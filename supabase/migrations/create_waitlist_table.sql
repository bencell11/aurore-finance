-- Créer la table waitlist si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Créer un index sur l'email pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Créer un index sur created_at pour trier par date
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Activer Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion depuis l'API
CREATE POLICY "Allow API to insert waitlist entries" ON public.waitlist
    FOR INSERT
    WITH CHECK (true);

-- Politique pour permettre la lecture du compteur
CREATE POLICY "Allow count queries" ON public.waitlist
    FOR SELECT
    USING (true);

-- Fonction pour envoyer un email de bienvenue automatiquement
CREATE OR REPLACE FUNCTION public.send_waitlist_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Cette fonction sera appelée automatiquement après chaque insertion
    -- Supabase peut être configuré pour envoyer des emails via des hooks
    PERFORM pg_notify('waitlist_signup', json_build_object(
        'email', NEW.email,
        'created_at', NEW.created_at
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour envoyer l'email
CREATE TRIGGER on_waitlist_signup
    AFTER INSERT ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION public.send_waitlist_welcome_email();

-- Commenter pour information
COMMENT ON TABLE public.waitlist IS 'Table pour stocker les inscriptions à la liste d''attente';
COMMENT ON COLUMN public.waitlist.email IS 'Email de l''utilisateur inscrit';
COMMENT ON COLUMN public.waitlist.status IS 'Statut de l''inscription: pending, confirmed, invited, etc.';
COMMENT ON COLUMN public.waitlist.metadata IS 'Métadonnées supplémentaires en JSON';