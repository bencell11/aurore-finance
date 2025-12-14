/**
 * Types pour la Maison des Finances
 * Architecture: Étage 0 → Étage 1 → Combles → Toiture
 */

// ============================================================================
// ÉTAGE 0: SÉCURITÉ (Fondations)
// ============================================================================

/**
 * Santé - Assurance maladie obligatoire et complémentaire
 */
export interface SanteData {
  // Assurance de base LAMAL
  assurance_lamal_nom: string;
  assurance_lamal_prime_mensuelle: number;
  assurance_lamal_franchise: number; // 300, 500, 1000, 1500, 2000, 2500
  assurance_lamal_modele: 'standard' | 'medecin_famille' | 'telmed' | 'hmo';
  assurance_lamal_couverture_accidents: boolean;
  assurance_lamal_document_url?: string; // Upload police d'assurance

  // Assurances complémentaires LCA
  assurance_lca_existe: boolean;
  assurance_lca_nom?: string;
  assurance_lca_prestations?: string[]; // Checkboxes: dentaire, médecine alternative, etc.
  assurance_lca_prime_mensuelle?: number;
  assurance_lca_document_url?: string;

  // État de santé général
  problemes_sante_chroniques: boolean;
  problemes_sante_details?: string;
  traitement_medicaux_reguliers: boolean;

  // Santé financière de cette section (0-100)
  sante_score?: number;
  sante_evaluation?: string;
  sante_recommandations?: string[];
}

/**
 * Revenu - Sources de revenus et taux d'activité
 */
export interface RevenuData {
  // Activité professionnelle
  statut_professionnel: 'salarie' | 'independant' | 'sans_emploi' | 'retraite' | 'etudiant';
  taux_activite: number; // 0-100% (slider)

  // Revenus salariés
  salaire_brut_mensuel?: number;
  salaire_net_mensuel?: number;
  13eme_salaire: boolean;
  primes_variables?: number; // Annuel

  // Revenus indépendants
  ca_annuel_independant?: number;
  charges_annuelles_independant?: number;
  benefice_net_independant?: number;

  // Autres revenus
  revenus_locatifs?: number; // Mensuel
  revenus_placements?: number; // Annuel
  autres_revenus?: number;
  autres_revenus_description?: string;

  // Conjoint
  situation_familiale: 'celibataire' | 'marie' | 'concubin' | 'divorce' | 'veuf';
  conjoint_revenus?: number; // Mensuel net

  // Personnes à charge
  nombre_enfants_charge: number;
  autres_personnes_charge: number;

  // Santé financière de cette section (0-100)
  revenu_score?: number;
  revenu_evaluation?: string;
  revenu_recommandations?: string[];
}

/**
 * Biens et Couverture - Protection des biens et RC
 */
export interface BiensData {
  // Responsabilité civile
  rc_privee_existe: boolean;
  rc_privee_nom?: string;
  rc_privee_montant_couverture?: number; // Ex: 5'000'000
  rc_privee_prime_annuelle?: number;
  rc_privee_document_url?: string;

  // Assurance ménage
  assurance_menage_existe: boolean;
  assurance_menage_nom?: string;
  assurance_menage_somme_assuree?: number;
  assurance_menage_prime_annuelle?: number;
  assurance_menage_document_url?: string;

  // Véhicules
  nombre_vehicules: number;
  vehicules?: {
    type: 'voiture' | 'moto' | 'scooter';
    marque: string;
    valeur_estimee: number;
    assurance_nom: string;
    assurance_type: 'rc_seule' | 'semi_casco' | 'casco_complete';
    prime_annuelle: number;
  }[];

  // Protection juridique
  protection_juridique_existe: boolean;
  protection_juridique_nom?: string;
  protection_juridique_domaines?: string[]; // Privé, circulation, travail, logement
  protection_juridique_prime_annuelle?: number;

  // Objets de valeur
  objets_valeur_existent: boolean;
  objets_valeur_liste?: {
    type: string;
    valeur: number;
    assure: boolean;
  }[];

  // Santé financière de cette section (0-100)
  biens_score?: number;
  biens_evaluation?: string;
  biens_recommandations?: string[];
}

// ============================================================================
// ÉTAGE 1: PLANIFICATION (Premier étage)
// ============================================================================

/**
 * Vieillesse - Prévoyance retraite (1er, 2e, 3e piliers)
 */
export interface VieillesseData {
  // 1er pilier (AVS)
  annees_cotisation_avs: number;
  lacunes_avs: boolean;
  montant_rente_avs_estimee?: number; // Mensuel

  // 2e pilier (LPP)
  lpp_existe: boolean;
  lpp_nom_caisse?: string;
  lpp_avoir_actuel?: number;
  lpp_cotisation_mensuelle_employee?: number;
  lpp_cotisation_mensuelle_employeur?: number;
  lpp_taux_conversion?: number; // Ex: 6.8%
  lpp_plan_prevoyance: 'minimal' | 'etendu' | 'cadre';
  lpp_certificat_url?: string; // Upload certificat LPP

  // Rachat LPP
  lpp_possibilite_rachat: boolean;
  lpp_montant_rachat_possible?: number;

  // 3e pilier A
  pilier3a_existe: boolean;
  pilier3a_montant_total?: number;
  pilier3a_nombre_comptes?: number;
  pilier3a_cotisation_annuelle?: number;
  pilier3a_institution?: string; // Banque ou assurance

  // 3e pilier B
  pilier3b_existe: boolean;
  pilier3b_type?: 'assurance_vie' | 'epargne_bancaire';
  pilier3b_montant_total?: number;

  // Prévoyance libre
  autres_placements_retraite?: number;

  // Projections
  age_actuel: number;
  age_retraite_souhaite: number;
  besoin_revenu_retraite_mensuel?: number;

  // Santé financière de cette section (0-100)
  vieillesse_score?: number;
  vieillesse_evaluation?: string;
  vieillesse_recommandations?: string[];
}

/**
 * Fortune - Patrimoine et placements
 */
export interface FortuneData {
  // Liquidités
  comptes_courants_total: number;
  comptes_epargne_total: number;

  // Placements bancaires
  comptes_titres_existe: boolean;
  comptes_titres_valeur?: number;
  comptes_titres_repartition?: {
    actions_suisses: number; // %
    actions_etrangeres: number;
    obligations: number;
    fonds: number;
    etf: number;
    autres: number;
  };

  // Cryptomonnaies
  crypto_existe: boolean;
  crypto_valeur?: number;
  crypto_types?: string[];

  // Métaux précieux
  metaux_precieux_existe: boolean;
  metaux_precieux_valeur?: number;

  // Autres actifs
  autres_actifs_existe: boolean;
  autres_actifs_description?: string;
  autres_actifs_valeur?: number;

  // Dettes
  credits_consommation_existe: boolean;
  credits_consommation_total?: number;
  credits_consommation_taux?: number;

  cartes_credit_solde?: number;

  autres_dettes_existe: boolean;
  autres_dettes_montant?: number;
  autres_dettes_description?: string;

  // Fortune nette calculée
  fortune_nette?: number;

  // Profil investisseur
  profil_risque?: 'defensif' | 'equilibre' | 'dynamique' | 'agressif';
  horizon_placement?: number; // années

  // Santé financière de cette section (0-100)
  fortune_score?: number;
  fortune_evaluation?: string;
  fortune_recommandations?: string[];
}

// ============================================================================
// COMBLES: DÉVELOPPEMENT (Deuxième étage)
// ============================================================================

/**
 * Immobilier - Propriété et projets immobiliers
 */
export interface ImmobilierData {
  // Situation actuelle
  statut_logement: 'proprietaire' | 'locataire' | 'loge_gratuitement';

  // Si locataire
  loyer_mensuel?: number;
  charges_mensuelles?: number;
  type_logement?: string;
  surface_m2?: number;

  // Si propriétaire
  proprietaire_residence_principale?: boolean;
  proprietaire_valeur_estimee?: number;
  proprietaire_annee_achat?: number;
  proprietaire_prix_achat?: number;

  // Hypothèque actuelle
  hypotheque_existe: boolean;
  hypotheque_montant_initial?: number;
  hypotheque_montant_restant?: number;
  hypotheque_taux_interet?: number;
  hypotheque_type?: 'fixe' | 'libor' | 'saron' | 'variable';
  hypotheque_duree_fixe?: number; // années
  hypotheque_echeance_fixe?: string; // Date
  hypotheque_amortissement_annuel?: number;
  hypotheque_document_url?: string; // Upload contrat hypothèque

  // Autres biens immobiliers
  autres_biens_existe: boolean;
  autres_biens?: {
    type: 'appartement' | 'maison' | 'terrain' | 'commercial';
    valeur: number;
    hypotheque_restante: number;
    revenus_locatifs_mensuels?: number;
  }[];

  // Projet d'achat
  projet_achat: boolean;
  projet_achat_budget?: number;
  projet_achat_fonds_propres_disponibles?: number;
  projet_achat_delai?: string; // "< 1 an", "1-3 ans", "3-5 ans", "> 5 ans"

  // Capacité d'emprunt calculée
  capacite_emprunt_maximale?: number;
  taux_endettement_actuel?: number; // %

  // Santé financière de cette section (0-100)
  immobilier_score?: number;
  immobilier_evaluation?: string;
  immobilier_recommandations?: string[];
}

/**
 * Budget - Revenus et dépenses détaillés
 */
export interface BudgetData {
  // Budget mensuel
  revenus_mensuels_nets_total: number;

  // Catégorie 1: Logement (25-35%)
  logement_loyer_hypotheque: number;
  logement_charges: number;
  logement_electricite: number;
  logement_chauffage: number;
  logement_eau: number;
  logement_internet_tv: number;
  logement_telephone: number;
  logement_entretien: number;
  logement_assurances: number;
  logement_total?: number;
  logement_pourcentage?: number;

  // Catégorie 2: Vie courante (15-25%)
  vie_alimentation: number;
  vie_restaurants: number;
  vie_vetements: number;
  vie_coiffeur_beaute: number;
  vie_loisirs_sorties: number;
  vie_sport_abonnements: number;
  vie_animaux: number;
  vie_divers: number;
  vie_total?: number;
  vie_pourcentage?: number;

  // Catégorie 3: Transports (5-15%)
  transport_voiture_leasing: number;
  transport_essence: number;
  transport_entretien_voiture: number;
  transport_parking: number;
  transport_transports_publics: number;
  transport_total?: number;
  transport_pourcentage?: number;

  // Catégorie 4: Santé & Assurances (10-20%)
  sante_lamal: number;
  sante_lca: number;
  sante_franchise_quote_part: number;
  sante_medicaments: number;
  sante_dentiste: number;
  sante_rc_menage: number;
  sante_protection_juridique: number;
  sante_autres_assurances: number;
  sante_total?: number;
  sante_pourcentage?: number;

  // Catégorie 5: Épargne & Prévoyance (10-20%)
  epargne_pilier3a: number;
  epargne_epargne_libre: number;
  epargne_placements: number;
  epargne_remboursement_dettes: number;
  epargne_total?: number;
  epargne_pourcentage?: number;

  // Totaux calculés
  depenses_mensuelles_total?: number;
  solde_mensuel?: number; // Revenus - Dépenses
  taux_epargne?: number; // %

  // Analyse
  categories_problematiques?: string[];

  // Santé financière de cette section (0-100)
  budget_score?: number;
  budget_evaluation?: string;
  budget_recommandations?: string[];
}

// ============================================================================
// TOITURE: OPTIMISATION (Toit)
// ============================================================================

/**
 * Fiscalité - Impôts et optimisation fiscale
 */
export interface FiscaliteData {
  // Situation fiscale
  canton_residence: string;
  commune_residence: string;
  statut_fiscal: 'celibataire' | 'marie_un_revenu' | 'marie_deux_revenus' | 'concubinage';

  // Calcul automatique depuis les autres données
  revenu_imposable_estime?: number;
  fortune_imposable_estimee?: number;

  // Déductions
  deductions_lpp_pilier3a?: number; // Auto-calculé
  deductions_interets_hypothecaires?: number; // Auto-calculé
  deductions_frais_garde_enfants?: number;
  deductions_frais_formation?: number;
  deductions_dons?: number;
  deductions_pension_alimentaire?: number;

  // Impôts estimés
  impots_federaux_estimes?: number;
  impots_cantonaux_estimes?: number;
  impots_communaux_estimes?: number;
  impots_total_annuel_estime?: number;

  // Taux d'imposition effectif
  taux_imposition_effectif?: number; // %

  // Opportunités d'optimisation
  optimisations_possibles?: {
    type: string;
    economie_estimee: number;
    description: string;
  }[];

  // Santé financière de cette section (0-100)
  fiscalite_score?: number;
  fiscalite_evaluation?: string;
  fiscalite_recommandations?: string[];
}

/**
 * Juridique - Protection juridique et documents importants
 */
export interface JuridiqueData {
  // Protection juridique
  protection_juridique_existe: boolean;
  protection_juridique_domaines?: string[];

  // Documents importants
  testament_existe: boolean;
  testament_date?: string;
  testament_chez_notaire: boolean;

  pacte_successoral_existe: boolean;
  pacte_successoral_date?: string;

  mandat_precautions_existe: boolean;
  mandat_precautions_date?: string;

  directives_anticipees_existent: boolean;
  directives_anticipees_date?: string;

  procuration_bancaire_existe: boolean;

  contrat_mariage_existe: boolean;
  regime_matrimonial?: 'separation_biens' | 'communaute_biens' | 'participation_acquets';

  // Dossier numérique
  documents_importants_centralises: boolean;
  personnes_confiance_informees: boolean;

  // Santé financière de cette section (0-100)
  juridique_score?: number;
  juridique_evaluation?: string;
  juridique_recommandations?: string[];
}

// ============================================================================
// MAISON COMPLÈTE
// ============================================================================

/**
 * État complet de la Maison des Finances
 */
export interface MaisonDesFinancesData {
  user_id: string;
  derniere_mise_a_jour: string;

  // Étage 0: Sécurité (Fondations)
  sante: SanteData;
  revenu: RevenuData;
  biens: BiensData;

  // Étage 1: Planification
  vieillesse: VieillesseData;
  fortune: FortuneData;

  // Combles: Développement
  immobilier: ImmobilierData;
  budget: BudgetData;

  // Toiture: Optimisation
  fiscalite: FiscaliteData;
  juridique: JuridiqueData;

  // Score global de santé financière (moyenne pondérée)
  score_global?: number;

  // Statut de complétion par section
  completion_status: {
    sante: 'non_commence' | 'en_cours' | 'termine';
    revenu: 'non_commence' | 'en_cours' | 'termine';
    biens: 'non_commence' | 'en_cours' | 'termine';
    vieillesse: 'non_commence' | 'en_cours' | 'termine';
    fortune: 'non_commence' | 'en_cours' | 'termine';
    immobilier: 'non_commence' | 'en_cours' | 'termine';
    budget: 'non_commence' | 'en_cours' | 'termine';
    fiscalite: 'non_commence' | 'en_cours' | 'termine';
    juridique: 'non_commence' | 'en_cours' | 'termine';
  };
}

/**
 * Indicateur de santé pour chaque thème
 */
export interface IndicateurSante {
  theme: string;
  score: number; // 0-100
  statut: 'critique' | 'attention' | 'bon' | 'excellent';
  couleur: string; // Pour l'affichage
  message_court: string;
}

/**
 * Configuration de la maison (poids et priorités)
 */
export interface MaisonConfig {
  poids_sections: {
    sante: number;
    revenu: number;
    biens: number;
    vieillesse: number;
    fortune: number;
    immobilier: number;
    budget: number;
    fiscalite: number;
    juridique: number;
  };
  seuils_scores: {
    critique: number; // 0-40
    attention: number; // 41-65
    bon: number; // 66-85
    excellent: number; // 86-100
  };
}
