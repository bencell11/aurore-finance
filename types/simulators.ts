import { Canton, SituationFamiliale } from './user';

// Types communs aux simulateurs
export interface SimulationBase {
  id: string;
  userId: string;
  type: SimulationType;
  dateCreation: Date;
  parametres: Record<string, any>;
  resultats: Record<string, any>;
  nom?: string;
  description?: string;
}

export type SimulationType = 'impots' | 'immobilier' | 'retraite' | 'investissement';

// Simulateur d'impôts
export interface ImpotsParameters {
  revenuBrutAnnuel: number;
  revenuConjoint?: number;
  canton: Canton;
  commune: string;
  situationFamiliale: SituationFamiliale;
  nombreEnfants: number;
  agesEnfants?: number[];
  
  // Déductions
  fraisProfessionnels: number;
  fraisTransport: number;
  fraisRepas: number;
  fraisFormation: number;
  pilier3a: number;
  pilier3b: number;
  donsCharite: number;
  fraisMedicaux: number;
  primesAssuranceMaladie: number;
  
  // Avoirs
  fortunePrivee: number;
  immobilierPrincipal?: number;
  immobilierRendement?: number;
  dettes: number;
}

export interface ImpotsResults {
  revenuImposable: number;
  fortuneImposable: number;
  
  // Impôts calculés
  impotFederal: number;
  impotCantonal: number;
  impotCommunal: number;
  impotEglise?: number;
  totalImpots: number;
  
  // Détails par tranche
  tranchesFederales: TrancheImpot[];
  tranchesCantonales: TrancheImpot[];
  
  // Optimisation
  tauxMarginal: number;
  tauxMoyen: number;
  economiesPossibles: OptimisationSuggestion[];
  
  // Comparaisons
  chargeReelle: number; // %
  chargeMoyenneSuisse: number;
  positionRelative: 'favorable' | 'moyenne' | 'elevee';
}

export interface TrancheImpot {
  de: number;
  a: number;
  taux: number;
  montantTranche: number;
  impotTranche: number;
}

export interface OptimisationSuggestion {
  type: 'pilier3a' | 'fraisProfessionnels' | 'rachatPilier2' | 'etalement' | 'timing';
  titre: string;
  description: string;
  economieAnnuelle: number;
  actionRequise: string;
  priorite: 'haute' | 'moyenne' | 'basse';
}

// Simulateur immobilier
export interface ImmobilierParameters {
  // Bien immobilier
  prixAchat: number;
  typeLogement: 'appartement' | 'maison' | 'terrain';
  surfaceHabitable: number;
  anneeConstruction: number;
  etatLogement: 'neuf' | 'bon' | 'a_renover';
  canton: Canton;
  commune: string;
  
  // Situation financière
  revenuNetMensuel: number;
  revenuConjoint?: number;
  fondsPropresPrevus: number;
  liquiditesDisponibles: number;
  
  // Financement
  dureeHypotheque: number;
  tauxInteretSouhaite?: number;
  typeHypotheque: 'fixe' | 'variable' | 'saron';
  
  // Frais
  fraisNotaire: number;
  fraisCourtage: number;
  taxesTransfert: number;
  fraisRenovation?: number;
}

export interface ImmobilierResults {
  // Capacité d'achat
  capaciteAchatMax: number;
  prixAccessible: boolean;
  
  // Financement
  fondsPropresMini: number;
  fondsPropresPourcent: number;
  montantHypotheque: number;
  
  // Coûts hypothécaires
  chargesTheoretiques: number;
  chargesReelles: number;
  tauxChargeTheorique: number; // % du revenu
  limiteChargeRespectee: boolean;
  
  // Amortissement
  amortissementObligatoire: number;
  dureeAmortissement: number;
  
  // Coûts totaux
  fraisTotauxAchat: number;
  chargesMensuelles: number;
  chargesAnnuelles: number;
  
  // Comparaisons
  coutLocation: number;
  economieAchatVsLocation: number;
  
  // Recommandations
  recommandations: string[];
  risques: string[];
  opportunites: string[];
}

// Simulateur retraite
export interface RetraiteParameters {
  // Situation personnelle
  age: number;
  ageRetraitePrevu: number;
  revenuActuel: number;
  canton: Canton;
  situationFamiliale: SituationFamiliale;
  
  // 1er pilier (AVS)
  anneeCotisation: number;
  lacunesAVS: number;
  
  // 2e pilier (LPP)
  capitalPilier2Actuel: number;
  cotisationsMensuelles: number;
  salaireAssure: number;
  planPrevoyance: 'minimal' | 'enveloppant' | 'surobligatoire';
  
  // 3e pilier
  pilier3aActuel: number;
  versementAnnuel3a: number;
  pilier3bActuel: number;
  versementAnnuel3b: number;
  
  // Objectifs
  revenuSouhaiteRetraite: number; // % du revenu actuel
  heritagePrevu?: number;
  chargesFamiliales?: number;
}

export interface RetraiteResults {
  // Projections
  revenusRetraiteTotal: number;
  tauxRemplacementReel: number; // %
  lacuneFinanciere: number;
  
  // Détail par pilier
  pilier1Prevision: number;
  pilier2Prevision: number;
  pilier3aPrevision: number;
  pilier3bPrevision: number;
  
  // Recommandations
  versementOptimal3a: number;
  besoinEpargneSupplementaire: number;
  strategieOptimisation: OptimisationRetraite[];
  
  // Scénarios
  scenarios: {
    pessimiste: ScenarioRetraite;
    realiste: ScenarioRetraite;
    optimiste: ScenarioRetraite;
  };
  
  // Planification
  planEtapes: EtapeRetraite[];
  
  // Fiscalité
  impactsFiscaux: {
    economiesAnnuelles3a: number;
    impositionCapitalRetraite: number;
    stratergieOptimaleRetrait: string;
  };
}

export interface OptimisationRetraite {
  type: 'pilier3a' | 'rachatPilier2' | 'pilier3b' | 'immobilier' | 'investissement';
  titre: string;
  description: string;
  impactRevenusRetraite: number;
  coutAnnuel: number;
  priorite: 'haute' | 'moyenne' | 'basse';
  delaiRecommande: string;
}

export interface ScenarioRetraite {
  rendementAnnuel: number;
  tauxInflation: number;
  revenuTotal: number;
  pouvoirAchat: number;
}

export interface EtapeRetraite {
  age: number;
  action: string;
  montant?: number;
  objectif: string;
  impact: string;
}

// Simulateur d'investissement
export interface InvestissementParameters {
  // Profil investisseur
  montantInitial: number;
  versementMensuel: number;
  horizonPlacement: number; // années
  objectifPlacement: 'epargne' | 'retraite' | 'immobilier' | 'enfants' | 'autre';
  
  // Profil de risque
  experienceInvestissement: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  toleranceRisque: 'conservateur' | 'modere' | 'dynamique' | 'agressif';
  capaciteFinanciere: 'limitee' | 'moyenne' | 'elevee';
  
  // Préférences
  typesProduits: ('actions' | 'obligations' | 'immobilier' | 'matieresPremiere' | 'crypto')[];
  marchesGeographiques: ('suisse' | 'europe' | 'amerique' | 'asie' | 'emergents')[];
  
  // Contraintes
  liquiditeRequise: 'immediate' | 'flexible' | 'bloquee';
  preoccupationESG: boolean;
  fraisMaxAcceptes: number; // %
}

export interface InvestissementResults {
  // Projections
  capitalFinal: {
    conservateur: number;
    modere: number;
    dynamique: number;
  };
  
  rendementAttendu: {
    annuel: number;
    total: number;
  };
  
  // Allocations recommandées
  allocationOptimale: AllocationAsset[];
  
  // Produits suggérés
  produitsRecommandes: ProduitInvestissement[];
  
  // Risques et opportunités
  analyse: {
    volatilitePortefeuille: number;
    perteMaximaleEstimee: number;
    probabiliteObjectifAtteint: number;
  };
  
  // Fiscalité
  impactsFiscaux: {
    impotRevenuAnnuel: number;
    impotFortune: number;
    strategieOptimisation: string[];
  };
  
  // Recommandations
  conseil: {
    rebalancement: string;
    periodiciteRevision: string;
    signauxSortie: string[];
  };
}

export interface AllocationAsset {
  classe: 'actions' | 'obligations' | 'immobilier' | 'liquidites' | 'alternatifs';
  pourcentage: number;
  montant: number;
  justification: string;
}

export interface ProduitInvestissement {
  nom: string;
  type: 'ETF' | 'fonds' | 'action' | 'obligation' | 'REIT';
  isin?: string;
  fraisGestion: number;
  rendementHistorique: number;
  noteESG?: string;
  justification: string;
  allocationPourcentage: number;
}

// Types pour l'interface utilisateur
export interface SimulatorStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation?: ValidationRule[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'checkbox' | 'radio' | 'slider' | 'currency';
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  dependsOn?: string;
  showWhen?: any;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min' | 'max' | 'range' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any, allValues: any) => boolean;
}

export interface SimulatorProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  canProceed: boolean;
  canGoBack: boolean;
}

// Types pour les résultats et rapports
export interface SimulationReport {
  id: string;
  type: SimulationType;
  titre: string;
  dateGeneration: Date;
  parameters: any;
  results: any;
  resumeExecutif: string;
  sections: ReportSection[];
  graphiques: ChartData[];
  recommandations: string[];
  prochainesEtapes: string[];
}

export interface ReportSection {
  id: string;
  titre: string;
  contenu: string;
  tableaux?: TableData[];
  graphiques?: ChartData[];
  alertes?: Alert[];
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  titre: string;
  data: any[];
  options?: any;
}

export interface TableData {
  id: string;
  titre: string;
  headers: string[];
  rows: any[][];
  footer?: string[];
}

export interface Alert {
  type: 'info' | 'warning' | 'error' | 'success';
  titre: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
}