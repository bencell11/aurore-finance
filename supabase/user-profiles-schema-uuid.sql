-- ============================================================================
-- USER PROFILES - SCHEMA avec user_id UUID (Supabase Auth)
-- ============================================================================
-- Ce script crée la table user_profiles pour fonctionner avec Supabase Auth
-- user_id est de type UUID et correspond à auth.uid()
-- ============================================================================
-- ⚠️ ATTENTION : Ce script supprime et recrée la table user_profiles
-- Toutes les données existantes seront perdues !
-- ============================================================================

-- Supprimer complètement l'ancienne table avec CASCADE
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Créer la nouvelle table avec user_id UUID
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
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
-- ROW LEVEL SECURITY (RLS) - ACTIVÉ pour Supabase Auth
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour SELECT
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Politique pour INSERT
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique pour UPDATE
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique pour DELETE
CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

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
