import React, { useMemo } from 'react';
import type { SNP } from '../utils/DNAParser';
import { riskAlleles, type RiskAllele } from '../data/RiskAlleles';

interface RiskReportProps {
  snps: SNP[];
}

interface DetectedRisk {
  riskInfo: RiskAllele;
  userGenotype: string;
  matchType: 'HO' | 'HE'; // Homozygous or Heterozygous for risk
}

const RiskReport: React.FC<RiskReportProps> = ({ snps }) => {
  // Memoize the risk calculation
  const detectedRisks = useMemo(() => {
    const findings: DetectedRisk[] = [];

    // Create a map for faster lookups
    const snpMap = new Map<string, string>();
    snps.forEach(snp => {
      snpMap.set(snp.rsid, snp.genotype);
    });

    riskAlleles.forEach(risk => {
      const userGenotype = snpMap.get(risk.rsid);

      if (userGenotype) {
        // Count how many risk alleles are present
        // Normalizing to check presence. Genotypes can be "AT", "TA", "A", "AA", etc.

        let riskCount = 0;
        for (const char of userGenotype) {
          if (char === risk.riskAllele) {
            riskCount++;
          }
        }

        if (riskCount > 0) {
          findings.push({
            riskInfo: risk,
            userGenotype,
            matchType: riskCount === 2 ? 'HO' : 'HE'
          });
        }
      }
    });

    // Sort by magnitude (severity) descending
    return findings.sort((a, b) => b.riskInfo.magnitude - a.riskInfo.magnitude);
  }, [snps]);

  if (detectedRisks.length === 0) {
    return (
      <div className="glass-card-elevated p-8 text-center animate-fade-in-up">
        <div className="text-6xl mb-4">👍</div>
        <h2 className="text-2xl font-bold text-white mb-2">No Specific Risks Detected</h2>
        <p className="text-gray-400">
          Based on the limited set of checking criteria, no significant genetic risks were identified in your data.
          Note that this is not a medical diagnosis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card-elevated p-6 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-indigo-400">🧬</span> Genetic Risk Analysis
        </h2>

        <div className="grid gap-4">
          {detectedRisks.map((risk, idx) => (
            <div
              key={`${risk.riskInfo.rsid}-${idx}`}
              className="glass-card p-4 border-l-4 transition-all hover:bg-white/5"
              style={{
                borderColor: risk.matchType === 'HO' ? '#ef4444' : '#f59e0b' // Red for Homozygous, Orange for Heterozygous
              }}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-white">{risk.riskInfo.condition}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${risk.matchType === 'HO'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                      {risk.matchType === 'HO' ? 'High Impact' : 'Moderate Impact'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {risk.riskInfo.category}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-2">{risk.riskInfo.description}</p>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span>Gene: <span className="text-gray-400">{risk.riskInfo.gene}</span></span>
                    <span>SNP: <span className="text-gray-400">{risk.riskInfo.rsid}</span></span>
                    <span>Risk Allele: <span className="text-gray-400">{risk.riskInfo.riskAllele}</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[100px]">
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Genotype</span>
                  <span className={`text-2xl font-bold ${risk.matchType === 'HO' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                    {risk.userGenotype}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskReport;
