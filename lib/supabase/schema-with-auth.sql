-- Schema Supabase pour Aurore Finance avec Authentification
-- NOUVEAU: Utilise auth.uid() au lieu de user_id TEXT

-- ===== CONFIGURATION AUTHENTIFICATION =====
-- Avant de lancer ce script:
-- 1. Dans Supabase Dashboard → Authentication → Providers
-- 2. Activer "Email" provider
-- 3. Désactiver "Confirm email" pour le développement (optionnel)

-- ===== MODIFICATION DES TABLES =====

-- 1. Supprimer les anciennes policies et tables (si existantes)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can view own favorites" ON real_estate_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON real_estate_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON real_estate_favorites;
DROP POLICY IF EXISTS "Users can view own alerts" ON real_estate_alerts;
DROP POLICY IF EXISTS "Users can insert own alerts" ON real_estate_alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON real_estate_alerts;
DROP POLICY IF EXISTS "Users can delete own alerts" ON real_estate_alerts;
DROP POLICY IF EXISTS "Users can view own documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can view own simulations" ON mortgage_simulations;
DROP POLICY IF EXISTS "Users can insert own simulations" ON mortgage_simulations;
DROP POLICY IF EXISTS "Users can delete own simulations" ON mortgage_simulations;

-- 2. Modifier user_profiles pour utiliser auth.users
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS user_id;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key ON user_profiles(user_id);

-- 3. Modifier les autres tables
ALTER TABLE financial_goals DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE financial_goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE real_estate_favorites DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE real_estate_favorites ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE real_estate_alerts DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE real_estate_alerts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE generated_documents DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ai_conversations DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE mortgage_simulations DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE mortgage_simulations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ===== NOUVELLES RLS POLICIES AVEC auth.uid() =====

-- user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- financial_goals
CREATE POLICY "Users can view own goals" ON financial_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON financial_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON financial_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON financial_goals
  FOR DELETE USING (auth.uid() = user_id);

-- real_estate_favorites
CREATE POLICY "Users can view own favorites" ON real_estate_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON real_estate_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON real_estate_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- real_estate_alerts
CREATE POLICY "Users can view own alerts" ON real_estate_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON real_estate_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON real_estate_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON real_estate_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- generated_documents
CREATE POLICY "Users can view own documents" ON generated_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON generated_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON generated_documents
  FOR DELETE USING (auth.uid() = user_id);

-- ai_conversations
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- mortgage_simulations
CREATE POLICY "Users can view own simulations" ON mortgage_simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON mortgage_simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations" ON mortgage_simulations
  FOR DELETE USING (auth.uid() = user_id);

-- ===== FONCTION AUTO-CRÉATION PROFIL =====

-- Fonction appelée automatiquement après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===== VUE DASHBOARD =====

CREATE OR REPLACE VIEW user_dashboard AS
SELECT
  up.user_id,
  up.nom,
  up.prenom,
  up.email,
  up.date_naissance,
  up.revenu_annuel,
  up.revenu_mensuel,
  up.situation_familiale,
  up.nombre_enfants,
  up.adresse,
  up.npa,
  up.ville,
  up.canton,
  up.statut_professionnel,
  up.employeur,
  up.profession,
  up.statut_logement,
  up.loyer_mensuel,
  COUNT(DISTINCT fg.id) as nombre_objectifs,
  SUM(CASE WHEN fg.statut = 'complete' THEN 1 ELSE 0 END) as objectifs_completes,
  COUNT(DISTINCT ref.id) as nombre_favoris,
  COUNT(DISTINCT rea.id) as nombre_alertes,
  COUNT(DISTINCT gd.id) as nombre_documents,
  COUNT(DISTINCT ms.id) as nombre_simulations,
  up.created_at,
  up.updated_at,
  up.last_synced_at
FROM user_profiles up
LEFT JOIN financial_goals fg ON up.user_id = fg.user_id
LEFT JOIN real_estate_favorites ref ON up.user_id = ref.user_id
LEFT JOIN real_estate_alerts rea ON up.user_id = rea.user_id
LEFT JOIN generated_documents gd ON up.user_id = gd.user_id
LEFT JOIN mortgage_simulations ms ON up.user_id = ms.user_id
GROUP BY
  up.user_id, up.nom, up.prenom, up.email, up.date_naissance,
  up.revenu_annuel, up.revenu_mensuel, up.situation_familiale,
  up.nombre_enfants, up.adresse, up.npa, up.ville, up.canton,
  up.statut_professionnel, up.employeur, up.profession,
  up.statut_logement, up.loyer_mensuel,
  up.created_at, up.updated_at, up.last_synced_at;

-- ===== NOTES D'IMPLÉMENTATION =====
-- Après avoir exécuté ce script:
-- 1. Dans Supabase Dashboard → Authentication → Email Templates
--    Personnaliser les emails si nécessaire
-- 2. Dans votre code Next.js, utiliser:
--    - supabase.auth.signUp() pour inscription
--    - supabase.auth.signInWithPassword() pour connexion
--    - supabase.auth.getUser() pour obtenir l'utilisateur
-- 3. Le profil sera créé automatiquement à l'inscription
