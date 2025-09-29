import { ImmobilierParameters, ImmobilierResults } from '@/types/simulators';
import { Canton } from '@/types/user';

export class RealEstateCalculator {
  
  calculate(params: ImmobilierParameters): ImmobilierResults {
    // 1. Calcul des revenus totaux
    const revenuTotal = params.revenuNetMensuel * 12 + (params.revenuConjoint ? params.revenuConjoint * 12 : 0);
    
    // 2. Fonds propres minimum (20% + frais)
    const fraisTotauxAchat = this.calculateFraisTotaux(params);
    const fondsPropresMini = params.prixAchat * 0.20 + fraisTotauxAchat;
    const fondsPropresPourcent = (params.fondsPropresPrevus / params.prixAchat) * 100;
    
    // 3. Montant hypothèque
    const montantHypotheque = params.prixAchat - params.fondsPropresPrevus;
    
    // 4. Charges théoriques et réelles
    const chargesCalculation = this.calculateCharges(params, revenuTotal);
    
    // 5. Capacité d'achat maximale
    const capaciteAchatMax = this.calculateCapaciteAchat(params, revenuTotal);
    
    // 6. Amortissement
    const amortissementData = this.calculateAmortissement(params);
    
    // 7. Comparaison location
    const coutLocation = this.estimateRentalCost(params);
    
    // 8. Recommandations et risques
    const analysis = this.generateAnalysis(params, {
      revenuTotal,
      fondsPropresMini,
      chargesTheoretiques: chargesCalculation.chargesTheoretiques,
      tauxChargeTheorique: chargesCalculation.tauxChargeTheorique
    });

    return {
      capaciteAchatMax,
      prixAccessible: params.prixAchat <= capaciteAchatMax && params.fondsPropresPrevus >= fondsPropresMini,
      fondsPropresMini,
      fondsPropresPourcent,
      montantHypotheque,
      chargesTheoretiques: chargesCalculation.chargesTheoretiques,
      chargesReelles: chargesCalculation.chargesReelles,
      tauxChargeTheorique: chargesCalculation.tauxChargeTheorique,
      limiteChargeRespectee: chargesCalculation.tauxChargeTheorique <= 33,
      amortissementObligatoire: amortissementData.amortissementObligatoire,
      dureeAmortissement: amortissementData.dureeAmortissement,
      fraisTotauxAchat,
      chargesMensuelles: chargesCalculation.chargesReelles / 12,
      chargesAnnuelles: chargesCalculation.chargesReelles,
      coutLocation,
      economieAchatVsLocation: chargesCalculation.chargesReelles - coutLocation,
      recommandations: analysis.recommandations,
      risques: analysis.risques,
      opportunites: analysis.opportunites
    };
  }

  private calculateFraisTotaux(params: ImmobilierParameters): number {
    // Frais de notaire (1-1.5% selon canton)
    const fraisNotaireEstimes = params.fraisNotaire || (params.prixAchat * 0.015);
    
    // Frais de courtage (0-3% selon canton)
    const fraisCourtageEstimes = params.fraisCourtage || 0;
    
    // Taxes de transfert (varie selon canton)
    const taxesTransfertEstimees = params.taxesTransfert || this.getTransferTax(params.canton, params.prixAchat);
    
    // Frais de rénovation éventuels
    const fraisRenovationEstimes = params.fraisRenovation || 0;
    
    return fraisNotaireEstimes + fraisCourtageEstimes + taxesTransfertEstimees + fraisRenovationEstimes;
  }

  private getTransferTax(canton: Canton, prixAchat: number): number {
    // Droits de mutation par canton (simplifié)
    const transferTaxRates: Record<string, number> = {
      'GE': 0.033, 'VD': 0.022, 'VS': 0.015, 'FR': 0.017, 'NE': 0.033,
      'JU': 0.017, 'BE': 0.018, 'ZH': 0, 'BS': 0.03, 'BL': 0.02,
      'AG': 0.01, 'SO': 0.017, 'LU': 0.02, 'ZG': 0.01, 'SZ': 0.01,
      'OW': 0.02, 'NW': 0.02, 'UR': 0.015, 'TG': 0.01, 'SH': 0.01,
      'AR': 0.015, 'AI': 0.015, 'SG': 0.01, 'GR': 0.01, 'TI': 0.015
    };
    
    return prixAchat * (transferTaxRates[(canton as any)?.code || canton] || 0.02);
  }

  private calculateCharges(params: ImmobilierParameters, revenuTotal: number) {
    const montantHypotheque = params.prixAchat - params.fondsPropresPrevus;
    
    // Taux d'intérêt selon le type choisi
    const tauxInteret = params.tauxInteretSouhaite || this.getMarketRate(params.typeHypotheque);
    
    // Charges théoriques (méthode bancaire suisse)
    // Taux théorique de 5% + 1% d'entretien + amortissement
    const tauxTheorique = 5.0; // Taux théorique standardisé
    const chargesInterets = (montantHypotheque * tauxTheorique) / 100;
    const chargesEntretien = (params.prixAchat * 1.0) / 100; // 1% du prix d'achat
    const amortissementAnnuel = this.calculateAmortissementAnnuel(params);
    
    const chargesTheoretiques = chargesInterets + chargesEntretien + amortissementAnnuel;
    const tauxChargeTheorique = (chargesTheoretiques / revenuTotal) * 100;
    
    // Charges réelles (avec taux actuel)
    const chargesInteretsReelles = (montantHypotheque * tauxInteret) / 100;
    const chargesReelles = chargesInteretsReelles + chargesEntretien + amortissementAnnuel;
    
    return {
      chargesTheoretiques,
      chargesReelles,
      tauxChargeTheorique
    };
  }

  private getMarketRate(typeHypotheque: string): number {
    // Taux du marché selon le type d'hypothèque (données indicatives 2024)
    const rates = {
      'fixe': 2.5,
      'variable': 2.2,
      'saron': 1.8
    };
    
    return rates[typeHypotheque as keyof typeof rates] || 2.5;
  }

  private calculateCapaciteAchat(params: ImmobilierParameters, revenuTotal: number): number {
    // Capacité basée sur la règle des 33% de charges théoriques
    const chargesMaximales = revenuTotal * 0.33;
    
    // Estimation des charges d'entretien (1% du prix)
    // Estimation de l'amortissement (dépend du prix)
    // Résolution de l'équation pour trouver le prix maximum
    
    // Simplification : utilisation d'une approche itérative
    let prixMax = 0;
    const increment = 10000;
    
    for (let prix = 100000; prix <= 3000000; prix += increment) {
      const montantHypotheque = prix - params.fondsPropresPrevus;
      if (montantHypotheque <= 0) continue;
      
      const chargesInterets = (montantHypotheque * 5.0) / 100; // Taux théorique 5%
      const chargesEntretien = (prix * 1.0) / 100;
      const amortissement = this.calculateAmortissementForPrice(prix, params.fondsPropresPrevus);
      
      const chargesTotales = chargesInterets + chargesEntretien + amortissement;
      
      if (chargesTotales <= chargesMaximales) {
        prixMax = prix;
      } else {
        break;
      }
    }
    
    return prixMax;
  }

  private calculateAmortissement(params: ImmobilierParameters) {
    const montantHypotheque = params.prixAchat - params.fondsPropresPrevus;
    const quotitePret = (montantHypotheque / params.prixAchat) * 100;
    
    // Amortissement obligatoire si quotité > 67%
    if (quotitePret > 67) {
      const montantAmortissement = montantHypotheque - (params.prixAchat * 0.67);
      const dureeAmortissement = 15; // 15 ans maximum en Suisse
      const amortissementAnnuel = montantAmortissement / dureeAmortissement;
      
      return {
        amortissementObligatoire: montantAmortissement,
        dureeAmortissement,
        amortissementAnnuel
      };
    }
    
    return {
      amortissementObligatoire: 0,
      dureeAmortissement: 0,
      amortissementAnnuel: 0
    };
  }

  private calculateAmortissementAnnuel(params: ImmobilierParameters): number {
    const amortissementData = this.calculateAmortissement(params);
    return amortissementData.amortissementAnnuel || 0;
  }

  private calculateAmortissementForPrice(prix: number, fondsPropresPrevus: number): number {
    const montantHypotheque = prix - fondsPropresPrevus;
    const quotitePret = (montantHypotheque / prix) * 100;
    
    if (quotitePret > 67) {
      const montantAmortissement = montantHypotheque - (prix * 0.67);
      return montantAmortissement / 15; // 15 ans
    }
    
    return 0;
  }

  private estimateRentalCost(params: ImmobilierParameters): number {
    // Estimation basée sur le prix d'achat et la région
    // Rendement locatif brut moyen en Suisse : 3.5-5%
    const rendementLocatifEstime = 0.04; // 4% en moyenne
    const loyerAnnuelEstime = params.prixAchat * rendementLocatifEstime;
    
    // Ajustement selon la surface et le type
    let facteurAjustement = 1;
    
    if (params.typeLogement === 'appartement') {
      facteurAjustement = 1.1; // Appartements généralement plus chers au m²
    } else if (params.typeLogement === 'maison') {
      facteurAjustement = 0.9;
    }
    
    return loyerAnnuelEstime * facteurAjustement;
  }

  private generateAnalysis(params: ImmobilierParameters, calculatedData: any) {
    const recommandations: string[] = [];
    const risques: string[] = [];
    const opportunites: string[] = [];
    
    // Analyse des fonds propres
    if (calculatedData.fondsPropresMini > params.fondsPropresPrevus) {
      const manquant = calculatedData.fondsPropresMini - params.fondsPropresPrevus;
      risques.push(`Il vous manque ${manquant.toLocaleString('fr-CH')} CHF de fonds propres minimum.`);
      recommandations.push('Augmentez vos fonds propres ou réduisez le prix du bien visé.');
    } else {
      opportunites.push('Vos fonds propres sont suffisants pour cet achat.');
    }
    
    // Analyse du taux de charge
    if (calculatedData.tauxChargeTheorique > 33) {
      risques.push(`Votre taux de charge (${calculatedData.tauxChargeTheorique.toFixed(1)}%) dépasse la limite bancaire de 33%.`);
      recommandations.push('Réduisez le prix d\'achat ou augmentez vos revenus avant de faire une demande.');
    } else if (calculatedData.tauxChargeTheorique > 28) {
      recommandations.push('Votre taux de charge est proche de la limite. Négociez les meilleures conditions.');
    } else {
      opportunites.push('Votre taux de charge est confortable, vous devriez obtenir un financement facilement.');
    }
    
    // Analyse de l'âge du bien
    const ageLogement = new Date().getFullYear() - params.anneeConstruction;
    if (ageLogement > 30 && params.etatLogement !== 'neuf') {
      recommandations.push('Prévoyez un budget pour les rénovations futures (toiture, chauffage, isolation).');
      if (!params.fraisRenovation || params.fraisRenovation < 20000) {
        risques.push('Budget de rénovation potentiellement sous-estimé pour un bien ancien.');
      }
    }
    
    // Recommandations sur l'hypothèque
    if (params.typeHypotheque === 'variable') {
      risques.push('Hypothèque variable : risque de hausse des taux d\'intérêt.');
      recommandations.push('Considérez un mix fixe/variable pour limiter les risques.');
    }
    
    if (params.dureeHypotheque > 10) {
      recommandations.push('Hypothèque longue durée : négociez un taux fixe pour vous protéger.');
    }
    
    // Opportunités d'investissement
    if (params.fondsPropresPrevus > calculatedData.fondsPropresMini * 1.2) {
      opportunites.push('Vous pourriez envisager un bien plus cher ou investir la différence.');
    }
    
    return { recommandations, risques, opportunites };
  }

  // Méthodes utilitaires statiques
  static getCantonTransferTaxes(): Record<string, { rate: number; description: string }> {
    return {
      'GE': { rate: 3.3, description: 'Droits de mutation 3.3%' },
      'VD': { rate: 2.2, description: 'Impôt sur les mutations 2.2%' },
      'ZH': { rate: 0, description: 'Pas de droits de mutation' },
      'BE': { rate: 1.8, description: 'Impôt sur les gains immobiliers variables' },
      'BS': { rate: 3.0, description: 'Droits de timbre 3%' },
      // ... autres cantons
    };
  }

  static getEstimatedMortgageRates(): Record<string, { rate: number; description: string }> {
    return {
      'fixe': { rate: 2.5, description: 'Taux fixe 10 ans (estimation)' },
      'variable': { rate: 2.2, description: 'Taux variable' },
      'saron': { rate: 1.8, description: 'Hypothèque SARON' }
    };
  }

  static calculateAffordabilityQuick(
    monthlyIncome: number, 
    downPayment: number, 
    otherIncome: number = 0
  ): number {
    const annualIncome = (monthlyIncome + otherIncome) * 12;
    const maxCharges = annualIncome * 0.33;
    
    // Estimation rapide : 6% de charges sur le prix d'achat
    const maxPrice = (maxCharges / 0.06) + downPayment;
    
    return Math.round(maxPrice / 10000) * 10000; // Arrondi aux 10'000 CHF
  }

  static getRegionalPriceIndicators(canton: Canton): { 
    averagePricePerM2: number; 
    priceIndex: number; 
    marketTrend: 'hausse' | 'stable' | 'baisse' 
  } {
    // Données indicatives moyennes 2024 (à actualiser)
    const regionalData: Partial<Record<string, any>> = {
      'GE': { averagePricePerM2: 12000, priceIndex: 130, marketTrend: 'stable' },
      'ZH': { averagePricePerM2: 15000, priceIndex: 150, marketTrend: 'hausse' },
      'VD': { averagePricePerM2: 9000, priceIndex: 110, marketTrend: 'stable' },
      'BS': { averagePricePerM2: 13000, priceIndex: 140, marketTrend: 'hausse' },
      'ZG': { averagePricePerM2: 14000, priceIndex: 145, marketTrend: 'stable' },
    };
    
    return regionalData[(canton as any)?.code || canton] || { 
      averagePricePerM2: 8000, 
      priceIndex: 100, 
      marketTrend: 'stable' as const 
    };
  }
}