-- Migration pour ajouter les colonnes manquantes dans financial_profiles
-- À exécuter dans Supabase SQL Editor

-- Vérifier et ajouter les colonnes manquantes si elles n'existent pas
DO $$
BEGIN
    -- Ajouter charges_logement si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'charges_logement'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN charges_logement DECIMAL(10,2);
    END IF;

    -- Ajouter charges_assurances si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'charges_assurances'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN charges_assurances DECIMAL(10,2);
    END IF;

    -- Ajouter autres_charges si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'autres_charges'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN autres_charges DECIMAL(10,2);
    END IF;

    -- Ajouter revenu_brut_annuel si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'revenu_brut_annuel'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN revenu_brut_annuel DECIMAL(12,2);
    END IF;

    -- Ajouter autres_revenus si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'autres_revenus'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN autres_revenus DECIMAL(12,2);
    END IF;

    -- Ajouter objectifs_financiers si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'objectifs_financiers'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN objectifs_financiers TEXT[];
    END IF;

    -- Ajouter tolerance_risque si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'tolerance_risque'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN tolerance_risque TEXT CHECK (tolerance_risque IN ('conservateur', 'moderee', 'dynamique', 'agressif'));
    END IF;

    -- Ajouter horizon_investissement si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'horizon_investissement'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN horizon_investissement TEXT;
    END IF;

    -- Ajouter niveau_connaissances si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'niveau_connaissances'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN niveau_connaissances TEXT CHECK (niveau_connaissances IN ('debutant', 'intermediaire', 'avance', 'expert'));
    END IF;

    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'financial_profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.financial_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Afficher les colonnes de la table après migration
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'financial_profiles'
ORDER BY ordinal_position;
