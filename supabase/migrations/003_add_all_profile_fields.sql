-- Migration: Ajout de TOUS les champs manquants au profil utilisateur
-- Date: 2025-01-15
-- Description: Ajout des champs pour dashboard et recherche LPP

-- Cette migration vérifie et ajoute les colonnes seulement si elles n'existent pas
DO $$
BEGIN
    -- Date de naissance
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'date_naissance'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN date_naissance DATE;
    END IF;

    -- Adresse
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'adresse'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN adresse TEXT;
    END IF;

    -- NPA (code postal)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'npa'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN npa TEXT;
    END IF;

    -- Ville
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'ville'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN ville TEXT;
    END IF;

    -- Statut professionnel
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'statut_professionnel'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN statut_professionnel TEXT;
    END IF;

    -- Carte d'identité (recto)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'carte_identite_recto_url'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN carte_identite_recto_url TEXT;
    END IF;

    -- Carte d'identité (verso)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'carte_identite_verso_url'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN carte_identite_verso_url TEXT;
    END IF;

    -- Genre
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'genre'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN genre TEXT CHECK (genre IN ('homme', 'femme', 'autre'));
    END IF;

    -- Nationalité
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'nationalite'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN nationalite TEXT;
    END IF;

    -- Téléphone
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'telephone'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN telephone TEXT;
    END IF;

    -- Langue
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'langue'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN langue TEXT CHECK (langue IN ('francais', 'allemand', 'italien', 'romanche', 'anglais'));
    END IF;

    -- Numéro AVS
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'numero_avs'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN numero_avs TEXT;
    END IF;

    -- Caisse de pension
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'caisse_pension'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN caisse_pension TEXT;
    END IF;

    -- Activité lucrative en Suisse
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'activite_lucrative_suisse'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN activite_lucrative_suisse BOOLEAN DEFAULT NULL;
    END IF;

    -- Nombre d'enfants
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'nombre_enfants'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN nombre_enfants INTEGER DEFAULT 0;
    END IF;

    -- Profession
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'profession'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN profession TEXT;
    END IF;

    -- Employeur
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'employeur'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN employeur TEXT;
    END IF;

    -- Revenu annuel
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'revenu_annuel'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN revenu_annuel NUMERIC(12,2);
    END IF;

    -- Revenu mensuel
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'revenu_mensuel'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN revenu_mensuel NUMERIC(12,2);
    END IF;

    -- Statut logement
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'statut_logement'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN statut_logement TEXT CHECK (statut_logement IN ('proprietaire', 'locataire', 'loge_gratuitement', 'autre'));
    END IF;

    -- Loyer mensuel
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'loyer_mensuel'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN loyer_mensuel NUMERIC(10,2);
    END IF;
END $$;

-- Commentaires pour documentation
COMMENT ON COLUMN user_profiles.date_naissance IS 'Date de naissance de l''utilisateur';
COMMENT ON COLUMN user_profiles.adresse IS 'Adresse complète (rue et numéro)';
COMMENT ON COLUMN user_profiles.npa IS 'Code postal (NPA)';
COMMENT ON COLUMN user_profiles.ville IS 'Ville de résidence';
COMMENT ON COLUMN user_profiles.statut_professionnel IS 'Statut professionnel (employé, indépendant, retraité, etc.)';
COMMENT ON COLUMN user_profiles.carte_identite_recto_url IS 'URL de l''image recto de la carte d''identité';
COMMENT ON COLUMN user_profiles.carte_identite_verso_url IS 'URL de l''image verso de la carte d''identité';
COMMENT ON COLUMN user_profiles.genre IS 'Genre: homme, femme, autre';
COMMENT ON COLUMN user_profiles.nationalite IS 'Nationalité (ex: Suisse, Française, etc.)';
COMMENT ON COLUMN user_profiles.telephone IS 'Numéro de téléphone (format: +41 XX XXX XX XX)';
COMMENT ON COLUMN user_profiles.langue IS 'Langue principale: francais, allemand, italien, romanche, anglais';
COMMENT ON COLUMN user_profiles.numero_avs IS 'Numéro AVS (format: 756.XXXX.XXXX.XX)';
COMMENT ON COLUMN user_profiles.caisse_pension IS 'Nom de la caisse de pension (LPP)';
COMMENT ON COLUMN user_profiles.activite_lucrative_suisse IS 'A une activité lucrative en Suisse (Oui/Non)';
COMMENT ON COLUMN user_profiles.nombre_enfants IS 'Nombre d''enfants à charge';
COMMENT ON COLUMN user_profiles.profession IS 'Profession / métier exercé';
COMMENT ON COLUMN user_profiles.employeur IS 'Nom de l''employeur actuel';
COMMENT ON COLUMN user_profiles.revenu_annuel IS 'Revenu annuel brut en CHF';
COMMENT ON COLUMN user_profiles.revenu_mensuel IS 'Revenu mensuel brut en CHF';
COMMENT ON COLUMN user_profiles.statut_logement IS 'Statut du logement: proprietaire, locataire, loge_gratuitement, autre';
COMMENT ON COLUMN user_profiles.loyer_mensuel IS 'Montant du loyer mensuel en CHF (si locataire)';

-- Afficher les colonnes de la table après migration
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
