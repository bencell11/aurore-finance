-- Migration: Ajout de nouveaux champs au profil utilisateur
-- Date: 2025-01-XX
-- Description: Ajout des champs pour synchronisation avec recherche LPP

-- Informations personnelles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS carte_identite_recto_url TEXT,
ADD COLUMN IF NOT EXISTS carte_identite_verso_url TEXT,
ADD COLUMN IF NOT EXISTS genre TEXT CHECK (genre IN ('homme', 'femme', 'autre')),
ADD COLUMN IF NOT EXISTS nationalite TEXT;

-- Contact
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS telephone TEXT,
ADD COLUMN IF NOT EXISTS langue TEXT CHECK (langue IN ('francais', 'allemand', 'italien', 'romanche', 'anglais'));

-- Professionnel
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS numero_avs TEXT,
ADD COLUMN IF NOT EXISTS caisse_pension TEXT,
ADD COLUMN IF NOT EXISTS activite_lucrative_suisse BOOLEAN DEFAULT NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN user_profiles.carte_identite_recto_url IS 'URL de l''image recto de la carte d''identité';
COMMENT ON COLUMN user_profiles.carte_identite_verso_url IS 'URL de l''image verso de la carte d''identité';
COMMENT ON COLUMN user_profiles.genre IS 'Genre: homme, femme, autre';
COMMENT ON COLUMN user_profiles.nationalite IS 'Nationalité (ex: Suisse, Française, etc.)';
COMMENT ON COLUMN user_profiles.telephone IS 'Numéro de téléphone (format: +41 XX XXX XX XX)';
COMMENT ON COLUMN user_profiles.langue IS 'Langue principale: francais, allemand, italien, romanche, anglais';
COMMENT ON COLUMN user_profiles.numero_avs IS 'Numéro AVS (format: 756.XXXX.XXXX.XX)';
COMMENT ON COLUMN user_profiles.caisse_pension IS 'Nom de la caisse de pension (LPP)';
COMMENT ON COLUMN user_profiles.activite_lucrative_suisse IS 'A une activité lucrative en Suisse (Oui/Non)';
