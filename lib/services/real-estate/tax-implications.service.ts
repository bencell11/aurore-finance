/**
 * Service de calcul des implications fiscales immobilières en Suisse
 */

import type { TaxImplication } from '@/lib/types/real-estate';

export interface PropertyTaxInput {
  propertyPrice: number;
  canton: string;
  city: string;
  isMainResidence: boolean;
  rentalIncome?: number;
  mortgageInterest?: number;
  maintenanceCosts?: number;
}

export class TaxImplicationsService {
  // Taux d'imposition immobilière par canton (approximatifs)
  private static readonly CANTON_PROPERTY_TAX_RATES: Record<string, number> = {
    'GE': 0.001, // 0.1%
    'VD': 0.0015, // 0.15%
    'ZH': 0.001, // 0.1%
    'BE': 0.0012, // 0.12%
    'VS': 0.0013, // 0.13%
    'FR': 0.0014, // 0.14%
    'NE': 0.0015, // 0.15%
    'TI': 0.0016, // 0.16%
    'LU': 0.0011, // 0.11%
    'default': 0.0012 // 0.12% par défaut
  };

  // Valeurs locatives forfaitaires par canton (% du prix)
  private static readonly IMPUTED_RENT_RATES: Record<string, number> = {
    'GE': 0.035, // 3.5%
    'VD': 0.04, // 4%
    'ZH': 0.035, // 3.5%
    'BE': 0.04, // 4%
    'VS': 0.045, // 4.5%
    'FR': 0.04, // 4%
    'NE': 0.04, // 4%
    'TI': 0.04, // 4%
    'LU': 0.045, // 4.5%
    'default': 0.04 // 4% par défaut
  };

  // Taux d'impôt sur la fortune par canton (simplifié)
  private static readonly WEALTH_TAX_RATES: Record<string, { threshold: number; rate: number }> = {
    'GE': { threshold: 0, rate: 0.005 }, // 0.5%
    'VD': { threshold: 0, rate: 0.004 }, // 0.4%
    'ZH': { threshold: 0, rate: 0.003 }, // 0.3%
    'BE': { threshold: 0, rate: 0.004 }, // 0.4%
    'VS': { threshold: 0, rate: 0.003 }, // 0.3%
    'default': { threshold: 0, rate: 0.004 } // 0.4% par défaut
  };

  /**
   * Calcule toutes les implications fiscales d'une propriété
   */
  static calculateTaxImplications(input: PropertyTaxInput): TaxImplication {
    const {
      propertyPrice,
      canton,
      city,
      isMainResidence,
      rentalIncome = 0,
      mortgageInterest = 0,
      maintenanceCosts = 0
    } = input;

    // Taxe foncière annuelle
    const propertyTaxRate = this.CANTON_PROPERTY_TAX_RATES[canton] || this.CANTON_PROPERTY_TAX_RATES['default'];
    const annualPropertyTax = propertyPrice * propertyTaxRate;

    // Valeur locative (impôt sur la fortune immobilière)
    const imputedRentRate = this.IMPUTED_RENT_RATES[canton] || this.IMPUTED_RENT_RATES['default'];
    const annualImputedRent = isMainResidence ? propertyPrice * imputedRentRate : 0;

    // Impôt sur la fortune
    const wealthTaxConfig = this.WEALTH_TAX_RATES[canton] || this.WEALTH_TAX_RATES['default'];
    const wealthTax = propertyPrice * wealthTaxConfig.rate;

    // Déductions fiscales possibles
    const deductions = this.calculateDeductions({
      mortgageInterest,
      maintenanceCosts,
      propertyTax: annualPropertyTax,
      isMainResidence
    });

    // Revenus locatifs imposables
    const taxableRentalIncome = rentalIncome > 0
      ? rentalIncome - mortgageInterest - maintenanceCosts - annualPropertyTax
      : 0;

    // Plus-value potentielle (estimation sur 10 ans à 2% par an)
    const estimatedAppreciation = this.estimatePropertyAppreciation(propertyPrice, canton, 10);
    const capitalGainsTax = this.calculateCapitalGainsTax(
      estimatedAppreciation,
      canton,
      10 // années de détention
    );

    // Frais de transfert (droits de mutation)
    const transferTax = this.calculateTransferTax(propertyPrice, canton);

    // Coût fiscal total annuel
    const totalAnnualTax = annualPropertyTax + wealthTax + (isMainResidence ? 0 : taxableRentalIncome * 0.25);

    return {
      annualPropertyTax,
      transferTax,
      capitalGainsTax,
      deductions: deductions.total,
      netTaxBurden: Math.max(0, totalAnnualTax - deductions.total),
      breakdown: {
        propertyTax: annualPropertyTax,
        wealthTax,
        imputedRent: annualImputedRent,
        rentalIncomeTax: taxableRentalIncome > 0 ? taxableRentalIncome * 0.25 : 0,
        deductibleInterest: deductions.mortgageInterest,
        deductibleMaintenance: deductions.maintenance,
        transferTax,
        estimatedCapitalGain: estimatedAppreciation,
        capitalGainsTax
      },
      recommendations: this.generateTaxRecommendations({
        ...input,
        totalAnnualTax,
        deductions: deductions.total,
        estimatedAppreciation
      })
    };
  }

  /**
   * Calcule les déductions fiscales possibles
   */
  private static calculateDeductions(params: {
    mortgageInterest: number;
    maintenanceCosts: number;
    propertyTax: number;
    isMainResidence: boolean;
  }): {
    mortgageInterest: number;
    maintenance: number;
    propertyTax: number;
    total: number;
  } {
    const { mortgageInterest, maintenanceCosts, propertyTax, isMainResidence } = params;

    // Les intérêts hypothécaires sont déductibles
    const deductibleInterest = mortgageInterest;

    // Les frais d'entretien sont déductibles (forfait ou réel)
    const deductibleMaintenance = maintenanceCosts;

    // Les impôts fonciers sont déductibles dans certains cantons
    const deductiblePropertyTax = isMainResidence ? propertyTax * 0.5 : propertyTax;

    return {
      mortgageInterest: deductibleInterest,
      maintenance: deductibleMaintenance,
      propertyTax: deductiblePropertyTax,
      total: deductibleInterest + deductibleMaintenance + deductiblePropertyTax
    };
  }

  /**
   * Calcule les droits de mutation (frais de transfert)
   */
  private static calculateTransferTax(propertyPrice: number, canton: string): number {
    // Taux de droits de mutation par canton
    const transferTaxRates: Record<string, number> = {
      'GE': 0.03, // 3%
      'VD': 0.033, // 3.3%
      'ZH': 0.0, // Pas de droits de mutation à Zurich
      'BE': 0.018, // 1.8%
      'VS': 0.015, // 1.5%
      'FR': 0.025, // 2.5%
      'NE': 0.033, // 3.3%
      'TI': 0.015, // 1.5%
      'LU': 0.0, // Pas de droits de mutation à Lucerne
      'default': 0.02 // 2% par défaut
    };

    const rate = transferTaxRates[canton] || transferTaxRates['default'];
    return propertyPrice * rate;
  }

  /**
   * Estime l'appréciation de la propriété
   */
  private static estimatePropertyAppreciation(
    propertyPrice: number,
    canton: string,
    years: number
  ): number {
    // Taux d'appréciation annuel moyen par canton (estimation)
    const appreciationRates: Record<string, number> = {
      'GE': 0.025, // 2.5% par an
      'VD': 0.022, // 2.2% par an
      'ZH': 0.03, // 3% par an
      'BE': 0.018, // 1.8% par an
      'VS': 0.015, // 1.5% par an
      'FR': 0.02, // 2% par an
      'NE': 0.015, // 1.5% par an
      'TI': 0.018, // 1.8% par an
      'LU': 0.025, // 2.5% par an
      'default': 0.02 // 2% par an par défaut
    };

    const annualRate = appreciationRates[canton] || appreciationRates['default'];
    const futureValue = propertyPrice * Math.pow(1 + annualRate, years);
    return futureValue - propertyPrice;
  }

  /**
   * Calcule l'impôt sur la plus-value
   */
  private static calculateCapitalGainsTax(
    capitalGain: number,
    canton: string,
    yearsHeld: number
  ): number {
    // Taux d'imposition sur la plus-value (décroissant avec la durée de détention)
    const baseTaxRates: Record<string, number> = {
      'GE': 0.5, // 50% de base
      'VD': 0.6, // 60% de base
      'ZH': 0.4, // 40% de base
      'BE': 0.5, // 50% de base
      'VS': 0.3, // 30% de base
      'default': 0.5 // 50% par défaut
    };

    const baseRate = baseTaxRates[canton] || baseTaxRates['default'];

    // Réduction par année de détention (généralement 2-3% par an)
    const yearlyReduction = 0.02; // 2% par an
    const totalReduction = Math.min(yearsHeld * yearlyReduction, baseRate * 0.8); // max 80% de réduction

    const effectiveRate = Math.max(0, baseRate - totalReduction);

    return capitalGain * effectiveRate;
  }

  /**
   * Génère des recommandations fiscales personnalisées
   */
  private static generateTaxRecommendations(params: {
    propertyPrice: number;
    canton: string;
    city: string;
    isMainResidence: boolean;
    rentalIncome?: number;
    mortgageInterest?: number;
    maintenanceCosts?: number;
    totalAnnualTax: number;
    deductions: number;
    estimatedAppreciation: number;
  }): string[] {
    const recommendations: string[] = [];
    const {
      propertyPrice,
      canton,
      isMainResidence,
      rentalIncome,
      mortgageInterest,
      maintenanceCosts,
      totalAnnualTax,
      deductions,
      estimatedAppreciation
    } = params;

    // Résidence principale
    if (isMainResidence) {
      recommendations.push(
        "✅ Résidence principale: vous bénéficiez d'avantages fiscaux (déductions sur la valeur locative)."
      );
    } else {
      recommendations.push(
        "💡 Propriété secondaire: considérez la location pour optimiser la fiscalité."
      );
    }

    // Déductions hypothécaires
    if (mortgageInterest && mortgageInterest > 0) {
      recommendations.push(
        `✅ Déduction des intérêts hypothécaires: ${Math.round(mortgageInterest).toLocaleString()} CHF déductibles par an.`
      );
    } else {
      recommendations.push(
        "💡 Sans hypothèque: pas de déductions d'intérêts, mais aussi pas de charges financières."
      );
    }

    // Entretien
    if (!maintenanceCosts || maintenanceCosts === 0) {
      const estimatedMaintenance = propertyPrice * 0.01;
      recommendations.push(
        `💡 Prévoyez ${Math.round(estimatedMaintenance).toLocaleString()} CHF/an d'entretien (déductible fiscalement).`
      );
    }

    // Charge fiscale
    const taxBurdenRatio = totalAnnualTax / propertyPrice;
    if (taxBurdenRatio > 0.015) {
      recommendations.push(
        `⚠️ Charge fiscale élevée (${(taxBurdenRatio * 100).toFixed(2)}% du prix): consultez un fiscaliste.`
      );
    } else {
      recommendations.push(
        `✅ Charge fiscale modérée (${(taxBurdenRatio * 100).toFixed(2)}% du prix).`
      );
    }

    // Plus-value
    if (estimatedAppreciation > propertyPrice * 0.3) {
      recommendations.push(
        `📈 Plus-value estimée importante: planifiez l'impôt sur la plus-value (réduction avec la durée de détention).`
      );
    }

    // Revenus locatifs
    if (rentalIncome && rentalIncome > 0) {
      const netIncome = rentalIncome - (mortgageInterest || 0) - (maintenanceCosts || 0);
      if (netIncome > 0) {
        recommendations.push(
          `💰 Revenu locatif net imposable: ${Math.round(netIncome).toLocaleString()} CHF/an.`
        );
      }
    }

    // Canton spécifique
    if (canton === 'ZH' || canton === 'LU') {
      recommendations.push(
        `✅ Avantage ${canton}: pas de droits de mutation lors de l'achat.`
      );
    }

    // Déductions totales
    recommendations.push(
      `💡 Déductions fiscales totales: ${Math.round(deductions).toLocaleString()} CHF/an à déclarer.`
    );

    return recommendations;
  }

  /**
   * Compare les implications fiscales entre cantons
   */
  static compareCantons(
    propertyPrice: number,
    cantons: string[],
    isMainResidence: boolean
  ): Array<{
    canton: string;
    totalAnnualTax: number;
    transferTax: number;
    wealthTax: number;
    propertyTax: number;
  }> {
    return cantons.map(canton => {
      const implications = this.calculateTaxImplications({
        propertyPrice,
        canton,
        city: '',
        isMainResidence,
        mortgageInterest: propertyPrice * 0.02, // 2% d'intérêts estimés
        maintenanceCosts: propertyPrice * 0.01 // 1% d'entretien estimé
      });

      return {
        canton,
        totalAnnualTax: implications.netTaxBurden,
        transferTax: implications.transferTax,
        wealthTax: implications.breakdown.wealthTax,
        propertyTax: implications.annualPropertyTax
      };
    }).sort((a, b) => a.totalAnnualTax - b.totalAnnualTax);
  }

  /**
   * Calcule l'économie d'impôt avec déductions
   */
  static calculateTaxSavings(
    grossIncome: number,
    deductions: number,
    canton: string
  ): {
    marginalRate: number;
    annualSavings: number;
    monthlySavings: number;
  } {
    // Taux marginal moyen par canton (simplifié)
    const marginalRates: Record<string, number> = {
      'GE': 0.42, // 42%
      'VD': 0.40, // 40%
      'ZH': 0.35, // 35%
      'BE': 0.38, // 38%
      'VS': 0.36, // 36%
      'default': 0.40 // 40% par défaut
    };

    const marginalRate = marginalRates[canton] || marginalRates['default'];
    const annualSavings = deductions * marginalRate;

    return {
      marginalRate,
      annualSavings,
      monthlySavings: annualSavings / 12
    };
  }
}
