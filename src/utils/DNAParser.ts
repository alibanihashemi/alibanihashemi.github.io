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
      complete: (results) => {
        try {
          const snps: SNP[] = [];
          let source = 'Unknown';
          const lines = results.data as string[][];

          // Simple heuristic to detect source and find header
          // 23andMe usually starts with comments #
          // MyHeritage usually starts with "MyHeritage DNA raw data" header or similar
          
          let headerFound = false;
          let startIndex = 0;

          // Check first few lines for comments to determine source/start
          for(let i=0; i<Math.min(100, lines.length); i++) {
              const line = lines[i];
              if (line.length === 0) continue;
              const lineStr = line.join(' ');
              
              if (lineStr.includes('23andMe')) source = '23andMe';
              if (lineStr.includes('MyHeritage')) source = 'MyHeritage';
              if (lineStr.includes('Ancestry')) source = 'Ancestry';

              // Detect header row (rsid, chromosome, position, genotype)
              if (
                  (lineStr.toLowerCase().includes('rsid') || lineStr.toLowerCase().includes('rs id')) &&
                  lineStr.toLowerCase().includes('chromosome')
              ) {
                  startIndex = i + 1;
                  headerFound = true;
                  break;
              }
              
              // If line starts with #, it's a comment
              if (line[0].startsWith('#')) {
                  continue;
              }
          }

          if (!headerFound) {
              // Fallback: try to guess where data starts (first line that looks like data)
              // rs... 1 12345 AA
             for(let i=0; i<Math.min(100, lines.length); i++) {
                 const line = lines[i];
                 if (line.length >= 3 && line[0].startsWith('rs')) {
                     startIndex = i;
                     break;
                 }
             }
          }

          for (let i = startIndex; i < lines.length; i++) {
            const row = lines[i];
            // Normalize row logic based on common formats
            // 23andMe: rsid, chromosome, position, genotype
            // MyHeritage: rsid, chromosome, position, result (genotype)
            // Ancestry: rsid, chromosome, position, allele1, allele2
            
            if (row.length < 3) continue;

            let rsid = row[0];
            let chromosome = row[1];
            let position = parseInt(row[2]);
            let genotype = '';

            if (row.length === 4) {
                genotype = row[3];
            } else if (row.length === 5) {
                genotype = row[3] + row[4];
            }

            // Basic validation
            if (!rsid || !chromosome || isNaN(position) || !genotype) continue;

            snps.push({
              rsid,
              chromosome,
              position,
              genotype
            });
          }

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
