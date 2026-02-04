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
            <div className="glass-card-elevated p-8 text-center animate-fade-in-up">
                <div className="text-6xl mb-4">👶✨</div>
                <h2 className="text-2xl font-bold text-white mb-2">No High Risks Predicted</h2>
                <p className="text-gray-400">
                    Based on the parents' genetic data, there are no significant risks identified for the categories we track.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="glass-card-elevated p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-pink-400">👶</span> Future Child Risk Assessment
                    </h2>
                    <span className="text-xs text-gray-500 glass-card px-2 py-1">
                        Mendelian Inheritance Model
                    </span>
                </div>

                <div className="grid gap-4">
                    {predictions.map((pred, idx) => (
                        <div
                            key={`${pred.riskInfo.rsid}-${idx}`}
                            className="glass-card p-0 overflow-hidden transition-all hover:bg-white/5"
                        >
                            <div className="p-4 flex flex-col md:flex-row gap-6">

                                {/* Risk Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-lg text-white">{pred.riskInfo.condition}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${pred.probability >= 0.75
                                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            : pred.probability >= 0.5
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            }`}>
                                            {(pred.probability * 100).toFixed(0)}% Probability
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3">{pred.riskInfo.description}</p>

                                    {/* Inheritance Visual */}
                                    <div className="bg-black/20 rounded-lg p-3 flex items-center justify-around text-center">
                                        <div>
                                            <div className="text-xs text-indigo-400 mb-1">{parent1Name}</div>
                                            <div className="text-xl font-mono font-bold text-white">{pred.p1Genotype}</div>
                                        </div>
                                        <div className="text-gray-500 text-lg">+</div>
                                        <div>
                                            <div className="text-xs text-pink-400 mb-1">{parent2Name}</div>
                                            <div className="text-xl font-mono font-bold text-white">{pred.p2Genotype}</div>
                                        </div>
                                        <div className="text-gray-500 text-lg">→</div>
                                        <div>
                                            <div className="text-xs text-green-400 mb-1">Child Risk</div>
                                            <div className="text-xl font-bold text-white">
                                                {pred.averageRiskCopies.toFixed(1)} <span className="text-xs font-normal text-gray-400">copies</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Punnett Visualization */}
                                <div className="w-full md:w-48 bg-white/5 rounded-lg p-3 flex flex-col justify-center">
                                    <div className="text-xs text-center text-gray-500 mb-2">Possible Genotypes</div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {pred.combinations.map((comb, i) => (
                                            <div key={i} className={`text-center py-1 rounded text-sm font-mono ${comb.includes(pred.riskInfo.riskAllele)
                                                ? (comb.split(pred.riskInfo.riskAllele).length - 1 === 2 ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300')
                                                : 'bg-green-500/20 text-green-300'
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
