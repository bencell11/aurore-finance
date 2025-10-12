/**
 * Service de calcul d'affordabilité immobilière
 * Règles suisses: 30% du revenu pour le loyer, 33% pour l'hypothèque
 */

import { AffordabilityCalculation } from '@/lib/types/real-estate';

export class AffordabilityService {
  // Règles suisses
  private static readonly RENT_TO_INCOME_RATIO = 0.30; // 30% max
  private static readonly MORTGAGE_TO_INCOME_RATIO = 0.33; // 33% max
  private static readonly MIN_DOWN_PAYMENT_RATIO = 0.20; // 20% min
  private static readonly AVERAGE_INTEREST_RATE = 0.025; // 2.5% SARON moyen
  private static readonly AVERAGE_AMORTIZATION = 0.01; // 1% amortissement
  private static readonly MAINTENANCE_COST_RATIO = 0.01; // 1% entretien

  /**
   * Calcule l'affordabilité pour un revenu donné
   */
  static calculateAffordability(
    monthlyIncome: number,
    hasPartner: boolean = false
  ): AffordabilityCalculation {
    // Revenu annuel
    const annualIncome = monthlyIncome * 12;
    const householdIncome = hasPartner ? annualIncome * 1.8 : annualIncome;

    // Loyer maximum (30% du revenu net)
    const maxMonthlyRent = monthlyIncome * this.RENT_TO_INCOME_RATIO;

    // Hypothèque maximum (33% du revenu brut pour charges hypothécaires)
    const maxMonthlyMortgage = (householdIncome / 12) * this.MORTGAGE_TO_INCOME_RATIO;

    // Calcul théorique (intérêts + amortissement + entretien)
    // Charges = (Prix * (taux + amortissement + entretien)) / 12
    const totalYearlyRate =
      this.AVERAGE_INTEREST_RATE +
      this.AVERAGE_AMORTIZATION +
      this.MAINTENANCE_COST_RATIO;

    // Prix maximum = (Charges mensuelles max * 12) / taux total annuel
    const maxPropertyPrice = (maxMonthlyMortgage * 12) / totalYearlyRate;

    // Mise de fonds minimum (20%)
    const downPaymentRequired = maxPropertyPrice * this.MIN_DOWN_PAYMENT_RATIO;

    // Montant maximum empruntable (80%)
    const maxLoanAmount = maxPropertyPrice * (1 - this.MIN_DOWN_PAYMENT_RATIO);

    // Évaluation
    const canAffordRent = maxMonthlyRent >= 1000; // Minimum réaliste en Suisse
    const canAffordBuy = maxPropertyPrice >= 300000; // Prix minimum réaliste

    // Recommandation
    let recommendation = '';
    if (!canAffordRent) {
      recommendation = 'Votre revenu est actuellement insuffisant pour un logement en Suisse. Considérez une colocation ou augmentez vos revenus.';
    } else if (canAffordRent && !canAffordBuy) {
      recommendation = `Vous pouvez louer jusqu'à ${Math.round(maxMonthlyRent)} CHF/mois. Pour acheter, vous devriez économiser ${Math.round(downPaymentRequired).toLocaleString()} CHF de fonds propres.`;
    } else {
      recommendation = `Vous pouvez louer jusqu'à ${Math.round(maxMonthlyRent)} CHF/mois ou acheter un bien jusqu'à ${Math.round(maxPropertyPrice).toLocaleString()} CHF (avec ${Math.round(downPaymentRequired).toLocaleString()} CHF de fonds propres).`;
    }

    return {
      monthlyIncome,
      maxMonthlyRent,
      maxMonthlyMortgage,
      maxLoanAmount,
      maxPropertyPrice,
      downPaymentRequired,
      canAfford: canAffordRent,
      recommendation
    };
  }

  /**
   * Vérifie si un bien est abordable
   */
  static canAffordProperty(
    monthlyIncome: number,
    propertyPrice: number,
    transactionType: 'rent' | 'buy',
    hasPartner: boolean = false
  ): {
    affordable: boolean;
    reason?: string;
    monthlyPayment: number;
    incomeRatio: number;
  } {
    const affordability = this.calculateAffordability(monthlyIncome, hasPartner);

    if (transactionType === 'rent') {
      const affordable = propertyPrice <= affordability.maxMonthlyRent;
      const incomeRatio = (propertyPrice / monthlyIncome) * 100;

      return {
        affordable,
        reason: affordable
          ? 'Ce loyer est abordable selon votre revenu'
          : `Ce loyer dépasse 30% de votre revenu (${incomeRatio.toFixed(0)}%). Maximum recommandé: ${Math.round(affordability.maxMonthlyRent)} CHF/mois`,
        monthlyPayment: propertyPrice,
        incomeRatio
      };
    } else {
      const affordable = propertyPrice <= affordability.maxPropertyPrice;
      const downPayment = propertyPrice * this.MIN_DOWN_PAYMENT_RATIO;
      const monthlyPayment = (propertyPrice * (
        this.AVERAGE_INTEREST_RATE +
        this.AVERAGE_AMORTIZATION +
        this.MAINTENANCE_COST_RATIO
      )) / 12;
      const incomeRatio = (monthlyPayment / (monthlyIncome * (hasPartner ? 1.8 : 1))) * 100;

      return {
        affordable,
        reason: affordable
          ? `Abordable avec ${Math.round(downPayment).toLocaleString()} CHF de fonds propres`
          : `Prix trop élevé. Maximum recommandé: ${Math.round(affordability.maxPropertyPrice).toLocaleString()} CHF`,
        monthlyPayment,
        incomeRatio
      };
    }
  }

  /**
   * Score d'affordabilité (0-100)
   */
  static calculateAffordabilityScore(
    monthlyIncome: number,
    propertyPrice: number,
    transactionType: 'rent' | 'buy'
  ): number {
    const check = this.canAffordProperty(monthlyIncome, propertyPrice, transactionType);

    if (transactionType === 'rent') {
      // Score basé sur le ratio loyer/revenu (30% = 100 points)
      const idealRatio = 0.25; // 25% est idéal
      const maxRatio = 0.30;
      const actualRatio = check.incomeRatio / 100;

      if (actualRatio <= idealRatio) {
        return 100;
      } else if (actualRatio <= maxRatio) {
        return Math.round(100 - ((actualRatio - idealRatio) / (maxRatio - idealRatio) * 30));
      } else {
        return Math.max(0, Math.round(70 - ((actualRatio - maxRatio) * 200)));
      }
    } else {
      // Score basé sur le ratio charges/revenu (33% = 100 points)
      const idealRatio = 0.25;
      const maxRatio = 0.33;
      const actualRatio = check.incomeRatio / 100;

      if (actualRatio <= idealRatio) {
        return 100;
      } else if (actualRatio <= maxRatio) {
        return Math.round(100 - ((actualRatio - idealRatio) / (maxRatio - idealRatio) * 30));
      } else {
        return Math.max(0, Math.round(70 - ((actualRatio - maxRatio) * 200)));
      }
    }
  }
}
