import { InvestissementParameters, InvestissementResults, AllocationAsset, ProduitInvestissement } from '@/types/simulators';

export class InvestmentCalculator {

  calculate(params: InvestissementParameters): InvestissementResults {
    // 1. Détermination du profil de risque global
    const profilRisque = this.calculateRiskProfile(params);
    
    // 2. Allocation d'actifs optimale selon le profil
    const allocationOptimale = this.generateOptimalAllocation(params, profilRisque);
    
    // 3. Projections de rendement selon différents scénarios
    const projections = this.calculateProjections(params, allocationOptimale);
    
    // 4. Sélection de produits adaptés au marché suisse
    const produitsRecommandes = this.selectSwissProducts(params, allocationOptimale);
    
    // 5. Analyse des risques et volatilité
    const analyse = this.performRiskAnalysis(params, allocationOptimale);
    
    // 6. Impact fiscal suisse
    const impactsFiscaux = this.calculateSwissTaxImpact(params, projections);
    
    // 7. Conseils personnalisés de gestion
    const conseil = this.generateInvestmentAdvice(params, allocationOptimale);

    return {
      capitalFinal: projections.capitalFinal,
      rendementAttendu: projections.rendementAttendu,
      allocationOptimale,
      produitsRecommandes,
      analyse,
      impactsFiscaux,
      conseil
    };
  }

  private calculateRiskProfile(params: InvestissementParameters): number {
    let score = 0;
    
    // Expérience d'investissement (0-25 points)
    const experienceScores = { 
      'debutant': 5, 
      'intermediaire': 12, 
      'avance': 20, 
      'expert': 25 
    };
    score += experienceScores[params.experienceInvestissement];
    
    // Tolérance au risque (0-30 points)
    const toleranceScores = { 
      'conservateur': 5, 
      'modere': 15, 
      'dynamique': 25, 
      'agressif': 30 
    };
    score += toleranceScores[params.toleranceRisque];
    
    // Capacité financière (0-20 points)
    const capaciteScores = { 
      'limitee': 5, 
      'moyenne': 12, 
      'elevee': 20 
    };
    score += capaciteScores[params.capaciteFinanciere];
    
    // Horizon de placement (0-25 points)
    if (params.horizonPlacement <= 2) score += 5;
    else if (params.horizonPlacement <= 5) score += 10;
    else if (params.horizonPlacement <= 10) score += 18;
    else score += 25;
    
    return Math.min(100, score); // Score sur 100
  }

  private generateOptimalAllocation(params: InvestissementParameters, riskScore: number): AllocationAsset[] {
    const allocations: AllocationAsset[] = [];
    
    // Allocation de base selon le profil de risque
    if (riskScore <= 30) { // Conservateur
      allocations.push(
        { classe: 'liquidites', pourcentage: 15, montant: 0, justification: 'Comptes épargne et monétaires pour sécurité' },
        { classe: 'obligations', pourcentage: 60, montant: 0, justification: 'Obligations gouvernementales et corporate pour stabilité' },
        { classe: 'actions', pourcentage: 20, montant: 0, justification: 'Actions défensives et dividendes pour croissance modérée' },
        { classe: 'immobilier', pourcentage: 5, montant: 0, justification: 'REITs et fonds immobiliers pour diversification' }
      );
    } else if (riskScore <= 55) { // Modéré
      allocations.push(
        { classe: 'liquidites', pourcentage: 10, montant: 0, justification: 'Réserve de sécurité et opportunités' },
        { classe: 'obligations', pourcentage: 40, montant: 0, justification: 'Mix obligations gouvernementales et corporate' },
        { classe: 'actions', pourcentage: 40, montant: 0, justification: 'Actions blue-chip et croissance modérée' },
        { classe: 'immobilier', pourcentage: 10, montant: 0, justification: 'REITs diversifiés pour rendement et protection inflation' }
      );
    } else if (riskScore <= 75) { // Dynamique
      allocations.push(
        { classe: 'liquidites', pourcentage: 5, montant: 0, justification: 'Liquidités pour saisir les opportunités' },
        { classe: 'obligations', pourcentage: 25, montant: 0, justification: 'Obligations high-yield et émergentes' },
        { classe: 'actions', pourcentage: 55, montant: 0, justification: 'Actions croissance et valeur pour performance' },
        { classe: 'immobilier', pourcentage: 15, montant: 0, justification: 'REITs et investissements immobiliers privés' }
      );
    } else { // Agressif
      allocations.push(
        { classe: 'liquidites', pourcentage: 3, montant: 0, justification: 'Liquidités minimales pour flexibilité' },
        { classe: 'obligations', pourcentage: 12, montant: 0, justification: 'Obligations convertibles et high-yield' },
        { classe: 'actions', pourcentage: 70, montant: 0, justification: 'Actions croissance et small-caps pour performance maximale' },
        { classe: 'immobilier', pourcentage: 10, montant: 0, justification: 'REITs spécialisés et private equity' },
        { classe: 'alternatifs', pourcentage: 5, montant: 0, justification: 'Investissements alternatifs et hedge funds' }
      );
    }
    
    // Ajustements selon les préférences géographiques
    return this.adjustGeographicalAllocation(allocations, params);
  }

  private adjustGeographicalAllocation(allocations: AllocationAsset[], params: InvestissementParameters): AllocationAsset[] {
    // Ajustement basé sur les préférences géographiques
    const hasSwissPreference = params.marchesGeographiques.includes('suisse');
    const hasEmergingPreference = params.marchesGeographiques.includes('emergents');
    
    return allocations.map(allocation => {
      if (allocation.classe === 'actions') {
        if (hasSwissPreference) {
          allocation.justification += ' - Focus Suisse avec diversification internationale';
        } else if (hasEmergingPreference) {
          allocation.justification += ' - Exposition accrue aux marchés émergents';
        } else {
          allocation.justification += ' - Diversification mondiale équilibrée';
        }
      }
      return allocation;
    });
  }

  private calculateProjections(params: InvestissementParameters, allocation: AllocationAsset[]) {
    // Rendements historiques moyens par classe d'actifs (ajustés pour le marché suisse)
    const rendementsHistoriques = {
      'liquidites': 0.005, // 0.5%
      'obligations': 0.025, // 2.5%
      'actions': 0.070, // 7%
      'immobilier': 0.055, // 5.5%
      'matieresPremiere': 0.045, // 4.5%
      'alternatifs': 0.080, // 8%
    };
    
    // Calcul du rendement pondéré du portefeuille
    const rendementPortefeuille = allocation.reduce((total, asset) => {
      const rendement = rendementsHistoriques[asset.classe as keyof typeof rendementsHistoriques] || 0.03;
      return total + (asset.pourcentage / 100) * rendement;
    }, 0);
    
    // Projections avec différents scénarios
    const scenarios = {
      conservateur: rendementPortefeuille * 0.7, // -30%
      modere: rendementPortefeuille, // Base
      dynamique: rendementPortefeuille * 1.3 // +30%
    };
    
    const capitalFinal = {
      conservateur: this.calculateFutureValue(params.montantInitial, params.versementMensuel, scenarios.conservateur, params.horizonPlacement),
      modere: this.calculateFutureValue(params.montantInitial, params.versementMensuel, scenarios.modere, params.horizonPlacement),
      dynamique: this.calculateFutureValue(params.montantInitial, params.versementMensuel, scenarios.dynamique, params.horizonPlacement)
    };
    
    const totalVerse = params.montantInitial + (params.versementMensuel * 12 * params.horizonPlacement);
    const rendementTotal = capitalFinal.modere - totalVerse;
    
    return {
      capitalFinal,
      rendementAttendu: {
        annuel: rendementPortefeuille * 100,
        total: (rendementTotal / totalVerse) * 100
      }
    };
  }

  private calculateFutureValue(capital: number, mensuel: number, taux: number, annees: number): number {
    // Valeur future du capital initial
    const futureCapital = capital * Math.pow(1 + taux, annees);
    
    // Valeur future des versements mensuels (annuité)
    const tauxMensuel = taux / 12;
    const nombreMois = annees * 12;
    const futureVersements = mensuel * (Math.pow(1 + tauxMensuel, nombreMois) - 1) / tauxMensuel;
    
    return futureCapital + futureVersements;
  }

  private selectSwissProducts(params: InvestissementParameters, allocation: AllocationAsset[]): ProduitInvestissement[] {
    const produits: ProduitInvestissement[] = [];
    
    allocation.forEach(asset => {
      switch (asset.classe) {
        case 'actions':
          produits.push(
            {
              nom: 'iShares Core SPI ETF (CSPI)',
              type: 'ETF',
              fraisGestion: 0.10,
              justification: 'ETF répliquant l\'indice SPI (Swiss Performance Index) - Exposition large marché suisse',
              rendementHistorique: 6.8,
              isin: 'CH0237935652',
              allocationPourcentage: 30
            },
            {
              nom: 'Vanguard FTSE Developed World ETF',
              type: 'ETF',
              fraisGestion: 0.12,
              justification: 'Diversification mondiale actions développées - Accès global low-cost',
              rendementHistorique: 7.2,
              isin: 'IE00BKX55T58',
              allocationPourcentage: 40
            }
          );
          break;
          
        case 'obligations':
          produits.push(
            {
              nom: 'iShares Core Swiss Government Bond ETF',
              type: 'ETF',
              fraisGestion: 0.15,
              justification: 'Obligations gouvernementales suisses - Sécurité et protection CHF',
              rendementHistorique: 1.8,
              isin: 'CH0193737827',
              allocationPourcentage: 50
            },
            {
              nom: 'ZKB Gold ETF',
              type: 'ETF',
              fraisGestion: 0.40,
              justification: 'ETF physique sur l\'or en CHF - Protection inflation et diversification',
              rendementHistorique: 4.2,
              isin: 'CH0047533523',
              allocationPourcentage: 20
            }
          );
          break;
          
        case 'immobilier':
          produits.push(
            {
              nom: 'Credit Suisse Real Estate Fund Switzerland',
              type: 'fonds',
              fraisGestion: 0.95,
              justification: 'Fonds immobilier suisse diversifié - Rendement et protection inflation',
              rendementHistorique: 5.1,
              isin: 'CH0005767842',
              allocationPourcentage: 80
            }
          );
          break;
      }
    });
    
    // Ajout de produits 3e pilier si horizon long terme
    if (params.horizonPlacement > 5 && params.objectifPlacement === 'retraite') {
      produits.push({
        nom: 'Viac 3a Global Strategy 100',
        type: 'ETF',
        fraisGestion: 0.52,
        justification: 'Solution 3e pilier avec 100% actions mondiales - Avantages fiscaux et croissance long terme',
        rendementHistorique: 8.1,
        noteESG: 'A',
        allocationPourcentage: 100
      });
    }
    
    return produits.slice(0, 6); // Limiter à 6 produits principaux
  }

  private performRiskAnalysis(params: InvestissementParameters, allocation: AllocationAsset[]) {
    // Volatilités par classe d'actifs
    const volatilites = {
      'liquidites': 0.01,
      'obligations': 0.04,
      'actions': 0.18,
      'immobilier': 0.12,
      'matieresPremiere': 0.22,
      'alternatifs': 0.15
    };
    
    // Calcul de la volatilité du portefeuille (simplifié)
    const volatilitePortefeuille = Math.sqrt(
      allocation.reduce((total, asset) => {
        const vol = volatilites[asset.classe as keyof typeof volatilites] || 0.10;
        return total + Math.pow((asset.pourcentage / 100) * vol, 2);
      }, 0)
    );
    
    // Perte maximale estimée (VaR 95%)
    const perteMaximaleEstimee = volatilitePortefeuille * 1.645 * 100; // 95% VaR
    
    // Probabilité d'atteindre l'objectif (simulation Monte Carlo simplifiée)
    const probabiliteObjectifAtteint = this.calculateSuccessProbability(params, allocation);
    
    return {
      volatilitePortefeuille: volatilitePortefeuille * 100,
      perteMaximaleEstimee,
      probabiliteObjectifAtteint
    };
  }

  private calculateSuccessProbability(params: InvestissementParameters, allocation: AllocationAsset[]): number {
    // Simulation simplifiée basée sur l'horizon et le profil de risque
    let probabilite = 70; // Base 70%
    
    // Ajustement selon l'horizon
    if (params.horizonPlacement > 10) probabilite += 15;
    else if (params.horizonPlacement > 5) probabilite += 10;
    else if (params.horizonPlacement < 3) probabilite -= 15;
    
    // Ajustement selon la diversification
    const nombreClasses = allocation.length;
    if (nombreClasses >= 5) probabilite += 10;
    else if (nombreClasses >= 3) probabilite += 5;
    
    // Ajustement selon la tolérance au risque vs horizon
    if (params.toleranceRisque === 'conservateur' && params.horizonPlacement > 10) {
      probabilite -= 10; // Trop conservateur pour long terme
    }
    if (params.toleranceRisque === 'agressif' && params.horizonPlacement < 5) {
      probabilite -= 15; // Trop risqué pour court terme
    }
    
    return Math.min(95, Math.max(25, probabilite));
  }

  private calculateSwissTaxImpact(params: InvestissementParameters, projections: any) {
    // Estimation de l'imposition en Suisse
    const capitalFinalModere = projections.capitalFinal.modere;
    const gainTotal = capitalFinalModere - params.montantInitial - (params.versementMensuel * 12 * params.horizonPlacement);
    
    // Impôt sur le revenu (dividendes/intérêts estimés à 3% du capital)
    const revenuAnnuelEstime = capitalFinalModere * 0.03;
    const impotRevenuAnnuel = revenuAnnuelEstime * 0.25; // Taux marginal estimé 25%
    
    // Impôt sur la fortune (0.5-1% selon canton)
    const impotFortune = capitalFinalModere * 0.007; // 0.7% estimé
    
    const strategieOptimisation = [
      'Privilégier les ETF à accumulation pour différer l\'imposition',
      'Utiliser les 3e piliers A et B pour optimiser la fiscalité',
      'Répartir les gains en capital sur plusieurs années fiscales',
      'Considérer la domiciliation dans un canton à fiscalité favorable'
    ];
    
    if (params.preoccupationESG) {
      strategieOptimisation.push('Intégrer des produits ESG qui peuvent bénéficier d\'avantages fiscaux');
    }
    
    return {
      impotRevenuAnnuel,
      impotFortune,
      strategieOptimisation
    };
  }

  private generateInvestmentAdvice(params: InvestissementParameters, allocation: AllocationAsset[]) {
    // Fréquence de rééquilibrage selon le profil
    let periodiciteRevision = 'Annuelle';
    if (params.toleranceRisque === 'agressif') {
      periodiciteRevision = 'Trimestrielle';
    } else if (params.toleranceRisque === 'conservateur') {
      periodiciteRevision = 'Semestrielle';
    }
    
    // Seuils de rééquilibrage
    const rebalancement = allocation.length > 4 
      ? 'Rééquilibrer si un actif dévie de plus de 5% de son allocation cible'
      : 'Rééquilibrer si un actif dévie de plus de 10% de son allocation cible';
    
    // Signaux de sortie/ajustement
    const signauxSortie = [
      'Changement majeur dans votre situation financière ou professionnelle',
      'Approche de votre objectif (moins de 2 ans avant échéance)',
      'Modification significative de votre tolérance au risque',
      'Performance sous-jacente systématiquement inférieure aux benchmarks'
    ];
    
    if (params.horizonPlacement > 10) {
      signauxSortie.push('Révision à mi-parcours pour ajuster la stratégie');
    }
    
    if (params.liquiditeRequise === 'immediate') {
      signauxSortie.push('Besoin de liquidités important non prévu (> 20% du portefeuille)');
    }
    
    return {
      rebalancement,
      periodiciteRevision,
      signauxSortie
    };
  }

  // Méthodes utilitaires statiques
  static getSwissMarketData(): {
    indices: { nom: string; ticker: string; rendement5ans: number }[];
    secteurs: { nom: string; poids: number; description: string }[];
  } {
    return {
      indices: [
        { nom: 'SMI (Swiss Market Index)', ticker: 'SMI', rendement5ans: 6.2 },
        { nom: 'SPI (Swiss Performance Index)', ticker: 'SPI', rendement5ans: 5.8 },
        { nom: 'SBI (Swiss Bond Index)', ticker: 'SBI', rendement5ans: 1.4 }
      ],
      secteurs: [
        { nom: 'Pharma & Santé', poids: 35, description: 'Novartis, Roche, Lonza' },
        { nom: 'Services Financiers', poids: 25, description: 'UBS, Credit Suisse, Swiss Re' },
        { nom: 'Biens de Consommation', poids: 20, description: 'Nestlé, Richemont' },
        { nom: 'Industrie', poids: 12, description: 'ABB, Schindler' },
        { nom: 'Technologie', poids: 8, description: 'Logitech, Temenos' }
      ]
    };
  }

  static getRiskToleranceQuestions(): {
    question: string;
    responses: { text: string; score: number }[];
  }[] {
    return [
      {
        question: "Si votre portefeuille perdait 20% en un mois, que feriez-vous ?",
        responses: [
          { text: "Je vendrais tout immédiatement", score: 1 },
          { text: "Je réduirais mes positions", score: 2 },
          { text: "Je ne changerais rien", score: 3 },
          { text: "J'investirais davantage pour profiter des prix bas", score: 4 }
        ]
      },
      {
        question: "Quel est votre objectif principal d'investissement ?",
        responses: [
          { text: "Préserver mon capital", score: 1 },
          { text: "Générer des revenus réguliers", score: 2 },
          { text: "Croissance modérée du capital", score: 3 },
          { text: "Croissance maximale du capital", score: 4 }
        ]
      },
      {
        question: "Quelle est votre réaction face à la volatilité des marchés ?",
        responses: [
          { text: "Je suis très anxieux et vérifie souvent", score: 1 },
          { text: "Je suis préoccupé mais reste investi", score: 2 },
          { text: "Je comprends que c'est normal", score: 3 },
          { text: "J'y vois des opportunités", score: 4 }
        ]
      }
    ];
  }

  static getESGCriteria(): {
    environnement: string[];
    social: string[];
    gouvernance: string[];
  } {
    return {
      environnement: [
        'Réduction des émissions carbone',
        'Énergies renouvelables',
        'Gestion durable des ressources',
        'Économie circulaire'
      ],
      social: [
        'Conditions de travail équitables',
        'Diversité et inclusion',
        'Impact communautaire positif',
        'Respect des droits humains'
      ],
      gouvernance: [
        'Transparence et éthique',
        'Indépendance du conseil',
        'Rémunération équitable',
        'Lutte contre la corruption'
      ]
    };
  }
}