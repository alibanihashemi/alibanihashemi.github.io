export interface RiskAllele {
  rsid: string;
  gene: string;
  riskAllele: string;
  condition: string;
  description: string;
  magnitude: number;
  category: 'Metabolism' | 'Neurology' | 'Cardiology' | 'Immunology' | 'Other';
}

export const riskAlleles: RiskAllele[] = [
  {
    rsid: 'rs429358',
    gene: 'APOE',
    riskAllele: 'C',
    condition: "Alzheimer's Disease",
    description: "One of two SNPs defining APOE-ε4. Presence increases risk of late-onset Alzheimer's.",
    magnitude: 8,
    category: 'Neurology'
  },
  {
    rsid: 'rs7412',
    gene: 'APOE',
    riskAllele: 'C', // APOE-e4 is defined by combinations. Simplified here for demo.
    condition: "Alzheimer's Disease",
    description: 'Second SNP for APOE genotyping.',
    magnitude: 6,
    category: 'Neurology'
  },
  {
    rsid: 'rs1801133',
    gene: 'MTHFR',
    riskAllele: 'T', // C677T
    condition: 'Methylation issues',
    description: 'Reduced enzyme activity, potential homocysteine elevation.',
    magnitude: 5,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1801131',
    gene: 'MTHFR',
    riskAllele: 'G', // A1298C (G is risk in some orientations, strictly C) - let's assume forward strand. A->C mutation.
    condition: 'Methylation issues',
    description: 'Milder reduction in enzyme activity compared to C677T.',
    magnitude: 3,
    category: 'Metabolism'
  },
  {
    rsid: 'rs4680',
    gene: 'COMT',
    riskAllele: 'A', // Met/Met (Warrior vs Worrier). A (Met) is slower breakdown of dopamine.
    condition: 'Stress Response',
    description: 'Slower dopamine breakdown ("Worrier"), higher cognitive function but lower stress tolerance.',
    magnitude: 4,
    category: 'Neurology'
  },
  {
    rsid: 'rs53576',
    gene: 'OXTR',
    riskAllele: 'A',
    condition: 'Social Empathy',
    description: 'Associated with lower empathy and stress handling ("A" allele).',
    magnitude: 3,
    category: 'Neurology'
  },
  {
    rsid: 'rs4988235',
    gene: 'LCT',
    riskAllele: 'C', // T is persistence (good), C is intolerance
    condition: 'Lactose Intolerance',
    description: 'Likely lactose intolerant in adulthood.',
    magnitude: 4,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1815739',
    gene: 'ACTN3',
    riskAllele: 'T', // R577X. T (X) is non-functional -> endurance. C (R) is power.
    condition: 'Muscle Performance',
    description: 'Associated with endurance rather than explosive power ("Sprinter gene").',
    magnitude: 2,
    category: 'Other'
  }
];
