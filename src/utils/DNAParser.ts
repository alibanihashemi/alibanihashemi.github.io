import Papa from 'papaparse';

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

export const parseDNAFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      worker: true,
      skipEmptyLines: true,
      comments: "#", // Explicitly handle # comments to avoid delimiter confusion
      complete: (results) => {
        try {
          const snps: SNP[] = [];
          let source = 'Unknown';
          const lines = results.data as string[][]; // Papa removes comments, so these are data lines

          // Heuristic to detect source based on file content (even if comments are stripped)
          // 23andMe usually has 4 columns: rsid, chromosome, position, genotype
          if (lines.length > 0) {
            // Look for a line that starts with 'rs'
            const firstLineWithData = lines.find(l => {
              // If Papa failed to split tabs, l[0] might contain the whole line
              const s = l[0].toString();
              return s.startsWith('rs') || (l.length > 1 && l[0].startsWith('rs'));
            });

            if (firstLineWithData) {
              if (firstLineWithData.length === 4) source = '23andMe';
              // MyHeritage often has 5 columns or different structure
            }
          }

          // Use file name as a secondary hint
          if (file.name.toLowerCase().includes('23andme')) source = '23andMe';
          if (file.name.toLowerCase().includes('myheritage')) source = 'MyHeritage';
          if (file.name.toLowerCase().includes('ancestry')) source = 'Ancestry';

          console.log(`Detected source: ${source}`);

          for (let i = 0; i < lines.length; i++) {
            const row = lines[i];

            // Skip header if it got through (though comments: '#' should catch most 23andMe headers)
            if (row[0] === 'rsid' || row[0] === '# rsid') continue;

            if (row.length === 0) continue;

            // 23andMe format: rsid, chromosome, position, genotype
            // Sometimes tab separated, Papa parse handles this if auto-detect works, 
            // but if it failed to detect tab, row might be length 1.

            let parts = row;
            if (row.length === 1 && typeof row[0] === 'string' && row[0].includes('\t')) {
              // Manual fallback for tab separation if Papa failed
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

            // Clean genotype (remove newlines, spaces)
            genotype = genotype ? genotype.trim() : '';

            if (!rsid || !chromosome || isNaN(position) || !genotype) continue;
            if (genotype === '--' || genotype === '__') continue; // Skip no-calls

            snps.push({
              rsid,
              chromosome,
              position,
              genotype
            });
          }

          console.log(`Successfully parsed ${snps.length} SNPs.`);
          if (snps.length > 0) console.log('First SNP parsed:', snps[0]);

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
      error: (err) => {
        reject(err);
      }
    });
  });
};
