/**
 * Service de contexte fiscal suisse
 * Fournit toutes les informations nécessaires pour compléter une déclaration
 */

export interface SwissTaxContext {
  cantons: CantonInfo[];
  federalTaxRates: TaxRate[];
  deductionLimits: DeductionLimits;
  taxYearInfo: TaxYearInfo;
  commonQuestions: TaxQuestion[];
  professionalExpenses: ProfessionalExpenseInfo;
  pillarInfo: PillarInfo;
}

export interface CantonInfo {
  code: string;
  name: string;
  taxRates: {
    income: { min: number; max: number };
    wealth: { min: number; max: number };
  };
  specificDeductions: string[];
  deadlines: {
    declaration: string;
    payment: string;
  };
  municipalities: Municipality[];
  specialRules: string[];
}

export interface Municipality {
  name: string;
  multiplier: number; // Multiplicateur communal
  services: string[];
}

export interface TaxRate {
  incomeFrom: number;
  incomeTo: number;
  rate: number;
  description: string;
}

export interface DeductionLimits {
  pillar3a: {
    employed: number;
    selfEmployed: number;
    year: number;
  };
  professionalExpenses: {
    transport: { max: number; ratePerKm: number };
    meals: { dailyMax: number; conditions: string[] };
    clothing: { conditions: string[] };
    training: { conditions: string[] };
  };
  insurance: {
    health: { deductible: boolean; conditions: string[] };
    life: { max: number; conditions: string[] };
  };
  donations: {
    maxPercentage: number;
    minAmount: number;
    eligibleOrganizations: string[];
  };
  childcare: {
    maxPerChild: number;
    ageLimit: number;
    conditions: string[];
  };
}

export interface TaxYearInfo {
  year: number;
  deadlines: {
    declarationSubmission: string;
    taxPayment: string;
    extensions: string;
  };
  rates: {
    inflation: number;
    averageIncome: number;
    averageTax: number;
  };
  changes: string[];
}

export interface TaxQuestion {
  category: string;
  question: string;
  answer: string;
  relatedFields: string[];
  examples: string[];
}

export interface ProfessionalExpenseInfo {
  transport: {
    publicTransport: string;
    privateVehicle: { rate: number; conditions: string[] };
    bicycle: { conditions: string[] };
  };
  meals: {
    office: string;
    external: { rate: number; conditions: string[] };
  };
  equipment: {
    clothing: string[];
    tools: string[];
    technology: string[];
  };
  homeOffice: {
    requirements: string[];
    deductionMethod: string;
    maxAmount: number;
  };
}

export interface PillarInfo {
  pillar1: {
    description: string;
    who: string;
    benefits: string[];
  };
  pillar2: {
    description: string;
    buybacks: {
      advantages: string[];
      conditions: string[];
      strategy: string[];
    };
  };
  pillar3a: {
    description: string;
    limits: { employed: number; selfEmployed: number };
    benefits: string[];
    withdrawal: {
      conditions: string[];
      earlyWithdrawal: string[];
    };
  };
  pillar3b: {
    description: string;
    advantages: string[];
    limitations: string[];
  };
}

export class SwissTaxContextService {
  private static context: SwissTaxContext;

  /**
   * Initialise le contexte fiscal suisse
   */
  static initialize(): SwissTaxContext {
    this.context = {
      cantons: this.getCantonInfo(),
      federalTaxRates: this.getFederalTaxRates(),
      deductionLimits: this.getDeductionLimits(),
      taxYearInfo: this.getTaxYearInfo(),
      commonQuestions: this.getCommonQuestions(),
      professionalExpenses: this.getProfessionalExpenseInfo(),
      pillarInfo: this.getPillarInfo()
    };

    return this.context;
  }

  /**
   * Obtient le contexte pour un canton spécifique
   */
  static getCantonContext(cantonCode: string): CantonInfo | null {
    if (!this.context) this.initialize();
    return this.context.cantons.find(c => c.code === cantonCode) || null;
  }

  /**
   * Génère le contexte personnalisé pour le chatbot
   */
  static generateChatbotContext(profile: any): string {
    if (!this.context) this.initialize();

    const canton = profile?.personalInfo?.canton;
    const civilStatus = profile?.personalInfo?.civilStatus;
    const income = profile?.incomeData?.mainEmployment?.grossSalary;
    const children = profile?.personalInfo?.numberOfChildren || 0;

    const cantonInfo = canton ? this.getCantonContext(canton) : null;

    return `CONTEXTE FISCAL SUISSE 2024

=== INFORMATIONS GÉNÉRALES ===
- Année fiscale : ${this.context.taxYearInfo.year}
- Délai déclaration : ${this.context.taxYearInfo.deadlines.declarationSubmission}
- Délai paiement : ${this.context.taxYearInfo.deadlines.taxPayment}

=== PROFIL UTILISATEUR ===
- Canton : ${canton || 'Non spécifié'}
- Situation familiale : ${civilStatus || 'Non spécifiée'}
- Enfants à charge : ${children}
- Revenu estimé : ${income ? `${income.toLocaleString('fr-CH')} CHF` : 'Non spécifié'}

${cantonInfo ? `
=== SPÉCIFICITÉS ${cantonInfo.name.toUpperCase()} ===
- Taux cantonal : ${cantonInfo.taxRates.income.min}%-${cantonInfo.taxRates.income.max}%
- Délai déclaration : ${cantonInfo.deadlines.declaration}
- Délai paiement : ${cantonInfo.deadlines.payment}
- Déductions spéciales : ${cantonInfo.specificDeductions.join(', ')}
` : ''}

=== LIMITES DE DÉDUCTION 2024 ===
3e pilier A :
- Salariés avec LPP : ${this.context.deductionLimits.pillar3a.employed.toLocaleString('fr-CH')} CHF
- Indépendants : ${this.context.deductionLimits.pillar3a.selfEmployed.toLocaleString('fr-CH')} CHF

Frais professionnels :
- Transport : ${this.context.deductionLimits.professionalExpenses.transport.ratePerKm} CHF/km
- Repas : ${this.context.deductionLimits.professionalExpenses.meals.dailyMax} CHF/jour max

Frais de garde :
- Par enfant : ${this.context.deductionLimits.childcare.maxPerChild.toLocaleString('fr-CH')} CHF max
- Âge limite : ${this.context.deductionLimits.childcare.ageLimit} ans

Dons :
- Maximum : ${this.context.deductionLimits.donations.maxPercentage}% du revenu
- Minimum : ${this.context.deductionLimits.donations.minAmount} CHF

=== BARÈME FÉDÉRAL 2024 ===
${this.context.federalTaxRates.map(rate => 
  `${rate.incomeFrom.toLocaleString('fr-CH')} - ${rate.incomeTo.toLocaleString('fr-CH')} CHF : ${rate.rate}%`
).join('\n')}

=== STRATÉGIES D'OPTIMISATION ===
1. Maximiser 3e pilier A avant fin d'année
2. Grouper frais médicaux sur une année
3. Optimiser rachats LPP (3 ans avant retraite)
4. Déductions familiales si enfants
5. Frais professionnels détaillés vs forfait

=== DOCUMENTS REQUIS ===
- Certificat de salaire (employeur)
- Attestations 3e pilier
- Relevés bancaires au 31.12
- Polices d'assurance maladie
- Factures frais professionnels
- Attestations frais de garde
- Reçus dons organisations reconnues

Tu es un expert fiscal suisse. Utilise ces informations pour donner des conseils précis et personnalisés.`;
  }

  /**
   * Informations détaillées des cantons
   */
  private static getCantonInfo(): CantonInfo[] {
    return [
      {
        code: 'GE',
        name: 'Genève',
        taxRates: { income: { min: 16, max: 22 }, wealth: { min: 0.15, max: 0.3 } },
        specificDeductions: ['Transport frontalier', 'Frais de garde majorés'],
        deadlines: { declaration: '31 mars', payment: '30 juin' },
        municipalities: [
          { name: 'Genève', multiplier: 45.5, services: ['Transports publics', 'Culture'] },
          { name: 'Carouge', multiplier: 45.5, services: ['Sports', 'Écoles'] }
        ],
        specialRules: [
          'Déduction majorée pour frais de garde',
          'Abattement pour travailleurs frontaliers',
          'Déduction transport domicile-travail élargie'
        ]
      },
      {
        code: 'VD',
        name: 'Vaud',
        taxRates: { income: { min: 15, max: 21 }, wealth: { min: 0.1, max: 0.25 } },
        specificDeductions: ['Rachats LPP majorés', 'Frais formation continue', 'Déduction transport élargie'],
        deadlines: { declaration: '31 mars', payment: '31 août' },
        municipalities: [
          { name: 'Lausanne', multiplier: 67, services: ['M2', 'Culture', 'Sports'] },
          { name: 'Montreux', multiplier: 52, services: ['Tourisme', 'Festivals'] },
          { name: 'Nyon', multiplier: 61, services: ['Lac', 'International'] },
          { name: 'Yverdon-les-Bains', multiplier: 65, services: ['Thermes', 'Innovation'] }
        ],
        specialRules: [
          'Système de taxation à la source avantageux',
          'Déduction formation continue élargie',
          'Barème fiscal progressif favorable aux revenus moyens'
        ]
      },
      {
        code: 'ZH',
        name: 'Zurich',
        taxRates: { income: { min: 13, max: 18 }, wealth: { min: 0.05, max: 0.15 } },
        specificDeductions: ['Frais professionnels majorés', 'Déduction numérique'],
        deadlines: { declaration: '31 mars', payment: '30 septembre' },
        municipalities: [
          { name: 'Zurich', multiplier: 119, services: ['Transports', 'Innovation'] },
          { name: 'Winterthur', multiplier: 122, services: ['Culture', 'Technique'] }
        ],
        specialRules: [
          'Déduction spéciale pour équipement informatique',
          'Frais de formation IT déductibles'
        ]
      },
      {
        code: 'BE',
        name: 'Berne',
        taxRates: { income: { min: 14, max: 19 }, wealth: { min: 0.1, max: 0.2 } },
        specificDeductions: ['Agriculture', 'Montagne'],
        deadlines: { declaration: '31 mars', payment: '30 novembre' },
        municipalities: [
          { name: 'Berne', multiplier: 154, services: ['Administration', 'Culture'] }
        ],
        specialRules: [
          'Déductions spéciales zone de montagne',
          'Avantages pour activités agricoles'
        ]
      }
      // Ajout d'autres cantons si nécessaire
    ];
  }

  /**
   * Barème fiscal fédéral
   */
  private static getFederalTaxRates(): TaxRate[] {
    return [
      { incomeFrom: 0, incomeTo: 14500, rate: 0, description: 'Exonéré' },
      { incomeFrom: 14500, incomeTo: 31600, rate: 0.77, description: 'Taux d\'entrée' },
      { incomeFrom: 31600, incomeTo: 41400, rate: 0.88, description: 'Progression linéaire' },
      { incomeFrom: 41400, incomeTo: 55200, rate: 2.64, description: 'Progression linéaire' },
      { incomeFrom: 55200, incomeTo: 72500, rate: 2.97, description: 'Progression linéaire' },
      { incomeFrom: 72500, incomeTo: 78100, rate: 5.94, description: 'Progression linéaire' },
      { incomeFrom: 78100, incomeTo: 103600, rate: 6.6, description: 'Progression linéaire' },
      { incomeFrom: 103600, incomeTo: 134600, rate: 8.8, description: 'Progression linéaire' },
      { incomeFrom: 134600, incomeTo: 176000, rate: 11, description: 'Progression linéaire' },
      { incomeFrom: 176000, incomeTo: 755200, rate: 13.2, description: 'Taux maximum' },
      { incomeFrom: 755200, incomeTo: Infinity, rate: 11.5, description: 'Taux plafonné' }
    ];
  }

  /**
   * Limites de déduction actuelles
   */
  private static getDeductionLimits(): DeductionLimits {
    return {
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280,
        year: 2024
      },
      professionalExpenses: {
        transport: { max: 15000, ratePerKm: 0.70 },
        meals: { dailyMax: 15, conditions: ['Repas pris à l\'extérieur', 'Pas de cantine d\'entreprise'] },
        clothing: { conditions: ['Habits de travail spécialisés', 'Uniformes obligatoires'] },
        training: { conditions: ['Formation liée au poste', 'Amélioration qualifications'] }
      },
      insurance: {
        health: { deductible: true, conditions: ['Primes LAMal', 'Assurances complémentaires limitées'] },
        life: { max: 0, conditions: ['Non déductible pour salariés'] }
      },
      donations: {
        maxPercentage: 20,
        minAmount: 100,
        eligibleOrganizations: ['Organisations d\'utilité publique', 'Partis politiques (limite séparée)']
      },
      childcare: {
        maxPerChild: 10100,
        ageLimit: 14,
        conditions: ['Garde externe nécessaire', 'Parents travaillent', 'Factures nominatives']
      }
    };
  }

  /**
   * Informations de l'année fiscale
   */
  private static getTaxYearInfo(): TaxYearInfo {
    return {
      year: 2024,
      deadlines: {
        declarationSubmission: '31 mars 2025',
        taxPayment: '30 septembre 2025',
        extensions: 'Prolongation possible jusqu\'au 30 septembre sur demande'
      },
      rates: {
        inflation: 1.8,
        averageIncome: 85000,
        averageTax: 15.2
      },
      changes: [
        'Augmentation limite 3e pilier A : 7\'056 CHF',
        'Nouveau barème fédéral ajusté inflation',
        'Déduction numérique élargie (ZH)',
        'Frais de garde augmentés : 10\'100 CHF par enfant'
      ]
    };
  }

  /**
   * Questions fiscales communes
   */
  private static getCommonQuestions(): TaxQuestion[] {
    return [
      {
        category: '3e Pilier',
        question: 'Jusqu\'à quand puis-je verser sur mon 3e pilier ?',
        answer: 'Vous pouvez verser jusqu\'au 31 décembre de l\'année fiscale pour bénéficier de la déduction.',
        relatedFields: ['deductions.pillar3a'],
        examples: ['Versement de 7\'056 CHF avant le 31.12.2024']
      },
      {
        category: 'Frais professionnels',
        question: 'Comment calculer mes frais de transport ?',
        answer: 'Transport public : montant exact. Voiture : 0.70 CHF/km si moins cher que transport public.',
        relatedFields: ['deductions.professionalExpenses.transport'],
        examples: ['Abonnement CFF : 3\'000 CHF', '50 km/jour × 220 jours × 0.70 = 7\'700 CHF']
      }
    ];
  }

  private static getProfessionalExpenseInfo(): ProfessionalExpenseInfo {
    return {
      transport: {
        publicTransport: 'Déductible intégralement selon factures',
        privateVehicle: { 
          rate: 0.70, 
          conditions: ['Si moins cher que transport public', 'Distance domicile-travail'] 
        },
        bicycle: { conditions: ['Vélo électrique : forfait selon distance', 'Vélo normal : forfait réduit'] }
      },
      meals: {
        office: 'Non déductible si cantine d\'entreprise disponible',
        external: { 
          rate: 15, 
          conditions: ['Maximum 15 CHF/jour', 'Repas pris à l\'extérieur nécessaire'] 
        }
      },
      equipment: {
        clothing: ['Habits de travail spécialisés', 'Équipements de protection', 'Uniformes'],
        tools: ['Outils professionnels personnels', 'Logiciels spécialisés'],
        technology: ['Ordinateur portable (quote-part usage privé)', 'Téléphone professionnel']
      },
      homeOffice: {
        requirements: ['Bureau séparé', 'Usage exclusivement professionnel', 'Accord employeur'],
        deductionMethod: 'Quote-part des frais du logement',
        maxAmount: 0 // Pas de limite fédérale, varie selon canton
      }
    };
  }

  private static getPillarInfo(): PillarInfo {
    return {
      pillar1: {
        description: 'AVS/AI - Prévoyance étatique obligatoire',
        who: 'Tous les résidents et travailleurs en Suisse',
        benefits: ['Rente de vieillesse', 'Rente d\'invalidité', 'Rente de survivant']
      },
      pillar2: {
        description: 'LPP - Prévoyance professionnelle obligatoire',
        buybacks: {
          advantages: ['Déduction fiscale intégrale', 'Capital supplémentaire à la retraite'],
          conditions: ['Lacune de prévoyance', 'Délai de 3 ans avant retrait'],
          strategy: ['Échelonner sur plusieurs années', 'Racheter avant la retraite']
        }
      },
      pillar3a: {
        description: 'Prévoyance liée - Épargne fiscalement privilégiée',
        limits: { employed: 7056, selfEmployed: 35280 },
        benefits: ['Déduction fiscale', 'Exonération d\'impôt sur gains', 'Taux réduit au retrait'],
        withdrawal: {
          conditions: ['5 ans avant âge AVS', 'Achat logement', 'Indépendance', 'Départ définitif'],
          earlyWithdrawal: ['Remboursement hypothèque', 'Rénovations importantes']
        }
      },
      pillar3b: {
        description: 'Prévoyance libre - Épargne et placements privés',
        advantages: ['Flexibilité totale', 'Pas de limite de versement'],
        limitations: ['Pas de déduction fiscale', 'Imposition normale des gains']
      }
    };
  }

  /**
   * Calcule les optimisations possibles pour un profil
   */
  static calculateOptimizations(profile: any): string[] {
    const optimizations: string[] = [];
    
    if (!profile) return optimizations;

    const income = profile.incomeData?.mainEmployment?.grossSalary || 0;
    const pillar3a = profile.deductions?.savingsContributions?.pillar3a || 0;
    const canton = profile.personalInfo?.canton;

    // Optimisation 3e pilier
    if (pillar3a < 7056) {
      const potential = 7056 - pillar3a;
      const savings = this.estimateTaxSavings(potential, income, canton);
      optimizations.push(`Augmenter 3e pilier de ${potential.toLocaleString('fr-CH')} CHF → économie ~${savings.toLocaleString('fr-CH')} CHF`);
    }

    // Optimisation frais professionnels
    const currentExpenses = this.calculateProfessionalExpenses(profile);
    if (currentExpenses.potential > currentExpenses.declared) {
      const additional = currentExpenses.potential - currentExpenses.declared;
      const savings = this.estimateTaxSavings(additional, income, canton);
      optimizations.push(`Optimiser frais professionnels → économie ~${savings.toLocaleString('fr-CH')} CHF`);
    }

    return optimizations;
  }

  private static estimateTaxSavings(amount: number, income: number, canton?: string): number {
    // Estimation simplifiée du taux marginal
    let marginalRate = 0.25; // 25% par défaut
    
    if (income > 100000) marginalRate = 0.35;
    if (income > 200000) marginalRate = 0.40;
    
    // Ajustement selon le canton
    if (canton === 'GE' || canton === 'VD') marginalRate += 0.05;
    if (canton === 'ZG' || canton === 'SZ') marginalRate -= 0.08;
    
    return Math.round(amount * marginalRate);
  }

  private static calculateProfessionalExpenses(profile: any): { declared: number; potential: number } {
    // Calcul simplifié des frais professionnels potentiels
    return {
      declared: profile.deductions?.professionalExpenses?.total || 0,
      potential: 3000 // Estimation basée sur profil type
    };
  }
}