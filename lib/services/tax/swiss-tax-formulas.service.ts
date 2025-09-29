/**
 * Formules fiscales officielles suisses
 * Sources: Administration fédérale des contributions (AFC), administrations cantonales
 */

import { getCantonData, calculateCantonTax as calculateFromDB } from '@/lib/data/swiss-tax-database';

export interface TaxCalculationSources {
  federal: {
    source: string;
    year: number;
    url: string;
    lastUpdated: string;
  };
  cantonal: {
    [canton: string]: {
      source: string;
      year: number;
      url: string;
      lastUpdated: string;
    };
  };
}

/**
 * Sources officielles des calculs fiscaux
 */
export const TAX_CALCULATION_SOURCES: TaxCalculationSources = {
  federal: {
    source: "Administration fédérale des contributions (AFC)",
    year: 2024,
    url: "https://www.estv.admin.ch/estv/fr/accueil/impot-federal-direct/tarifs-fiscaux.html",
    lastUpdated: "2024-01-01"
  },
  cantonal: {
    GE: {
      source: "Administration fiscale cantonale de Genève",
      year: 2024,
      url: "https://www.ge.ch/organisation/administration-fiscale-cantonale",
      lastUpdated: "2024-01-01"
    },
    VD: {
      source: "Administration cantonale des impôts (ACI) - Vaud",
      year: 2024,
      url: "https://www.vd.ch/themes/finances-et-fiscalite/fiscalite/",
      lastUpdated: "2024-01-01"
    },
    ZH: {
      source: "Kantonales Steueramt Zürich",
      year: 2024,
      url: "https://www.zh.ch/de/steuern-finanzen.html",
      lastUpdated: "2024-01-01"
    }
  }
};

/**
 * Service de calculs fiscaux officiels suisses
 */
export class SwissTaxFormulasService {

  /**
   * Calcule le vrai taux marginal en comparant l'impôt sur deux revenus
   * Le taux marginal = (impôt(revenu+1000) - impôt(revenu)) / 1000
   */
  static calculateMarginalRate(taxableIncome: number, civilStatus: 'single' | 'married' = 'single', increment: number = 1000): number {
    if (taxableIncome <= 0) return 0;
    
    // Calculer l'impôt au revenu actuel
    const taxAtCurrentIncome = this.calculateFederalTaxInternal(taxableIncome, civilStatus);
    
    // Calculer l'impôt avec le revenu incrémenté
    const taxAtIncrementedIncome = this.calculateFederalTaxInternal(taxableIncome + increment, civilStatus);
    
    // Calculer le taux marginal réel
    const marginalRate = ((taxAtIncrementedIncome - taxAtCurrentIncome) / increment) * 100;
    
    return Math.round(marginalRate * 100) / 100; // Arrondir à 2 décimales
  }

  /**
   * Calcule le taux marginal TOTAL (fédéral + cantonal + communal)
   * Conforme à la méthode suisse de calcul du taux marginal
   * @param taxableIncome Revenu imposable
   * @param canton Canton de résidence
   * @param municipality Commune (optionnel)
   * @param civilStatus État civil
   * @param increment Incrément pour le calcul (par défaut 1000 CHF)
   * @returns Taux marginal total en pourcentage
   */
  static calculateTotalMarginalRate(taxableIncome: number, canton: string, municipality?: string, civilStatus: 'single' | 'married' = 'single', increment: number = 1000): number {
    if (taxableIncome <= 0) return 0;
    
    // Calculer l'impôt total au revenu actuel
    const federalTaxCurrent = this.calculateFederalTaxInternal(taxableIncome, civilStatus);
    const cantonalTaxCurrent = this.calculateCantonalTax(taxableIncome, canton, municipality).totalTax;
    const totalTaxCurrent = federalTaxCurrent + cantonalTaxCurrent;
    
    // Calculer l'impôt total avec le revenu incrémenté
    const federalTaxIncremented = this.calculateFederalTaxInternal(taxableIncome + increment, civilStatus);
    const cantonalTaxIncremented = this.calculateCantonalTax(taxableIncome + increment, canton, municipality).totalTax;
    const totalTaxIncremented = federalTaxIncremented + cantonalTaxIncremented;
    
    // Calculer le taux marginal réel total
    const marginalRate = ((totalTaxIncremented - totalTaxCurrent) / increment) * 100;
    
    console.log(`[TaxFormulas] Taux marginal pour ${canton}:`, {
      revenu: taxableIncome,
      impôtActuel: totalTaxCurrent,
      impôtIncrémenté: totalTaxIncremented,
      différence: totalTaxIncremented - totalTaxCurrent,
      tauxMarginal: marginalRate
    });
    
    return Math.round(marginalRate * 100) / 100; // Arrondir à 2 décimales
  }

  /**
   * CALCUL IMPÔT FÉDÉRAL DIRECT (IFD)
   * Source: Art. 214 LIFD, Ordonnance AFC sur les tarifs
   * Formule officielle progressive par tranches
   */
  static calculateFederalTax(taxableIncome: number, civilStatus: 'single' | 'married' = 'single'): {
    tax: number;
    marginalRate: number;
    effectiveRate: number;
    calculation: TaxCalculationDetail[];
  } {
    // Tarif 2024 officiel AFC pour personnes seules
    const federalTaxBrackets2024Single = [
      { from: 0, to: 14500, rate: 0, base: 0 },
      { from: 14500, to: 31600, rate: 0.77, base: 0 },
      { from: 31600, to: 41400, rate: 0.88, base: 131.67 },
      { from: 41400, to: 55200, rate: 2.64, base: 217.92 },
      { from: 55200, to: 72500, rate: 2.97, base: 582.24 },
      { from: 72500, to: 78100, rate: 5.94, base: 1095.69 },
      { from: 78100, to: 103600, rate: 6.6, base: 1428.33 },
      { from: 103600, to: 134600, rate: 8.8, base: 3111.33 },
      { from: 134600, to: 176000, rate: 11, base: 5839.33 },
      { from: 176000, to: 755200, rate: 13.2, base: 10393.33 },
      { from: 755200, to: Infinity, rate: 11.5, base: 86859.73 }
    ];

    // Tarif pour couples mariés (taxation commune)
    const federalTaxBracketsMarried = [
      { from: 0, to: 29000, rate: 0, base: 0 },
      { from: 29000, to: 50900, rate: 1, base: 0 },
      { from: 50900, to: 58400, rate: 2, base: 219 },
      { from: 58400, to: 75300, rate: 3, base: 369 },
      { from: 75300, to: 90300, rate: 4, base: 876 },
      { from: 90300, to: 103400, rate: 5, base: 1476 },
      { from: 103400, to: 114700, rate: 6, base: 2131 },
      { from: 114700, to: 124200, rate: 7, base: 2809 },
      { from: 124200, to: 131700, rate: 8, base: 3474 },
      { from: 131700, to: 137300, rate: 9, base: 4074 },
      { from: 137300, to: 141200, rate: 10, base: 4578 },
      { from: 141200, to: 143100, rate: 11, base: 4968 },
      { from: 143100, to: 145000, rate: 12, base: 5177 },
      { from: 145000, to: Infinity, rate: 11.5, base: 5405 }
    ];

    const totalTax = this.calculateFederalTaxInternal(taxableIncome, civilStatus);
    const calculation = this.calculateFederalTaxBreakdown(taxableIncome, civilStatus);
    const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
    
    // Calculer le vrai taux marginal
    const marginalRate = this.calculateMarginalRate(taxableIncome, civilStatus);

    return {
      tax: Math.round(totalTax),
      marginalRate,
      effectiveRate,
      calculation
    };
  }

  /**
   * Fonction interne pour calculer uniquement le montant de l'impôt fédéral
   */
  private static calculateFederalTaxInternal(taxableIncome: number, civilStatus: 'single' | 'married' = 'single'): number {
    const federalTaxBrackets2024Single = [
      { from: 0, to: 14500, rate: 0, base: 0 },
      { from: 14500, to: 31600, rate: 0.77, base: 0 },
      { from: 31600, to: 41400, rate: 0.88, base: 131.67 },
      { from: 41400, to: 55200, rate: 2.64, base: 217.92 },
      { from: 55200, to: 72500, rate: 2.97, base: 582.24 },
      { from: 72500, to: 78100, rate: 5.94, base: 1095.69 },
      { from: 78100, to: 103600, rate: 6.6, base: 1428.33 },
      { from: 103600, to: 134600, rate: 8.8, base: 3111.33 },
      { from: 134600, to: 176000, rate: 11, base: 5839.33 },
      { from: 176000, to: 755200, rate: 13.2, base: 10393.33 },
      { from: 755200, to: Infinity, rate: 11.5, base: 86859.73 }
    ];

    const federalTaxBracketsMarried = [
      { from: 0, to: 29000, rate: 0, base: 0 },
      { from: 29000, to: 50900, rate: 1, base: 0 },
      { from: 50900, to: 58400, rate: 2, base: 219 },
      { from: 58400, to: 75300, rate: 3, base: 369 },
      { from: 75300, to: 90300, rate: 4, base: 876 },
      { from: 90300, to: 103400, rate: 5, base: 1476 },
      { from: 103400, to: 114700, rate: 6, base: 2131 },
      { from: 114700, to: 124200, rate: 7, base: 2809 },
      { from: 124200, to: 131700, rate: 8, base: 3474 },
      { from: 131700, to: 137300, rate: 9, base: 4074 },
      { from: 137300, to: 141200, rate: 10, base: 4578 },
      { from: 141200, to: 143100, rate: 11, base: 4968 },
      { from: 143100, to: 145000, rate: 12, base: 5177 },
      { from: 145000, to: Infinity, rate: 11.5, base: 5405 }
    ];

    const brackets = civilStatus === 'married' ? federalTaxBracketsMarried : federalTaxBrackets2024Single;
    let totalTax = 0;

    for (const bracket of brackets) {
      if (taxableIncome > bracket.from) {
        const taxableInThisBracket = Math.min(taxableIncome, bracket.to) - bracket.from;
        const taxInThisBracket = (taxableInThisBracket * bracket.rate) / 100;
        totalTax = bracket.base + taxInThisBracket;
        if (taxableIncome <= bracket.to) break;
      }
    }

    return totalTax;
  }

  /**
   * Fonction pour calculer le détail par tranche
   */
  private static calculateFederalTaxBreakdown(taxableIncome: number, civilStatus: 'single' | 'married' = 'single'): TaxCalculationDetail[] {
    const federalTaxBrackets2024Single = [
      { from: 0, to: 14500, rate: 0, base: 0 },
      { from: 14500, to: 31600, rate: 0.77, base: 0 },
      { from: 31600, to: 41400, rate: 0.88, base: 131.67 },
      { from: 41400, to: 55200, rate: 2.64, base: 217.92 },
      { from: 55200, to: 72500, rate: 2.97, base: 582.24 },
      { from: 72500, to: 78100, rate: 5.94, base: 1095.69 },
      { from: 78100, to: 103600, rate: 6.6, base: 1428.33 },
      { from: 103600, to: 134600, rate: 8.8, base: 3111.33 },
      { from: 134600, to: 176000, rate: 11, base: 5839.33 },
      { from: 176000, to: 755200, rate: 13.2, base: 10393.33 },
      { from: 755200, to: Infinity, rate: 11.5, base: 86859.73 }
    ];

    const federalTaxBracketsMarried = [
      { from: 0, to: 29000, rate: 0, base: 0 },
      { from: 29000, to: 50900, rate: 1, base: 0 },
      { from: 50900, to: 58400, rate: 2, base: 219 },
      { from: 58400, to: 75300, rate: 3, base: 369 },
      { from: 75300, to: 90300, rate: 4, base: 876 },
      { from: 90300, to: 103400, rate: 5, base: 1476 },
      { from: 103400, to: 114700, rate: 6, base: 2131 },
      { from: 114700, to: 124200, rate: 7, base: 2809 },
      { from: 124200, to: 131700, rate: 8, base: 3474 },
      { from: 131700, to: 137300, rate: 9, base: 4074 },
      { from: 137300, to: 141200, rate: 10, base: 4578 },
      { from: 141200, to: 143100, rate: 11, base: 4968 },
      { from: 143100, to: 145000, rate: 12, base: 5177 },
      { from: 145000, to: Infinity, rate: 11.5, base: 5405 }
    ];

    const brackets = civilStatus === 'married' ? federalTaxBracketsMarried : federalTaxBrackets2024Single;
    const calculation: TaxCalculationDetail[] = [];
    let totalTax = 0;

    for (const bracket of brackets) {
      if (taxableIncome > bracket.from) {
        const taxableInThisBracket = Math.min(taxableIncome, bracket.to) - bracket.from;
        const taxInThisBracket = (taxableInThisBracket * bracket.rate) / 100;
        totalTax = bracket.base + taxInThisBracket;
        
        calculation.push({
          bracket: `${bracket.from.toLocaleString('fr-CH')} - ${bracket.to === Infinity ? '∞' : bracket.to.toLocaleString('fr-CH')}`,
          rate: bracket.rate,
          taxableAmount: taxableInThisBracket,
          taxAmount: taxInThisBracket,
          cumulativeTax: totalTax
        });

        if (taxableIncome <= bracket.to) break;
      }
    }

    return calculation;
  }

  /**
   * CALCUL IMPÔT CANTONAL ET COMMUNAL
   * Utilise la base de données fiscale complète
   * Source: Lois fiscales cantonales respectives
   */
  static calculateCantonalTax(taxableIncome: number, canton: string, municipality?: string): {
    cantonalTax: number;
    communalTax: number;
    totalTax: number;
    calculation: CantonalTaxDetail;
  } {
    console.log(`[SwissTaxFormulas] Calcul pour canton: ${canton}, revenu: ${taxableIncome}`);
    
    // Utiliser la base de données fiscale complète
    const cantonData = getCantonData(canton);
    if (cantonData) {
      // Utiliser la fonction de calcul de la base de données
      const result = calculateFromDB(canton, taxableIncome, municipality);
      
      console.log(`[SwissTaxFormulas] Résultat DB pour ${canton}:`, result);
      
      // Séparer l'impôt cantonal et communal
      const cantonalTax = result.simpleTax * (result.cantonalRate / 100);
      const communalTax = result.simpleTax * (result.communalRate / 100);
      
      return {
        cantonalTax: Math.round(cantonalTax),
        communalTax: Math.round(communalTax),
        totalTax: Math.round(result.totalTax),
        calculation: {
          simpleTax: result.simpleTax,
          cantonalRate: result.cantonalRate,
          communalRate: result.communalRate,
          municipality: municipality || cantonData.municipalities[0]?.name || canton,
          source: cantonData.laws.name
        }
      };
    }
    
    // Fallback sur l'ancienne méthode si canton non trouvé
    console.log(`[SwissTaxFormulas] Canton ${canton} non trouvé dans DB, utilisation fallback`);
    const cantonDataOld = this.getCantonTaxData(canton);
    const municipalityData = municipality ? this.getMunicipalityData(canton, municipality) : cantonDataOld.defaultMunicipality;

    // Calcul de l'impôt simple cantonal (base)
    const simpleTax = this.calculateSimpleCantonalTax(taxableIncome, canton);
    
    // Application des taux cantonal et communal
    const cantonalTax = (simpleTax * cantonDataOld.cantonalRate) / 100;
    const communalTax = (simpleTax * municipalityData.rate) / 100;

    return {
      cantonalTax: Math.round(cantonalTax),
      communalTax: Math.round(communalTax),
      totalTax: Math.round(cantonalTax + communalTax),
      calculation: {
        simpleTax,
        cantonalRate: cantonDataOld.cantonalRate,
        communalRate: municipalityData.rate,
        municipality: municipalityData.name,
        source: cantonDataOld.source
      }
    };
  }

  /**
   * CALCUL DEDUCTIONS FISCALES
   * Sources: Art. 9-33 LIFD (fédéral), lois cantonales respectives
   */
  static calculateDeductions(profile: any, canton: string): {
    federal: DeductionSummary;
    cantonal: DeductionSummary;
    total: DeductionSummary;
  } {
    const federalDeductions = this.calculateFederalDeductions(profile);
    const cantonalDeductions = this.calculateCantonalDeductions(profile, canton);

    const totalPersonal = federalDeductions.personalDeductions + cantonalDeductions.personalDeductions;
    const totalProfessional = Math.max(federalDeductions.professionalExpenses, cantonalDeductions.professionalExpenses);
    const totalSocial = federalDeductions.socialDeductions + cantonalDeductions.socialDeductions;
    const totalOther = federalDeductions.otherDeductions + cantonalDeductions.otherDeductions;
    
    return {
      federal: federalDeductions,
      cantonal: cantonalDeductions,
      total: {
        personalDeductions: totalPersonal,
        professionalExpenses: totalProfessional,
        socialDeductions: totalSocial,
        otherDeductions: totalOther,
        totalDeductions: totalPersonal + totalProfessional + totalSocial + totalOther
      }
    };
  }

  /**
   * DEDUCTIONS FEDERALES (Art. 9-33 LIFD)
   * Source: Loi fédérale sur l'impôt fédéral direct (LIFD)
   */
  private static calculateFederalDeductions(profile: any): DeductionSummary {
    let personalDeductions = 0;
    let professionalExpenses = 0;
    let socialDeductions = 0;
    let otherDeductions = 0;

    const grossSalary = profile.incomeData?.mainEmployment?.grossSalary || 0;
    const civilStatus = profile.personalInfo?.civilStatus || 'single';
    const children = profile.personalInfo?.numberOfChildren || 0;

    // COTISATIONS SOCIALES OBLIGATOIRES (déductibles à 100%)
    // AVS/AI/APG: 5.3% du salaire brut
    const avsAiApg = grossSalary * 0.053;
    socialDeductions += avsAiApg;
    
    // Assurance chômage AC: 1.1% jusqu'à 148'200, puis 0.5%
    const ac = grossSalary <= 148200 ? grossSalary * 0.011 : 148200 * 0.011 + (grossSalary - 148200) * 0.005;
    socialDeductions += ac;
    
    // LPP (2e pilier): environ 7-12% du salaire coordonné (simplifié à 10% du brut)
    const lpp = profile.deductions?.pensionContributions || (grossSalary * 0.10);
    socialDeductions += lpp;
    
    // AANP (accident non professionnel): environ 1.5%
    const aanp = grossSalary * 0.015;
    socialDeductions += aanp;

    // Art. 26 LIFD - 3e pilier A
    const pillar3a = Math.min(profile.deductions?.savingsContributions?.pillar3a || 0, 7056);
    socialDeductions += pillar3a;

    // Art. 27 LIFD - Primes d'assurance maladie et vie (déduction limitée)
    const healthInsurance = profile.deductions?.insurancePremiums?.healthInsurance || 3000;
    const lifeInsurance = profile.deductions?.insurancePremiums?.lifeInsurance || 0;
    // Déduction forfaitaire pour assurances (célibataire: 1'800, marié: 3'700)
    const insuranceDeduction = civilStatus === 'married' ? 3700 : 1800;
    const insuranceDeductionPerChild = 700;
    const maxInsuranceDeduction = insuranceDeduction + (children * insuranceDeductionPerChild);
    socialDeductions += Math.min(healthInsurance + lifeInsurance, maxInsuranceDeduction);

    // Art. 9 al. 2 LIFD - Frais professionnels
    const declaredExpenses = this.calculateProfessionalExpenses(profile);
    const standardDeduction = this.getStandardProfessionalDeduction(grossSalary);
    professionalExpenses = Math.max(declaredExpenses, standardDeduction, 2000); // Minimum 2000 CHF

    // Art. 10 LIFD - Déductions pour enfants
    personalDeductions += children * 6500; // 6'500 CHF par enfant 2024

    // Art. 33a LIFD - Dons
    const donations = profile.deductions?.donations?.amount || 0;
    const maxDonations = Math.min(donations, grossSalary * 0.2); // Max 20% du revenu
    otherDeductions += donations >= 100 ? maxDonations : 0; // Minimum 100 CHF

    return {
      personalDeductions,
      professionalExpenses,
      socialDeductions,
      otherDeductions,
      totalDeductions: personalDeductions + professionalExpenses + socialDeductions + otherDeductions
    };
  }

  /**
   * FRAIS PROFESSIONNELS (Art. 9 LIFD)
   * Calcul détaillé selon justificatifs ou forfait
   */
  private static calculateProfessionalExpenses(profile: any): number {
    let totalExpenses = 0;

    const expenses = profile.deductions?.professionalExpenses;
    if (!expenses) return 0;

    // Transport domicile-travail
    totalExpenses += expenses.transportCosts || 0;

    // Repas pris à l'extérieur (max 15 CHF/jour)
    const mealCosts = expenses.mealCosts || 0;
    const workingDays = 220; // Estimation 220 jours/an
    totalExpenses += Math.min(mealCosts, workingDays * 15);

    // Autres frais professionnels justifiés
    totalExpenses += expenses.otherProfessionalExpenses || 0;

    return totalExpenses;
  }

  /**
   * DEDUCTION FORFAITAIRE PROFESSIONNELLE
   * Source: Pratique AFC, circulaire n° 30
   */
  private static getStandardProfessionalDeduction(grossSalary: number): number {
    // Forfait AFC 2024
    if (grossSalary <= 25000) return grossSalary * 0.03;
    if (grossSalary <= 50000) return 750 + (grossSalary - 25000) * 0.02;
    if (grossSalary <= 100000) return 1250 + (grossSalary - 50000) * 0.01;
    return 1750; // Maximum 1'750 CHF
  }

  /**
   * DONNEES FISCALES CANTONALES
   * Source: Administrations fiscales cantonales respectives
   */
  private static getCantonTaxData(canton: string): CantonTaxData {
    const cantonData: { [key: string]: CantonTaxData } = {
      GE: {
        cantonalRate: 45.5,
        defaultMunicipality: { name: 'Genève', rate: 45.5 },
        source: 'Loi générale sur les contributions publiques (LGCP) - GE',
        simpleTaxFormula: 'progressive_cantonal'
      },
      VD: {
        cantonalRate: 100, // Le canton prend 100% de l'impôt simple
        defaultMunicipality: { name: 'Lausanne', rate: 78.5 }, // Multiplicateur Lausanne 2024
        source: 'Loi sur les impôts directs cantonaux (LIDC) - VD',
        simpleTaxFormula: 'progressive_cantonal'
      },
      ZH: {
        cantonalRate: 100,
        defaultMunicipality: { name: 'Zurich', rate: 119 },
        source: 'Steuergesetz des Kantons Zürich (StG) - ZH',
        simpleTaxFormula: 'progressive_cantonal'
      },
      BE: {
        cantonalRate: 154,
        defaultMunicipality: { name: 'Berne', rate: 154 },
        source: 'Steuergesetz des Kantons Bern (StG) - BE',
        simpleTaxFormula: 'progressive_cantonal'
      }
    };

    return cantonData[canton] || cantonData.GE;
  }

  /**
   * CALCUL IMPOT SIMPLE CANTONAL
   * Chaque canton a sa propre formule progressive
   */
  private static calculateSimpleCantonalTax(taxableIncome: number, canton: string): number {
    // Utilisation des barèmes officiels de chaque canton
    
    if (canton === 'GE') {
      return this.calculateGenevaSimpleTax(taxableIncome);
    }
    
    if (canton === 'VD') {
      return this.calculateVaudSimpleTax(taxableIncome);
    }
    
    if (canton === 'ZH') {
      return this.calculateZurichSimpleTax(taxableIncome);
    }
    
    // Estimation générale basée sur les barèmes moyens pour les autres cantons
    if (taxableIncome <= 20000) return taxableIncome * 0.01;
    if (taxableIncome <= 50000) return 200 + (taxableIncome - 20000) * 0.02;
    if (taxableIncome <= 100000) return 800 + (taxableIncome - 50000) * 0.03;
    return 2300 + (taxableIncome - 100000) * 0.035;
  }

  /**
   * BAREME GENEVOIS OFFICIEL
   * Source: LGCP art. 36, Règlement d'application
   */
  private static calculateGenevaSimpleTax(taxableIncome: number): number {
    // Barème progressif genevois 2024 (simplifié)
    const brackets = [
      { from: 0, to: 14900, rate: 0 },
      { from: 14900, to: 19200, rate: 0.68 },
      { from: 19200, to: 26700, rate: 1.49 },
      { from: 26700, to: 36100, rate: 2.23 },
      { from: 36100, to: 47400, rate: 2.97 },
      { from: 47400, to: 61600, rate: 3.72 },
      { from: 61600, to: 79500, rate: 4.46 },
      { from: 79500, to: 103200, rate: 5.21 },
      { from: 103200, to: 134400, rate: 5.95 },
      { from: 134400, to: 176300, rate: 6.70 },
      { from: 176300, to: Infinity, rate: 7.44 }
    ];

    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.to - bracket.from);
      tax += (taxableInBracket * bracket.rate) / 100;
      remainingIncome -= taxableInBracket;
    }

    return tax;
  }

  /**
   * BAREME VAUDOIS OFFICIEL 2024-2025
   * Source: Administration cantonale des impôts (ACI) Vaud
   * Barème pour personnes seules
   */
  private static calculateVaudSimpleTax(taxableIncome: number): number {
    // Barème officiel Vaud 2024-2025 avec impôt de base
    const brackets = [
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
    ];

    // Trouver la bonne tranche
    for (const bracket of brackets) {
      if (taxableIncome > bracket.from && taxableIncome <= (bracket.to || Infinity)) {
        const taxableInBracket = taxableIncome - bracket.from;
        const tax = bracket.base + (taxableInBracket * bracket.rate) / 100;
        return tax;
      }
    }

    return 0;
  }

  /**
   * BAREME ZURICHOIS OFFICIEL
   * Source: Steuergesetz des Kantons Zürich (StG-ZH)
   */
  private static calculateZurichSimpleTax(taxableIncome: number): number {
    // Barème progressif zurichois 2024 (simplifié pour personne seule)
    const brackets = [
      { from: 0, to: 13300, rate: 0 },
      { from: 13300, to: 19700, rate: 2.0 },
      { from: 19700, to: 31300, rate: 3.0 },
      { from: 31300, to: 44200, rate: 4.0 },
      { from: 44200, to: 66200, rate: 5.0 },
      { from: 66200, to: 88100, rate: 6.0 },
      { from: 88100, to: 122000, rate: 7.0 },
      { from: 122000, to: 185900, rate: 8.0 },
      { from: 185900, to: 254600, rate: 9.0 },
      { from: 254600, to: 354100, rate: 10.0 },
      { from: 354100, to: Infinity, rate: 11.0 }
    ];

    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.to - bracket.from);
      tax += (taxableInBracket * bracket.rate) / 100;
      remainingIncome -= taxableInBracket;
    }

    return tax;
  }

  private static getMunicipalityData(canton: string, municipality: string): { name: string; rate: number } {
    // Base de données des taux communaux (extrait)
    const municipalityRates: { [key: string]: { [key: string]: number } } = {
      GE: {
        'Genève': 45.5,
        'Carouge': 45.5,
        'Lancy': 45.5,
        'Vernier': 44.0
      },
      VD: {
        'Lausanne': 78.5,  // Multiplicateur communal 2024
        'Montreux': 63.5,
        'Yverdon': 73.5
      },
      ZH: {
        'Zurich': 119,
        'Winterthur': 122,
        'Uster': 109
      }
    };

    const rate = municipalityRates[canton]?.[municipality] || 100;
    return { name: municipality, rate };
  }

  /**
   * DEDUCTIONS CANTONALES
   * Certains cantons ont des déductions spéciales en plus du fédéral
   */
  private static calculateCantonalDeductions(profile: any, canton: string): DeductionSummary {
    // En Suisse, la plupart des déductions cantonales suivent les règles fédérales
    // Certains cantons ont des déductions spéciales
    const federalDeductions = this.calculateFederalDeductions(profile);
    
    // Ajustements cantonaux spécifiques
    let additionalDeductions = 0;
    
    // Genève : déduction majorée pour garde d'enfants
    if (canton === 'GE') {
      const children = profile.personalInfo?.numberOfChildren || 0;
      additionalDeductions += children * 500; // Bonus cantonal GE
    }
    
    // Vaud : déduction formation continue
    if (canton === 'VD' && profile.deductions?.trainingExpenses) {
      additionalDeductions += Math.min(profile.deductions.trainingExpenses, 2000);
    }

    return {
      personalDeductions: federalDeductions.personalDeductions + additionalDeductions,
      professionalExpenses: federalDeductions.professionalExpenses,
      socialDeductions: federalDeductions.socialDeductions,
      otherDeductions: federalDeductions.otherDeductions,
      totalDeductions: federalDeductions.totalDeductions + additionalDeductions
    };
  }
}

// Interfaces pour les types de retour
interface TaxCalculationDetail {
  bracket: string;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
  cumulativeTax: number;
}

interface CantonalTaxDetail {
  simpleTax: number;
  cantonalRate: number;
  communalRate: number;
  municipality: string;
  source: string;
}

interface DeductionSummary {
  personalDeductions: number;
  professionalExpenses: number;
  socialDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
}

interface CantonTaxData {
  cantonalRate: number;
  defaultMunicipality: { name: string; rate: number };
  source: string;
  simpleTaxFormula: string;
}