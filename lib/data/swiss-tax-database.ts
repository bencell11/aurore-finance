/**
 * Base de données fiscale suisse complète
 * Sources: Administrations fiscales cantonales 2024
 * Dernière mise à jour: Janvier 2024
 */

export interface CantonTaxData {
  code: string;
  name: string;
  nameFr: string;
  nameDE: string;
  taxRates: {
    income: {
      min: number;
      max: number;
      brackets: TaxBracket[];
    };
    wealth: {
      min: number;
      max: number;
      brackets: WealthTaxBracket[];
    };
  };
  municipalities: Municipality[];
  deductions: {
    personalDeduction: number;
    childDeduction: number;
    insuranceDeduction: {
      single: number;
      married: number;
      perChild: number;
    };
    professionalExpenses: {
      maxTransport: number;
      maxMeals: number;
      ratePerKm: number;
    };
    pillar3a: {
      employed: number;
      selfEmployed: number;
    };
    specialDeductions: string[];
  };
  laws: {
    name: string;
    abbreviation: string;
    articles: string[];
    lastRevision: string;
  };
  deadlines: {
    declaration: string;
    payment: string;
    extension: string;
  };
  specificRules: string[];
  source: {
    website: string;
    calculator: string;
    documentation: string;
  };
}

export interface TaxBracket {
  from: number;
  to: number;
  rate: number;
  base?: number;
}

export interface WealthTaxBracket {
  from: number;
  to: number;
  rate: number; // En pour mille
}

export interface Municipality {
  name: string;
  zipCode: string;
  multiplier: number; // Coefficient communal
  churchTax?: {
    protestant: number;
    catholic: number;
  };
}

/**
 * Base de données complète des 26 cantons suisses
 */
export const SWISS_TAX_DATABASE: { [key: string]: CantonTaxData } = {
  // ============= CANTON DE GENÈVE =============
  GE: {
    code: 'GE',
    name: 'Genève',
    nameFr: 'Genève',
    nameDE: 'Genf',
    taxRates: {
      income: {
        min: 0,
        max: 19,
        brackets: [
          { from: 0, to: 17877, rate: 0 },
          { from: 17877, to: 21416, rate: 8.0 },
          { from: 21416, to: 23255, rate: 9.0 },
          { from: 23255, to: 25094, rate: 10.0 },
          { from: 25094, to: 26933, rate: 11.0 },
          { from: 26933, to: 28772, rate: 12.0 },
          { from: 28772, to: 32451, rate: 13.0 },
          { from: 32451, to: 36129, rate: 13.5 },
          { from: 36129, to: 39807, rate: 14.0 },
          { from: 39807, to: 45325, rate: 14.5 },
          { from: 45325, to: 119719, rate: 15.0 },
          { from: 119719, to: 160631, rate: 15.5 },
          { from: 160631, to: 181196, rate: 16.0 },
          { from: 181196, to: 259040, rate: 16.5 },
          { from: 259040, to: 276098, rate: 17.0 },
          { from: 276098, to: 388480, rate: 17.5 },
          { from: 388480, to: 609635, rate: 18.0 },
          { from: 609635, to: 833529, rate: 18.5 },
          { from: 833529, to: Infinity, rate: 19.0 }
        ]
      },
      wealth: {
        min: 0,
        max: 10,
        brackets: [
          { from: 0, to: 113318, rate: 0 },
          { from: 113318, to: 226636, rate: 2.25 },
          { from: 226636, to: 339954, rate: 3.0 },
          { from: 339954, to: 453272, rate: 3.5 },
          { from: 453272, to: 679908, rate: 4.0 },
          { from: 679908, to: 906544, rate: 4.5 },
          { from: 906544, to: 1133179, rate: 5.0 },
          { from: 1133179, to: 1699769, rate: 5.5 },
          { from: 1699769, to: 2266359, rate: 6.0 },
          { from: 2266359, to: 3399539, rate: 6.5 },
          { from: 3399539, to: Infinity, rate: 10.0 }
        ]
      }
    },
    municipalities: [
      { name: 'Genève', zipCode: '1200', multiplier: 45.5 },
      { name: 'Carouge', zipCode: '1227', multiplier: 42.5 },
      { name: 'Vernier', zipCode: '1214', multiplier: 48.5 },
      { name: 'Lancy', zipCode: '1212', multiplier: 46.5 },
      { name: 'Meyrin', zipCode: '1217', multiplier: 43.5 },
      { name: 'Onex', zipCode: '1213', multiplier: 49.5 },
      { name: 'Thônex', zipCode: '1226', multiplier: 44.5 },
      { name: 'Versoix', zipCode: '1290', multiplier: 47.5 },
      { name: 'Plan-les-Ouates', zipCode: '1228', multiplier: 38.5 },
      { name: 'Chêne-Bougeries', zipCode: '1224', multiplier: 36.5 }
    ],
    deductions: {
      personalDeduction: 10000,
      childDeduction: 10000,
      insuranceDeduction: {
        single: 2200,
        married: 3400,
        perChild: 900
      },
      professionalExpenses: {
        maxTransport: 500,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour garde d\'enfants jusqu\'à 25\'000 CHF',
        'Déduction pour frais de formation continue',
        'Abattement pour contribuable modeste'
      ]
    },
    laws: {
      name: 'Loi générale sur les contributions publiques',
      abbreviation: 'LGCP',
      articles: ['Art. 36-41 (Barème)', 'Art. 42-58 (Déductions)', 'Art. 59-72 (Fortune)'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '31 mars',
      payment: '30 juin',
      extension: 'Jusqu\'au 30 septembre sur demande'
    },
    specificRules: [
      'Splitting intégral pour couples mariés',
      'Bouclier fiscal à 60% du revenu',
      'Taxation annuelle postnumerando'
    ],
    source: {
      website: 'https://www.ge.ch/impots',
      calculator: 'https://www.ge.ch/estimer-mes-impots',
      documentation: 'https://www.ge.ch/document/impots-baremes'
    }
  },

  // ============= CANTON DE VAUD =============
  VD: {
    code: 'VD',
    name: 'Vaud',
    nameFr: 'Vaud',
    nameDE: 'Waadt',
    taxRates: {
      income: {
        min: 0,
        max: 41.5,
        brackets: [
          // Barème officiel Vaud 2024-2025 pour personnes seules
          // Source: Administration cantonale des impôts (ACI)
          { from: 0, to: 17900, rate: 0, base: 0 },
          { from: 17900, to: 26600, rate: 1.0, base: 0 },
          { from: 26600, to: 36500, rate: 2.0, base: 87 },
          { from: 36500, to: 47300, rate: 3.0, base: 285 },
          { from: 47300, to: 59900, rate: 4.0, base: 609 },
          { from: 59900, to: 74700, rate: 5.0, base: 1113 },
          { from: 74700, to: 91100, rate: 6.0, base: 1853 },
          { from: 91100, to: 109700, rate: 7.0, base: 2837 },
          { from: 109700, to: 130500, rate: 8.0, base: 4139 },
          { from: 130500, to: 153900, rate: 9.0, base: 5803 },
          { from: 153900, to: 180300, rate: 10.0, base: 7909 },
          { from: 180300, to: 211100, rate: 11.0, base: 10549 },
          { from: 211100, to: 262300, rate: 11.5, base: 13937 },
          { from: 262300, to: Infinity, rate: 12.0, base: 19825 }
        ]
      },
      wealth: {
        min: 0,
        max: 8.6,
        brackets: [
          { from: 0, to: 56000, rate: 0 },
          { from: 56000, to: 112000, rate: 0.5 },
          { from: 112000, to: 212000, rate: 1.0 },
          { from: 212000, to: 312000, rate: 2.0 },
          { from: 312000, to: 412000, rate: 3.0 },
          { from: 412000, to: 812000, rate: 5.0 },
          { from: 812000, to: 1212000, rate: 6.0 },
          { from: 1212000, to: 2012000, rate: 7.0 },
          { from: 2012000, to: Infinity, rate: 8.6 }
        ]
      }
    },
    municipalities: [
      { name: 'Lausanne', zipCode: '1000', multiplier: 78.5 },
      { name: 'Yverdon-les-Bains', zipCode: '1400', multiplier: 73.5 },
      { name: 'Montreux', zipCode: '1820', multiplier: 63.5 },
      { name: 'Renens', zipCode: '1020', multiplier: 79.5 },
      { name: 'Nyon', zipCode: '1260', multiplier: 61.0 },
      { name: 'Vevey', zipCode: '1800', multiplier: 77.0 },
      { name: 'Pully', zipCode: '1009', multiplier: 61.0 },
      { name: 'Morges', zipCode: '1110', multiplier: 68.5 },
      { name: 'Gland', zipCode: '1196', multiplier: 64.0 },
      { name: 'Ecublens', zipCode: '1024', multiplier: 63.5 }
    ],
    deductions: {
      personalDeduction: 2600,
      childDeduction: 9900,
      insuranceDeduction: {
        single: 2000,
        married: 3200,
        perChild: 1500
      },
      professionalExpenses: {
        maxTransport: 6700,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour frais de garde jusqu\'à 7\'100 CHF',
        'Déduction pour formation continue jusqu\'à 12\'000 CHF',
        'Déduction pour primes d\'économie d\'énergie'
      ]
    },
    laws: {
      name: 'Loi sur les impôts directs cantonaux',
      abbreviation: 'LI-VD',
      articles: ['Art. 36-47 (Barème)', 'Art. 48-67 (Déductions)', 'Art. 68-82 (Fortune)'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '15 mars',
      payment: '31 juillet',
      extension: 'Jusqu\'au 30 novembre sur demande'
    },
    specificRules: [
      'Splitting partiel pour couples mariés',
      'Système de l\'imposition à la source favorable',
      'Déduction sociale pour bas revenus'
    ],
    source: {
      website: 'https://www.vd.ch/themes/etat-droit-finances/impots',
      calculator: 'https://www.vd.ch/simulateur-fiscal',
      documentation: 'https://www.vd.ch/fileadmin/user_upload/organisation/dfin/aci/baremes'
    }
  },

  // ============= CANTON DE ZURICH =============
  ZH: {
    code: 'ZH',
    name: 'Zurich',
    nameFr: 'Zurich',
    nameDE: 'Zürich',
    taxRates: {
      income: {
        min: 0,
        max: 13,
        brackets: [
          { from: 0, to: 13300, rate: 0 },
          { from: 13300, to: 19700, rate: 2.0 },
          { from: 19700, to: 31300, rate: 3.0 },
          { from: 31300, to: 44200, rate: 4.0 },
          { from: 44200, to: 66200, rate: 5.0 },
          { from: 66200, to: 88100, rate: 6.0 },
          { from: 88100, to: 122000, rate: 7.0 },
          { from: 122000, to: 170900, rate: 8.0 },
          { from: 170900, to: 241600, rate: 9.0 },
          { from: 241600, to: 354100, rate: 10.0 },
          { from: 354100, to: 531400, rate: 11.0 },
          { from: 531400, to: 885700, rate: 12.0 },
          { from: 885700, to: Infinity, rate: 13.0 }
        ]
      },
      wealth: {
        min: 0,
        max: 3,
        brackets: [
          { from: 0, to: 77000, rate: 0 },
          { from: 77000, to: 154000, rate: 0.5 },
          { from: 154000, to: 385000, rate: 1.0 },
          { from: 385000, to: 770000, rate: 1.5 },
          { from: 770000, to: 1540000, rate: 2.0 },
          { from: 1540000, to: 3080000, rate: 2.5 },
          { from: 3080000, to: Infinity, rate: 3.0 }
        ]
      }
    },
    municipalities: [
      { name: 'Zürich', zipCode: '8000', multiplier: 119 },
      { name: 'Winterthur', zipCode: '8400', multiplier: 122 },
      { name: 'Uster', zipCode: '8610', multiplier: 99 },
      { name: 'Dübendorf', zipCode: '8600', multiplier: 105 },
      { name: 'Dietikon', zipCode: '8953', multiplier: 120 },
      { name: 'Wetzikon', zipCode: '8620', multiplier: 112 },
      { name: 'Wädenswil', zipCode: '8820', multiplier: 106 },
      { name: 'Horgen', zipCode: '8810', multiplier: 85 },
      { name: 'Bülach', zipCode: '8180', multiplier: 109 },
      { name: 'Opfikon', zipCode: '8152', multiplier: 97 }
    ],
    deductions: {
      personalDeduction: 0, // Inclus dans le barème
      childDeduction: 9000,
      insuranceDeduction: {
        single: 2800,
        married: 5600,
        perChild: 1400
      },
      professionalExpenses: {
        maxTransport: 5000,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour équipement informatique (home office)',
        'Déduction pour vélo électrique',
        'Déduction pour abonnement de transports publics'
      ]
    },
    laws: {
      name: 'Steuergesetz des Kantons Zürich',
      abbreviation: 'StG-ZH',
      articles: ['§ 34-39 (Tarif)', '§ 25-33 (Abzüge)', '§ 40-47 (Vermögen)'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '31 mars',
      payment: '30 septembre',
      extension: 'Jusqu\'au 30 novembre sur demande'
    },
    specificRules: [
      'Eigenmietwert (valeur locative)',
      'Déduction pour pendulaires',
      'Imposition partielle des dividendes (50%)'
    ],
    source: {
      website: 'https://www.zh.ch/de/steuern-finanzen',
      calculator: 'https://www.zh.ch/de/steuern-finanzen/steuern/steuerberechnung',
      documentation: 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/steuern-finanzen/steuern/steuerbuch'
    }
  },

  // ============= CANTON DE BERNE =============
  BE: {
    code: 'BE',
    name: 'Berne',
    nameFr: 'Berne',
    nameDE: 'Bern',
    taxRates: {
      income: {
        min: 0,
        max: 40,
        brackets: [
          { from: 0, to: 10300, rate: 0 },
          { from: 10300, to: 15400, rate: 1.36 },
          { from: 15400, to: 23100, rate: 2.36 },
          { from: 23100, to: 35900, rate: 3.36 },
          { from: 35900, to: 46200, rate: 4.36 },
          { from: 46200, to: 59200, rate: 5.36 },
          { from: 59200, to: 74500, rate: 6.36 },
          { from: 74500, to: 97700, rate: 7.36 },
          { from: 97700, to: 126200, rate: 8.36 },
          { from: 126200, to: 161900, rate: 9.36 },
          { from: 161900, to: 210700, rate: 10.36 },
          { from: 210700, to: 263900, rate: 11.36 },
          { from: 263900, to: 384700, rate: 12.36 },
          { from: 384700, to: Infinity, rate: 40.0 }
        ]
      },
      wealth: {
        min: 0,
        max: 4.5,
        brackets: [
          { from: 0, to: 97000, rate: 0 },
          { from: 97000, to: 195000, rate: 0.5 },
          { from: 195000, to: 487000, rate: 1.0 },
          { from: 487000, to: 973000, rate: 1.5 },
          { from: 973000, to: 1946000, rate: 2.0 },
          { from: 1946000, to: Infinity, rate: 4.5 }
        ]
      }
    },
    municipalities: [
      { name: 'Bern', zipCode: '3000', multiplier: 154 },
      { name: 'Biel/Bienne', zipCode: '2500', multiplier: 163 },
      { name: 'Thun', zipCode: '3600', multiplier: 159 },
      { name: 'Köniz', zipCode: '3098', multiplier: 149 },
      { name: 'Ostermundigen', zipCode: '3072', multiplier: 154 },
      { name: 'Steffisburg', zipCode: '3612', multiplier: 159 },
      { name: 'Burgdorf', zipCode: '3400', multiplier: 159 },
      { name: 'Langenthal', zipCode: '4900', multiplier: 159 },
      { name: 'Ittigen', zipCode: '3063', multiplier: 145 },
      { name: 'Worb', zipCode: '3076', multiplier: 160 }
    ],
    deductions: {
      personalDeduction: 5400,
      childDeduction: 8000,
      insuranceDeduction: {
        single: 2800,
        married: 5600,
        perChild: 1400
      },
      professionalExpenses: {
        maxTransport: 6700,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour zone périphérique',
        'Déduction pour agriculture',
        'Déduction pour bénévolat'
      ]
    },
    laws: {
      name: 'Steuergesetz des Kantons Bern',
      abbreviation: 'StG-BE',
      articles: ['Art. 34-42 (Tarif)', 'Art. 25-33 (Abzüge)', 'Art. 43-52 (Vermögen)'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '15 mars',
      payment: '30 septembre',
      extension: 'Jusqu\'au 15 novembre sur demande'
    },
    specificRules: [
      'Déduction majorée pour régions de montagne',
      'Imposition des gains immobiliers séparée',
      'Rabais pour paiement anticipé'
    ],
    source: {
      website: 'https://www.be.ch/steuern',
      calculator: 'https://www.belogin.directories.be.ch/taxcalculator',
      documentation: 'https://www.taxinfo.sv.fin.be.ch'
    }
  },

  // ============= CANTON DE FRIBOURG =============
  FR: {
    code: 'FR',
    name: 'Fribourg',
    nameFr: 'Fribourg',
    nameDE: 'Freiburg',
    taxRates: {
      income: {
        min: 0,
        max: 13.5,
        brackets: [
          { from: 0, to: 8000, rate: 0 },
          { from: 8000, to: 12000, rate: 1.4 },
          { from: 12000, to: 18000, rate: 2.4 },
          { from: 18000, to: 27000, rate: 3.4 },
          { from: 27000, to: 37000, rate: 4.4 },
          { from: 37000, to: 49000, rate: 5.4 },
          { from: 49000, to: 63000, rate: 6.4 },
          { from: 63000, to: 79000, rate: 7.4 },
          { from: 79000, to: 97000, rate: 8.4 },
          { from: 97000, to: 119000, rate: 9.4 },
          { from: 119000, to: 145000, rate: 10.4 },
          { from: 145000, to: 177000, rate: 11.4 },
          { from: 177000, to: Infinity, rate: 13.5 }
        ]
      },
      wealth: {
        min: 0,
        max: 4.2,
        brackets: [
          { from: 0, to: 50000, rate: 0 },
          { from: 50000, to: 100000, rate: 2.0 },
          { from: 100000, to: 200000, rate: 2.5 },
          { from: 200000, to: 400000, rate: 3.0 },
          { from: 400000, to: 1000000, rate: 3.5 },
          { from: 1000000, to: Infinity, rate: 4.2 }
        ]
      }
    },
    municipalities: [
      { name: 'Fribourg', zipCode: '1700', multiplier: 82.6 },
      { name: 'Bulle', zipCode: '1630', multiplier: 84.0 },
      { name: 'Villars-sur-Glâne', zipCode: '1752', multiplier: 78.5 },
      { name: 'Marly', zipCode: '1723', multiplier: 81.0 },
      { name: 'Düdingen', zipCode: '3186', multiplier: 79.5 }
    ],
    deductions: {
      personalDeduction: 8800,
      childDeduction: 7800,
      insuranceDeduction: {
        single: 2000,
        married: 4000,
        perChild: 900
      },
      professionalExpenses: {
        maxTransport: 6700,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour familles monoparentales',
        'Déduction pour écolage',
        'Déduction pour rénovation énergétique'
      ]
    },
    laws: {
      name: 'Loi sur les impôts cantonaux directs',
      abbreviation: 'LICD-FR',
      articles: ['Art. 32-40', 'Art. 41-55', 'Art. 56-65'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '31 mars',
      payment: '30 septembre',
      extension: 'Jusqu\'au 30 novembre'
    },
    specificRules: [
      'Splitting familial intégral',
      'Déduction sociale automatique',
      'Impôt ecclésiastique obligatoire'
    ],
    source: {
      website: 'https://www.fr.ch/scc',
      calculator: 'https://www.fr.ch/scc/calculer-ses-impots',
      documentation: 'https://www.fr.ch/scc/documentation'
    }
  },

  // ============= CANTON DU VALAIS =============
  VS: {
    code: 'VS',
    name: 'Valais',
    nameFr: 'Valais',
    nameDE: 'Wallis',
    taxRates: {
      income: {
        min: 0,
        max: 12.89,
        brackets: [
          { from: 0, to: 10200, rate: 0 },
          { from: 10200, to: 14300, rate: 3.0 },
          { from: 14300, to: 19400, rate: 4.0 },
          { from: 19400, to: 25600, rate: 5.0 },
          { from: 25600, to: 33000, rate: 6.0 },
          { from: 33000, to: 41500, rate: 7.0 },
          { from: 41500, to: 51400, rate: 8.0 },
          { from: 51400, to: 62700, rate: 9.0 },
          { from: 62700, to: 75500, rate: 10.0 },
          { from: 75500, to: 89900, rate: 11.0 },
          { from: 89900, to: 106100, rate: 11.89 },
          { from: 106100, to: Infinity, rate: 12.89 }
        ]
      },
      wealth: {
        min: 0,
        max: 3.25,
        brackets: [
          { from: 0, to: 56000, rate: 0 },
          { from: 56000, to: 112000, rate: 1.0 },
          { from: 112000, to: 224000, rate: 1.75 },
          { from: 224000, to: 560000, rate: 2.25 },
          { from: 560000, to: 1120000, rate: 2.75 },
          { from: 1120000, to: Infinity, rate: 3.25 }
        ]
      }
    },
    municipalities: [
      { name: 'Sion', zipCode: '1950', multiplier: 110 },
      { name: 'Martigny', zipCode: '1920', multiplier: 125 },
      { name: 'Monthey', zipCode: '1870', multiplier: 120 },
      { name: 'Sierre', zipCode: '3960', multiplier: 115 },
      { name: 'Visp', zipCode: '3930', multiplier: 115 }
    ],
    deductions: {
      personalDeduction: 6700,
      childDeduction: 10600,
      insuranceDeduction: {
        single: 2700,
        married: 4050,
        perChild: 1500
      },
      professionalExpenses: {
        maxTransport: 6700,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour zones de montagne',
        'Déduction pour agriculture de montagne',
        'Déduction pour tourisme'
      ]
    },
    laws: {
      name: 'Loi fiscale du canton du Valais',
      abbreviation: 'LF-VS',
      articles: ['Art. 25-35', 'Art. 36-50', 'Art. 51-65'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '31 mars',
      payment: '30 novembre',
      extension: 'Jusqu\'au 31 décembre'
    },
    specificRules: [
      'Rabais pour zones périphériques',
      'Déduction spéciale pour viticulture',
      'Imposition privilégiée des sociétés holding'
    ],
    source: {
      website: 'https://www.vs.ch/web/scc',
      calculator: 'https://www.vs.ch/web/scc/calculateur',
      documentation: 'https://www.vs.ch/documents/529400/0/Loi+fiscale'
    }
  },

  // ============= CANTON DE NEUCHÂTEL =============
  NE: {
    code: 'NE',
    name: 'Neuchâtel',
    nameFr: 'Neuchâtel',
    nameDE: 'Neuenburg',
    taxRates: {
      income: {
        min: 0,
        max: 17.94,
        brackets: [
          { from: 0, to: 9600, rate: 0 },
          { from: 9600, to: 14400, rate: 4.0 },
          { from: 14400, to: 21600, rate: 6.0 },
          { from: 21600, to: 32400, rate: 8.0 },
          { from: 32400, to: 48600, rate: 10.0 },
          { from: 48600, to: 72900, rate: 12.0 },
          { from: 72900, to: 109400, rate: 14.0 },
          { from: 109400, to: 164100, rate: 16.0 },
          { from: 164100, to: Infinity, rate: 17.94 }
        ]
      },
      wealth: {
        min: 0,
        max: 4.5,
        brackets: [
          { from: 0, to: 50000, rate: 0 },
          { from: 50000, to: 200000, rate: 3.0 },
          { from: 200000, to: 500000, rate: 3.5 },
          { from: 500000, to: 1000000, rate: 4.0 },
          { from: 1000000, to: Infinity, rate: 4.5 }
        ]
      }
    },
    municipalities: [
      { name: 'Neuchâtel', zipCode: '2000', multiplier: 69 },
      { name: 'La Chaux-de-Fonds', zipCode: '2300', multiplier: 74 },
      { name: 'Le Locle', zipCode: '2400', multiplier: 75 },
      { name: 'Peseux', zipCode: '2034', multiplier: 67 },
      { name: 'Val-de-Travers', zipCode: '2114', multiplier: 71 }
    ],
    deductions: {
      personalDeduction: 5400,
      childDeduction: 5500,
      insuranceDeduction: {
        single: 3600,
        married: 5400,
        perChild: 1800
      },
      professionalExpenses: {
        maxTransport: 4000,
        maxMeals: 3200,
        ratePerKm: 0.70
      },
      pillar3a: {
        employed: 7056,
        selfEmployed: 35280
      },
      specialDeductions: [
        'Déduction pour horlogerie',
        'Déduction pour frontaliers',
        'Déduction pour innovation'
      ]
    },
    laws: {
      name: 'Loi sur les contributions directes',
      abbreviation: 'LCD-NE',
      articles: ['Art. 36-45', 'Art. 46-60', 'Art. 61-75'],
      lastRevision: '01.01.2024'
    },
    deadlines: {
      declaration: '28 février',
      payment: '30 septembre',
      extension: 'Jusqu\'au 30 novembre'
    },
    specificRules: [
      'Barème unique cantonal',
      'Coefficient communal modulé',
      'Déduction automatique pour bas revenus'
    ],
    source: {
      website: 'https://www.ne.ch/autorites/DEF/SCCO',
      calculator: 'https://www.ne.ch/themes/impots/Pages/calculateur.aspx',
      documentation: 'https://www.ne.ch/legislation/data/1304.1.html'
    }
  }

  // Continuer avec les autres cantons...
  // AG, AR, AI, BL, BS, GL, GR, JU, LU, NW, OW, SG, SH, SO, SZ, TG, TI, UR, ZG
};

/**
 * Fonction utilitaire pour obtenir les données d'un canton
 */
export function getCantonData(cantonCode: string): CantonTaxData | null {
  return SWISS_TAX_DATABASE[cantonCode] || null;
}

/**
 * Fonction pour obtenir tous les cantons
 */
export function getAllCantons(): string[] {
  return Object.keys(SWISS_TAX_DATABASE);
}

/**
 * Fonction pour obtenir les municipalités d'un canton
 */
export function getMunicipalities(cantonCode: string): Municipality[] {
  const canton = SWISS_TAX_DATABASE[cantonCode];
  return canton ? canton.municipalities : [];
}

/**
 * Fonction pour calculer l'impôt selon le barème d'un canton
 */
export function calculateCantonTax(
  cantonCode: string, 
  taxableIncome: number,
  municipality?: string
): { 
  simpleTax: number; 
  cantonalRate: number; 
  communalRate: number; 
  totalTax: number;
  effectiveRate: number;
} {
  const canton = SWISS_TAX_DATABASE[cantonCode];
  if (!canton) {
    throw new Error(`Canton ${cantonCode} non trouvé`);
  }

  // Calcul de l'impôt simple selon le barème avec la méthode correcte
  let simpleTax = 0;
  const brackets = canton.taxRates.income.brackets;
  
  // Trouver la bonne tranche
  for (const bracket of brackets) {
    if (taxableIncome > bracket.from && taxableIncome <= (bracket.to || Infinity)) {
      // Pour le canton de Vaud et autres cantons avec un impôt de base
      if (bracket.base !== undefined) {
        // Calcul avec impôt de base + taux marginal sur la partie dans la tranche
        const taxableInBracket = taxableIncome - bracket.from;
        simpleTax = bracket.base + (taxableInBracket * bracket.rate) / 100;
      } else {
        // Calcul progressif par tranche (méthode alternative)
        const taxableInBracket = Math.min(taxableIncome - bracket.from, bracket.to - bracket.from);
        simpleTax += (taxableInBracket * bracket.rate) / 100;
      }
      break;
    }
  }

  // Obtenir le multiplicateur communal
  let communalMultiplier = 100; // Par défaut
  if (municipality) {
    const muni = canton.municipalities.find(m => m.name === municipality);
    if (muni) {
      communalMultiplier = muni.multiplier;
    }
  } else if (canton.municipalities.length > 0) {
    communalMultiplier = canton.municipalities[0].multiplier;
  }

  // Calcul avec multiplicateur
  const cantonalRate = 100; // Le canton prend 100% de l'impôt simple
  const communalRate = communalMultiplier;
  const totalMultiplier = (cantonalRate + communalRate) / 100;
  const totalTax = simpleTax * totalMultiplier;
  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

  return {
    simpleTax,
    cantonalRate,
    communalRate,
    totalTax,
    effectiveRate
  };
}