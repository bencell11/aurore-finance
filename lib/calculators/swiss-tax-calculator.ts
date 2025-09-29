import { cantonalTaxData, federalTaxRates } from '@/lib/data/swiss-tax-data';
import { ImpotsParameters, ImpotsResults, TrancheImpot, OptimisationSuggestion } from '@/types/simulators';
import { Canton } from '@/types/user';

export class SwissTaxCalculator {
  private cantonData: any;
  private federalRates: any;

  constructor() {
    this.federalRates = federalTaxRates;
  }

  calculate(params: ImpotsParameters): ImpotsResults {
    this.cantonData = (cantonalTaxData as any)[(params.canton as any)?.code || params.canton];
    
    if (!this.cantonData) {
      throw new Error(`Données fiscales non disponibles pour le canton ${params.canton}`);
    }

    // 1. Calcul du revenu imposable
    const revenuImposable = this.calculateRevenuImposable(params);
    
    // 2. Calcul de la fortune imposable
    const fortuneImposable = this.calculateFortuneImposable(params);
    
    // 3. Calcul des impôts fédéraux
    const impotFederal = this.calculateImpotFederal(revenuImposable, params.situationFamiliale);
    
    // 4. Calcul des impôts cantonaux
    const impotCantonal = this.calculateImpotCantonal(revenuImposable, params.situationFamiliale);
    
    // 5. Calcul des impôts communaux (estimation moyenne)
    const impotCommunal = impotCantonal * 0.3; // 30% en moyenne
    
    // 6. Impôt d'église (optionnel)
    const impotEglise = (impotCantonal + impotCommunal) * 0.05; // 5% en moyenne
    
    const totalImpots = impotFederal + impotCantonal + impotCommunal + impotEglise;
    
    // 7. Calcul des taux
    const tauxMoyen = (totalImpots / params.revenuBrutAnnuel) * 100;
    const tauxMarginal = this.calculateTauxMarginal(params);
    
    // 8. Analyse des tranches
    const tranchesFederales = this.getTranchesFederales(revenuImposable, params.situationFamiliale);
    const tranchesCantonales = this.getTranchesCantonales(revenuImposable, params.situationFamiliale);
    
    // 9. Suggestions d'optimisation
    const economiesPossibles = this.generateOptimisationSuggestions(params, totalImpots);
    
    // 10. Comparaisons
    const chargeReelle = tauxMoyen;
    const chargeMoyenneSuisse = this.getChargeMoyenneSuisse(params.revenuBrutAnnuel);
    const positionRelative = this.determinePositionRelative(chargeReelle, chargeMoyenneSuisse);

    return {
      revenuImposable,
      fortuneImposable,
      impotFederal,
      impotCantonal,
      impotCommunal,
      impotEglise,
      totalImpots,
      tranchesFederales,
      tranchesCantonales,
      tauxMarginal,
      tauxMoyen,
      economiesPossibles,
      chargeReelle,
      chargeMoyenneSuisse,
      positionRelative
    };
  }

  private calculateRevenuImposable(params: ImpotsParameters): number {
    let revenuBrut = params.revenuBrutAnnuel;
    
    // Ajouter le revenu du conjoint si marié
    if (params.situationFamiliale === 'marie' && params.revenuConjoint) {
      revenuBrut += params.revenuConjoint;
    }
    
    // Déductions standard
    let deductions = this.getDeductionsStandard(params);
    
    // Déductions spécifiques
    deductions += params.fraisProfessionnels;
    deductions += params.fraisTransport;
    deductions += params.fraisRepas;
    deductions += params.fraisFormation;
    deductions += Math.min(params.pilier3a, this.cantonData.deductions.pilier3aMax);
    deductions += params.pilier3b;
    deductions += params.donsCharite;
    deductions += params.fraisMedicaux;
    deductions += params.primesAssuranceMaladie;
    
    // Déductions par enfant
    deductions += params.nombreEnfants * this.cantonData.deductions.parEnfant;
    
    return Math.max(0, revenuBrut - deductions);
  }

  private calculateFortuneImposable(params: ImpotsParameters): number {
    let fortune = params.fortunePrivee;
    
    if (params.immobilierPrincipal) {
      // Résidence principale: déduction de 30% en moyenne
      fortune += params.immobilierPrincipal * 0.7;
    }
    
    if (params.immobilierRendement) {
      fortune += params.immobilierRendement;
    }
    
    // Déduction des dettes
    fortune -= params.dettes;
    
    // Franchise de fortune (varie par canton)
    const franchiseFortune = params.situationFamiliale === 'marie' ? 100000 : 50000;
    
    return Math.max(0, fortune - franchiseFortune);
  }

  private calculateImpotFederal(revenuImposable: number, situation: any): number {
    const baremes = situation === 'marie' 
      ? this.federalRates.marie 
      : this.federalRates.celibataire;
    
    let impot = 0;
    let revenuRestant = revenuImposable;
    
    for (const tranche of baremes) {
      if (revenuRestant <= 0) break;
      
      const montantTranche = Math.min(
        revenuRestant, 
        tranche.a === Infinity ? revenuRestant : tranche.a - tranche.de
      );
      
      if (montantTranche > 0) {
        impot += (montantTranche * tranche.taux) / 100;
        revenuRestant -= montantTranche;
      }
    }
    
    return impot;
  }

  private calculateImpotCantonal(revenuImposable: number, situation: any): number {
    const baremes = situation === 'marie' 
      ? this.cantonData.baremesMaries 
      : this.cantonData.baremesCelibataires;
    
    let impot = 0;
    
    for (const tranche of baremes) {
      if (revenuImposable > tranche.de) {
        const montantTranche = Math.min(
          revenuImposable - tranche.de,
          tranche.a === Infinity ? revenuImposable - tranche.de : tranche.a - tranche.de
        );
        
        if (montantTranche > 0) {
          impot += (montantTranche * tranche.taux) / 100;
        }
      }
    }
    
    return impot;
  }

  private calculateTauxMarginal(params: ImpotsParameters): number {
    // Calculer l'impôt avec un franc supplémentaire
    const impotBase = this.calculate(params).totalImpots;
    const paramsPlus1 = { ...params, revenuBrutAnnuel: params.revenuBrutAnnuel + 1 };
    const impotPlus1 = this.calculate(paramsPlus1).totalImpots;
    
    return ((impotPlus1 - impotBase) * 100);
  }

  private getDeductionsStandard(params: ImpotsParameters): number {
    if (params.situationFamiliale === 'marie') {
      return this.cantonData.deductions.marie;
    } else {
      return this.cantonData.deductions.celibataire;
    }
  }

  private getTranchesFederales(revenuImposable: number, situation: any): TrancheImpot[] {
    const baremes = situation === 'marie' 
      ? this.federalRates.marie 
      : this.federalRates.celibataire;
    
    const tranches: TrancheImpot[] = [];
    let revenuRestant = revenuImposable;
    
    for (const bareme of baremes) {
      if (revenuRestant <= 0) break;
      
      const montantTranche = Math.min(
        revenuRestant,
        bareme.a === Infinity ? revenuRestant : bareme.a - bareme.de
      );
      
      if (montantTranche > 0) {
        const impotTranche = (montantTranche * bareme.taux) / 100;
        
        tranches.push({
          de: bareme.de,
          a: bareme.a,
          taux: bareme.taux,
          montantTranche,
          impotTranche
        });
        
        revenuRestant -= montantTranche;
      }
    }
    
    return tranches;
  }

  private getTranchesCantonales(revenuImposable: number, situation: any): TrancheImpot[] {
    const baremes = situation === 'marie' 
      ? this.cantonData.baremesMaries 
      : this.cantonData.baremesCelibataires;
    
    const tranches: TrancheImpot[] = [];
    
    for (const bareme of baremes) {
      if (revenuImposable > bareme.de) {
        const montantTranche = Math.min(
          revenuImposable - bareme.de,
          bareme.a === Infinity ? revenuImposable - bareme.de : bareme.a - bareme.de
        );
        
        if (montantTranche > 0) {
          const impotTranche = (montantTranche * bareme.taux) / 100;
          
          tranches.push({
            de: bareme.de,
            a: bareme.a,
            taux: bareme.taux,
            montantTranche,
            impotTranche
          });
        }
      }
    }
    
    return tranches;
  }

  private generateOptimisationSuggestions(params: ImpotsParameters, impotActuel: number): OptimisationSuggestion[] {
    const suggestions: OptimisationSuggestion[] = [];
    
    // Optimisation 3e pilier A
    const maxPilier3a = this.cantonData.deductions.pilier3aMax;
    if (params.pilier3a < maxPilier3a) {
      const versementSupplementaire = maxPilier3a - params.pilier3a;
      const economie = versementSupplementaire * (params.revenuBrutAnnuel > 100000 ? 0.25 : 0.20);
      
      suggestions.push({
        type: 'pilier3a',
        titre: 'Maximiser le 3e pilier A',
        description: `Vous pouvez encore verser ${versementSupplementaire.toLocaleString('fr-CH')} CHF cette année.`,
        economieAnnuelle: economie,
        actionRequise: 'Effectuer un versement supplémentaire avant le 31 décembre',
        priorite: 'haute'
      });
    }
    
    // Optimisation frais professionnels
    if (params.fraisProfessionnels < this.cantonData.deductions.fraisProfessionnels) {
      const economie = (this.cantonData.deductions.fraisProfessionnels - params.fraisProfessionnels) * 0.25;
      
      suggestions.push({
        type: 'fraisProfessionnels',
        titre: 'Optimiser les frais professionnels',
        description: 'Documentez mieux vos frais de transport, repas et formation.',
        economieAnnuelle: economie,
        actionRequise: 'Tenir un registre détaillé des frais professionnels',
        priorite: 'moyenne'
      });
    }
    
    // Rachat 2e pilier (si applicable)
    if (params.revenuBrutAnnuel > 80000) {
      const rachatEstime = Math.min(params.revenuBrutAnnuel * 0.1, 50000);
      const economie = rachatEstime * 0.30;
      
      suggestions.push({
        type: 'rachatPilier2',
        titre: 'Rachat dans le 2e pilier',
        description: 'Un rachat vous permettrait de réduire significativement vos impôts.',
        economieAnnuelle: economie,
        actionRequise: 'Demander un certificat de rachat à votre caisse de pension',
        priorite: params.revenuBrutAnnuel > 120000 ? 'haute' : 'moyenne'
      });
    }
    
    // Étalement des revenus
    if (params.revenuBrutAnnuel > 150000) {
      suggestions.push({
        type: 'etalement',
        titre: 'Étalement des revenus',
        description: 'Répartir les bonus sur plusieurs années peut réduire la progression fiscale.',
        economieAnnuelle: impotActuel * 0.05,
        actionRequise: 'Négocier avec l\'employeur l\'étalement des primes',
        priorite: 'basse'
      });
    }
    
    return suggestions.sort((a, b) => {
      const prioriteOrder = { 'haute': 3, 'moyenne': 2, 'basse': 1 };
      return prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
    });
  }

  private getChargeMoyenneSuisse(revenus: number): number {
    // Données moyennes suisses par tranche de revenus
    if (revenus < 50000) return 8;
    if (revenus < 80000) return 12;
    if (revenus < 120000) return 16;
    if (revenus < 200000) return 20;
    return 25;
  }

  private determinePositionRelative(chargeReelle: number, chargeMoyenne: number): 'favorable' | 'moyenne' | 'elevee' {
    if (chargeReelle < chargeMoyenne * 0.9) return 'favorable';
    if (chargeReelle > chargeMoyenne * 1.1) return 'elevee';
    return 'moyenne';
  }

  // Méthodes utilitaires pour les simulateurs
  static getCantonsList(): { value: Canton; label: string }[] {
    return Object.entries(cantonalTaxData).map(([code, data]) => ({
      value: code as any,
      label: `${(data as any).nom} (${code})`
    }));
  }

  static estimateQuickTax(revenus: number, canton: Canton, situation: any): number {
    const cantonData = (cantonalTaxData as any)[(canton as any)?.code || canton];
    if (!cantonData) return 0;
    
    // Estimation rapide basée sur le taux de base
    const tauxEstime = situation === 'marie' 
      ? cantonData.tauxBase * 0.8 
      : cantonData.tauxBase;
    
    return (revenus * tauxEstime) / 100;
  }

  static getDeductionLimits(canton: Canton): Record<string, number> {
    const cantonData = (cantonalTaxData as any)[(canton as any)?.code || canton];
    return cantonData ? cantonData.deductions : {};
  }
}