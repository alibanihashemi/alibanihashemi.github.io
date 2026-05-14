import React, { useMemo } from 'react';
import type { SNP } from '../utils/DNAParser';
import { riskAlleles } from '../data/RiskAlleles';
import { generateRiskPDF, type DetectedRisk } from '../utils/pdfGenerator';

interface RiskReportProps {
  snps: SNP[];
}

// Ensure DetectedRisk matches our utility definition or just export/import it
// Since I defined DetectedRisk inside RiskReport originally, let's just use the one from pdfGenerator to be safe/consistent, 
// OR map it. The structure is the same.


const RiskReport: React.FC<RiskReportProps> = ({ snps }) => {
  // Memoize the risk calculation
  const detectedRisks = useMemo(() => {
    const findings: DetectedRisk[] = [];

    // Create a map for faster lookups
    const snpMap = new Map<string, string>();
    snps.forEach(snp => {
      snpMap.set(snp.rsid, snp.genotype);
    });
    console.log(`Matching against SNP map with ${snpMap.size} entries.`);

    riskAlleles.forEach(risk => {
      const userGenotype = snpMap.get(risk.rsid);
      if (userGenotype) console.log(`Found user data for ${risk.rsid}: ${userGenotype} (Risk allele: ${risk.riskAllele})`);

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
          console.log(`MATCH DETECTED: ${risk.condition} (${riskCount === 2 ? 'HO' : 'HE'})`);
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center animate-fade-in-up">
        <div className="text-6xl mb-4">👍</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Specific Risks Detected</h2>
        <p className="text-slate-500">
          Based on the limited set of checking criteria, no significant genetic risks were identified in your data.
          Note that this is not a medical diagnosis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-blue-600">🧬</span> Genetic Risk Analysis
          </h2>
          <button
            onClick={() => generateRiskPDF(detectedRisks, snps.length, "User Upload")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
          >
            <span>📄</span> Download Report
          </button>
        </div>

        <div className="grid gap-4">
          {detectedRisks.map((risk, idx) => (
            <div
              key={`${risk.riskInfo.rsid}-${idx}`}
              className="bg-slate-50 border border-slate-200 rounded-lg p-5 border-l-4 transition-all hover:shadow-md"
              style={{
                borderLeftColor: risk.matchType === 'HO' ? '#ef4444' : '#f59e0b' // Red for Homozygous, Orange for Heterozygous
              }}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-slate-900">{risk.riskInfo.condition}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${risk.matchType === 'HO'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                      {risk.matchType === 'HO' ? 'High Impact' : 'Moderate Impact'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {risk.riskInfo.category}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-3">{risk.riskInfo.description}</p>

                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">
                      ✅ Recommended Action
                    </p>
                    <p className="text-sm text-green-900">
                      {risk.riskInfo.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">Gene: <span className="font-semibold text-slate-700">{risk.riskInfo.gene}</span></span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">SNP: <span className="font-semibold text-slate-700">{risk.riskInfo.rsid}</span></span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">Risk Allele: <span className="font-bold text-slate-900">{risk.riskInfo.riskAllele}</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[100px] bg-white p-2 rounded border border-slate-100">
                  <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Genotype</span>
                  <span className={`text-2xl font-bold ${risk.matchType === 'HO' ? 'text-red-600' : 'text-amber-500'
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