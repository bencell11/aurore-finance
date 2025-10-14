-- Schema Supabase pour Aurore Finance
-- Tables de profil utilisateur et données persistantes

-- Table profil utilisateur
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- ID utilisateur (auth externe ou session)
  email TEXT,

  -- Informations personnelles
  nom TEXT,
  prenom TEXT,
  date_naissance DATE,

  -- Informations fiscales
  revenu_annuel DECIMAL(12, 2),
  revenu_mensuel DECIMAL(12, 2),
  situation_familiale TEXT, -- 'celibataire', 'marie', 'divorce', 'veuf', 'concubinage'
  nombre_enfants INTEGER DEFAULT 0,

  -- Localisation
  adresse TEXT,
  npa TEXT,
  ville TEXT,
  canton TEXT,

  -- Informations professionnelles
  statut_professionnel TEXT, -- 'salarie', 'independant', 'retraite', 'etudiant', 'sans_emploi'
  employeur TEXT,
  profession TEXT,

  -- Informations bancaires (optionnel)
  iban TEXT,
  banque TEXT,

  -- Informations immobilières
  statut_logement TEXT, -- 'locataire', 'proprietaire', 'heberge'
  loyer_mensuel DECIMAL(10, 2),

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table objectifs financiers
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  type TEXT NOT NULL, -- 'epargne', 'investissement', 'achat_immobilier', 'retraite', 'education'
  nom TEXT NOT NULL,
  description TEXT,

  montant_cible DECIMAL(12, 2),
  montant_actuel DECIMAL(12, 2) DEFAULT 0,

  date_debut DATE,
  date_cible DATE,

  priorite INTEGER DEFAULT 3, -- 1 (faible) à 5 (très haute)
  statut TEXT DEFAULT 'en_cours', -- 'en_cours', 'complete', 'abandonne', 'en_pause'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON financial_goals(user_id);

-- Table favoris immobiliers
CREATE TABLE IF NOT EXISTS real_estate_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  property_id TEXT NOT NULL,
  property_data JSONB NOT NULL, -- Stockage complet de la propriété

  notes TEXT,
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_user_id ON real_estate_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_property_id ON real_estate_favorites(property_id);

-- Table alertes immobilières
CREATE TABLE IF NOT EXISTS real_estate_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  nom TEXT NOT NULL,
  criteria JSONB NOT NULL, -- Critères de recherche
  frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'instant'

  active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_real_estate_alerts_user_id ON real_estate_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_alerts_active ON real_estate_alerts(active);

-- Table documents générés
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  template_used TEXT,
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_type ON generated_documents(type);

-- Table historique conversations IA
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  type TEXT NOT NULL, -- 'tax_assistant', 'document_generator', 'real_estate'

  messages JSONB NOT NULL, -- Historique des messages
  context JSONB, -- Contexte de la conversation

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_type ON ai_conversations(type);

-- Table simulations hypothécaires sauvegardées
CREATE TABLE IF NOT EXISTS mortgage_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  property_price DECIMAL(12, 2) NOT NULL,
  down_payment DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 4) NOT NULL,
  duration INTEGER NOT NULL,

  simulation_result JSONB NOT NULL,

  nom TEXT, -- Nom donné à la simulation
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mortgage_simulations_user_id ON mortgage_simulations(user_id);

-- Row Level Security (RLS) pour sécuriser les données

-- Activer RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_simulations ENABLE ROW LEVEL SECURITY;

-- Politiques RLS : Les utilisateurs peuvent seulement voir/modifier leurs propres données

-- user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- financial_goals
CREATE POLICY "Users can view own goals" ON financial_goals
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own goals" ON financial_goals
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own goals" ON financial_goals
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own goals" ON financial_goals
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- real_estate_favorites
CREATE POLICY "Users can view own favorites" ON real_estate_favorites
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own favorites" ON real_estate_favorites
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own favorites" ON real_estate_favorites
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- real_estate_alerts
CREATE POLICY "Users can view own alerts" ON real_estate_alerts
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own alerts" ON real_estate_alerts
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own alerts" ON real_estate_alerts
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own alerts" ON real_estate_alerts
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- generated_documents
CREATE POLICY "Users can view own documents" ON generated_documents
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own documents" ON generated_documents
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own documents" ON generated_documents
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- ai_conversations
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- mortgage_simulations
CREATE POLICY "Users can view own simulations" ON mortgage_simulations
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own simulations" ON mortgage_simulations
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own simulations" ON mortgage_simulations
  FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Fonction helper pour obtenir ou créer un profil utilisateur
CREATE OR REPLACE FUNCTION get_or_create_user_profile(p_user_id TEXT, p_email TEXT DEFAULT NULL)
RETURNS user_profiles AS $$
DECLARE
  v_profile user_profiles;
BEGIN
  -- Chercher le profil existant
  SELECT * INTO v_profile FROM user_profiles WHERE user_id = p_user_id;

  -- Si pas trouvé, créer un nouveau profil
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, email)
    VALUES (p_user_id, p_email)
    RETURNING * INTO v_profile;
  END IF;

  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vues utiles

-- Vue résumé utilisateur
CREATE OR REPLACE VIEW user_summary AS
SELECT
  up.user_id,
  up.nom,
  up.prenom,
  up.email,
  up.revenu_mensuel,
  up.canton,
  COUNT(DISTINCT fg.id) as nombre_objectifs,
  COUNT(DISTINCT ref.id) as nombre_favoris,
  COUNT(DISTINCT rea.id) as nombre_alertes,
  COUNT(DISTINCT gd.id) as nombre_documents,
  up.created_at,
  up.updated_at
FROM user_profiles up
LEFT JOIN financial_goals fg ON up.user_id = fg.user_id
LEFT JOIN real_estate_favorites ref ON up.user_id = ref.user_id
LEFT JOIN real_estate_alerts rea ON up.user_id = rea.user_id
LEFT JOIN generated_documents gd ON up.user_id = gd.user_id
GROUP BY up.user_id, up.nom, up.prenom, up.email, up.revenu_mensuel, up.canton, up.created_at, up.updated_at;
