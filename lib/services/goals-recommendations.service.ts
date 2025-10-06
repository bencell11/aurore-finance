import { UserProfile, FinancialGoal } from '@/types/user';

export interface GoalRecommendation {
  type: FinancialGoal['type'];
  titre: string;
  description: string;
  montantCible: number;
  montantSuggere: number;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  raisonnement: string;
  delaiMoisSuggere: number;
  versementMensuelSuggere: number;
  icon: string;
  tags: string[];
  difficulte: 'facile' | 'moyen' | 'difficile';
}

export interface FinancialInsight {
  type: 'info' | 'warning' | 'success' | 'danger';
  titre: string;
  message: string;
  action?: string;
  actionUrl?: string;
}

export interface BudgetAnalysis {
  revenuNetMensuel: number;
  capaciteEpargneMensuelle: number;
  tauxEpargne: number;
  depensesEstimees: number;
  chargesFixesEstimees: number;
  margeSecurite: number;
}

export class GoalsRecommendationsService {
  private static instance: GoalsRecommendationsService;

  public static getInstance(): GoalsRecommendationsService {
    if (!GoalsRecommendationsService.instance) {
      GoalsRecommendationsService.instance = new GoalsRecommendationsService();
    }
    return GoalsRecommendationsService.instance;
  }

  /**
   * Analyse le budget de l'utilisateur
   */
  analyzeBudget(profile: UserProfile): BudgetAnalysis {
    const revenuNetMensuel = profile.revenuNetMensuel || 0;

    // Estimer les charges fixes (30-40% du revenu)
    const chargesFixesEstimees = revenuNetMensuel * 0.35;

    // Estimer les dépenses courantes (30-40% du revenu)
    const depensesEstimees = revenuNetMensuel * 0.35;

    // Marge de sécurité (10%)
    const margeSecurite = revenuNetMensuel * 0.1;

    // Capacité d'épargne = Revenu - Charges - Dépenses - Marge
    const capaciteEpargneMensuelle = Math.max(0,
      revenuNetMensuel - chargesFixesEstimees - depensesEstimees - margeSecurite
    );

    const tauxEpargne = revenuNetMensuel > 0
      ? (capaciteEpargneMensuelle / revenuNetMensuel) * 100
      : 0;

    return {
      revenuNetMensuel,
      capaciteEpargneMensuelle,
      tauxEpargne,
      depensesEstimees,
      chargesFixesEstimees,
      margeSecurite
    };
  }

  /**
   * Génère des recommandations d'objectifs personnalisées
   */
  generateRecommendations(profile: UserProfile, existingGoals: FinancialGoal[]): GoalRecommendation[] {
    const recommendations: GoalRecommendation[] = [];
    const budget = this.analyzeBudget(profile);
    const age = this.calculateAge(profile.dateNaissance);

    // 1. Fonds d'urgence (prioritaire si pas existant)
    if (!existingGoals.some(g => g.type === 'epargne' && g.titre.toLowerCase().includes('urgence'))) {
      const montantCible = profile.revenuNetMensuel * 6; // 6 mois de dépenses
      recommendations.push({
        type: 'epargne',
        titre: 'Fonds d\'urgence',
        description: 'Constituer une réserve de sécurité équivalente à 6 mois de revenus pour faire face aux imprévus.',
        montantCible,
        montantSuggere: montantCible,
        priorite: 'critique',
        raisonnement: 'Un fonds d\'urgence est essentiel pour votre sécurité financière. Il vous protège contre les imprévus (perte d\'emploi, urgences médicales, réparations).',
        delaiMoisSuggere: 12,
        versementMensuelSuggere: Math.min(montantCible / 12, budget.capaciteEpargneMensuelle * 0.5),
        icon: 'Shield',
        tags: ['Sécurité', 'Prioritaire', 'Court terme'],
        difficulte: 'moyen'
      });
    }

    // 2. 3e pilier (si salarié et pas de 3e pilier actif)
    if (profile.statutProfessionnel === 'salarie' &&
        !existingGoals.some(g => g.type === 'retraite' && g.titre.toLowerCase().includes('pilier'))) {
      const montantAnnuelMax = 7056; // Maximum 2024
      recommendations.push({
        type: 'retraite',
        titre: '3e pilier A - Prévoyance',
        description: 'Maximiser vos versements au 3e pilier pour optimiser votre retraite et réduire vos impôts.',
        montantCible: montantAnnuelMax,
        montantSuggere: Math.min(montantAnnuelMax, budget.capaciteEpargneMensuelle * 12),
        priorite: 'haute',
        raisonnement: `Le 3e pilier A vous permet de déduire jusqu'à CHF ${montantAnnuelMax} de vos impôts chaque année, tout en constituant votre retraite.`,
        delaiMoisSuggere: 12,
        versementMensuelSuggere: Math.min(588, budget.capaciteEpargneMensuelle * 0.3),
        icon: 'PiggyBank',
        tags: ['Fiscal', 'Retraite', 'Récurrent'],
        difficulte: 'facile'
      });
    }

    // 3. Achat immobilier (si jeune et pas de patrimoine immobilier)
    if (age < 45 && profile.patrimoine.immobilier === 0) {
      const fondsPropresSuggeres = 100000; // 20% de 500k
      recommendations.push({
        type: 'immobilier',
        titre: 'Fonds propres résidence principale',
        description: 'Constituer les fonds propres nécessaires (20%) pour l\'achat de votre résidence principale.',
        montantCible: fondsPropresSuggeres,
        montantSuggere: fondsPropresSuggeres,
        priorite: 'haute',
        raisonnement: 'Devenir propriétaire est un objectif majeur de constitution de patrimoine en Suisse.',
        delaiMoisSuggere: 60, // 5 ans
        versementMensuelSuggere: Math.min(fondsPropresSuggeres / 60, budget.capaciteEpargneMensuelle * 0.4),
        icon: 'Home',
        tags: ['Patrimoine', 'Long terme', 'Investissement'],
        difficulte: 'difficile'
      });
    }

    // 4. Investissements diversifiés (si capacité d'épargne élevée)
    if (budget.capaciteEpargneMensuelle > 1000 &&
        !existingGoals.some(g => g.type === 'investissement')) {
      const montantCible = 50000;
      recommendations.push({
        type: 'investissement',
        titre: 'Portfolio d\'investissement diversifié',
        description: 'Constituer un portefeuille d\'actions, ETF et obligations pour faire fructifier votre épargne.',
        montantCible,
        montantSuggere: montantCible,
        priorite: 'moyenne',
        raisonnement: 'Avec votre capacité d\'épargne actuelle, investir vous permettra de générer des rendements supérieurs à l\'épargne classique.',
        delaiMoisSuggere: 36,
        versementMensuelSuggere: Math.min(1400, budget.capaciteEpargneMensuelle * 0.3),
        icon: 'TrendingUp',
        tags: ['Rendement', 'Croissance', 'Moyen terme'],
        difficulte: 'moyen'
      });
    }

    // 5. Formation continue (si salarié)
    if (profile.statutProfessionnel === 'salarie') {
      recommendations.push({
        type: 'education',
        titre: 'Formation continue professionnelle',
        description: 'Investir dans votre développement professionnel pour augmenter votre valeur sur le marché.',
        montantCible: 15000,
        montantSuggere: 15000,
        priorite: 'moyenne',
        raisonnement: 'La formation continue est déductible fiscalement et augmente votre potentiel de revenus futurs.',
        delaiMoisSuggere: 24,
        versementMensuelSuggere: Math.min(625, budget.capaciteEpargneMensuelle * 0.2),
        icon: 'GraduationCap',
        tags: ['Carrière', 'Fiscal', 'Investissement personnel'],
        difficulte: 'facile'
      });
    }

    // 6. Vacances / Loisirs (qualité de vie)
    if (budget.capaciteEpargneMensuelle > 500) {
      recommendations.push({
        type: 'voyage',
        titre: 'Projet vacances annuelles',
        description: 'Épargner pour des vacances de qualité et maintenir un bon équilibre vie professionnelle/personnelle.',
        montantCible: 8000,
        montantSuggere: 8000,
        priorite: 'basse',
        raisonnement: 'Maintenir un équilibre entre épargne et qualité de vie est important pour votre bien-être.',
        delaiMoisSuggere: 12,
        versementMensuelSuggere: Math.min(667, budget.capaciteEpargneMensuelle * 0.15),
        icon: 'Plane',
        tags: ['Bien-être', 'Court terme', 'Loisirs'],
        difficulte: 'facile'
      });
    }

    // Trier par priorité
    const priorityOrder = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
    return recommendations.sort((a, b) =>
      priorityOrder[a.priorite] - priorityOrder[b.priorite]
    );
  }

  /**
   * Génère des insights financiers personnalisés
   */
  generateInsights(profile: UserProfile, goals: FinancialGoal[]): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    const budget = this.analyzeBudget(profile);
    const activeGoals = goals.filter(g => g.status === 'actif');
    const totalMonthlyCommitments = activeGoals.reduce((sum, g) => sum + g.versementMensuelPlan, 0);

    // Insight 1: Capacité d'épargne
    if (budget.tauxEpargne < 10) {
      insights.push({
        type: 'warning',
        titre: 'Taux d\'épargne faible',
        message: `Votre taux d'épargne est de ${budget.tauxEpargne.toFixed(1)}%. Il est recommandé d'épargner au moins 10-20% de vos revenus.`,
        action: 'Optimiser mon budget',
        actionUrl: '/profil'
      });
    } else if (budget.tauxEpargne > 30) {
      insights.push({
        type: 'success',
        titre: 'Excellent taux d\'épargne',
        message: `Félicitations ! Votre taux d'épargne de ${budget.tauxEpargne.toFixed(1)}% est excellent. Vous êtes sur la bonne voie !`,
      });
    }

    // Insight 2: Surengagement
    if (totalMonthlyCommitments > budget.capaciteEpargneMensuelle) {
      insights.push({
        type: 'danger',
        titre: 'Objectifs trop ambitieux',
        message: `Vos engagements mensuels (${this.formatCurrency(totalMonthlyCommitments)}) dépassent votre capacité d'épargne (${this.formatCurrency(budget.capaciteEpargneMensuelle)}). Ajustez vos objectifs.`,
        action: 'Revoir mes objectifs',
        actionUrl: '/objectifs'
      });
    }

    // Insight 3: 3e pilier
    const has3rdPillar = goals.some(g => g.type === 'retraite' && g.titre.toLowerCase().includes('pilier'));
    if (!has3rdPillar && profile.revenuNetMensuel > 4000) {
      insights.push({
        type: 'info',
        titre: '3e pilier non utilisé',
        message: 'Vous ne profitez pas des avantages fiscaux du 3e pilier. Économisez jusqu\'à CHF 2,500 d\'impôts par an !',
        action: 'Découvrir le 3e pilier',
        actionUrl: '/education-fiscale/articles/troisieme-pilier'
      });
    }

    // Insight 4: Fonds d'urgence
    const hasEmergencyFund = goals.some(g =>
      g.type === 'epargne' && g.titre.toLowerCase().includes('urgence')
    );
    if (!hasEmergencyFund) {
      insights.push({
        type: 'warning',
        titre: 'Pas de fonds d\'urgence',
        message: 'Un fonds d\'urgence de 3-6 mois de revenus est essentiel pour votre sécurité financière.',
        action: 'Créer un fonds d\'urgence',
        actionUrl: '/objectifs'
      });
    }

    // Insight 5: Diversification
    const goalTypes = new Set(activeGoals.map(g => g.type));
    if (goalTypes.size === 1 && activeGoals.length > 1) {
      insights.push({
        type: 'info',
        titre: 'Diversifiez vos objectifs',
        message: 'Avoir des objectifs variés (épargne, investissement, retraite) permet une meilleure gestion de votre patrimoine.',
      });
    }

    return insights;
  }

  /**
   * Calcule l'âge à partir de la date de naissance
   */
  private calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Formate un montant en CHF
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Évalue la faisabilité d'un objectif
   */
  evaluateGoalFeasibility(
    goal: Partial<FinancialGoal>,
    profile: UserProfile
  ): {
    feasible: boolean;
    score: number; // 0-100
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const budget = this.analyzeBudget(profile);

    const montantCible = goal.montantCible || 0;
    const delaiMois = goal.dateEcheance
      ? Math.ceil((new Date(goal.dateEcheance).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
      : 12;

    const versementMensuelRequis = montantCible / delaiMois;
    const pourcentageCapacite = (versementMensuelRequis / budget.capaciteEpargneMensuelle) * 100;

    let score = 100;

    // Vérification 1: Versement vs capacité
    if (versementMensuelRequis > budget.capaciteEpargneMensuelle) {
      score -= 40;
      warnings.push('Le versement mensuel requis dépasse votre capacité d\'épargne actuelle');
      suggestions.push('Augmentez la durée de l\'objectif ou réduisez le montant cible');
    } else if (pourcentageCapacite > 70) {
      score -= 20;
      warnings.push('L\'objectif mobilise plus de 70% de votre capacité d\'épargne');
      suggestions.push('Laissez une marge pour les imprévus');
    } else if (pourcentageCapacite > 50) {
      score -= 10;
    }

    // Vérification 2: Durée
    if (delaiMois < 6) {
      score -= 15;
      warnings.push('L\'échéance est très proche (moins de 6 mois)');
      suggestions.push('Envisagez une période plus longue pour plus de flexibilité');
    }

    // Vérification 3: Priorités
    if (goal.priorite === 'critique' && pourcentageCapacite < 30) {
      suggestions.push('Objectif prioritaire: augmentez les versements mensuels si possible');
    }

    const feasible = score >= 50;

    return {
      feasible,
      score: Math.max(0, Math.min(100, score)),
      warnings,
      suggestions
    };
  }
}
