export interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  canton: Canton;
  situationFamiliale: 'celibataire' | 'marie' | 'divorce' | 'veuf' | 'concubinage';
  nombreEnfants: number;
  profession: string;
  employeur?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialProfile {
  userId: string;
  // Revenus
  revenuBrutAnnuel: number;
  autresRevenus: number;
  revenuConjoint?: number;
  
  // Patrimoine
  liquidites: number;
  compteEpargne: number;
  investissements: number;
  immobilierPrincipal?: number;
  immobilierLocatif?: number;
  troisièmePilier: number;
  deuxièmePilier: number;
  autresActifs: number;
  
  // Dettes
  hypothèque?: number;
  pretsPersonnels: number;
  carteCredit: number;
  autresDettes: number;
  
  // Charges mensuelles
  loyerOuHypotheque: number;
  assurancesObligatoires: number;
  assurancesComplementaires: number;
  impots: number;
  chargesVie: number;
  autresCharges: number;
  
  // Profil risque
  toleranceRisque: 'conservateur' | 'modere' | 'dynamique' | 'agressif';
  experienceInvestissement: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  horizonPlacement: number;
  
  updatedAt: Date;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  titre: string;
  description: string;
  type: 'epargne' | 'immobilier' | 'retraite' | 'investissement' | 'education' | 'voyage' | 'autre';
  montantCible: number;
  montantActuel: number;
  dateEcheance: Date;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  status: 'actif' | 'atteint' | 'suspendu' | 'abandonne';
  
  // Configuration
  versementMensuelPlan: number;
  tauxRendementEstime: number;
  strategieRecommandee?: string;
  
  // Suivi
  progressionPourcentage: number;
  derniereContribution?: Date;
  prochaineMileStone?: Date;
  
  // Notifications
  rappelsActifs: boolean;
  frequenceRappel?: 'hebdomadaire' | 'mensuel' | 'trimestriel';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  userId: string;
  montant: number;
  type: 'contribution' | 'retrait' | 'rendement' | 'ajustement';
  description?: string;
  dateTransaction: Date;
  soldeApres: number;
}

export interface UserInsight {
  id: string;
  userId: string;
  type: 'recommendation' | 'alerte' | 'opportunite' | 'analyse';
  titre: string;
  message: string;
  priorite: 'info' | 'warning' | 'urgent';
  actionRecommandee?: string;
  actionUrl?: string;
  lu: boolean;
  dateGeneration: Date;
  dateExpiration?: Date;
}

export interface UserAction {
  id: string;
  userId: string;
  type: 'simulation' | 'objectif_cree' | 'contribution' | 'consultation_chatbot' | 'modification_profil';
  details: Record<string, any>;
  dateAction: Date;
  resultat?: string;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  rappelsObjectifs: boolean;
  frequenceRapports: 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'jamais';
  alertesOpportunites: boolean;
  alertesRisques: boolean;
}

export interface Canton {
  code: string;
  nom: string;
  tauxImposition: {
    revenu: number;
    fortune: number;
  };
}

export interface DashboardData {
  patrimoineNet: number;
  evolutionPatrimoine: Array<{date: Date; valeur: number}>;
  objectifsActifs: FinancialGoal[];
  prochainesToches: UserInsight[];
  dernièresActions: UserAction[];
  performanceObjectifs: {
    enCours: number;
    atteints: number;
    enRetard: number;
  };
}