import { UserProfile, Canton } from '@/types/user';
import { cantonalTaxData } from '@/lib/data/swiss-tax-data';

export interface Recommendation {
  id: string;
  type: 'urgent' | 'important' | 'suggestion' | 'info';
  category: 'impots' | 'prevoyance' | 'investissement' | 'immobilier' | 'budget' | 'assurance';
  titre: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
  montantPotentiel?: number;
  dateCreation: Date;
  lu: boolean;
}

export interface UserContext {
  profile: UserProfile;
  financialSnapshot: any;
  objectifs: any[];
  recommendations: Recommendation[];
  notifications: Notification[];
  historique: {
    simulations: SimulationResult[];
    transactions: Transaction[];
    documents: Document[];
  };
  insights: FinancialInsights;
}

export interface SimulationResult {
  id: string;
  type: 'impots' | 'immobilier' | 'retraite' | 'investissement';
  date: Date;
  parametres: any;
  resultats: any;
  recommandations: string[];
}

export interface Transaction {
  id: string;
  date: Date;
  montant: number;
  categorie: string;
  description: string;
}

export interface Document {
  id: string;
  nom: string;
  type: 'declaration_impots' | 'fiche_salaire' | 'contrat' | 'autre';
  date: Date;
  url?: string;
}

export interface FinancialInsights {
  tendances: {
    epargne: 'hausse' | 'stable' | 'baisse';
    depenses: 'hausse' | 'stable' | 'baisse';
    patrimoine: 'hausse' | 'stable' | 'baisse';
  };
  alertes: string[];
  opportunites: string[];
  comparaisonPairs: {
    position: 'au-dessus' | 'dans la moyenne' | 'en-dessous';
    percentile: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  titre: string;
  message: string;
  date: Date;
  lu: boolean;
}

export class UserContextService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }

  async buildFullContext(userId: string): Promise<UserContext> {
    try {
      const [profile, objectifs, simulations, recommendations] = await Promise.all([
        this.getUserProfile(userId),
        this.getObjectifs(userId),
        this.getRecentSimulations(userId),
        this.getRecommendations(userId)
      ]);
      
      const financialSnapshot = await this.calculateFinancialSnapshot(profile);
      const insights = await this.generateInsights(profile, financialSnapshot, simulations);
      const notifications = await this.getPendingNotifications(userId);
      
      return {
        profile,
        financialSnapshot,
        objectifs,
        recommendations,
        notifications,
        historique: {
          simulations,
          transactions: await this.getRecentTransactions(userId),
          documents: await this.getUserDocuments(userId)
        },
        insights
      };
    } catch (error) {
      console.error('Erreur lors de la construction du contexte:', error);
      throw new Error('Impossible de construire le contexte utilisateur');
    }
  }

  async calculateFinancialSnapshot(profile: UserProfile): Promise<any> {
    const revenusAnnuels = (profile as any).revenuBrutAnnuel || ((profile as any).revenuNetMensuel * 13);
    const chargesAnnuelles = (profile as any).chargesFixes * 12;
    
    const patrimoineTotal = 
      (profile as any).patrimoine?.cash +
      (profile as any).patrimoine?.investissements +
      (profile as any).patrimoine?.immobilier +
      (profile as any).patrimoine?.prevoyance?.pilier2?.capital +
      (profile as any).patrimoine?.prevoyance?.pilier3a?.capital +
      (profile as any).patrimoine?.prevoyance?.pilier3b?.capital;
    
    const patrimoineNet = patrimoineTotal - (profile as any).patrimoine?.dettes;
    
    const tauxImposition = await this.calculateTaxRate(profile);
    const tauxImpositionMarginal = await this.calculateMarginalTaxRate(profile);
    
    const capaciteEpargne = (profile as any).revenuNetMensuel - (profile as any).chargesFixes;
    const ratioEndettement = (profile as any).patrimoine?.dettes / revenusAnnuels;
    
    const scoreFinancier = this.calculateFinancialScore({
      capaciteEpargne,
      ratioEndettement,
      patrimoine: patrimoineNet,
      revenus: revenusAnnuels
    });
    
    const risqueProfile = this.evaluateRiskProfile(profile, scoreFinancier);
    
    return {
      tauxImposition,
      tauxImpositionMarginal,
      capaciteEpargne,
      scoreFinancier,
      risqueProfile,
      ratioEndettement,
      liquidites: (profile as any).patrimoine?.cash,
      patrimoineNet,
      revenusAnnuels,
      chargesAnnuelles
    };
  }

  private async calculateTaxRate(profile: UserProfile): Promise<number> {
    const taxData = cantonalTaxData[profile.canton];
    if (!taxData) return 15;
    
    const revenuImposable = profile.revenuBrutAnnuel * 0.85;
    
    if (profile.situationFamiliale === 'marie') {
      return taxData.baremesMaries.find(b => 
        revenuImposable >= b.de && revenuImposable < b.a
      )?.taux || taxData.tauxBase;
    } else {
      return taxData.baremesCelibataires.find(b => 
        revenuImposable >= b.de && revenuImposable < b.a
      )?.taux || taxData.tauxBase;
    }
  }

  private async calculateMarginalTaxRate(profile: UserProfile): Promise<number> {
    const revenuImposable = profile.revenuBrutAnnuel * 0.85;
    const taxData = cantonalTaxData[profile.canton];
    
    if (!taxData) return 25;
    
    const baremes = profile.situationFamiliale === 'marie' 
      ? taxData.baremesMaries 
      : taxData.baremesCelibataires;
    
    const tranche = baremes.findIndex(b => 
      revenuImposable >= b.de && revenuImposable < b.a
    );
    
    return baremes[Math.min(tranche + 1, baremes.length - 1)]?.taux || 30;
  }

  private calculateFinancialScore(data: {
    capaciteEpargne: number;
    ratioEndettement: number;
    patrimoine: number;
    revenus: number;
  }): number {
    let score = 50;
    
    if (data.capaciteEpargne > data.revenus * 0.2) score += 15;
    else if (data.capaciteEpargne > data.revenus * 0.1) score += 10;
    else if (data.capaciteEpargne > 0) score += 5;
    
    if (data.ratioEndettement < 0.3) score += 15;
    else if (data.ratioEndettement < 0.5) score += 10;
    else if (data.ratioEndettement < 0.7) score += 5;
    else score -= 10;
    
    if (data.patrimoine > data.revenus * 5) score += 20;
    else if (data.patrimoine > data.revenus * 3) score += 15;
    else if (data.patrimoine > data.revenus) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private evaluateRiskProfile(
    profile: UserProfile, 
    scoreFinancier: number
  ): 'conservateur' | 'modere' | 'dynamique' | 'agressif' {
    if (profile.age > 60 || scoreFinancier < 40) return 'conservateur';
    if (profile.age > 50 || scoreFinancier < 60) return 'modere';
    if (profile.age > 35 || scoreFinancier < 80) return 'dynamique';
    return 'agressif';
  }

  private async generateInsights(
    profile: UserProfile,
    snapshot: FinancialSnapshot,
    simulations: SimulationResult[]
  ): Promise<FinancialInsights> {
    const alertes: string[] = [];
    const opportunites: string[] = [];
    
    if (snapshot.capaciteEpargne < 0) {
      alertes.push('Votre capacité d\'épargne est négative. Revoyez votre budget.');
    }
    
    if (snapshot.ratioEndettement > 0.5) {
      alertes.push('Votre taux d\'endettement est élevé (>50%).');
    }
    
    const maxPilier3a = 7056;
    if (profile.patrimoine.prevoyance.pilier3a.versementAnnuel < maxPilier3a) {
      opportunites.push(`Vous pouvez encore verser ${maxPilier3a - profile.patrimoine.prevoyance.pilier3a.versementAnnuel} CHF dans votre 3e pilier cette année.`);
    }
    
    if (profile.age > 50 && profile.patrimoine.prevoyance.pilier2.capital < 300000) {
      opportunites.push('Envisagez un rachat dans votre 2e pilier pour optimiser vos impôts.');
    }
    
    return {
      tendances: {
        epargne: snapshot.capaciteEpargne > 500 ? 'hausse' : 'stable',
        depenses: 'stable',
        patrimoine: snapshot.patrimoineNet > 0 ? 'hausse' : 'baisse'
      },
      alertes,
      opportunites,
      comparaisonPairs: {
        position: snapshot.scoreFinancier > 70 ? 'au-dessus' : 
                  snapshot.scoreFinancier > 40 ? 'dans la moyenne' : 'en-dessous',
        percentile: Math.round(snapshot.scoreFinancier)
      }
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`/api/user/profile?userId=${userId}`);
    if (!response.ok) throw new Error('Profil utilisateur non trouvé');
    return response.json();
  }

  async getObjectifs(userId: string): Promise<Objectif[]> {
    const response = await fetch(`/api/objectifs?userId=${userId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getRecentSimulations(userId: string, limit: number = 10): Promise<SimulationResult[]> {
    const response = await fetch(`/api/simulations?userId=${userId}&limit=${limit}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getRecommendations(userId: string): Promise<Recommendation[]> {
    const response = await fetch(`/api/ai/recommendations?userId=${userId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getPendingNotifications(userId: string): Promise<Notification[]> {
    const response = await fetch(`/api/notifications?userId=${userId}&unread=true`);
    if (!response.ok) return [];
    return response.json();
  }

  async getRecentTransactions(userId: string, limit: number = 20): Promise<Transaction[]> {
    const response = await fetch(`/api/transactions?userId=${userId}&limit=${limit}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    const response = await fetch(`/api/documents?userId=${userId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async saveContext(context: UserContext): Promise<void> {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userContext', JSON.stringify(context));
    }
  }

  async getCachedContext(): Promise<UserContext | null> {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('userContext');
      if (cached) {
        return JSON.parse(cached);
      }
    }
    return null;
  }
}