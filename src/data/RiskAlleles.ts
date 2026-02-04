export interface RiskAllele {
  rsid: string;
  gene: string;
  riskAllele: string;
  condition: string;
  description: string;
  magnitude: number;
  category: 'Metabolism' | 'Neurology' | 'Cardiology' | 'Immunology' | 'Endocrinology' | 'Carrier Status' | 'Oncology' | 'Cognitive' | 'Nutrition' | 'Pharmacogenomics' | 'Longevity' | 'Other';
}

export const riskAlleles: RiskAllele[] = [
  // --- NEUROLOGY ---
  {
    rsid: 'rs429358',
    gene: 'APOE',
    riskAllele: 'C',
    condition: "Late-Onset Alzheimer's Disease",
    description: "The ε4 allele is the strongest genetic risk factor for late-onset Alzheimer's. Presence of C allele at this position defines ε4.",
    magnitude: 9,
    category: 'Neurology'
  },
  {
    rsid: 'rs7412',
    gene: 'APOE',
    riskAllele: 'C',
    condition: "Alzheimer's / Lipid Metabolism",
    description: "Used in combination with rs429358 to determine APOE genotype (ε2, ε3, ε4).",
    magnitude: 7,
    category: 'Neurology'
  },
  {
    rsid: 'rs6265',
    gene: 'BDNF',
    riskAllele: 'A',
    condition: "Neuroplasticity / Mood",
    description: "The 'Met' allele (A) is associated with reduced BDNF secretion, potentially impacting memory and response to stress.",
    magnitude: 4,
    category: 'Neurology'
  },
  {
    rsid: 'rs4680',
    gene: 'COMT',
    riskAllele: 'A',
    condition: "Dopamine Breakdown / Stress",
    description: "The 'Worrier' allele (A) leads to slower dopamine breakdown, higher cognitive function but lower stress tolerance.",
    magnitude: 5,
    category: 'Neurology'
  },
  {
    rsid: 'rs53576',
    gene: 'OXTR',
    riskAllele: 'A',
    condition: "Social Empathy / Stress Handling",
    description: "Associated with lower levels of social empathy and a higher sensitivity to stress.",
    magnitude: 3,
    category: 'Neurology'
  },

  // --- METABOLISM ---
  {
    rsid: 'rs1801133',
    gene: 'MTHFR',
    riskAllele: 'T',
    condition: "Folate Metabolism (C677T)",
    description: "Significantly reduced enzyme activity (up to 70% if homozygous). May lead to elevated homocysteine.",
    magnitude: 6,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1801131',
    gene: 'MTHFR',
    riskAllele: 'G',
    condition: "Folate Metabolism (A1298C)",
    description: "Moderate reduction in enzyme activity. Important when combined with C677T mutation.",
    magnitude: 4,
    category: 'Metabolism'
  },
  {
    rsid: 'rs4988235',
    gene: 'LCT',
    riskAllele: 'C',
    condition: "Lactose Intolerance",
    description: "The C allele is associated with primary lactase deficiency in adulthood.",
    magnitude: 5,
    category: 'Metabolism'
  },
  {
    rsid: 'rs7139228',
    gene: 'SHBG',
    riskAllele: 'T',
    condition: "Hormone Transport",
    description: "Associated with lower levels of Sex Hormone-Binding Globulin.",
    magnitude: 3,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1229984',
    gene: 'ADH1B',
    riskAllele: 'T',
    condition: "Alcohol Metabolism",
    description: "Associated with slower conversion of ethanol to acetaldehyde.",
    magnitude: 4,
    category: 'Metabolism'
  },

  // --- CARDIOLOGY ---
  {
    rsid: 'rs10757274',
    gene: '9p21',
    riskAllele: 'G',
    condition: "Coronary Artery Disease",
    description: "One of the most well-validated genetic markers for increased risk of heart disease.",
    magnitude: 7,
    category: 'Cardiology'
  },
  {
    rsid: 'rs1333049',
    gene: '9p21',
    riskAllele: 'C',
    condition: "Myocardial Infarction Risk",
    description: "Associated with increased risk of early-onset heart attack.",
    magnitude: 7,
    category: 'Cardiology'
  },
  {
    rsid: 'rs6025',
    gene: 'F5',
    riskAllele: 'A',
    condition: "Factor V Leiden",
    description: "Significantly increases risk of venous thromboembolism (blood clots).",
    magnitude: 8,
    category: 'Cardiology'
  },
  {
    rsid: 'rs1799963',
    gene: 'F2',
    riskAllele: 'A',
    condition: "Prothrombin G20210A",
    description: "A mutation in the prothrombin gene that increases the risk of blood clots.",
    magnitude: 8,
    category: 'Cardiology'
  },

  // --- ENDOCRINOLOGY ---
  {
    rsid: 'rs13266634',
    gene: 'SLC30A8',
    riskAllele: 'T',
    condition: "Type 2 Diabetes",
    description: "Associated with zinc transport in insulin-secreting beta cells.",
    magnitude: 6,
    category: 'Endocrinology'
  },
  {
    rsid: 'rs7903146',
    gene: 'TCF7L2',
    riskAllele: 'T',
    condition: "Type 2 Diabetes Risk",
    description: "The most significant genetic common variant associated with Type 2 Diabetes risk.",
    magnitude: 8,
    category: 'Endocrinology'
  },

  // --- IMMUNOLOGY ---
  {
    rsid: 'rs12720356',
    gene: 'TYK2',
    riskAllele: 'C',
    condition: "Psoriasis",
    description: "Associated with increased susceptibility to psoriasis and other autoimmune conditions.",
    magnitude: 5,
    category: 'Immunology'
  },
  {
    rsid: 'rs6897932',
    gene: 'IL7R',
    riskAllele: 'T',
    condition: "Multiple Sclerosis",
    description: "Associated with an increased risk of developing Multiple Sclerosis.",
    magnitude: 6,
    category: 'Immunology'
  },
  {
    rsid: 'rs3184504',
    gene: 'SH2B3',
    riskAllele: 'T',
    condition: "Celiac Disease / Hypertension",
    description: "Associated with increased risk of Celiac disease and higher blood pressure.",
    magnitude: 5,
    category: 'Immunology'
  },

  // --- CARRIER STATUS ---
  {
    rsid: 'rs1800629',
    gene: 'HFE',
    riskAllele: 'G',
    condition: "Hereditary Hemochromatosis (C282Y)",
    description: "Primary mutation for iron overload disorder. Serious risk if homozygous.",
    magnitude: 9,
    category: 'Carrier Status'
  },
  {
    rsid: 'rs1799945',
    gene: 'HFE',
    riskAllele: 'G',
    condition: "Hereditary Hemochromatosis (H63D)",
    description: "Secondary mutation for iron overload. Usually requires C282Y co-mutation for clinical symptoms.",
    magnitude: 6,
    category: 'Carrier Status'
  },
  {
    rsid: 'rs113852337',
    gene: 'GBA',
    riskAllele: 'A',
    condition: "Gaucher Disease / Parkinson's",
    description: "Carrier status for Gaucher disease; also increases risk for Parkinson's disease.",
    magnitude: 7,
    category: 'Carrier Status'
  },
  {
    rsid: 'rs7676492',
    gene: 'GBA',
    riskAllele: 'T',
    condition: "Parkinson's Disease Risk",
    description: "N370S mutation in GBA gene, associated with Gaucher disease and Parkinson's risk.",
    magnitude: 7,
    category: 'Carrier Status'
  },

  // --- COGNITIVE (IQ, Memory, ADHD) ---
  {
    rsid: 'rs2760118',
    gene: 'ALDH5A1',
    riskAllele: 'T',
    condition: "Cognitive Processing",
    description: "Variants in GABA metabolism associated with general intelligence scores.",
    magnitude: 3,
    category: 'Cognitive'
  },
  {
    rsid: 'rs6296',
    gene: 'HTR1B',
    riskAllele: 'G',
    condition: "ADHD Susceptibility",
    description: "Serotonin receptor variant associated with attention deficit traits and impulsivity.",
    magnitude: 4,
    category: 'Cognitive'
  },
  {
    rsid: 'rs405509',
    gene: 'APOE',
    riskAllele: 'T',
    condition: "Cognitive Decline",
    description: "APOE promoter variant associated with age-related cognitive decline, independent of epsilon status.",
    magnitude: 4,
    category: 'Cognitive'
  },

  // --- NUTRITION & DIET ---
  {
    rsid: 'rs9939609',
    gene: 'FTO',
    riskAllele: 'A',
    condition: "Obesity Risk / Satiety",
    description: "Strongest genetic link to obesity. carriers have higher appetite and lower satiety. High-protein diets may be more effective.",
    magnitude: 7,
    category: 'Nutrition'
  },
  {
    rsid: 'rs1558902',
    gene: 'FTO',
    riskAllele: 'A',
    condition: "Fat Mass Accumulation",
    description: "Associated with higher BMI and difficulty losing weight with standard low-calorie diets.",
    magnitude: 6,
    category: 'Nutrition'
  },
  {
    rsid: 'rs1862513',
    gene: 'RETN',
    riskAllele: 'G',
    condition: "Dietary Fat Response",
    description: "Resistin gene variant affecting response to dietary fats. GG genotype responds better to low-fat diets.",
    magnitude: 4,
    category: 'Nutrition'
  },
  {
    rsid: 'rs1801282',
    gene: 'PPARG',
    riskAllele: 'C',
    condition: "Carbohydrate Sensitivity",
    description: "The Pro12Ala variant. Pro (C) carriers are more insulin resistant and may benefit more from carbohydrate restriction.",
    magnitude: 5,
    category: 'Nutrition'
  },
  // Benchnmark Additions - Vitamins & Supplements
  {
    rsid: 'rs1544410',
    gene: 'VDR',
    riskAllele: 'T', // BsmI 'b' risk allele often cited as effect.
    condition: "Vitamin D Resistance",
    description: "Vitamin D Receptor variant associated with reduced calcium absorption and bone mineral density.",
    magnitude: 4,
    category: 'Nutrition'
  },
  {
    rsid: 'rs7501331',
    gene: 'BCMO1',
    riskAllele: 'T',
    condition: "Vitamin A Conversion",
    description: "Reduced ability to convert beta-carotene (plant Vitamin A) into active retinol.",
    magnitude: 5,
    category: 'Nutrition'
  },
  {
    rsid: 'rs762551',
    gene: 'CYP1A2',
    riskAllele: 'C',
    condition: "Slow Caffeine Metabolism",
    description: "Associated with slower clearance of caffeine. Carriers may have higher risk of heart issues with high coffee consumption.",
    magnitude: 4,
    category: 'Pharmacogenomics'
  },

  // --- ONCOLOGY (Cancer Risks) ---
  {
    rsid: 'rs6983267',
    gene: '8q24',
    riskAllele: 'G',
    condition: "Colorectal / Prostate Cancer Risk",
    description: "A well-studied region (8q24) associated with increased risk of various cancers.",
    magnitude: 6,
    category: 'Oncology'
  },
  {
    rsid: 'rs4430796',
    gene: 'HNF1B',
    riskAllele: 'A',
    condition: "Prostate Cancer Risk",
    description: "Associated with increased risk of prostate cancer.",
    magnitude: 5,
    category: 'Oncology'
  },
  {
    rsid: 'rs11614913',
    gene: 'MIR146A',
    riskAllele: 'C',
    condition: "Lung / Digestive Cancers",
    description: "Variant in microRNA-146a associated with susceptibility to various cancers.",
    magnitude: 4,
    category: 'Oncology'
  },
  {
    rsid: 'rs1695',
    gene: 'GSTP1',
    riskAllele: 'G',
    condition: "Detoxification / Oxidative Stress",
    description: "Reduced ability to conjugate toxins. Associated with higher risk of cancers if exposed to environmental toxins.",
    magnitude: 5,
    category: 'Oncology'
  },

  // --- MITOCHONDRIA & ANTIOXIDANTS ---
  {
    rsid: 'rs4880',
    gene: 'SOD2',
    riskAllele: 'C',
    condition: "Oxidative Stress Handling",
    description: "The Val16Ala polymorphism. Val (C) carriers have less efficient antioxidant defense in mitochondria.",
    magnitude: 5,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1050450',
    gene: 'GPX1',
    riskAllele: 'T',
    condition: "Glutathione Peroxidase Activity",
    description: "Reduced enzyme activity, leading to lower antioxidant capacity and higher oxidative stress.",
    magnitude: 4,
    category: 'Metabolism'
  },
  {
    rsid: 'rs1001179',
    gene: 'CAT',
    riskAllele: 'T',
    condition: "Catalase Levels",
    description: "Associated with lower transcriptional activity of Catalase, essential for breaking down hydrogen peroxide.",
    magnitude: 4,
    category: 'Metabolism'
  },

  // --- LONGEVITY & SLEEP ---
  {
    rsid: 'rs2802292',
    gene: 'FOXO3',
    riskAllele: 'T', // The G allele is the longevity one (protective). T is 'normal' or risk relative to longevity benefit.
    condition: "Longevity Factor",
    description: "Carrier of the 'normal' allele. The alternative G allele is strongly associated with healthy aging and longevity.",
    magnitude: 4,
    category: 'Longevity'
  },
  {
    rsid: 'rs1801260',
    gene: 'CLOCK',
    riskAllele: 'C',
    condition: "Circadian Rhythm / Sleep",
    description: "Associated with eveningness preference ('night owls') and potential sleep duration issues.",
    magnitude: 3,
    category: 'Other'
  },

  // --- OTHER / WELLNESS ---
  {
    rsid: 'rs1815739',
    gene: 'ACTN3',
    riskAllele: 'T',
    condition: "Muscle Performance",
    description: "The 'Speed Gene'. T (X) allele is associated with endurance, while C (R) is associated with power.",
    magnitude: 2,
    category: 'Other'
  },
  {
    rsid: 'rs17608059',
    gene: 'AMPD1',
    riskAllele: 'A',
    condition: "Exercise Capacity",
    description: "Associated with muscle fatigue during high-intensity exercise.",
    magnitude: 3,
    category: 'Other'
  }
];