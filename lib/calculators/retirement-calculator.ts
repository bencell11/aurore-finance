import { RetraiteParameters, RetraiteResults, OptimisationRetraite, ScenarioRetraite, EtapeRetraite } from '@/types/simulators';
import { Canton } from '@/types/user';

export class RetirementCalculator {

  calculate(params: RetraiteParameters): RetraiteResults {
    const anneesJusquRetraite = params.ageRetraitePrevu - params.age;
    
    // 1. Calcul des projections par pilier
    const pilier1Prevision = this.calculatePilier1(params);
    const pilier2Prevision = this.calculatePilier2(params, anneesJusquRetraite);
    const pilier3aPrevision = this.calculatePilier3a(params, anneesJusquRetraite);
    const pilier3bPrevision = this.calculatePilier3b(params, anneesJusquRetraite);
    
    // 2. Revenus totaux à la retraite
    const revenusRetraiteTotal = pilier1Prevision + pilier2Prevision + pilier3aPrevision + pilier3bPrevision;
    
    // 3. Taux de remplacement et lacune
    const revenuSouhaite = (params.revenuSouhaiteRetraite / 100) * params.revenuActuel;
    const tauxRemplacementReel = (revenusRetraiteTotal / params.revenuActuel) * 100;
    const lacuneFinanciere = Math.max(0, revenuSouhaite - revenusRetraiteTotal);
    
    // 4. Stratégies d'optimisation
    const strategieOptimisation = this.generateOptimisationStrategies(params, lacuneFinanciere, anneesJusquRetraite);
    
    // 5. Scénarios
    const scenarios = this.generateScenarios(params, anneesJusquRetraite);
    
    // 6. Plan d'étapes
    const planEtapes = this.generateActionPlan(params, lacuneFinanciere, anneesJusquRetraite);
    
    // 7. Impacts fiscaux
    const impactsFiscaux = this.calculateFiscalImpacts(params);
    
    // 8. Recommandations
    const versementOptimal3a = this.calculateOptimal3aContribution(params);
    const besoinEpargneSupplementaire = this.calculateAdditionalSavingsNeed(lacuneFinanciere, anneesJusquRetraite);

    return {
      revenusRetraiteTotal,
      tauxRemplacementReel,
      lacuneFinanciere,
      pilier1Prevision,
      pilier2Prevision,
      pilier3aPrevision,
      pilier3bPrevision,
      versementOptimal3a,
      besoinEpargneSupplementaire,
      strategieOptimisation,
      scenarios,
      planEtapes,
      impactsFiscaux
    };
  }

  private calculatePilier1(params: RetraiteParameters): number {
    // Rente AVS maximale (2024): 2'450 CHF/mois pour une personne seule
    // Rente AVS minimale (2024): 1'225 CHF/mois
    const renteAVSMax = 2450 * 12; // 29'400 CHF/an
    const renteAVSMin = 1225 * 12; // 14'700 CHF/an
    
    // Facteur de réduction selon les lacunes
    const anneeCotisationComplete = 44; // Années de cotisation complètes requises
    const anneesManquantes = Math.max(0, anneeCotisationComplete - params.anneeCotisation);
    const facteurLacunes = Math.max(0.5, 1 - (anneesManquantes * 0.023)); // Réduction de ~2.3% par année manquante
    
    // Calcul basé sur le revenu (simplifié)
    let facteurRevenu = 1;
    if (params.revenuActuel < 30000) {
      facteurRevenu = 0.6;
    } else if (params.revenuActuel < 60000) {
      facteurRevenu = 0.8;
    } else if (params.revenuActuel > 85000) {
      facteurRevenu = 1; // Plafond atteint
    }
    
    const renteEstimee = renteAVSMax * facteurRevenu * facteurLacunes;
    
    // Ajustement pour couple
    if (params.situationFamiliale === 'marie') {
      return Math.min(renteEstimee * 1.5, renteAVSMax * 1.5); // Plafonnement pour couple
    }
    
    return Math.max(renteAVSMin, renteEstimee);
  }

  private calculatePilier2(params: RetraiteParameters, anneesRestantes: number): number {
    // Projection du capital LPP
    const capitalActuel = params.capitalPilier2Actuel;
    const cotisationsAnnuelles = params.cotisationsMensuelles * 12;
    
    // Taux de rendement selon l'âge (plus conservateur proche de la retraite)
    const tauxRendement = params.age < 50 ? 0.03 : (params.age < 60 ? 0.025 : 0.02);
    
    // Calcul du capital futur avec cotisations
    let capitalFutur = capitalActuel;
    for (let i = 0; i < anneesRestantes; i++) {
      capitalFutur = capitalFutur * (1 + tauxRendement) + cotisationsAnnuelles;
    }
    
    // Taux de conversion selon l'âge de retraite (2024)
    const tauxConversion = this.getTauxConversionLPP(params.ageRetraitePrevu);
    
    return capitalFutur * tauxConversion;
  }

  private getTauxConversionLPP(ageRetraite: number): number {
    // Taux de conversion LPP selon l'âge (en baisse progressive)
    const taux = {
      58: 0.058,
      59: 0.059,
      60: 0.060,
      61: 0.061,
      62: 0.062,
      63: 0.063,
      64: 0.064,
      65: 0.065,
      66: 0.064,
      67: 0.063,
      68: 0.062,
      69: 0.061,
      70: 0.060
    };
    
    return taux[ageRetraite as keyof typeof taux] || 0.058;
  }

  private calculatePilier3a(params: RetraiteParameters, anneesRestantes: number): number {
    const capitalActuel = params.pilier3aActuel;
    const versementAnnuel = params.versementAnnuel3a;
    
    // Taux de rendement moyen 3e pilier (obligations + actions)
    const tauxRendement = 0.025; // 2.5% net
    
    // Calcul du capital futur
    let capitalFutur = capitalActuel;
    for (let i = 0; i < anneesRestantes; i++) {
      capitalFutur = capitalFutur * (1 + tauxRendement) + versementAnnuel;
    }
    
    // Conversion en rente (optionnel) ou retrait échelonné
    // Pour la simulation, on suppose un retrait sur 20 ans
    return capitalFutur / 20;
  }

  private calculatePilier3b(params: RetraiteParameters, anneesRestantes: number): number {
    const capitalActuel = params.pilier3bActuel;
    const versementAnnuel = params.versementAnnuel3b;
    
    // Taux de rendement plus élevé pour 3b (plus de flexibilité d'investissement)
    const tauxRendement = 0.04; // 4% net
    
    let capitalFutur = capitalActuel;
    for (let i = 0; i < anneesRestantes; i++) {
      capitalFutur = capitalFutur * (1 + tauxRendement) + versementAnnuel;
    }
    
    // Retrait échelonné sur 25 ans
    return capitalFutur / 25;
  }

  private generateOptimisationStrategies(
    params: RetraiteParameters, 
    lacune: number, 
    anneesRestantes: number
  ): OptimisationRetraite[] {
    const strategies: OptimisationRetraite[] = [];
    
    // Maximiser 3e pilier A
    const montantMaximal3a = this.getMaximal3aContribution(params.situationFamiliale);
    if (params.versementAnnuel3a < montantMaximal3a) {
      const augmentationPossible = montantMaximal3a - params.versementAnnuel3a;
      const impactRetraite = (augmentationPossible * anneesRestantes * 1.025) / 20; // Impact annuel estimé
      
      strategies.push({
        type: 'pilier3a',
        titre: 'Maximiser les versements 3e pilier A',
        description: `Augmenter vos versements de ${augmentationPossible.toLocaleString('fr-CH')} CHF/an`,
        impactRevenusRetraite: impactRetraite,
        coutAnnuel: augmentationPossible,
        priorite: 'haute',
        delaiRecommande: 'Immédiatement'
      });
    }
    
    // Rachats 2e pilier
    const potentielRachat = this.calculateRachatPotential(params);
    if (potentielRachat > 0) {
      const impactRetraite = potentielRachat * this.getTauxConversionLPP(params.ageRetraitePrevu);
      
      strategies.push({
        type: 'rachatPilier2',
        titre: 'Rachats dans le 2e pilier',
        description: 'Améliorer vos prestations LPP tout en économisant des impôts',
        impactRevenusRetraite: impactRetraite,
        coutAnnuel: Math.min(potentielRachat, potentielRachat / Math.max(5, anneesRestantes)),
        priorite: 'moyenne',
        delaiRecommande: '3-6 mois'
      });
    }
    
    // Épargne libre (3e pilier B)
    if (lacune > 0) {
      const besoinAnnuel = lacune * 20; // Capital nécessaire pour générer la rente manquante
      const epargneSuppAnnuelle = besoinAnnuel / anneesRestantes / 1.04; // Avec rendement 4%
      
      strategies.push({
        type: 'pilier3b',
        titre: 'Épargne libre supplémentaire',
        description: 'Investissement en titres ou assurance-vie pour combler la lacune',
        impactRevenusRetraite: lacune,
        coutAnnuel: epargneSuppAnnuelle,
        priorite: lacune > 1000 ? 'haute' : 'basse',
        delaiRecommande: '1-3 mois'
      });
    }

    return strategies.sort((a, b) => {
      const prioriteOrder = { 'haute': 3, 'moyenne': 2, 'basse': 1 };
      return prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
    });
  }

  private generateScenarios(params: RetraiteParameters, anneesRestantes: number): {
    pessimiste: ScenarioRetraite;
    realiste: ScenarioRetraite;
    optimiste: ScenarioRetraite;
  } {
    const scenarioBase = this.calculate(params);
    
    return {
      pessimiste: {
        rendementAnnuel: 0.015,
        tauxInflation: 0.025,
        revenuTotal: scenarioBase.revenusRetraiteTotal * 0.85,
        pouvoirAchat: scenarioBase.revenusRetraiteTotal * 0.85 * 0.975 // Impact inflation
      },
      realiste: {
        rendementAnnuel: 0.025,
        tauxInflation: 0.02,
        revenuTotal: scenarioBase.revenusRetraiteTotal,
        pouvoirAchat: scenarioBase.revenusRetraiteTotal * 0.98
      },
      optimiste: {
        rendementAnnuel: 0.04,
        tauxInflation: 0.015,
        revenuTotal: scenarioBase.revenusRetraiteTotal * 1.2,
        pouvoirAchat: scenarioBase.revenusRetraiteTotal * 1.2 * 0.985
      }
    };
  }

  private generateActionPlan(
    params: RetraiteParameters, 
    lacune: number, 
    anneesRestantes: number
  ): EtapeRetraite[] {
    const etapes: EtapeRetraite[] = [];
    const currentYear = new Date().getFullYear();
    
    // Étape immédiate
    etapes.push({
      age: params.age,
      action: 'Faire le point sur votre prévoyance actuelle',
      objectif: 'Établir votre situation de base',
      impact: 'Vision claire de vos droits futurs'
    });
    
    // Maximiser 3e pilier
    if (params.versementAnnuel3a < this.getMaximal3aContribution(params.situationFamiliale)) {
      const gapAmount = this.getMaximal3aContribution(params.situationFamiliale) - params.versementAnnuel3a;
      etapes.push({
        age: params.age + 1,
        action: 'Maximiser les versements 3e pilier A',
        montant: gapAmount,
        objectif: 'Optimiser les déductions fiscales',
        impact: `Économie d'impôts de ~${Math.round(gapAmount * 0.25).toLocaleString('fr-CH')} CHF/an`
      });
    }
    
    // Planification moyen terme
    if (anneesRestantes > 10) {
      etapes.push({
        age: params.age + 5,
        action: 'Évaluer les rachats dans le 2e pilier',
        objectif: 'Améliorer les prestations LPP',
        impact: 'Réduction fiscale et augmentation de la rente'
      });
    }
    
    // Préparation retraite
    etapes.push({
      age: params.ageRetraitePrevu - 5,
      action: 'Planifier la stratégie de retrait',
      objectif: 'Optimiser la fiscalité à la retraite',
      impact: 'Économies fiscales significatives'
    });

    return etapes;
  }

  private calculateFiscalImpacts(params: RetraiteParameters): {
    economiesAnnuelles3a: number;
    impositionCapitalRetraite: number;
    stratergieOptimaleRetrait: string;
  } {
    const tauxMarginal = this.getTauxMarginalFiscal(params.revenuActuel, params.canton);
    const economiesAnnuelles3a = params.versementAnnuel3a * tauxMarginal;
    
    // Estimation imposition capital (taux réduit)
    const capitalTotal3a = params.pilier3aActuel + params.versementAnnuel3a * (params.ageRetraitePrevu - params.age);
    const impositionCapitalRetraite = capitalTotal3a * this.getTauxImpositionCapital(params.canton);
    
    return {
      economiesAnnuelles3a,
      impositionCapitalRetraite,
      stratergieOptimaleRetrait: 'Échelonner les retraits sur plusieurs années fiscales pour optimiser l\'imposition'
    };
  }

  private calculateOptimal3aContribution(params: RetraiteParameters): number {
    return this.getMaximal3aContribution(params.situationFamiliale);
  }

  private calculateAdditionalSavingsNeed(lacune: number, anneesRestantes: number): number {
    if (lacune <= 0) return 0;
    
    // Capital nécessaire pour générer la rente manquante (avec 4% de retrait)
    const capitalNecessaire = lacune * 25;
    
    // Épargne annuelle nécessaire avec rendement estimé
    const tauxRendement = 0.04;
    const facteurAnnuite = ((1 + tauxRendement) ** anneesRestantes - 1) / tauxRendement;
    
    return capitalNecessaire / facteurAnnuite;
  }

  // Méthodes utilitaires
  private getMaximal3aContribution(situation: any): number {
    // Montants maximaux 2024
    return situation === 'marie' ? 7056 : 7056; // Même montant pour tous
  }

  private calculateRachatPotential(params: RetraiteParameters): number {
    // Estimation simplifiée du potentiel de rachat
    const salaireAssuré = Math.min(params.salaireAssure, 88200); // Plafond LPP 2024
    const anneesService = Math.min(params.age - 25, 40);
    
    const capitalTheorique = salaireAssuré * 0.25 * anneesService; // Estimation
    return Math.max(0, capitalTheorique - params.capitalPilier2Actuel);
  }

  private getTauxMarginalFiscal(revenu: number, canton: Canton): number {
    // Taux marginaux fiscaux simplifiés par canton (estimation)
    const tauxCantonaux: Record<string, number> = {
      'GE': 0.25, 'VD': 0.22, 'ZH': 0.20, 'BE': 0.21, 'BS': 0.26,
      'ZG': 0.15, 'SZ': 0.18, 'TI': 0.20, 'FR': 0.19, 'NE': 0.23,
      'VS': 0.18, 'JU': 0.21, 'AG': 0.19, 'SO': 0.20, 'LU': 0.18,
      'BL': 0.22, 'SH': 0.17, 'AR': 0.16, 'AI': 0.15, 'SG': 0.19,
      'GR': 0.17, 'TG': 0.18, 'UR': 0.16, 'OW': 0.17, 'NW': 0.16
    };
    
    const tauxCantonal = tauxCantonaux[(canton as any)?.code || canton] || 0.20;
    
    // Ajustement selon le revenu
    if (revenu > 150000) return tauxCantonal * 1.1;
    if (revenu < 50000) return tauxCantonal * 0.8;
    
    return tauxCantonal;
  }

  private getTauxImpositionCapital(canton: Canton): number {
    // Taux d'imposition réduits sur les capitaux de prévoyance
    const tauxCapital: Record<string, number> = {
      'GE': 0.02, 'VD': 0.015, 'ZH': 0.01, 'BE': 0.015, 'BS': 0.02,
      'ZG': 0.005, 'SZ': 0.01, 'TI': 0.015, 'FR': 0.012, 'NE': 0.018,
      'VS': 0.012, 'JU': 0.015, 'AG': 0.012, 'SO': 0.015, 'LU': 0.012,
      'BL': 0.015, 'SH': 0.01, 'AR': 0.008, 'AI': 0.007, 'SG': 0.012,
      'GR': 0.01, 'TG': 0.012, 'UR': 0.008, 'OW': 0.01, 'NW': 0.008
    };
    
    return tauxCapital[(canton as any)?.code || canton] || 0.015;
  }

  // Méthodes statiques utilitaires
  static getAVSRatesByYear(): Record<number, { min: number; max: number }> {
    return {
      2024: { min: 14700, max: 29400 },
      2025: { min: 15000, max: 30000 }, // Estimations
      2026: { min: 15300, max: 30600 }
    };
  }

  static getLPPConversionRates(): Record<number, number> {
    return {
      58: 0.058, 59: 0.059, 60: 0.060, 61: 0.061, 62: 0.062,
      63: 0.063, 64: 0.064, 65: 0.065, 66: 0.064, 67: 0.063,
      68: 0.062, 69: 0.061, 70: 0.060
    };
  }

  static getRetirementAgeRecommendations(birthYear: number): {
    normalAge: number;
    anticipatedMin: number;
    postponedMax: number;
  } {
    // Évolution future de l'âge de retraite
    if (birthYear >= 1960) {
      return { normalAge: 65, anticipatedMin: 62, postponedMax: 70 };
    }
    return { normalAge: 64, anticipatedMin: 62, postponedMax: 70 };
  }
}