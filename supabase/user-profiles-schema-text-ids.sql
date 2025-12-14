-- ============================================================================
-- USER PROFILES - SCHEMA avec user_id TEXT
-- ============================================================================
-- Ce script crée ou migre la table user_profiles pour utiliser user_id TEXT
-- au lieu de UUID, compatible avec le système d'authentification local
-- ============================================================================
-- ⚠️ ATTENTION : Ce script supprime et recrée la table user_profiles
-- Toutes les données existantes seront perdues !
-- ============================================================================

-- Supprimer complètement l'ancienne table avec CASCADE
-- Cela supprimera aussi toutes les dépendances (foreign keys, indexes, policies, triggers)
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Créer la nouvelle table avec user_id TEXT
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT,

  -- Informations personnelles
  nom TEXT,
  prenom TEXT,
  date_naissance DATE,
  carte_identite_recto_url TEXT,
  carte_identite_verso_url TEXT,
  genre TEXT CHECK (genre IN ('homme', 'femme', 'autre')),
  nationalite TEXT,

  -- Informations fiscales
  revenu_annuel NUMERIC(12, 2),
  revenu_mensuel NUMERIC(10, 2),
  situation_familiale TEXT CHECK (situation_familiale IN ('celibataire', 'marie', 'divorce', 'veuf', 'concubinage')),
  nombre_enfants INTEGER DEFAULT 0,

  -- Localisation & Contact
  adresse TEXT,
  npa TEXT,
  ville TEXT,
  canton TEXT,
  telephone TEXT,
  langue TEXT CHECK (langue IN ('francais', 'allemand', 'italien', 'romanche', 'anglais')),

  -- Informations professionnelles
  statut_professionnel TEXT CHECK (statut_professionnel IN ('salarie', 'independant', 'retraite', 'etudiant', 'sans_emploi')),
  employeur TEXT,
  profession TEXT,
  numero_avs TEXT,
  caisse_pension TEXT,
  activite_lucrative_suisse BOOLEAN DEFAULT TRUE,

  -- Informations bancaires
  iban TEXT,
  banque TEXT,

  -- Informations immobilières
  statut_logement TEXT CHECK (statut_logement IN ('locataire', 'proprietaire', 'heberge')),
  loyer_mensuel NUMERIC(10, 2),

  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour SELECT
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique pour INSERT
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique pour UPDATE
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Politique pour DELETE
CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO anon;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- Vérification: Afficher la structure de la table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;
