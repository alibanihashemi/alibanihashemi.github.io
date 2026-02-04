import { FixedSizeList as List } from 'react-window';
import type { SNP } from '../utils/DNAParser';

interface GenomeBrowserProps {
  snps: SNP[];
}

const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: SNP[] }) => {
  const snp = data[index];
  return (
    <div style={style} className="flex items-center justify-between px-4 py-2 border-b border-white/10 hover:bg-white/5 text-sm">
      <span className="font-mono text-indigo-300 w-1/4 truncate">{snp.rsid}</span>
      <span className="w-1/4 text-center text-gray-400">Chr {snp.chromosome}</span>
      <span className="w-1/4 text-right text-gray-500">{snp.position}</span>
      <span className="w-1/4 text-right font-bold text-white">{snp.genotype}</span>
    </div>
  );
};

const GenomeBrowser: React.FC<GenomeBrowserProps> = ({ snps }) => {
  return (
    <div className="glass-card-elevated p-0 overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between font-semibold text-gray-300 text-sm">
        <span className="w-1/4">RSID</span>
        <span className="w-1/4 text-center">Chr</span>
        <span className="w-1/4 text-right">Pos</span>
        <span className="w-1/4 text-right">Genotype</span>
      </div>
      <div className="flex-1">
        <List
          height={450}
          itemCount={snps.length}
          itemSize={40}
          width="100%"
          itemData={snps}
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default GenomeBrowser;
