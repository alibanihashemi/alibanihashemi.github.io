import React, { useMemo } from 'react';
import type { SNP } from '../utils/DNAParser';
import { riskAlleles, type RiskAllele } from '../data/RiskAlleles';

interface BabyRiskReportProps {
    parent1Snps: SNP[];
    parent2Snps: SNP[];
    parent1Name?: string;
    parent2Name?: string;
}

interface InheritanceResult {
    riskInfo: RiskAllele;
    p1Genotype: string;
    p2Genotype: string;
    probability: number; // 0-1
    averageRiskCopies: number; // Expected value of risk copies
    combinations: string[];
}

const BabyRiskReport: React.FC<BabyRiskReportProps> = ({
    parent1Snps,
    parent2Snps,
    parent1Name = 'Parent 1',
    parent2Name = 'Parent 2'
}) => {

    const predictions = useMemo(() => {
        const findings: InheritanceResult[] = [];

        // Map SNPs for fast lookup
        const p1Map = new Map<string, string>();
        parent1Snps.forEach(s => p1Map.set(s.rsid, s.genotype));

        const p2Map = new Map<string, string>();
        parent2Snps.forEach(s => p2Map.set(s.rsid, s.genotype));

        riskAlleles.forEach(risk => {
            const g1 = p1Map.get(risk.rsid);
            const g2 = p2Map.get(risk.rsid);

            if (g1 && g2) {
                // Mendelian Inheritance Calculation
                // Normalize alleles to array (e.g., "AG" -> ['A', 'G'])
                const alleles1 = g1.length === 2 ? g1.split('') : [g1[0], g1[0]]; // Handle single letter as homozygous
                const alleles2 = g2.length === 2 ? g2.split('') : [g2[0], g2[0]];

                // Punnett Square (2x2 = 4 outcomes)
                const outcomes: string[] = [];
                let riskAlleleCountTotal = 0;
                let combinationsWithRisk = 0;

                for (const a1 of alleles1) {
                    for (const a2 of alleles2) {
                        // Sort to make "AG" same as "GA"
                        const combination = [a1, a2].sort().join('');
                        outcomes.push(combination);

                        // Check risk presence
                        let currentRiskCopies = 0;
                        if (a1 === risk.riskAllele) currentRiskCopies++;
                        if (a2 === risk.riskAllele) currentRiskCopies++;

                        riskAlleleCountTotal += currentRiskCopies;
                        if (currentRiskCopies > 0) combinationsWithRisk++;
                    }
                }

                const probability = combinationsWithRisk / 4;
                const averageRiskCopies = riskAlleleCountTotal / 4;

                if (probability > 0) {
                    findings.push({
                        riskInfo: risk,
                        p1Genotype: g1,
                        p2Genotype: g2,
                        probability,
                        averageRiskCopies,
                        combinations: outcomes
                    });
                }
            }
        });

        // Sort by severity (magnitude * probability)
        return findings.sort((a, b) =>
            (b.riskInfo.magnitude * b.probability) - (a.riskInfo.magnitude * a.probability)
        );
    }, [parent1Snps, parent2Snps]);

    if (predictions.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center animate-fade-in-up">
                <div className="text-6xl mb-4">👶✨</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No High Risks Predicted</h2>
                <p className="text-slate-500">
                    Based on the parents' genetic data, there are no significant risks identified for the categories we track.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="text-blue-500">👶</span> Future Child Risk Assessment
                    </h2>
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Mendelian Inheritance Model
                    </span>
                </div>

                <div className="grid gap-4">
                    {predictions.map((pred, idx) => (
                        <div
                            key={`${pred.riskInfo.rsid}-${idx}`}
                            className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
                        >
                            <div className="p-5 flex flex-col md:flex-row gap-8">

                                {/* Risk Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-lg text-slate-900">{pred.riskInfo.condition}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${pred.probability >= 0.75
                                            ? 'bg-red-50 text-red-700 border-red-200'
                                            : pred.probability >= 0.5
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {(pred.probability * 100).toFixed(0)}% Probability
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4">{pred.riskInfo.description}</p>

                                    {/* Inheritance Visual */}
                                    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-around text-center">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">{parent1Name}</div>
                                            <div className="text-xl font-mono font-bold text-slate-800">{pred.p1Genotype}</div>
                                        </div>
                                        <div className="text-slate-300 text-lg">+</div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">{parent2Name}</div>
                                            <div className="text-xl font-mono font-bold text-slate-800">{pred.p2Genotype}</div>
                                        </div>
                                        <div className="text-slate-300 text-lg">→</div>
                                        <div>
                                            <div className="text-xs text-blue-600 font-medium mb-1">Child Risk</div>
                                            <div className="text-xl font-bold text-slate-900">
                                                {pred.averageRiskCopies.toFixed(1)} <span className="text-xs font-normal text-slate-400">copies</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Punnett Visualization */}
                                <div className="w-full md:w-56 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-center">
                                    <div className="text-xs text-center text-slate-500 mb-3 font-medium">Possible Genotypes</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {pred.combinations.map((comb, i) => (
                                            <div key={i} className={`text-center py-2 rounded text-sm font-mono border ${comb.includes(pred.riskInfo.riskAllele)
                                                ? (comb.split(pred.riskInfo.riskAllele).length - 1 === 2 
                                                    ? 'bg-red-50 text-red-700 border-red-100' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-100')
                                                : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {comb}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BabyRiskReport;