import { FinancialGoal, GoalTransaction, UserInsight } from '@/types/user';

export class GoalsService {
  private static instance: GoalsService;
  private goals: Map<string, FinancialGoal> = new Map();
  private transactions: Map<string, GoalTransaction[]> = new Map();

  public static getInstance(): GoalsService {
    if (!GoalsService.instance) {
      GoalsService.instance = new GoalsService();
    }
    return GoalsService.instance;
  }

  // Gestion des objectifs
  async createGoal(userId: string, goalData: Omit<FinancialGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'progressionPourcentage'>): Promise<FinancialGoal> {
    const goal: FinancialGoal = {
      id: this.generateId(),
      userId,
      ...goalData,
      progressionPourcentage: (goalData.montantActuel / goalData.montantCible) * 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(goal.id, goal);
    this.transactions.set(goal.id, []);

    // Initialiser avec le montant actuel s'il existe
    if (goalData.montantActuel > 0) {
      await this.addTransaction(goal.id, {
        montant: goalData.montantActuel,
        type: 'contribution',
        description: 'Montant initial'
      });
    }

    return goal;
  }

  async getGoalsByUser(userId: string): Promise<FinancialGoal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getGoal(goalId: string): Promise<FinancialGoal | null> {
    return this.goals.get(goalId) || null;
  }

  async updateGoal(goalId: string, updates: Partial<FinancialGoal>): Promise<FinancialGoal | null> {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: new Date()
    };

    // Recalculer la progression
    updatedGoal.progressionPourcentage = (updatedGoal.montantActuel / updatedGoal.montantCible) * 100;

    this.goals.set(goalId, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(goalId: string): Promise<boolean> {
    const deleted = this.goals.delete(goalId);
    this.transactions.delete(goalId);
    return deleted;
  }

  // Gestion des transactions
  async addTransaction(goalId: string, transactionData: {
    montant: number;
    type: 'contribution' | 'retrait' | 'rendement' | 'ajustement';
    description?: string;
  }): Promise<GoalTransaction | null> {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const transactions = this.transactions.get(goalId) || [];
    const newBalance = goal.montantActuel + (
      transactionData.type === 'retrait' ? -transactionData.montant : transactionData.montant
    );

    const transaction: GoalTransaction = {
      id: this.generateId(),
      goalId,
      userId: goal.userId,
      ...transactionData,
      dateTransaction: new Date(),
      soldeApres: newBalance
    };

    transactions.push(transaction);
    this.transactions.set(goalId, transactions);

    // Mettre à jour l'objectif
    await this.updateGoal(goalId, {
      montantActuel: newBalance,
      derniereContribution: transactionData.type === 'contribution' ? new Date() : goal.derniereContribution
    });

    return transaction;
  }

  async getGoalTransactions(goalId: string): Promise<GoalTransaction[]> {
    return this.transactions.get(goalId) || [];
  }

  // Calculs et projections
  calculateTimeToGoal(goal: FinancialGoal): {
    monthsRemaining: number;
    isOnTrack: boolean;
    requiredMonthlyContribution: number;
    projectedCompletionDate: Date;
  } {
    const montantRestant = goal.montantCible - goal.montantActuel;
    const monthsToTarget = Math.ceil((goal.dateEcheance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    let requiredMonthlyContribution = 0;
    if (monthsToTarget > 0) {
      // Calcul avec rendement estimé
      const tauxMensuel = goal.tauxRendementEstime / 12 / 100;
      if (tauxMensuel > 0) {
        requiredMonthlyContribution = montantRestant * tauxMensuel / (Math.pow(1 + tauxMensuel, monthsToTarget) - 1);
      } else {
        requiredMonthlyContribution = montantRestant / monthsToTarget;
      }
    }

    const isOnTrack = goal.versementMensuelPlan >= requiredMonthlyContribution;
    
    // Projection avec versements actuels
    let projectedMonths = monthsToTarget;
    if (goal.versementMensuelPlan > 0) {
      const tauxMensuel = goal.tauxRendementEstime / 12 / 100;
      if (tauxMensuel > 0) {
        projectedMonths = Math.log(1 + (montantRestant * tauxMensuel) / goal.versementMensuelPlan) / Math.log(1 + tauxMensuel);
      } else {
        projectedMonths = montantRestant / goal.versementMensuelPlan;
      }
    }

    const projectedCompletionDate = new Date();
    projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + projectedMonths);

    return {
      monthsRemaining: monthsToTarget,
      isOnTrack,
      requiredMonthlyContribution: Math.max(0, requiredMonthlyContribution),
      projectedCompletionDate
    };
  }

  calculateGoalProgress(goal: FinancialGoal): {
    progressionPourcentage: number;
    montantRestant: number;
    tempsEcoule: number;
    tempsRestant: number;
    vitesseMoyenne: number;
  } {
    const progressionPourcentage = (goal.montantActuel / goal.montantCible) * 100;
    const montantRestant = goal.montantCible - goal.montantActuel;
    
    const maintenant = new Date();
    const dureeTotal = goal.dateEcheance.getTime() - goal.createdAt.getTime();
    const tempsEcoule = maintenant.getTime() - goal.createdAt.getTime();
    const tempsRestant = goal.dateEcheance.getTime() - maintenant.getTime();
    
    const vitesseMoyenne = tempsEcoule > 0 ? goal.montantActuel / (tempsEcoule / (1000 * 60 * 60 * 24 * 30)) : 0;

    return {
      progressionPourcentage,
      montantRestant,
      tempsEcoule: (tempsEcoule / dureeTotal) * 100,
      tempsRestant: Math.max(0, (tempsRestant / (1000 * 60 * 60 * 24))),
      vitesseMoyenne
    };
  }

  // Analyses et recommandations
  async generateGoalInsights(userId: string): Promise<UserInsight[]> {
    const goals = await this.getGoalsByUser(userId);
    const insights: UserInsight[] = [];

    for (const goal of goals) {
      if (goal.status !== 'actif') continue;

      const timeAnalysis = this.calculateTimeToGoal(goal);
      const progress = this.calculateGoalProgress(goal);

      // Objectif en retard
      if (!timeAnalysis.isOnTrack && goal.priorite !== 'basse') {
        insights.push({
          id: this.generateId(),
          userId,
          type: 'alerte',
          titre: `Objectif "${goal.titre}" en retard`,
          message: `Votre objectif nécessite ${timeAnalysis.requiredMonthlyContribution.toFixed(0)} CHF/mois au lieu de ${goal.versementMensuelPlan} CHF actuels.`,
          priorite: goal.priorite === 'critique' ? 'urgent' : 'warning',
          actionRecommandee: 'Augmenter les versements mensuels',
          actionUrl: `/objectifs/${goal.id}/edit`,
          lu: false,
          dateGeneration: new Date()
        });
      }

      // Objectif bientôt atteint
      if (progress.progressionPourcentage > 90) {
        insights.push({
          id: this.generateId(),
          userId,
          type: 'opportunite',
          titre: `Félicitations ! "${goal.titre}" bientôt atteint`,
          message: `Plus que ${(goal.montantCible - goal.montantActuel).toFixed(0)} CHF pour atteindre votre objectif !`,
          priorite: 'info',
          actionRecommandee: 'Planifier la suite',
          actionUrl: `/objectifs/${goal.id}`,
          lu: false,
          dateGeneration: new Date()
        });
      }

      // Pas de contribution récente
      if (goal.derniereContribution) {
        const daysSinceLastContribution = (new Date().getTime() - goal.derniereContribution.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastContribution > 60) {
          insights.push({
            id: this.generateId(),
            userId,
            type: 'recommendation',
            titre: `Aucune contribution récente pour "${goal.titre}"`,
            message: `Dernière contribution il y a ${Math.floor(daysSinceLastContribution)} jours. Reprenez vos versements pour rester sur la bonne voie.`,
            priorite: 'warning',
            actionRecommandee: 'Effectuer une contribution',
            actionUrl: `/objectifs/${goal.id}/contribute`,
            lu: false,
            dateGeneration: new Date()
          });
        }
      }

      // Optimisation fiscale pour objectifs retraite
      if (goal.type === 'retraite' && goal.montantActuel > 50000) {
        insights.push({
          id: this.generateId(),
          userId,
          type: 'opportunite',
          titre: 'Optimisation fiscale 3e pilier',
          message: `Avec ${goal.montantActuel.toFixed(0)} CHF d'épargne retraite, vous pourriez optimiser votre fiscalité via le 3e pilier.`,
          priorite: 'info',
          actionRecommandee: 'Consulter les options 3e pilier',
          actionUrl: '/simulateurs/retraite',
          lu: false,
          dateGeneration: new Date()
        });
      }
    }

    return insights;
  }

  // Stratégies recommandées
  getRecommendedStrategy(goal: FinancialGoal): string {
    const timeToGoal = this.calculateTimeToGoal(goal);
    const monthsRemaining = timeToGoal.monthsRemaining;

    if (goal.type === 'epargne' && monthsRemaining < 12) {
      return 'Compte épargne sécurisé avec liquidité immédiate';
    }

    if (goal.type === 'immobilier') {
      if (monthsRemaining < 24) {
        return 'Compte épargne 3a + obligations courtes pour sécurité';
      } else {
        return 'Mix ETF actions (40%) + obligations (60%) pour croissance modérée';
      }
    }

    if (goal.type === 'retraite') {
      if (monthsRemaining > 120) {
        return 'Stratégie agressive : 80% actions mondiales + 20% obligations';
      } else if (monthsRemaining > 60) {
        return 'Stratégie équilibrée : 60% actions + 40% obligations';
      } else {
        return 'Stratégie conservatrice : 30% actions + 70% obligations';
      }
    }

    if (goal.type === 'investissement') {
      return 'Portefeuille diversifié selon votre profil de risque';
    }

    return 'Stratégie mixte adaptée à votre horizon temporel';
  }

  // Simulation de scenarios
  simulateGoalScenarios(goal: FinancialGoal): {
    conservative: { finalAmount: number; completionDate: Date };
    moderate: { finalAmount: number; completionDate: Date };
    optimistic: { finalAmount: number; completionDate: Date };
  } {
    const monthsToTarget = Math.ceil((goal.dateEcheance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const scenarios = {
      conservative: { return: goal.tauxRendementEstime * 0.5, volatility: 0.1 },
      moderate: { return: goal.tauxRendementEstime, volatility: 0.15 },
      optimistic: { return: goal.tauxRendementEstime * 1.5, volatility: 0.25 }
    };

    const results: any = {};

    Object.entries(scenarios).forEach(([scenario, params]) => {
      const monthlyReturn = params.return / 12 / 100;
      let currentAmount = goal.montantActuel;
      let months = 0;

      // Simulation jusqu'à atteindre l'objectif ou la date limite
      while (currentAmount < goal.montantCible && months < monthsToTarget) {
        currentAmount += goal.versementMensuelPlan;
        currentAmount *= (1 + monthlyReturn);
        months++;
      }

      const completionDate = new Date();
      completionDate.setMonth(completionDate.getMonth() + months);

      results[scenario] = {
        finalAmount: currentAmount,
        completionDate
      };
    });

    return results;
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Sauvegarde et chargement (simulation localStorage)
  async saveToStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = {
        goals: Array.from(this.goals.entries()),
        transactions: Array.from(this.transactions.entries())
      };
      localStorage.setItem('aurore_goals', JSON.stringify(data));
    }
  }

  async loadFromStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('aurore_goals');
      if (data) {
        const parsed = JSON.parse(data);
        this.goals = new Map(parsed.goals);
        this.transactions = new Map(parsed.transactions);
      }
    }
  }

  // Méthodes de reporting
  async getGoalsReport(userId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    averageProgress: number;
    onTrackGoals: number;
  }> {
    const goals = await this.getGoalsByUser(userId);
    const activeGoals = goals.filter(g => g.status === 'actif');
    const completedGoals = goals.filter(g => g.status === 'atteint');
    
    const totalTargetAmount = goals.reduce((sum, g) => sum + g.montantCible, 0);
    const totalCurrentAmount = goals.reduce((sum, g) => sum + g.montantActuel, 0);
    const averageProgress = goals.length > 0 ? goals.reduce((sum, g) => sum + g.progressionPourcentage, 0) / goals.length : 0;
    
    const onTrackGoals = activeGoals.filter(goal => {
      const timeAnalysis = this.calculateTimeToGoal(goal);
      return timeAnalysis.isOnTrack;
    }).length;

    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      totalTargetAmount,
      totalCurrentAmount,
      averageProgress,
      onTrackGoals
    };
  }
}