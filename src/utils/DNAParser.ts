import Papa from 'papaparse';
import JSZip from 'jszip';

export interface SNP {
  rsid: string;
  chromosome: string;
  position: number;
  genotype: string;
}

export interface ParseResult {
  snps: SNP[];
  meta: {
    source: string;
    totalSNPs: number;
    timestamp: string;
  };
}

const parseTextContent = (content: string, fileName: string): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      worker: true,
      skipEmptyLines: true,
      comments: "#",
      complete: (results) => {
        try {
          const snps: SNP[] = [];
          let source = 'Unknown';
          const lines = results.data as string[][];

          // Heuristic to detect source
          if (lines.length > 0) {
            const firstLineWithData = lines.find(l => {
              const s = l[0].toString();
              return s.startsWith('rs') || (l.length > 1 && l[0].startsWith('rs'));
            });

            if (firstLineWithData) {
              if (firstLineWithData.length === 4) source = '23andMe';
            }
          }

          if (fileName.toLowerCase().includes('23andme')) source = '23andMe';
          if (fileName.toLowerCase().includes('myheritage')) source = 'MyHeritage';
          if (fileName.toLowerCase().includes('ancestry')) source = 'Ancestry';

          console.log(`Detected source: ${source}`);

          for (let i = 0; i < lines.length; i++) {
            const row = lines[i];

            if (row[0] === 'rsid' || row[0] === '# rsid') continue;
            if (row.length === 0) continue;

            let parts = row;
            if (row.length === 1 && typeof row[0] === 'string' && row[0].includes('\t')) {
              parts = row[0].split('\t');
            }

            if (parts.length < 3) continue;

            let rsid = parts[0];
            let chromosome = parts[1];
            let position = parseInt(parts[2]);
            let genotype = '';

            if (parts.length === 4) {
              genotype = parts[3];
            } else if (parts.length >= 5) {
              genotype = parts[3] + parts[4];
            }

            genotype = genotype ? genotype.trim() : '';

            if (!rsid || !chromosome || isNaN(position) || !genotype) continue;
            if (genotype === '--' || genotype === '__') continue;

            snps.push({
              rsid,
              chromosome,
              position,
              genotype
            });
          }

          console.log(`Successfully parsed ${snps.length} SNPs.`);

          resolve({
            snps,
            meta: {
              source,
              totalSNPs: snps.length,
              timestamp: new Date().toISOString()
            }
          });

        } catch (e) {
          reject(e);
        }
      },
      error: (err: unknown) => {
        reject(err);
      }
    });
  });
};

export const parseDNAFile = async (file: File): Promise<ParseResult> => {
  // Check for Zip File
  if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
    try {
      console.log('Unzipping file:', file.name);
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      // Find the first text file
      const textFile = Object.values(contents.files).find(f =>
        !f.dir && (f.name.endsWith('.txt') || f.name.endsWith('.csv'))
      );

      if (!textFile) {
        throw new Error("No valid DNA data file (.txt or .csv) found in the zip archive.");
      }

      const fileContent = await textFile.async('string');
      return parseTextContent(fileContent, textFile.name);

    } catch (err) {
      console.error("Zip extraction failed:", err);
      throw new Error("Failed to process zip file. Please ensure it contains a valid raw data file.");
    }
  }

  // Handle Standard Text/CSV File
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) {
        reject(new Error("Empty file"));
        return;
      }
      try {
        const result = await parseTextContent(text, file.name);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
