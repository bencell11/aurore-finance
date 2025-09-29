-- Migration pour créer les tables de l'assistant fiscal suisse
-- Remplace le système de storage en mémoire par une vraie base de données

-- ====================================
-- Table des profils fiscaux
-- ====================================
CREATE TABLE tax_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations personnelles (chiffrées)
  personal_info JSONB NOT NULL DEFAULT '{}',
  personal_info_encrypted TEXT, -- Version chiffrée pour RGPD
  
  -- Données de revenus (chiffrées)
  income_data JSONB NOT NULL DEFAULT '{}',
  income_data_encrypted TEXT,
  
  -- Déductions fiscales
  deductions JSONB NOT NULL DEFAULT '{}',
  deductions_encrypted TEXT,
  
  -- Patrimoine et fortune (chiffrés)
  assets JSONB NOT NULL DEFAULT '{}',
  assets_encrypted TEXT,
  
  -- Immobilier
  real_estate JSONB NOT NULL DEFAULT '[]',
  
  -- Documents attachés
  documents JSONB NOT NULL DEFAULT '[]',
  
  -- Statut de complétion
  completion_status JSONB NOT NULL DEFAULT '{
    "overall": 0,
    "sections": {
      "personalInfo": false,
      "income": false, 
      "deductions": false,
      "assets": false,
      "realEstate": false,
      "documents": false
    },
    "lastModified": null,
    "readyForSubmission": false
  }',
  
  -- Métadonnées
  canton VARCHAR(2) NOT NULL DEFAULT 'GE',
  tax_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index pour performance
  CONSTRAINT valid_canton CHECK (canton IN ('AG','AI','AR','BE','BL','BS','FR','GE','GL','GR','JU','LU','NE','NW','OW','SG','SH','SO','SZ','TG','TI','UR','VD','VS','ZG','ZH'))
);

-- ====================================
-- Table des calculs fiscaux
-- ====================================
CREATE TABLE tax_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES tax_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Résultats du calcul
  canton VARCHAR(2) NOT NULL,
  tax_year INTEGER NOT NULL,
  gross_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  taxable_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  taxable_wealth DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Impôts calculés
  federal_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  cantonal_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  communal_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  church_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Taux
  effective_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  marginal_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Impôt à la source
  withheld_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  remaining_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Détails des calculs (JSON)
  deductions_breakdown JSONB NOT NULL DEFAULT '{}',
  calculation_details JSONB NOT NULL DEFAULT '{}',
  
  -- Métadonnées
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  calculation_method VARCHAR(50) DEFAULT 'swiss_official_formulas',
  
  -- Index pour les requêtes fréquentes
  INDEX idx_tax_calculations_profile_year ON tax_calculations(profile_id, tax_year),
  INDEX idx_tax_calculations_user_year ON tax_calculations(user_id, tax_year)
);

-- ====================================
-- Table des optimisations fiscales
-- ====================================
CREATE TABLE tax_optimizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES tax_profiles(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES tax_calculations(id) ON DELETE CASCADE,
  
  -- Type d'optimisation
  optimization_type VARCHAR(50) NOT NULL, -- 'pillar3a', 'professional_expenses', etc.
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Impact financier
  potential_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  effort VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'easy', 'medium', 'complex'
  
  -- Délais et actions
  deadline DATE,
  action_required TEXT,
  
  -- Statut
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'applied', 'dismissed'
  applied_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- Table des documents exportés
-- ====================================
CREATE TABLE tax_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES tax_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Type d'export
  export_format VARCHAR(20) NOT NULL, -- 'PDF', 'HTML', 'TAX', 'OFFICIAL_HTML'
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  
  -- Contenu (pour les petits fichiers)
  content TEXT,
  
  -- Référence stockage externe (pour gros fichiers)
  storage_path VARCHAR(500),
  
  -- Métadonnées
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canton VARCHAR(2) NOT NULL,
  tax_year INTEGER NOT NULL,
  
  -- Sécurité et audit
  downloaded_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- ====================================
-- Table d'audit et logs RGPD
-- ====================================
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Action effectuée
  action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'export'
  resource_type VARCHAR(50) NOT NULL, -- 'tax_profile', 'calculation', 'export'
  resource_id UUID,
  
  -- Détails
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  
  -- Conformité RGPD
  data_subject_consent BOOLEAN DEFAULT false,
  retention_period INTERVAL DEFAULT INTERVAL '7 years',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- Politiques de sécurité RLS (Row Level Security)
-- ====================================

-- Activer RLS sur toutes les tables
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques : les utilisateurs ne voient que leurs propres données
CREATE POLICY "Users can only access their own tax profiles" ON tax_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own calculations" ON tax_calculations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own optimizations" ON tax_optimizations
  FOR ALL USING (
    profile_id IN (SELECT id FROM tax_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can only access their own exports" ON tax_exports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own audit logs" ON audit_logs
  FOR ALL USING (auth.uid() = user_id);

-- ====================================
-- Fonctions utilitaires
-- ====================================

-- Fonction pour chiffrer les données sensibles
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Chiffrer les données sensibles avant insertion/update
  -- (Implémentation dépend de la stratégie de chiffrement choisie)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour automatiquement last_updated
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_encrypt_tax_profiles
  BEFORE INSERT OR UPDATE ON tax_profiles
  FOR EACH ROW EXECUTE FUNCTION encrypt_sensitive_data();

CREATE TRIGGER trigger_update_tax_profiles_timestamp
  BEFORE UPDATE ON tax_profiles
  FOR EACH ROW EXECUTE FUNCTION update_last_updated();

-- ====================================
-- Index pour les performances
-- ====================================
CREATE INDEX idx_tax_profiles_user_canton ON tax_profiles(user_id, canton);
CREATE INDEX idx_tax_profiles_year ON tax_profiles(tax_year);
CREATE INDEX idx_tax_calculations_total_tax ON tax_calculations(total_tax);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);

-- ====================================
-- Vues pour l'API
-- ====================================

-- Vue pour le résumé fiscal utilisateur
CREATE VIEW user_tax_summary AS
SELECT 
  tp.id as profile_id,
  tp.user_id,
  tp.canton,
  tp.tax_year,
  tp.completion_status,
  tc.total_tax,
  tc.effective_rate,
  tc.calculated_at,
  COUNT(to_opt.id) as available_optimizations,
  SUM(to_opt.potential_savings) as potential_savings
FROM tax_profiles tp
LEFT JOIN tax_calculations tc ON tp.id = tc.profile_id
LEFT JOIN tax_optimizations to_opt ON tp.id = to_opt.profile_id 
  AND to_opt.status = 'pending'
GROUP BY tp.id, tc.id;

-- Vue pour l'historique des calculs
CREATE VIEW tax_calculation_history AS
SELECT 
  tc.*,
  tp.canton,
  tp.completion_status->>'overall' as profile_completion
FROM tax_calculations tc
JOIN tax_profiles tp ON tc.profile_id = tp.id
ORDER BY tc.calculated_at DESC;