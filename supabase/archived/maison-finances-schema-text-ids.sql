-- ============================================================================
-- MAISON DES FINANCES - SCHEMA COMPLET SUPABASE (avec user_id TEXT)
-- ============================================================================
-- Ce script crée toutes les tables pour la fonctionnalité Maison des Finances
-- Architecture: 1 table principale + 9 tables de données + RLS + Indexes
-- Version adaptée pour user_id TEXT (au lieu de UUID)
-- ============================================================================

-- ============================================================================
-- 1. TABLE PRINCIPALE: maison_finances
-- ============================================================================

DROP TABLE IF EXISTS public.maison_finances CASCADE;

CREATE TABLE public.maison_finances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changé de UUID à TEXT

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
CREATE INDEX idx_maison_finances_user_id ON public.maison_finances(user_id);

-- ============================================================================
-- 2. ÉTAGE 0: SÉCURITÉ (Fondations)
-- ============================================================================

-- 2.1 SANTÉ
DROP TABLE IF EXISTS public.sante_data CASCADE;

CREATE TABLE public.sante_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

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
  assurance_lca_prestations TEXT[],
  assurance_lca_prime_mensuelle NUMERIC(10, 2),
  assurance_lca_document_url TEXT,

  -- État de santé général
  problemes_sante_chroniques BOOLEAN DEFAULT FALSE,
  problemes_sante_details TEXT,
  traitement_medicaux_reguliers BOOLEAN DEFAULT FALSE,

  -- Santé financière
  sante_score INTEGER CHECK (sante_score >= 0 AND sante_score <= 100),
  sante_evaluation TEXT,
  sante_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_sante_data_user_id ON public.sante_data(user_id);

-- 2.2 REVENU
DROP TABLE IF EXISTS public.revenu_data CASCADE;

CREATE TABLE public.revenu_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  statut_professionnel TEXT CHECK (statut_professionnel IN ('salarie', 'independant', 'sans_emploi', 'retraite', 'etudiant')),
  taux_activite INTEGER CHECK (taux_activite >= 0 AND taux_activite <= 100),

  salaire_brut_mensuel NUMERIC(10, 2),
  salaire_net_mensuel NUMERIC(10, 2),
  "13eme_salaire" BOOLEAN DEFAULT FALSE,
  primes_variables NUMERIC(10, 2),

  ca_annuel_independant NUMERIC(12, 2),
  charges_annuelles_independant NUMERIC(12, 2),
  benefice_net_independant NUMERIC(12, 2),

  revenus_locatifs NUMERIC(10, 2),
  revenus_placements NUMERIC(10, 2),
  autres_revenus NUMERIC(10, 2),
  autres_revenus_description TEXT,

  situation_familiale TEXT CHECK (situation_familiale IN ('celibataire', 'marie', 'concubin', 'divorce', 'veuf')),
  conjoint_revenus NUMERIC(10, 2),

  nombre_enfants_charge INTEGER DEFAULT 0,
  autres_personnes_charge INTEGER DEFAULT 0,

  revenu_score INTEGER CHECK (revenu_score >= 0 AND revenu_score <= 100),
  revenu_evaluation TEXT,
  revenu_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_revenu_data_user_id ON public.revenu_data(user_id);

-- 2.3 BIENS
DROP TABLE IF EXISTS public.biens_data CASCADE;

CREATE TABLE public.biens_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  rc_privee_existe BOOLEAN DEFAULT FALSE,
  rc_privee_nom TEXT,
  rc_privee_montant_couverture NUMERIC(12, 2),
  rc_privee_prime_annuelle NUMERIC(10, 2),
  rc_privee_document_url TEXT,

  assurance_menage_existe BOOLEAN DEFAULT FALSE,
  assurance_menage_nom TEXT,
  assurance_menage_somme_assuree NUMERIC(12, 2),
  assurance_menage_prime_annuelle NUMERIC(10, 2),
  assurance_menage_document_url TEXT,

  nombre_vehicules INTEGER DEFAULT 0,
  vehicules JSONB DEFAULT '[]'::jsonb,

  protection_juridique_existe BOOLEAN DEFAULT FALSE,
  protection_juridique_nom TEXT,
  protection_juridique_domaines TEXT[],
  protection_juridique_prime_annuelle NUMERIC(10, 2),

  objets_valeur_existent BOOLEAN DEFAULT FALSE,
  objets_valeur_liste JSONB DEFAULT '[]'::jsonb,

  biens_score INTEGER CHECK (biens_score >= 0 AND biens_score <= 100),
  biens_evaluation TEXT,
  biens_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_biens_data_user_id ON public.biens_data(user_id);

-- ============================================================================
-- 3. ÉTAGE 1: PLANIFICATION
-- ============================================================================

-- 3.1 VIEILLESSE
DROP TABLE IF EXISTS public.vieillesse_data CASCADE;

CREATE TABLE public.vieillesse_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  annees_cotisation_avs INTEGER,
  lacunes_avs BOOLEAN DEFAULT FALSE,
  montant_rente_avs_estimee NUMERIC(10, 2),

  lpp_existe BOOLEAN DEFAULT FALSE,
  lpp_nom_caisse TEXT,
  lpp_avoir_actuel NUMERIC(12, 2),
  lpp_cotisation_mensuelle_employee NUMERIC(10, 2),
  lpp_cotisation_mensuelle_employeur NUMERIC(10, 2),
  lpp_taux_conversion NUMERIC(5, 2),
  lpp_plan_prevoyance TEXT CHECK (lpp_plan_prevoyance IN ('minimal', 'etendu', 'cadre')),
  lpp_certificat_url TEXT,

  lpp_possibilite_rachat BOOLEAN DEFAULT FALSE,
  lpp_montant_rachat_possible NUMERIC(12, 2),

  pilier3a_existe BOOLEAN DEFAULT FALSE,
  pilier3a_montant_total NUMERIC(12, 2),
  pilier3a_nombre_comptes INTEGER,
  pilier3a_cotisation_annuelle NUMERIC(10, 2),
  pilier3a_institution TEXT,

  pilier3b_existe BOOLEAN DEFAULT FALSE,
  pilier3b_type TEXT CHECK (pilier3b_type IN ('assurance_vie', 'epargne_bancaire')),
  pilier3b_montant_total NUMERIC(12, 2),

  autres_placements_retraite NUMERIC(12, 2),

  age_actuel INTEGER,
  age_retraite_souhaite INTEGER,
  besoin_revenu_retraite_mensuel NUMERIC(10, 2),

  vieillesse_score INTEGER CHECK (vieillesse_score >= 0 AND vieillesse_score <= 100),
  vieillesse_evaluation TEXT,
  vieillesse_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_vieillesse_data_user_id ON public.vieillesse_data(user_id);

-- 3.2 FORTUNE
DROP TABLE IF EXISTS public.fortune_data CASCADE;

CREATE TABLE public.fortune_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  comptes_courants_total NUMERIC(12, 2),
  comptes_epargne_total NUMERIC(12, 2),

  comptes_titres_existe BOOLEAN DEFAULT FALSE,
  comptes_titres_valeur NUMERIC(12, 2),
  comptes_titres_repartition JSONB,

  crypto_existe BOOLEAN DEFAULT FALSE,
  crypto_valeur NUMERIC(12, 2),
  crypto_types TEXT[],

  metaux_precieux_existe BOOLEAN DEFAULT FALSE,
  metaux_precieux_valeur NUMERIC(12, 2),

  autres_actifs_existe BOOLEAN DEFAULT FALSE,
  autres_actifs_description TEXT,
  autres_actifs_valeur NUMERIC(12, 2),

  credits_consommation_existe BOOLEAN DEFAULT FALSE,
  credits_consommation_total NUMERIC(12, 2),
  credits_consommation_taux NUMERIC(5, 2),

  cartes_credit_solde NUMERIC(10, 2),

  autres_dettes_existe BOOLEAN DEFAULT FALSE,
  autres_dettes_montant NUMERIC(12, 2),
  autres_dettes_description TEXT,

  fortune_nette NUMERIC(12, 2),

  profil_risque TEXT CHECK (profil_risque IN ('defensif', 'equilibre', 'dynamique', 'agressif')),
  horizon_placement INTEGER,

  fortune_score INTEGER CHECK (fortune_score >= 0 AND fortune_score <= 100),
  fortune_evaluation TEXT,
  fortune_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_fortune_data_user_id ON public.fortune_data(user_id);

-- ============================================================================
-- 4. COMBLES: DÉVELOPPEMENT
-- ============================================================================

-- 4.1 IMMOBILIER
DROP TABLE IF EXISTS public.immobilier_data CASCADE;

CREATE TABLE public.immobilier_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  statut_logement TEXT CHECK (statut_logement IN ('proprietaire', 'locataire', 'loge_gratuitement')),

  loyer_mensuel NUMERIC(10, 2),
  charges_mensuelles NUMERIC(10, 2),
  type_logement TEXT,
  surface_m2 NUMERIC(8, 2),

  proprietaire_residence_principale BOOLEAN,
  proprietaire_valeur_estimee NUMERIC(12, 2),
  proprietaire_annee_achat INTEGER,
  proprietaire_prix_achat NUMERIC(12, 2),

  hypotheque_existe BOOLEAN DEFAULT FALSE,
  hypotheque_montant_initial NUMERIC(12, 2),
  hypotheque_montant_restant NUMERIC(12, 2),
  hypotheque_taux_interet NUMERIC(5, 2),
  hypotheque_type TEXT CHECK (hypotheque_type IN ('fixe', 'libor', 'saron', 'variable')),
  hypotheque_duree_fixe INTEGER,
  hypotheque_echeance_fixe DATE,
  hypotheque_amortissement_annuel NUMERIC(10, 2),
  hypotheque_document_url TEXT,

  autres_biens_existe BOOLEAN DEFAULT FALSE,
  autres_biens JSONB DEFAULT '[]'::jsonb,

  projet_achat BOOLEAN DEFAULT FALSE,
  projet_achat_budget NUMERIC(12, 2),
  projet_achat_fonds_propres_disponibles NUMERIC(12, 2),
  projet_achat_delai TEXT,

  capacite_emprunt_maximale NUMERIC(12, 2),
  taux_endettement_actuel NUMERIC(5, 2),

  immobilier_score INTEGER CHECK (immobilier_score >= 0 AND immobilier_score <= 100),
  immobilier_evaluation TEXT,
  immobilier_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_immobilier_data_user_id ON public.immobilier_data(user_id);

-- 4.2 BUDGET
DROP TABLE IF EXISTS public.budget_data CASCADE;

CREATE TABLE public.budget_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  revenus_mensuels_nets_total NUMERIC(10, 2),

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

  transport_voiture_leasing NUMERIC(10, 2),
  transport_essence NUMERIC(10, 2),
  transport_entretien_voiture NUMERIC(10, 2),
  transport_parking NUMERIC(10, 2),
  transport_transports_publics NUMERIC(10, 2),
  transport_total NUMERIC(10, 2),
  transport_pourcentage NUMERIC(5, 2),

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

  epargne_pilier3a NUMERIC(10, 2),
  epargne_epargne_libre NUMERIC(10, 2),
  epargne_placements NUMERIC(10, 2),
  epargne_remboursement_dettes NUMERIC(10, 2),
  epargne_total NUMERIC(10, 2),
  epargne_pourcentage NUMERIC(5, 2),

  depenses_mensuelles_total NUMERIC(10, 2),
  solde_mensuel NUMERIC(10, 2),
  taux_epargne NUMERIC(5, 2),

  categories_problematiques TEXT[],

  budget_score INTEGER CHECK (budget_score >= 0 AND budget_score <= 100),
  budget_evaluation TEXT,
  budget_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_budget_data_user_id ON public.budget_data(user_id);

-- ============================================================================
-- 5. TOITURE: OPTIMISATION
-- ============================================================================

-- 5.1 FISCALITÉ
DROP TABLE IF EXISTS public.fiscalite_data CASCADE;

CREATE TABLE public.fiscalite_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  canton_residence TEXT,
  commune_residence TEXT,
  statut_fiscal TEXT CHECK (statut_fiscal IN ('celibataire', 'marie_un_revenu', 'marie_deux_revenus', 'concubinage')),

  revenu_imposable_estime NUMERIC(12, 2),
  fortune_imposable_estimee NUMERIC(12, 2),

  deductions_lpp_pilier3a NUMERIC(10, 2),
  deductions_interets_hypothecaires NUMERIC(10, 2),
  deductions_frais_garde_enfants NUMERIC(10, 2),
  deductions_frais_formation NUMERIC(10, 2),
  deductions_dons NUMERIC(10, 2),
  deductions_pension_alimentaire NUMERIC(10, 2),

  impots_federaux_estimes NUMERIC(10, 2),
  impots_cantonaux_estimes NUMERIC(10, 2),
  impots_communaux_estimes NUMERIC(10, 2),
  impots_total_annuel_estime NUMERIC(10, 2),

  taux_imposition_effectif NUMERIC(5, 2),

  optimisations_possibles JSONB DEFAULT '[]'::jsonb,

  fiscalite_score INTEGER CHECK (fiscalite_score >= 0 AND fiscalite_score <= 100),
  fiscalite_evaluation TEXT,
  fiscalite_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_fiscalite_data_user_id ON public.fiscalite_data(user_id);

-- 5.2 JURIDIQUE
DROP TABLE IF EXISTS public.juridique_data CASCADE;

CREATE TABLE public.juridique_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,

  protection_juridique_existe BOOLEAN DEFAULT FALSE,
  protection_juridique_domaines TEXT[],

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

  documents_importants_centralises BOOLEAN DEFAULT FALSE,
  personnes_confiance_informees BOOLEAN DEFAULT FALSE,

  juridique_score INTEGER CHECK (juridique_score >= 0 AND juridique_score <= 100),
  juridique_evaluation TEXT,
  juridique_recommandations TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_juridique_data_user_id ON public.juridique_data(user_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) - DÉSACTIVÉ pour authentification locale
-- ============================================================================
-- Note: RLS désactivé car l'application utilise une authentification locale
-- La sécurité est gérée côté application avec les user_id
-- Les politiques RLS ci-dessous sont commentées car elles requièrent Supabase Auth

-- ALTER TABLE public.maison_finances ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sante_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.revenu_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.biens_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.vieillesse_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fortune_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.immobilier_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.budget_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.fiscalite_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.juridique_data ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
-- 8. FONCTION RPC POUR CHARGEMENT OPTIMISÉ (avec TEXT user_id)
-- ============================================================================

DROP FUNCTION IF EXISTS get_maison_finances_complete(UUID);
DROP FUNCTION IF EXISTS get_maison_finances_complete(TEXT);

CREATE OR REPLACE FUNCTION get_maison_finances_complete(user_id_param TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  maison_record RECORD;
BEGIN
  SELECT * INTO maison_record
  FROM maison_finances
  WHERE user_id = user_id_param
  LIMIT 1;

  IF maison_record IS NULL THEN
    RETURN NULL;
  END IF;

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

GRANT EXECUTE ON FUNCTION get_maison_finances_complete(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_maison_finances_complete(TEXT) TO anon;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
