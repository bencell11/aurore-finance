/**
 * Service de simulation de crédit hypothécaire suisse
 */

import type { MortgageSimulation } from '@/lib/types/real-estate';

export interface MortgageCalculationInput {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  duration: number; // en années
  amortizationType: 'direct' | 'indirect';
  additionalCosts?: {
    notaryFees?: number;
    registrationFees?: number;
    brokerFees?: number;
    renovationCosts?: number;
  };
}

export class MortgageSimulationService {
  // Taux SARON moyen (référence 2025)
  private static readonly DEFAULT_SARON_RATE = 0.025; // 2.5%
  private static readonly TYPICAL_MARGIN = 0.015; // 1.5% marge bancaire

  // Règles suisses
  private static readonly MIN_DOWN_PAYMENT_RATIO = 0.20; // 20% minimum
  private static readonly MIN_DOWN_PAYMENT_OWN_FUNDS = 0.10; // 10% fonds propres
  private static readonly MAX_AFFORDABILITY_RATIO = 0.33; // 33% du revenu brut

  // Coûts annexes standards (% du prix)
  private static readonly NOTARY_FEES_RATIO = 0.01; // 1%
  private static readonly REGISTRATION_FEES_RATIO = 0.005; // 0.5%
  private static readonly BROKER_FEES_RATIO = 0.03; // 3%

  /**
   * Calcule une simulation complète de crédit hypothécaire
   */
  static calculateMortgage(input: MortgageCalculationInput): MortgageSimulation {
    const {
      propertyPrice,
      downPayment,
      interestRate,
      duration,
      amortizationType,
      additionalCosts = {}
    } = input;

    // Validation
    if (downPayment < propertyPrice * this.MIN_DOWN_PAYMENT_RATIO) {
      throw new Error(`L'apport minimum doit être de ${this.MIN_DOWN_PAYMENT_RATIO * 100}% du prix`);
    }

    // Montant du prêt
    const loanAmount = propertyPrice - downPayment;

    // Coûts annexes
    const notaryFees = additionalCosts.notaryFees || propertyPrice * this.NOTARY_FEES_RATIO;
    const registrationFees = additionalCosts.registrationFees || propertyPrice * this.REGISTRATION_FEES_RATIO;
    const brokerFees = additionalCosts.brokerFees || 0;
    const renovationCosts = additionalCosts.renovationCosts || 0;

    const totalAdditionalCosts = notaryFees + registrationFees + brokerFees + renovationCosts;
    const totalInitialCost = downPayment + totalAdditionalCosts;

    // Calcul du taux effectif
    const effectiveRate = interestRate + this.TYPICAL_MARGIN;

    // Calcul de l'amortissement (1% par an sur 15 ans minimum)
    const annualAmortization = loanAmount * 0.01;
    const monthlyAmortization = annualAmortization / 12;

    // Calcul des intérêts mensuels
    const monthlyInterest = (loanAmount * effectiveRate) / 12;

    // Mensualité totale (intérêts + amortissement)
    const monthlyPayment = monthlyInterest + monthlyAmortization;

    // Coûts d'entretien (1% du prix de la propriété par an)
    const maintenanceCosts = propertyPrice * 0.01;
    const monthlyMaintenance = maintenanceCosts / 12;

    // Coût mensuel total (hypothèque + entretien)
    const totalMonthlyCost = monthlyPayment + monthlyMaintenance;

    // Coût annuel total
    const totalYearlyCost = totalMonthlyCost * 12;

    // Coût total sur la durée
    const totalCost = (monthlyPayment * duration * 12) + totalInitialCost;

    // Revenu annuel minimum requis (règle des 33%)
    const minAnnualIncome = totalYearlyCost / this.MAX_AFFORDABILITY_RATIO;

    // Plan d'amortissement
    const amortizationSchedule = this.generateAmortizationSchedule(
      loanAmount,
      effectiveRate,
      duration,
      monthlyAmortization
    );

    return {
      loanAmount,
      interestRate: effectiveRate,
      duration,
      monthlyPayment,
      totalCost,
      totalInterest: totalCost - loanAmount - totalInitialCost,
      downPayment,
      amortizationSchedule,
      breakdown: {
        monthlyInterest,
        monthlyAmortization,
        monthlyMaintenance,
        totalMonthlyCost,
        totalYearlyCost,
        notaryFees,
        registrationFees,
        brokerFees,
        renovationCosts,
        totalInitialCost,
        minAnnualIncome
      }
    };
  }

  /**
   * Génère le plan d'amortissement année par année
   */
  private static generateAmortizationSchedule(
    initialLoan: number,
    rate: number,
    years: number,
    monthlyAmortization: number
  ): Array<{
    year: number;
    remainingBalance: number;
    principalPaid: number;
    interestPaid: number;
    totalPaid: number;
  }> {
    const schedule: any[] = [];
    let remainingBalance = initialLoan;
    const yearlyAmortization = monthlyAmortization * 12;

    for (let year = 1; year <= years; year++) {
      const interestPaid = remainingBalance * rate;
      const principalPaid = Math.min(yearlyAmortization, remainingBalance);
      const totalPaid = interestPaid + principalPaid;

      remainingBalance -= principalPaid;

      schedule.push({
        year,
        remainingBalance: Math.max(0, remainingBalance),
        principalPaid,
        interestPaid,
        totalPaid
      });

      if (remainingBalance <= 0) break;
    }

    return schedule;
  }

  /**
   * Calcule le taux d'intérêt actuel basé sur le SARON
   */
  static getCurrentRate(fixedPeriod: number = 5): number {
    // Simulation basée sur la période de fixation
    const baseRate = this.DEFAULT_SARON_RATE;

    // Plus la période est longue, plus le taux est élevé
    const periodAdjustment = (fixedPeriod - 5) * 0.001; // +0.1% par année au-delà de 5 ans

    return baseRate + periodAdjustment;
  }

  /**
   * Compare différents scénarios de crédit
   */
  static compareScenarios(
    propertyPrice: number,
    downPaymentRatios: number[],
    durations: number[]
  ): Array<{
    scenario: string;
    downPaymentRatio: number;
    duration: number;
    simulation: MortgageSimulation;
  }> {
    const scenarios: any[] = [];
    const currentRate = this.getCurrentRate();

    downPaymentRatios.forEach(ratio => {
      durations.forEach(duration => {
        const downPayment = propertyPrice * ratio;

        try {
          const simulation = this.calculateMortgage({
            propertyPrice,
            downPayment,
            interestRate: currentRate,
            duration,
            amortizationType: 'direct'
          });

          scenarios.push({
            scenario: `${ratio * 100}% apport, ${duration} ans`,
            downPaymentRatio: ratio,
            duration,
            simulation
          });
        } catch (error) {
          // Scénario invalide, on l'ignore
        }
      });
    });

    return scenarios.sort((a, b) =>
      a.simulation.breakdown.totalMonthlyCost - b.simulation.breakdown.totalMonthlyCost
    );
  }

  /**
   * Vérifie si un crédit est abordable selon les règles suisses
   */
  static isAffordable(
    monthlyIncome: number,
    simulation: MortgageSimulation
  ): {
    affordable: boolean;
    utilizationRate: number;
    maxAffordableMonthlyCost: number;
    shortfall: number;
  } {
    const maxAffordableMonthlyCost = monthlyIncome * this.MAX_AFFORDABILITY_RATIO;
    const totalMonthlyCost = simulation.breakdown.totalMonthlyCost;
    const utilizationRate = totalMonthlyCost / monthlyIncome;
    const shortfall = Math.max(0, totalMonthlyCost - maxAffordableMonthlyCost);

    return {
      affordable: utilizationRate <= this.MAX_AFFORDABILITY_RATIO,
      utilizationRate,
      maxAffordableMonthlyCost,
      shortfall
    };
  }

  /**
   * Calcule le montant maximum empruntable
   */
  static calculateMaxLoan(
    monthlyIncome: number,
    downPayment: number,
    interestRate?: number
  ): {
    maxPropertyPrice: number;
    maxLoanAmount: number;
    monthlyPayment: number;
  } {
    const rate = interestRate || this.getCurrentRate();
    const maxMonthlyCost = monthlyIncome * this.MAX_AFFORDABILITY_RATIO;

    // Retirer les coûts d'entretien (estimés à 1% du prix / 12)
    // maxMonthlyCost = monthlyPayment + (propertyPrice * 0.01 / 12)
    // maxMonthlyCost = (loanAmount * (rate + 0.01)) / 12 + (propertyPrice * 0.01 / 12)

    // Approximation: on considère que l'entretien représente 20% du coût total
    const availableForMortgage = maxMonthlyCost * 0.8;

    // Calcul du prêt max basé sur intérêts + amortissement (1% par an)
    const monthlyRate = (rate + 0.01) / 12;
    const maxLoanAmount = availableForMortgage / monthlyRate;

    // Prix max = prêt max + apport
    const maxPropertyPrice = maxLoanAmount + downPayment;

    return {
      maxPropertyPrice,
      maxLoanAmount,
      monthlyPayment: availableForMortgage
    };
  }

  /**
   * Génère des recommandations personnalisées
   */
  static generateRecommendations(
    monthlyIncome: number,
    savings: number,
    propertyPrice: number
  ): string[] {
    const recommendations: string[] = [];
    const minDownPayment = propertyPrice * this.MIN_DOWN_PAYMENT_RATIO;
    const optimalDownPayment = propertyPrice * 0.30; // 30% recommandé

    // Vérifier l'apport
    if (savings < minDownPayment) {
      recommendations.push(
        `⚠️ Vous devez économiser au moins ${Math.round(minDownPayment - savings).toLocaleString()} CHF supplémentaires pour l'apport minimum (20%).`
      );
    } else if (savings < optimalDownPayment) {
      recommendations.push(
        `💡 Un apport de 30% (${Math.round(optimalDownPayment).toLocaleString()} CHF) réduirait significativement vos mensualités.`
      );
    }

    // Calculer l'affordabilité
    const currentRate = this.getCurrentRate();
    const downPayment = Math.min(savings, propertyPrice * 0.3);

    try {
      const simulation = this.calculateMortgage({
        propertyPrice,
        downPayment,
        interestRate: currentRate,
        duration: 20,
        amortizationType: 'direct'
      });

      const affordability = this.isAffordable(monthlyIncome, simulation);

      if (!affordability.affordable) {
        recommendations.push(
          `⚠️ Avec votre revenu actuel, cette propriété n'est pas abordable. Il manque ${Math.round(affordability.shortfall).toLocaleString()} CHF/mois.`
        );

        const maxLoan = this.calculateMaxLoan(monthlyIncome, downPayment, currentRate);
        recommendations.push(
          `💡 Budget recommandé: maximum ${Math.round(maxLoan.maxPropertyPrice).toLocaleString()} CHF`
        );
      } else if (affordability.utilizationRate > 0.30) {
        recommendations.push(
          `⚠️ Le coût représente ${Math.round(affordability.utilizationRate * 100)}% de votre revenu. Prévoyez une marge de sécurité.`
        );
      } else {
        recommendations.push(
          `✅ Cette propriété est abordable avec votre revenu actuel (${Math.round(affordability.utilizationRate * 100)}% d'utilisation).`
        );
      }

      // Recommandations sur la durée
      if (simulation.duration > 25) {
        recommendations.push(
          `💡 Réduire la durée du crédit permet d'économiser sur les intérêts totaux.`
        );
      }

      // Recommandations sur les taux
      recommendations.push(
        `📊 Taux actuel: ${(currentRate * 100).toFixed(2)}%. Considérez une fixation de 5-10 ans pour stabiliser vos coûts.`
      );

    } catch (error: any) {
      recommendations.push(
        `⚠️ ${error.message}`
      );
    }

    return recommendations;
  }
}
