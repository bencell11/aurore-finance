import { UserProfile, FinancialProfile, DashboardData, UserAction, UserInsight, NotificationSettings } from '@/types/user';
import { GoalsService } from './goals.service';

export class UserProfileService {
  private static instance: UserProfileService;
  private userProfiles: Map<string, UserProfile> = new Map();
  private financialProfiles: Map<string, FinancialProfile> = new Map();
  private userActions: Map<string, UserAction[]> = new Map();
  private notificationSettings: Map<string, NotificationSettings> = new Map();
  private goalsService: GoalsService;

  private constructor() {
    this.goalsService = GoalsService.getInstance();
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  // Gestion du profil utilisateur
  async createUserProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: this.generateId(),
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userProfiles.set(profile.id, profile);

    // Créer les paramètres de notification par défaut
    const defaultNotificationSettings: NotificationSettings = {
      userId: profile.id,
      emailNotifications: true,
      pushNotifications: false,
      rappelsObjectifs: true,
      frequenceRapports: 'mensuel',
      alertesOpportunites: true,
      alertesRisques: true
    };

    this.notificationSettings.set(profile.id, defaultNotificationSettings);
    this.userActions.set(profile.id, []);

    await this.logUserAction(profile.id, {
      type: 'modification_profil',
      details: { action: 'creation_profil' },
      resultat: 'success'
    });

    // Sauvegarder automatiquement dans localStorage
    await this.saveToStorage();

    return profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date()
    };

    this.userProfiles.set(userId, updatedProfile);

    await this.logUserAction(userId, {
      type: 'modification_profil',
      details: { changedFields: Object.keys(updates) },
      resultat: 'success'
    });

    // Sauvegarder automatiquement dans localStorage
    await this.saveToStorage();

    return updatedProfile;
  }

  // Gestion du profil financier
  async createOrUpdateFinancialProfile(userId: string, financialData: Omit<FinancialProfile, 'userId' | 'updatedAt'>): Promise<FinancialProfile> {
    const financialProfile: FinancialProfile = {
      userId,
      ...financialData,
      updatedAt: new Date()
    };

    this.financialProfiles.set(userId, financialProfile);

    await this.logUserAction(userId, {
      type: 'modification_profil',
      details: {
        action: 'mise_a_jour_profil_financier',
        patrimoine_net: this.calculateNetWorth(financialProfile)
      },
      resultat: 'success'
    });

    // Sauvegarder automatiquement dans localStorage
    await this.saveToStorage();

    return financialProfile;
  }

  async getFinancialProfile(userId: string): Promise<FinancialProfile | null> {
    return this.financialProfiles.get(userId) || null;
  }

  // Calculs financiers
  calculateNetWorth(profile: FinancialProfile): number {
    const assets = profile.liquidites + 
                   profile.compteEpargne + 
                   profile.investissements + 
                   (profile.immobilierPrincipal || 0) + 
                   (profile.immobilierLocatif || 0) + 
                   profile.troisièmePilier + 
                   profile.deuxièmePilier + 
                   profile.autresActifs;

    const liabilities = (profile.hypothèque || 0) + 
                       profile.pretsPersonnels + 
                       profile.carteCredit + 
                       profile.autresDettes;

    return assets - liabilities;
  }

  calculateMonthlyNetIncome(profile: FinancialProfile): number {
    const monthlyGrossIncome = (profile.revenuBrutAnnuel + profile.autresRevenus + (profile.revenuConjoint || 0)) / 12;
    const monthlyExpenses = profile.loyerOuHypotheque + 
                           profile.assurancesObligatoires + 
                           profile.assurancesComplementaires + 
                           profile.impots + 
                           profile.chargesVie + 
                           profile.autresCharges;

    return monthlyGrossIncome - monthlyExpenses;
  }

  calculateSavingsRate(profile: FinancialProfile): number {
    const monthlyIncome = (profile.revenuBrutAnnuel + profile.autresRevenus + (profile.revenuConjoint || 0)) / 12;
    const monthlyNetIncome = this.calculateMonthlyNetIncome(profile);
    
    return monthlyIncome > 0 ? (monthlyNetIncome / monthlyIncome) * 100 : 0;
  }

  // Dashboard et analytics
  async getDashboardData(userId: string): Promise<DashboardData | null> {
    // Charger les données depuis le stockage
    await this.loadFromStorage();
    await this.goalsService.loadFromStorage();
    
    const userProfile = await this.getUserProfile(userId);
    const financialProfile = await this.getFinancialProfile(userId);
    
    if (!userProfile || !financialProfile) {
      // Créer des données par défaut si pas de profil financier
      return this.generateDefaultDashboardData(userId);
    }

    const patrimoineNet = this.calculateNetWorth(financialProfile);
    const objectifsActifs = await this.goalsService.getGoalsByUser(userId);
    const prochainesToches = await this.goalsService.generateGoalInsights(userId);
    const dernièresActions = this.userActions.get(userId)?.slice(-10) || [];
    
    // Simulation évolution patrimoine (données de démonstration)
    const evolutionPatrimoine = this.generateWealthEvolution(patrimoineNet);
    
    // Calcul performance objectifs
    const goalsReport = await this.goalsService.getGoalsReport(userId);
    const performanceObjectifs = {
      enCours: goalsReport.activeGoals,
      atteints: goalsReport.completedGoals,
      enRetard: goalsReport.activeGoals - goalsReport.onTrackGoals
    };

    return {
      patrimoineNet,
      evolutionPatrimoine,
      objectifsActifs: objectifsActifs.filter(g => g.status === 'actif').slice(0, 5),
      prochainesToches: prochainesToches.slice(0, 5),
      dernièresActions,
      performanceObjectifs
    };
  }

  // Génération de données dashboard par défaut
  private async generateDefaultDashboardData(userId: string): Promise<DashboardData> {
    const objectifsActifs = await this.goalsService.getGoalsByUser(userId);
    const prochainesToches = await this.goalsService.generateGoalInsights(userId);
    
    return {
      patrimoineNet: 0,
      objectifsActifs,
      evolutionPatrimoine: [
        { date: new Date(), valeur: 0 }
      ],
      performanceObjectifs: {
        enCours: objectifsActifs.filter(g => g.status === 'actif').length,
        atteints: objectifsActifs.filter(g => g.status === 'atteint').length,
        enRetard: objectifsActifs.filter(g => {
          const today = new Date();
          return g.status === 'actif' && new Date(g.dateEcheance) < today;
        }).length
      },
      prochainesToches: prochainesToches.slice(0, 5),
      dernièresActions: []
    };
  }

  // Analyse et recommandations
  async generateFinancialInsights(userId: string): Promise<UserInsight[]> {
    await this.loadFromStorage();
    
    const financialProfile = await this.getFinancialProfile(userId);
    if (!financialProfile) return [];

    const insights: UserInsight[] = [];
    const savingsRate = this.calculateSavingsRate(financialProfile);
    const netWorth = this.calculateNetWorth(financialProfile);
    const monthlyNetIncome = this.calculateMonthlyNetIncome(financialProfile);

    // Taux d'épargne faible
    if (savingsRate < 10) {
      insights.push({
        id: this.generateId(),
        userId,
        type: 'recommendation',
        titre: 'Taux d\'épargne à améliorer',
        message: `Votre taux d'épargne actuel est de ${savingsRate.toFixed(1)}%. L'idéal serait d'atteindre 20% minimum.`,
        priorite: 'warning',
        actionRecommandee: 'Analyser vos dépenses',
        actionUrl: '/profil/finances',
        lu: false,
        dateGeneration: new Date()
      });
    }

    // Patrimoine faible par rapport à l'âge
    const userProfile = await this.getUserProfile(userId);
    if (userProfile) {
      const age = new Date().getFullYear() - userProfile.dateNaissance.getFullYear();
      const targetNetWorth = financialProfile.revenuBrutAnnuel * (age / 10);
      
      if (netWorth < targetNetWorth * 0.5) {
        insights.push({
          id: this.generateId(),
          userId,
          type: 'alerte',
          titre: 'Patrimoine en retard pour votre âge',
          message: `À ${age} ans, votre patrimoine devrait idéalement être proche de ${targetNetWorth.toFixed(0)} CHF.`,
          priorite: 'warning',
          actionRecommandee: 'Planifier votre épargne',
          actionUrl: '/objectifs/create',
          lu: false,
          dateGeneration: new Date()
        });
      }
    }

    // Liquidités excessives
    if (financialProfile.liquidites > monthlyNetIncome * 6 && financialProfile.liquidites > 50000) {
      insights.push({
        id: this.generateId(),
        userId,
        type: 'opportunite',
        titre: 'Liquidités importantes non investies',
        message: `Vous avez ${financialProfile.liquidites.toFixed(0)} CHF en liquidités. Considérez des investissements pour faire fructifier cette somme.`,
        priorite: 'info',
        actionRecommandee: 'Explorer les options d\'investissement',
        actionUrl: '/simulateurs/investissement',
        lu: false,
        dateGeneration: new Date()
      });
    }

    // Endettement élevé
    const totalDebt = (financialProfile.hypothèque || 0) + financialProfile.pretsPersonnels + 
                     financialProfile.carteCredit + financialProfile.autresDettes;
    const debtToIncomeRatio = (totalDebt / financialProfile.revenuBrutAnnuel) * 100;
    
    if (debtToIncomeRatio > 500) { // Plus de 5x le revenu annuel
      insights.push({
        id: this.generateId(),
        userId,
        type: 'alerte',
        titre: 'Endettement élevé',
        message: `Votre endettement représente ${debtToIncomeRatio.toFixed(0)}% de vos revenus annuels. Considérez un plan de désendettement.`,
        priorite: 'urgent',
        actionRecommandee: 'Planifier le désendettement',
        actionUrl: '/conseil/desendettement',
        lu: false,
        dateGeneration: new Date()
      });
    }

    // 3e pilier sous-optimisé
    const maxThirdPillar = 7056; // Montant maximum 2024
    if (financialProfile.troisièmePilier < maxThirdPillar * 0.5) {
      insights.push({
        id: this.generateId(),
        userId,
        type: 'opportunite',
        titre: '3e pilier sous-optimisé',
        message: `Vous pourriez économiser jusqu'à ${(maxThirdPillar * 0.25).toFixed(0)} CHF d'impôts en optimisant votre 3e pilier.`,
        priorite: 'info',
        actionRecommandee: 'Optimiser le 3e pilier',
        actionUrl: '/simulateurs/retraite',
        lu: false,
        dateGeneration: new Date()
      });
    }

    return insights;
  }

  // Actions utilisateur
  async logUserAction(userId: string, actionData: Omit<UserAction, 'id' | 'userId' | 'dateAction'>): Promise<void> {
    const action: UserAction = {
      id: this.generateId(),
      userId,
      ...actionData,
      dateAction: new Date()
    };

    const actions = this.userActions.get(userId) || [];
    actions.push(action);
    
    // Garder seulement les 100 dernières actions
    if (actions.length > 100) {
      actions.splice(0, actions.length - 100);
    }
    
    this.userActions.set(userId, actions);
  }

  async getUserActions(userId: string, limit: number = 20): Promise<UserAction[]> {
    const actions = this.userActions.get(userId) || [];
    return actions.slice(-limit).reverse();
  }

  // Paramètres de notification
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings | null> {
    const currentSettings = this.notificationSettings.get(userId);
    if (!currentSettings) return null;

    const updatedSettings = {
      ...currentSettings,
      ...settings
    };

    this.notificationSettings.set(userId, updatedSettings);
    return updatedSettings;
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    return this.notificationSettings.get(userId) || null;
  }

  // Export de données pour le chatbot
  async exportUserDataForChatbot(userId: string): Promise<{
    profile: UserProfile | null;
    financial: FinancialProfile | null;
    goals: any;
    insights: UserInsight[];
    recentActions: UserAction[];
    summary: string;
  }> {
    const profile = await this.getUserProfile(userId);
    const financial = await this.getFinancialProfile(userId);
    const goals = await this.goalsService.getGoalsReport(userId);
    const insights = await this.generateFinancialInsights(userId);
    const recentActions = await this.getUserActions(userId, 10);

    // Générer un résumé textuel pour le chatbot
    let summary = `Utilisateur: ${profile?.prenom} ${profile?.nom}\n`;
    
    if (financial) {
      const netWorth = this.calculateNetWorth(financial);
      const savingsRate = this.calculateSavingsRate(financial);
      summary += `Patrimoine net: ${netWorth.toFixed(0)} CHF\n`;
      summary += `Revenu annuel: ${financial.revenuBrutAnnuel.toFixed(0)} CHF\n`;
      summary += `Taux d'épargne: ${savingsRate.toFixed(1)}%\n`;
      summary += `Profil de risque: ${financial.toleranceRisque}\n`;
    }

    summary += `Objectifs actifs: ${goals.activeGoals}\n`;
    summary += `Objectifs atteints: ${goals.completedGoals}\n`;
    
    if (insights.length > 0) {
      summary += `Points d'attention: ${insights.filter(i => i.priorite === 'warning' || i.priorite === 'urgent').length}\n`;
    }

    return {
      profile,
      financial,
      goals,
      insights,
      recentActions,
      summary
    };
  }

  // Utilitaires
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateWealthEvolution(currentWealth: number): Array<{date: Date; valeur: number}> {
    const evolution = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Simulation d'évolution avec croissance moyenne de 0.5% par mois
      const growthFactor = Math.pow(1.005, i) * (0.95 + Math.random() * 0.1);
      const valeur = currentWealth * growthFactor;
      
      evolution.push({ date, valeur });
    }

    return evolution;
  }

  // Sauvegarde et chargement
  async saveToStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = {
        userProfiles: Array.from(this.userProfiles.entries()),
        financialProfiles: Array.from(this.financialProfiles.entries()),
        userActions: Array.from(this.userActions.entries()),
        notificationSettings: Array.from(this.notificationSettings.entries())
      };
      localStorage.setItem('aurore_user_data', JSON.stringify(data));
    }
  }

  async loadFromStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('aurore_user_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.userProfiles = new Map(parsed.userProfiles || []);
        this.financialProfiles = new Map(parsed.financialProfiles || []);
        this.userActions = new Map(parsed.userActions || []);
        this.notificationSettings = new Map(parsed.notificationSettings || []);
      }
    }
  }
}