-- ============================================================================
-- MAISON DES FINANCES - SCHEMA COMPLET SUPABASE
-- ============================================================================
-- Ce script crée toutes les tables pour la fonctionnalité Maison des Finances
-- Architecture: 1 table principale + 9 tables de données + RLS + Indexes
-- ============================================================================

-- ============================================================================
-- 1. TABLE PRINCIPALE: maison_finances
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.maison_finances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Métadonnées
  derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score_global INTEGER DEFAULT 0 CHECK (score_global >= 0 AND score_global <= 100),

  -- Statut de complétion par section (JSONB pour flexibilité)
  completion_status JSONB DEFAULT '{
    "sante": "non_commence",
    "revenu": "non_commence",
    "biens": "non_commence",
    "vieillesse": "non_commence",
    "fortune": "non_commence",
    "immobilier": "non_commence",
    "budget": "non_commence",
    "fiscalite": "non_commence",
    "juridique": "non_commence"
  }'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un seul enregistrement par utilisateur
  UNIQUE(user_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_maison_finances_user_id ON public.maison_finances(user_id);

-- ============================================================================
-- 2. ÉTAGE 0: SÉCURITÉ (Fondations)
-- ============================================================================

-- 2.1 SANTÉ - Assurance maladie obligatoire et complémentaire
CREATE TABLE IF NOT EXISTS public.sante_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Assurance de base LAMAL
  assurance_lamal_nom TEXT,
  assurance_lamal_prime_mensuelle NUMERIC(10, 2),
  assurance_lamal_franchise INTEGER CHECK (assurance_lamal_franchise IN (300, 500, 1000, 1500, 2000, 2500)),
  assurance_lamal_modele TEXT CHECK (assurance_lamal_modele IN ('standard', 'medecin_famille', 'telmed', 'hmo')),
  assurance_lamal_couverture_accidents BOOLEAN DEFAULT FALSE,
  assurance_lamal_document_url TEXT,

  -- Assurances complémentaires LCA
  assurance_lca_existe BOOLEAN DEFAULT FALSE,
  assurance_lca_nom TEXT,
  assurance_lca_prestations TEXT[], -- Array de prestations
  assurance_lca_prime_mensuelle NUMERIC(10, 2),
  assurance_lca_document_url TEXT,

  -- État de santé général
  problemes_sante_chroniques BOOLEAN DEFAULT FALSE,
  problemes_sante_details TEXT,
  traitement_medicaux_reguliers BOOLEAN DEFAULT FALSE,

  -- Santé financière de cette section
  sante_score INTEGER CHECK (sante_score >= 0 AND sante_score <= 100),
  sante_evaluation TEXT,
  sante_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_sante_data_user_id ON public.sante_data(user_id);

-- 2.2 REVENU - Sources de revenus et taux d'activité
CREATE TABLE IF NOT EXISTS public.revenu_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Activité professionnelle
  statut_professionnel TEXT CHECK (statut_professionnel IN ('salarie', 'independant', 'sans_emploi', 'retraite', 'etudiant')),
  taux_activite INTEGER CHECK (taux_activite >= 0 AND taux_activite <= 100),

  -- Revenus salariés
  salaire_brut_mensuel NUMERIC(10, 2),
  salaire_net_mensuel NUMERIC(10, 2),
  "13eme_salaire" BOOLEAN DEFAULT FALSE,
  primes_variables NUMERIC(10, 2), -- Annuel

  -- Revenus indépendants
  ca_annuel_independant NUMERIC(12, 2),
  charges_annuelles_independant NUMERIC(12, 2),
  benefice_net_independant NUMERIC(12, 2),

  -- Autres revenus
  revenus_locatifs NUMERIC(10, 2), -- Mensuel
  revenus_placements NUMERIC(10, 2), -- Annuel
  autres_revenus NUMERIC(10, 2),
  autres_revenus_description TEXT,

  -- Conjoint
  situation_familiale TEXT CHECK (situation_familiale IN ('celibataire', 'marie', 'concubin', 'divorce', 'veuf')),
  conjoint_revenus NUMERIC(10, 2), -- Mensuel net

  -- Personnes à charge
  nombre_enfants_charge INTEGER DEFAULT 0,
  autres_personnes_charge INTEGER DEFAULT 0,

  -- Santé financière
  revenu_score INTEGER CHECK (revenu_score >= 0 AND revenu_score <= 100),
  revenu_evaluation TEXT,
  revenu_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_revenu_data_user_id ON public.revenu_data(user_id);

-- 2.3 BIENS - Protection des biens et RC
CREATE TABLE IF NOT EXISTS public.biens_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Responsabilité civile
  rc_privee_existe BOOLEAN DEFAULT FALSE,
  rc_privee_nom TEXT,
  rc_privee_montant_couverture NUMERIC(12, 2),
  rc_privee_prime_annuelle NUMERIC(10, 2),
  rc_privee_document_url TEXT,

  -- Assurance ménage
  assurance_menage_existe BOOLEAN DEFAULT FALSE,
  assurance_menage_nom TEXT,
  assurance_menage_somme_assuree NUMERIC(12, 2),
  assurance_menage_prime_annuelle NUMERIC(10, 2),
  assurance_menage_document_url TEXT,

  -- Véhicules (JSONB pour flexibilité)
  nombre_vehicules INTEGER DEFAULT 0,
  vehicules JSONB DEFAULT '[]'::jsonb, -- Array d'objets véhicules

  -- Protection juridique
  protection_juridique_existe BOOLEAN DEFAULT FALSE,
  protection_juridique_nom TEXT,
  protection_juridique_domaines TEXT[],
  protection_juridique_prime_annuelle NUMERIC(10, 2),

  -- Objets de valeur
  objets_valeur_existent BOOLEAN DEFAULT FALSE,
  objets_valeur_liste JSONB DEFAULT '[]'::jsonb, -- Array d'objets de valeur

  -- Santé financière
  biens_score INTEGER CHECK (biens_score >= 0 AND biens_score <= 100),
  biens_evaluation TEXT,
  biens_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_biens_data_user_id ON public.biens_data(user_id);

-- ============================================================================
-- 3. ÉTAGE 1: PLANIFICATION (Premier étage)
-- ============================================================================

-- 3.1 VIEILLESSE - Prévoyance retraite (1er, 2e, 3e piliers)
CREATE TABLE IF NOT EXISTS public.vieillesse_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 1er pilier (AVS)
  annees_cotisation_avs INTEGER,
  lacunes_avs BOOLEAN DEFAULT FALSE,
  montant_rente_avs_estimee NUMERIC(10, 2),

  -- 2e pilier (LPP)
  lpp_existe BOOLEAN DEFAULT FALSE,
  lpp_nom_caisse TEXT,
  lpp_avoir_actuel NUMERIC(12, 2),
  lpp_cotisation_mensuelle_employee NUMERIC(10, 2),
  lpp_cotisation_mensuelle_employeur NUMERIC(10, 2),
  lpp_taux_conversion NUMERIC(5, 2), -- Ex: 6.8
  lpp_plan_prevoyance TEXT CHECK (lpp_plan_prevoyance IN ('minimal', 'etendu', 'cadre')),
  lpp_certificat_url TEXT,

  -- Rachat LPP
  lpp_possibilite_rachat BOOLEAN DEFAULT FALSE,
  lpp_montant_rachat_possible NUMERIC(12, 2),

  -- 3e pilier A
  pilier3a_existe BOOLEAN DEFAULT FALSE,
  pilier3a_montant_total NUMERIC(12, 2),
  pilier3a_nombre_comptes INTEGER,
  pilier3a_cotisation_annuelle NUMERIC(10, 2),
  pilier3a_institution TEXT,

  -- 3e pilier B
  pilier3b_existe BOOLEAN DEFAULT FALSE,
  pilier3b_type TEXT CHECK (pilier3b_type IN ('assurance_vie', 'epargne_bancaire')),
  pilier3b_montant_total NUMERIC(12, 2),

  -- Prévoyance libre
  autres_placements_retraite NUMERIC(12, 2),

  -- Projections
  age_actuel INTEGER,
  age_retraite_souhaite INTEGER,
  besoin_revenu_retraite_mensuel NUMERIC(10, 2),

  -- Santé financière
  vieillesse_score INTEGER CHECK (vieillesse_score >= 0 AND vieillesse_score <= 100),
  vieillesse_evaluation TEXT,
  vieillesse_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_vieillesse_data_user_id ON public.vieillesse_data(user_id);

-- 3.2 FORTUNE - Patrimoine et placements
CREATE TABLE IF NOT EXISTS public.fortune_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Liquidités
  comptes_courants_total NUMERIC(12, 2),
  comptes_epargne_total NUMERIC(12, 2),

  -- Placements bancaires
  comptes_titres_existe BOOLEAN DEFAULT FALSE,
  comptes_titres_valeur NUMERIC(12, 2),
  comptes_titres_repartition JSONB, -- Objet avec répartition en %

  -- Cryptomonnaies
  crypto_existe BOOLEAN DEFAULT FALSE,
  crypto_valeur NUMERIC(12, 2),
  crypto_types TEXT[],

  -- Métaux précieux
  metaux_precieux_existe BOOLEAN DEFAULT FALSE,
  metaux_precieux_valeur NUMERIC(12, 2),

  -- Autres actifs
  autres_actifs_existe BOOLEAN DEFAULT FALSE,
  autres_actifs_description TEXT,
  autres_actifs_valeur NUMERIC(12, 2),

  -- Dettes
  credits_consommation_existe BOOLEAN DEFAULT FALSE,
  credits_consommation_total NUMERIC(12, 2),
  credits_consommation_taux NUMERIC(5, 2),

  cartes_credit_solde NUMERIC(10, 2),

  autres_dettes_existe BOOLEAN DEFAULT FALSE,
  autres_dettes_montant NUMERIC(12, 2),
  autres_dettes_description TEXT,

  -- Fortune nette calculée
  fortune_nette NUMERIC(12, 2),

  -- Profil investisseur
  profil_risque TEXT CHECK (profil_risque IN ('defensif', 'equilibre', 'dynamique', 'agressif')),
  horizon_placement INTEGER, -- années

  -- Santé financière
  fortune_score INTEGER CHECK (fortune_score >= 0 AND fortune_score <= 100),
  fortune_evaluation TEXT,
  fortune_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_fortune_data_user_id ON public.fortune_data(user_id);

-- ============================================================================
-- 4. COMBLES: DÉVELOPPEMENT (Deuxième étage)
-- ============================================================================

-- 4.1 IMMOBILIER - Propriété et projets immobiliers
CREATE TABLE IF NOT EXISTS public.immobilier_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Situation actuelle
  statut_logement TEXT CHECK (statut_logement IN ('proprietaire', 'locataire', 'loge_gratuitement')),

  -- Si locataire
  loyer_mensuel NUMERIC(10, 2),
  charges_mensuelles NUMERIC(10, 2),
  type_logement TEXT,
  surface_m2 NUMERIC(8, 2),

  -- Si propriétaire
  proprietaire_residence_principale BOOLEAN,
  proprietaire_valeur_estimee NUMERIC(12, 2),
  proprietaire_annee_achat INTEGER,
  proprietaire_prix_achat NUMERIC(12, 2),

  -- Hypothèque actuelle
  hypotheque_existe BOOLEAN DEFAULT FALSE,
  hypotheque_montant_initial NUMERIC(12, 2),
  hypotheque_montant_restant NUMERIC(12, 2),
  hypotheque_taux_interet NUMERIC(5, 2),
  hypotheque_type TEXT CHECK (hypotheque_type IN ('fixe', 'libor', 'saron', 'variable')),
  hypotheque_duree_fixe INTEGER,
  hypotheque_echeance_fixe DATE,
  hypotheque_amortissement_annuel NUMERIC(10, 2),
  hypotheque_document_url TEXT,

  -- Autres biens immobiliers
  autres_biens_existe BOOLEAN DEFAULT FALSE,
  autres_biens JSONB DEFAULT '[]'::jsonb, -- Array d'autres biens

  -- Projet d'achat
  projet_achat BOOLEAN DEFAULT FALSE,
  projet_achat_budget NUMERIC(12, 2),
  projet_achat_fonds_propres_disponibles NUMERIC(12, 2),
  projet_achat_delai TEXT,

  -- Capacité d'emprunt calculée
  capacite_emprunt_maximale NUMERIC(12, 2),
  taux_endettement_actuel NUMERIC(5, 2),

  -- Santé financière
  immobilier_score INTEGER CHECK (immobilier_score >= 0 AND immobilier_score <= 100),
  immobilier_evaluation TEXT,
  immobilier_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_immobilier_data_user_id ON public.immobilier_data(user_id);

-- 4.2 BUDGET - Revenus et dépenses détaillés
CREATE TABLE IF NOT EXISTS public.budget_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Budget mensuel
  revenus_mensuels_nets_total NUMERIC(10, 2),

  -- Catégorie 1: Logement (25-35%)
  logement_loyer_hypotheque NUMERIC(10, 2),
  logement_charges NUMERIC(10, 2),
  logement_electricite NUMERIC(10, 2),
  logement_chauffage NUMERIC(10, 2),
  logement_eau NUMERIC(10, 2),
  logement_internet_tv NUMERIC(10, 2),
  logement_telephone NUMERIC(10, 2),
  logement_entretien NUMERIC(10, 2),
  logement_assurances NUMERIC(10, 2),
  logement_total NUMERIC(10, 2),
  logement_pourcentage NUMERIC(5, 2),

  -- Catégorie 2: Vie courante (15-25%)
  vie_alimentation NUMERIC(10, 2),
  vie_restaurants NUMERIC(10, 2),
  vie_vetements NUMERIC(10, 2),
  vie_coiffeur_beaute NUMERIC(10, 2),
  vie_loisirs_sorties NUMERIC(10, 2),
  vie_sport_abonnements NUMERIC(10, 2),
  vie_animaux NUMERIC(10, 2),
  vie_divers NUMERIC(10, 2),
  vie_total NUMERIC(10, 2),
  vie_pourcentage NUMERIC(5, 2),

  -- Catégorie 3: Transports (5-15%)
  transport_voiture_leasing NUMERIC(10, 2),
  transport_essence NUMERIC(10, 2),
  transport_entretien_voiture NUMERIC(10, 2),
  transport_parking NUMERIC(10, 2),
  transport_transports_publics NUMERIC(10, 2),
  transport_total NUMERIC(10, 2),
  transport_pourcentage NUMERIC(5, 2),

  -- Catégorie 4: Santé & Assurances (10-20%)
  sante_lamal NUMERIC(10, 2),
  sante_lca NUMERIC(10, 2),
  sante_franchise_quote_part NUMERIC(10, 2),
  sante_medicaments NUMERIC(10, 2),
  sante_dentiste NUMERIC(10, 2),
  sante_rc_menage NUMERIC(10, 2),
  sante_protection_juridique NUMERIC(10, 2),
  sante_autres_assurances NUMERIC(10, 2),
  sante_total NUMERIC(10, 2),
  sante_pourcentage NUMERIC(5, 2),

  -- Catégorie 5: Épargne & Prévoyance (10-20%)
  epargne_pilier3a NUMERIC(10, 2),
  epargne_epargne_libre NUMERIC(10, 2),
  epargne_placements NUMERIC(10, 2),
  epargne_remboursement_dettes NUMERIC(10, 2),
  epargne_total NUMERIC(10, 2),
  epargne_pourcentage NUMERIC(5, 2),

  -- Totaux calculés
  depenses_mensuelles_total NUMERIC(10, 2),
  solde_mensuel NUMERIC(10, 2),
  taux_epargne NUMERIC(5, 2),

  -- Analyse
  categories_problematiques TEXT[],

  -- Santé financière
  budget_score INTEGER CHECK (budget_score >= 0 AND budget_score <= 100),
  budget_evaluation TEXT,
  budget_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_budget_data_user_id ON public.budget_data(user_id);

-- ============================================================================
-- 5. TOITURE: OPTIMISATION (Toit)
-- ============================================================================

-- 5.1 FISCALITÉ - Impôts et optimisation fiscale
CREATE TABLE IF NOT EXISTS public.fiscalite_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Situation fiscale
  canton_residence TEXT,
  commune_residence TEXT,
  statut_fiscal TEXT CHECK (statut_fiscal IN ('celibataire', 'marie_un_revenu', 'marie_deux_revenus', 'concubinage')),

  -- Calcul automatique depuis les autres données
  revenu_imposable_estime NUMERIC(12, 2),
  fortune_imposable_estimee NUMERIC(12, 2),

  -- Déductions
  deductions_lpp_pilier3a NUMERIC(10, 2),
  deductions_interets_hypothecaires NUMERIC(10, 2),
  deductions_frais_garde_enfants NUMERIC(10, 2),
  deductions_frais_formation NUMERIC(10, 2),
  deductions_dons NUMERIC(10, 2),
  deductions_pension_alimentaire NUMERIC(10, 2),

  -- Impôts estimés
  impots_federaux_estimes NUMERIC(10, 2),
  impots_cantonaux_estimes NUMERIC(10, 2),
  impots_communaux_estimes NUMERIC(10, 2),
  impots_total_annuel_estime NUMERIC(10, 2),

  -- Taux d'imposition effectif
  taux_imposition_effectif NUMERIC(5, 2),

  -- Opportunités d'optimisation
  optimisations_possibles JSONB DEFAULT '[]'::jsonb, -- Array d'opportunités

  -- Santé financière
  fiscalite_score INTEGER CHECK (fiscalite_score >= 0 AND fiscalite_score <= 100),
  fiscalite_evaluation TEXT,
  fiscalite_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_fiscalite_data_user_id ON public.fiscalite_data(user_id);

-- 5.2 JURIDIQUE - Protection juridique et documents importants
CREATE TABLE IF NOT EXISTS public.juridique_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Protection juridique
  protection_juridique_existe BOOLEAN DEFAULT FALSE,
  protection_juridique_domaines TEXT[],

  -- Documents importants
  testament_existe BOOLEAN DEFAULT FALSE,
  testament_date DATE,
  testament_chez_notaire BOOLEAN DEFAULT FALSE,

  pacte_successoral_existe BOOLEAN DEFAULT FALSE,
  pacte_successoral_date DATE,

  mandat_precautions_existe BOOLEAN DEFAULT FALSE,
  mandat_precautions_date DATE,

  directives_anticipees_existent BOOLEAN DEFAULT FALSE,
  directives_anticipees_date DATE,

  procuration_bancaire_existe BOOLEAN DEFAULT FALSE,

  contrat_mariage_existe BOOLEAN DEFAULT FALSE,
  regime_matrimonial TEXT CHECK (regime_matrimonial IN ('separation_biens', 'communaute_biens', 'participation_acquets')),

  -- Dossier numérique
  documents_importants_centralises BOOLEAN DEFAULT FALSE,
  personnes_confiance_informees BOOLEAN DEFAULT FALSE,

  -- Santé financière
  juridique_score INTEGER CHECK (juridique_score >= 0 AND juridique_score <= 100),
  juridique_evaluation TEXT,
  juridique_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_juridique_data_user_id ON public.juridique_data(user_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.maison_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sante_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenu_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biens_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vieillesse_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fortune_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immobilier_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscalite_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.juridique_data ENABLE ROW LEVEL SECURITY;

-- Politique pour maison_finances
CREATE POLICY "Users can view their own maison_finances"
  ON public.maison_finances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maison_finances"
  ON public.maison_finances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maison_finances"
  ON public.maison_finances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maison_finances"
  ON public.maison_finances FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour sante_data
CREATE POLICY "Users can view their own sante_data"
  ON public.sante_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sante_data"
  ON public.sante_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sante_data"
  ON public.sante_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sante_data"
  ON public.sante_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour revenu_data
CREATE POLICY "Users can view their own revenu_data"
  ON public.revenu_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenu_data"
  ON public.revenu_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own revenu_data"
  ON public.revenu_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revenu_data"
  ON public.revenu_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour biens_data
CREATE POLICY "Users can view their own biens_data"
  ON public.biens_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own biens_data"
  ON public.biens_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own biens_data"
  ON public.biens_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own biens_data"
  ON public.biens_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour vieillesse_data
CREATE POLICY "Users can view their own vieillesse_data"
  ON public.vieillesse_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vieillesse_data"
  ON public.vieillesse_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vieillesse_data"
  ON public.vieillesse_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vieillesse_data"
  ON public.vieillesse_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour fortune_data
CREATE POLICY "Users can view their own fortune_data"
  ON public.fortune_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fortune_data"
  ON public.fortune_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fortune_data"
  ON public.fortune_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fortune_data"
  ON public.fortune_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour immobilier_data
CREATE POLICY "Users can view their own immobilier_data"
  ON public.immobilier_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own immobilier_data"
  ON public.immobilier_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own immobilier_data"
  ON public.immobilier_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own immobilier_data"
  ON public.immobilier_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour budget_data
CREATE POLICY "Users can view their own budget_data"
  ON public.budget_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget_data"
  ON public.budget_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget_data"
  ON public.budget_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget_data"
  ON public.budget_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour fiscalite_data
CREATE POLICY "Users can view their own fiscalite_data"
  ON public.fiscalite_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fiscalite_data"
  ON public.fiscalite_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fiscalite_data"
  ON public.fiscalite_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fiscalite_data"
  ON public.fiscalite_data FOR DELETE
  USING (auth.uid() = user_id);

-- Politique pour juridique_data
CREATE POLICY "Users can view their own juridique_data"
  ON public.juridique_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own juridique_data"
  ON public.juridique_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own juridique_data"
  ON public.juridique_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own juridique_data"
  ON public.juridique_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at sur toutes les tables
CREATE TRIGGER update_maison_finances_updated_at BEFORE UPDATE ON public.maison_finances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sante_data_updated_at BEFORE UPDATE ON public.sante_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenu_data_updated_at BEFORE UPDATE ON public.revenu_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biens_data_updated_at BEFORE UPDATE ON public.biens_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vieillesse_data_updated_at BEFORE UPDATE ON public.vieillesse_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fortune_data_updated_at BEFORE UPDATE ON public.fortune_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_immobilier_data_updated_at BEFORE UPDATE ON public.immobilier_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_data_updated_at BEFORE UPDATE ON public.budget_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fiscalite_data_updated_at BEFORE UPDATE ON public.fiscalite_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_juridique_data_updated_at BEFORE UPDATE ON public.juridique_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. FONCTION RPC POUR CHARGEMENT OPTIMISÉ
-- ============================================================================

-- Supprimer l'ancienne fonction si elle existe (nécessaire car on change le type de retour JSON → JSONB)
DROP FUNCTION IF EXISTS get_maison_finances_complete(UUID);

CREATE OR REPLACE FUNCTION get_maison_finances_complete(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  maison_record RECORD;
BEGIN
  -- Récupérer l'enregistrement principal
  SELECT * INTO maison_record
  FROM maison_finances
  WHERE user_id = user_id_param
  LIMIT 1;

  -- Si pas de maison, retourner NULL
  IF maison_record IS NULL THEN
    RETURN NULL;
  END IF;

  -- Construire l'objet JSONB complet avec toutes les sections
  SELECT jsonb_build_object(
    'user_id', user_id_param,
    'score_global', COALESCE(maison_record.score_global, 0),
    'derniere_mise_a_jour', maison_record.derniere_mise_a_jour,
    'completion_status', maison_record.completion_status,
    'sante', COALESCE((SELECT row_to_json(s.*) FROM sante_data s WHERE s.user_id = user_id_param LIMIT 1), '{}'::json),
    'revenu', COALESCE((SELECT row_to_json(r.*) FROM revenu_data r WHERE r.user_id = user_id_param LIMIT 1), '{}'::json),
    'biens', COALESCE((SELECT row_to_json(b.*) FROM biens_data b WHERE b.user_id = user_id_param LIMIT 1), '{}'::json),
    'vieillesse', COALESCE((SELECT row_to_json(v.*) FROM vieillesse_data v WHERE v.user_id = user_id_param LIMIT 1), '{}'::json),
    'fortune', COALESCE((SELECT row_to_json(f.*) FROM fortune_data f WHERE f.user_id = user_id_param LIMIT 1), '{}'::json),
    'immobilier', COALESCE((SELECT row_to_json(i.*) FROM immobilier_data i WHERE i.user_id = user_id_param LIMIT 1), '{}'::json),
    'budget', COALESCE((SELECT row_to_json(bu.*) FROM budget_data bu WHERE bu.user_id = user_id_param LIMIT 1), '{}'::json),
    'fiscalite', COALESCE((SELECT row_to_json(fi.*) FROM fiscalite_data fi WHERE fi.user_id = user_id_param LIMIT 1), '{}'::json),
    'juridique', COALESCE((SELECT row_to_json(j.*) FROM juridique_data j WHERE j.user_id = user_id_param LIMIT 1), '{}'::json)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant pour les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION get_maison_finances_complete(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_maison_finances_complete(UUID) TO anon;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- Pour vérifier que tout est créé correctement :
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%_data' OR table_name = 'maison_finances';
