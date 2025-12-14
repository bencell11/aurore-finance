-- ============================================================================
-- MAISON DES FINANCES - SCHEMA SUPABASE
-- ============================================================================
-- Ce schéma stocke toutes les données de la Maison des Finances
-- avec un système de scores de santé financière pour chaque section
-- ============================================================================

-- Table principale: maison_finances
CREATE TABLE IF NOT EXISTS public.maison_finances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Métadonnées
    derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Score global de santé financière
    score_global INTEGER DEFAULT 0 CHECK (score_global >= 0 AND score_global <= 100),

    -- Statut de complétion par section
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

    UNIQUE(user_id)
);

-- ============================================================================
-- ÉTAGE 0: SÉCURITÉ (Fondations)
-- ============================================================================

-- Table: sante_data
CREATE TABLE IF NOT EXISTS public.sante_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Assurance LAMal
    assurance_lamal_nom VARCHAR(255),
    assurance_lamal_prime_mensuelle DECIMAL(10, 2),
    assurance_lamal_franchise INTEGER CHECK (assurance_lamal_franchise IN (300, 500, 1000, 1500, 2000, 2500)),
    assurance_lamal_modele VARCHAR(50) CHECK (assurance_lamal_modele IN ('standard', 'medecin_famille', 'telmed', 'hmo')),
    assurance_lamal_couverture_accidents BOOLEAN DEFAULT FALSE,
    assurance_lamal_document_url TEXT,

    -- Assurance LCA
    assurance_lca_existe BOOLEAN DEFAULT FALSE,
    assurance_lca_nom VARCHAR(255),
    assurance_lca_prestations TEXT[], -- Array de prestations
    assurance_lca_prime_mensuelle DECIMAL(10, 2),
    assurance_lca_document_url TEXT,

    -- État de santé
    problemes_sante_chroniques BOOLEAN DEFAULT FALSE,
    problemes_sante_details TEXT,
    traitement_medicaux_reguliers BOOLEAN DEFAULT FALSE,

    -- Score et évaluation
    sante_score INTEGER DEFAULT 0 CHECK (sante_score >= 0 AND sante_score <= 100),
    sante_evaluation TEXT,
    sante_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Table: revenu_data
CREATE TABLE IF NOT EXISTS public.revenu_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Activité professionnelle
    statut_professionnel VARCHAR(50) CHECK (statut_professionnel IN ('salarie', 'independant', 'sans_emploi', 'retraite', 'etudiant')),
    taux_activite INTEGER CHECK (taux_activite >= 0 AND taux_activite <= 100),

    -- Revenus salariés
    salaire_brut_mensuel DECIMAL(10, 2),
    salaire_net_mensuel DECIMAL(10, 2),
    treizieme_salaire BOOLEAN DEFAULT FALSE,
    primes_variables DECIMAL(10, 2),

    -- Revenus indépendants
    ca_annuel_independant DECIMAL(12, 2),
    charges_annuelles_independant DECIMAL(12, 2),
    benefice_net_independant DECIMAL(12, 2),

    -- Autres revenus
    revenus_locatifs DECIMAL(10, 2),
    revenus_placements DECIMAL(10, 2),
    autres_revenus DECIMAL(10, 2),
    autres_revenus_description TEXT,

    -- Situation familiale
    situation_familiale VARCHAR(50) CHECK (situation_familiale IN ('celibataire', 'marie', 'concubin', 'divorce', 'veuf')),
    conjoint_revenus DECIMAL(10, 2),
    nombre_enfants_charge INTEGER DEFAULT 0,
    autres_personnes_charge INTEGER DEFAULT 0,

    -- Score et évaluation
    revenu_score INTEGER DEFAULT 0 CHECK (revenu_score >= 0 AND revenu_score <= 100),
    revenu_evaluation TEXT,
    revenu_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Table: biens_data
CREATE TABLE IF NOT EXISTS public.biens_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- RC privée
    rc_privee_existe BOOLEAN DEFAULT FALSE,
    rc_privee_nom VARCHAR(255),
    rc_privee_montant_couverture DECIMAL(12, 2),
    rc_privee_prime_annuelle DECIMAL(10, 2),
    rc_privee_document_url TEXT,

    -- Assurance ménage
    assurance_menage_existe BOOLEAN DEFAULT FALSE,
    assurance_menage_nom VARCHAR(255),
    assurance_menage_somme_assuree DECIMAL(12, 2),
    assurance_menage_prime_annuelle DECIMAL(10, 2),
    assurance_menage_document_url TEXT,

    -- Véhicules
    nombre_vehicules INTEGER DEFAULT 0,
    vehicules JSONB DEFAULT '[]'::jsonb, -- Array d'objets véhicule

    -- Protection juridique
    protection_juridique_existe BOOLEAN DEFAULT FALSE,
    protection_juridique_nom VARCHAR(255),
    protection_juridique_domaines TEXT[],
    protection_juridique_prime_annuelle DECIMAL(10, 2),

    -- Objets de valeur
    objets_valeur_existent BOOLEAN DEFAULT FALSE,
    objets_valeur_liste JSONB DEFAULT '[]'::jsonb,

    -- Score et évaluation
    biens_score INTEGER DEFAULT 0 CHECK (biens_score >= 0 AND biens_score <= 100),
    biens_evaluation TEXT,
    biens_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- ============================================================================
-- ÉTAGE 1: PLANIFICATION
-- ============================================================================

-- Table: vieillesse_data
CREATE TABLE IF NOT EXISTS public.vieillesse_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Planification générale
    age_actuel INTEGER,
    age_retraite_souhaite INTEGER,
    besoin_revenu_retraite_mensuel DECIMAL(10, 2),

    -- 1er pilier (AVS)
    annees_cotisation_avs INTEGER,
    lacunes_avs BOOLEAN DEFAULT FALSE,
    montant_rente_avs_estimee DECIMAL(10, 2),

    -- 2e pilier (LPP)
    lpp_existe BOOLEAN DEFAULT FALSE,
    lpp_nom_caisse VARCHAR(255),
    lpp_avoir_actuel DECIMAL(12, 2),
    lpp_cotisation_mensuelle_employee DECIMAL(10, 2),
    lpp_cotisation_mensuelle_employeur DECIMAL(10, 2),
    lpp_taux_conversion DECIMAL(5, 2),
    lpp_plan_prevoyance VARCHAR(50) CHECK (lpp_plan_prevoyance IN ('minimal', 'etendu', 'cadre')),
    lpp_certificat_url TEXT,
    lpp_possibilite_rachat BOOLEAN DEFAULT FALSE,
    lpp_montant_rachat_possible DECIMAL(12, 2),

    -- 3e pilier A
    pilier3a_existe BOOLEAN DEFAULT FALSE,
    pilier3a_montant_total DECIMAL(12, 2),
    pilier3a_nombre_comptes INTEGER,
    pilier3a_cotisation_annuelle DECIMAL(10, 2),
    pilier3a_institution VARCHAR(255),

    -- 3e pilier B
    pilier3b_existe BOOLEAN DEFAULT FALSE,
    pilier3b_type VARCHAR(50) CHECK (pilier3b_type IN ('assurance_vie', 'epargne_bancaire')),
    pilier3b_montant_total DECIMAL(12, 2),

    -- Autres placements
    autres_placements_retraite DECIMAL(12, 2),

    -- Score et évaluation
    vieillesse_score INTEGER DEFAULT 0 CHECK (vieillesse_score >= 0 AND vieillesse_score <= 100),
    vieillesse_evaluation TEXT,
    vieillesse_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Table: fortune_data
CREATE TABLE IF NOT EXISTS public.fortune_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Liquidités
    comptes_courants_total DECIMAL(12, 2),
    comptes_epargne_total DECIMAL(12, 2),

    -- Placements
    comptes_titres_existe BOOLEAN DEFAULT FALSE,
    comptes_titres_valeur DECIMAL(12, 2),
    comptes_titres_repartition JSONB DEFAULT '{
        "actions_suisses": 0,
        "actions_etrangeres": 0,
        "obligations": 0,
        "fonds": 0,
        "etf": 0,
        "autres": 0
    }'::jsonb,
    profil_risque VARCHAR(50) CHECK (profil_risque IN ('defensif', 'equilibre', 'dynamique', 'agressif')),
    horizon_placement INTEGER,

    -- Cryptomonnaies
    crypto_existe BOOLEAN DEFAULT FALSE,
    crypto_valeur DECIMAL(12, 2),
    crypto_types TEXT[],

    -- Métaux précieux
    metaux_precieux_existe BOOLEAN DEFAULT FALSE,
    metaux_precieux_valeur DECIMAL(12, 2),

    -- Autres actifs
    autres_actifs_existe BOOLEAN DEFAULT FALSE,
    autres_actifs_description TEXT,
    autres_actifs_valeur DECIMAL(12, 2),

    -- Dettes
    credits_consommation_existe BOOLEAN DEFAULT FALSE,
    credits_consommation_total DECIMAL(12, 2),
    credits_consommation_taux DECIMAL(5, 2),
    cartes_credit_solde DECIMAL(10, 2),
    autres_dettes_existe BOOLEAN DEFAULT FALSE,
    autres_dettes_montant DECIMAL(12, 2),
    autres_dettes_description TEXT,

    -- Fortune nette (calculée)
    fortune_nette DECIMAL(12, 2),

    -- Score et évaluation
    fortune_score INTEGER DEFAULT 0 CHECK (fortune_score >= 0 AND fortune_score <= 100),
    fortune_evaluation TEXT,
    fortune_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- ============================================================================
-- COMBLES: DÉVELOPPEMENT
-- ============================================================================

-- Table: immobilier_data
CREATE TABLE IF NOT EXISTS public.immobilier_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Situation actuelle
    statut_logement VARCHAR(50) CHECK (statut_logement IN ('proprietaire', 'locataire', 'loge_gratuitement')),

    -- Si locataire
    loyer_mensuel DECIMAL(10, 2),
    charges_mensuelles DECIMAL(10, 2),
    type_logement VARCHAR(255),
    surface_m2 DECIMAL(6, 2),

    -- Si propriétaire
    proprietaire_residence_principale BOOLEAN,
    proprietaire_valeur_estimee DECIMAL(12, 2),
    proprietaire_annee_achat INTEGER,
    proprietaire_prix_achat DECIMAL(12, 2),

    -- Hypothèque
    hypotheque_existe BOOLEAN DEFAULT FALSE,
    hypotheque_montant_initial DECIMAL(12, 2),
    hypotheque_montant_restant DECIMAL(12, 2),
    hypotheque_taux_interet DECIMAL(5, 2),
    hypotheque_type VARCHAR(50) CHECK (hypotheque_type IN ('fixe', 'libor', 'saron', 'variable')),
    hypotheque_duree_fixe INTEGER,
    hypotheque_echeance_fixe DATE,
    hypotheque_amortissement_annuel DECIMAL(10, 2),
    hypotheque_document_url TEXT,

    -- Autres biens
    autres_biens_existe BOOLEAN DEFAULT FALSE,
    autres_biens JSONB DEFAULT '[]'::jsonb,

    -- Projet d'achat
    projet_achat BOOLEAN DEFAULT FALSE,
    projet_achat_budget DECIMAL(12, 2),
    projet_achat_fonds_propres_disponibles DECIMAL(12, 2),
    projet_achat_delai VARCHAR(50),

    -- Calculs
    capacite_emprunt_maximale DECIMAL(12, 2),
    taux_endettement_actuel DECIMAL(5, 2),

    -- Score et évaluation
    immobilier_score INTEGER DEFAULT 0 CHECK (immobilier_score >= 0 AND immobilier_score <= 100),
    immobilier_evaluation TEXT,
    immobilier_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Table: budget_data
CREATE TABLE IF NOT EXISTS public.budget_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Revenus
    revenus_mensuels_nets_total DECIMAL(10, 2),

    -- Catégorie 1: Logement
    logement_loyer_hypotheque DECIMAL(10, 2) DEFAULT 0,
    logement_charges DECIMAL(10, 2) DEFAULT 0,
    logement_electricite DECIMAL(10, 2) DEFAULT 0,
    logement_chauffage DECIMAL(10, 2) DEFAULT 0,
    logement_eau DECIMAL(10, 2) DEFAULT 0,
    logement_internet_tv DECIMAL(10, 2) DEFAULT 0,
    logement_telephone DECIMAL(10, 2) DEFAULT 0,
    logement_entretien DECIMAL(10, 2) DEFAULT 0,
    logement_assurances DECIMAL(10, 2) DEFAULT 0,
    logement_total DECIMAL(10, 2),
    logement_pourcentage DECIMAL(5, 2),

    -- Catégorie 2: Vie courante
    vie_alimentation DECIMAL(10, 2) DEFAULT 0,
    vie_restaurants DECIMAL(10, 2) DEFAULT 0,
    vie_vetements DECIMAL(10, 2) DEFAULT 0,
    vie_coiffeur_beaute DECIMAL(10, 2) DEFAULT 0,
    vie_loisirs_sorties DECIMAL(10, 2) DEFAULT 0,
    vie_sport_abonnements DECIMAL(10, 2) DEFAULT 0,
    vie_animaux DECIMAL(10, 2) DEFAULT 0,
    vie_divers DECIMAL(10, 2) DEFAULT 0,
    vie_total DECIMAL(10, 2),
    vie_pourcentage DECIMAL(5, 2),

    -- Catégorie 3: Transports
    transport_voiture_leasing DECIMAL(10, 2) DEFAULT 0,
    transport_essence DECIMAL(10, 2) DEFAULT 0,
    transport_entretien_voiture DECIMAL(10, 2) DEFAULT 0,
    transport_parking DECIMAL(10, 2) DEFAULT 0,
    transport_transports_publics DECIMAL(10, 2) DEFAULT 0,
    transport_total DECIMAL(10, 2),
    transport_pourcentage DECIMAL(5, 2),

    -- Catégorie 4: Santé & Assurances
    sante_lamal DECIMAL(10, 2) DEFAULT 0,
    sante_lca DECIMAL(10, 2) DEFAULT 0,
    sante_franchise_quote_part DECIMAL(10, 2) DEFAULT 0,
    sante_medicaments DECIMAL(10, 2) DEFAULT 0,
    sante_dentiste DECIMAL(10, 2) DEFAULT 0,
    sante_rc_menage DECIMAL(10, 2) DEFAULT 0,
    sante_protection_juridique DECIMAL(10, 2) DEFAULT 0,
    sante_autres_assurances DECIMAL(10, 2) DEFAULT 0,
    sante_total DECIMAL(10, 2),
    sante_pourcentage DECIMAL(5, 2),

    -- Catégorie 5: Épargne & Prévoyance
    epargne_pilier3a DECIMAL(10, 2) DEFAULT 0,
    epargne_epargne_libre DECIMAL(10, 2) DEFAULT 0,
    epargne_placements DECIMAL(10, 2) DEFAULT 0,
    epargne_remboursement_dettes DECIMAL(10, 2) DEFAULT 0,
    epargne_total DECIMAL(10, 2),
    epargne_pourcentage DECIMAL(5, 2),

    -- Totaux calculés
    depenses_mensuelles_total DECIMAL(10, 2),
    solde_mensuel DECIMAL(10, 2),
    taux_epargne DECIMAL(5, 2),
    categories_problematiques TEXT[],

    -- Score et évaluation
    budget_score INTEGER DEFAULT 0 CHECK (budget_score >= 0 AND budget_score <= 100),
    budget_evaluation TEXT,
    budget_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- ============================================================================
-- TOITURE: OPTIMISATION
-- ============================================================================

-- Table: fiscalite_data
CREATE TABLE IF NOT EXISTS public.fiscalite_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Situation fiscale
    canton_residence VARCHAR(2),
    commune_residence VARCHAR(255),
    statut_fiscal VARCHAR(50) CHECK (statut_fiscal IN ('celibataire', 'marie_un_revenu', 'marie_deux_revenus', 'concubinage')),

    -- Base de calcul
    revenu_imposable_estime DECIMAL(12, 2),
    fortune_imposable_estimee DECIMAL(12, 2),

    -- Déductions
    deductions_lpp_pilier3a DECIMAL(10, 2),
    deductions_interets_hypothecaires DECIMAL(10, 2),
    deductions_frais_garde_enfants DECIMAL(10, 2),
    deductions_frais_formation DECIMAL(10, 2),
    deductions_dons DECIMAL(10, 2),
    deductions_pension_alimentaire DECIMAL(10, 2),

    -- Impôts estimés
    impots_federaux_estimes DECIMAL(12, 2),
    impots_cantonaux_estimes DECIMAL(12, 2),
    impots_communaux_estimes DECIMAL(12, 2),
    impots_total_annuel_estime DECIMAL(12, 2),
    taux_imposition_effectif DECIMAL(5, 2),

    -- Opportunités d'optimisation
    optimisations_possibles JSONB DEFAULT '[]'::jsonb,

    -- Score et évaluation
    fiscalite_score INTEGER DEFAULT 0 CHECK (fiscalite_score >= 0 AND fiscalite_score <= 100),
    fiscalite_evaluation TEXT,
    fiscalite_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Table: juridique_data
CREATE TABLE IF NOT EXISTS public.juridique_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maison_finances_id UUID NOT NULL REFERENCES public.maison_finances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Protection juridique
    protection_juridique_existe BOOLEAN DEFAULT FALSE,
    protection_juridique_domaines TEXT[],

    -- Documents
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
    regime_matrimonial VARCHAR(50) CHECK (regime_matrimonial IN ('separation_biens', 'communaute_biens', 'participation_acquets')),

    -- Organisation
    documents_importants_centralises BOOLEAN DEFAULT FALSE,
    personnes_confiance_informees BOOLEAN DEFAULT FALSE,

    -- Score et évaluation
    juridique_score INTEGER DEFAULT 0 CHECK (juridique_score >= 0 AND juridique_score <= 100),
    juridique_evaluation TEXT,
    juridique_recommandations TEXT[],

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- ============================================================================
-- INDEXES pour performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_maison_finances_user_id ON public.maison_finances(user_id);
CREATE INDEX IF NOT EXISTS idx_sante_data_user_id ON public.sante_data(user_id);
CREATE INDEX IF NOT EXISTS idx_revenu_data_user_id ON public.revenu_data(user_id);
CREATE INDEX IF NOT EXISTS idx_biens_data_user_id ON public.biens_data(user_id);
CREATE INDEX IF NOT EXISTS idx_vieillesse_data_user_id ON public.vieillesse_data(user_id);
CREATE INDEX IF NOT EXISTS idx_fortune_data_user_id ON public.fortune_data(user_id);
CREATE INDEX IF NOT EXISTS idx_immobilier_data_user_id ON public.immobilier_data(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_data_user_id ON public.budget_data(user_id);
CREATE INDEX IF NOT EXISTS idx_fiscalite_data_user_id ON public.fiscalite_data(user_id);
CREATE INDEX IF NOT EXISTS idx_juridique_data_user_id ON public.juridique_data(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
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

-- Policies pour maison_finances
CREATE POLICY "Users can view their own maison finances"
    ON public.maison_finances FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maison finances"
    ON public.maison_finances FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maison finances"
    ON public.maison_finances FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies pour toutes les tables de données (pattern identique)
CREATE POLICY "Users can view their own sante data"
    ON public.sante_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sante data"
    ON public.sante_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sante data"
    ON public.sante_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own revenu data"
    ON public.revenu_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own revenu data"
    ON public.revenu_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own revenu data"
    ON public.revenu_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own biens data"
    ON public.biens_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own biens data"
    ON public.biens_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own biens data"
    ON public.biens_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own vieillesse data"
    ON public.vieillesse_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vieillesse data"
    ON public.vieillesse_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vieillesse data"
    ON public.vieillesse_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fortune data"
    ON public.fortune_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fortune data"
    ON public.fortune_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fortune data"
    ON public.fortune_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own immobilier data"
    ON public.immobilier_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own immobilier data"
    ON public.immobilier_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own immobilier data"
    ON public.immobilier_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own budget data"
    ON public.budget_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budget data"
    ON public.budget_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budget data"
    ON public.budget_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fiscalite data"
    ON public.fiscalite_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fiscalite data"
    ON public.fiscalite_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fiscalite data"
    ON public.fiscalite_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own juridique data"
    ON public.juridique_data FOR SELECT
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own juridique data"
    ON public.juridique_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own juridique data"
    ON public.juridique_data FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS pour mise à jour automatique des timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
