-- Extension pour le module fiscal
-- Ajout aux tables existantes dans schema.sql

-- Table pour les profils fiscaux complets
CREATE TABLE public.tax_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anonymized_id TEXT UNIQUE NOT NULL,
  
  -- Informations personnelles
  civil_status TEXT CHECK (civil_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'registered_partnership')),
  canton TEXT NOT NULL,
  commune TEXT NOT NULL,
  number_of_children INTEGER DEFAULT 0,
  confession TEXT CHECK (confession IN ('protestant', 'catholic', 'other', 'none')),
  taxation_mode TEXT CHECK (taxation_mode IN ('individual', 'family')),
  
  -- Données chiffrées sensibles
  encrypted_personal_data TEXT, -- Contient AVS, date naissance, etc.
  
  -- Statut de complétion
  completion_status JSONB DEFAULT '{"overall": 0, "sections": {"personalInfo": false, "income": false, "deductions": false, "assets": false, "realEstate": false, "documents": false}}',
  ready_for_submission BOOLEAN DEFAULT FALSE,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_declaration_year INTEGER,
  
  UNIQUE(user_id)
);

-- Table pour les données de revenus
CREATE TABLE public.tax_income_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  
  -- Emploi principal
  main_employer TEXT,
  gross_salary DECIMAL(12,2) DEFAULT 0,
  net_salary DECIMAL(12,2) DEFAULT 0,
  
  -- Déductions sociales
  avs_deduction DECIMAL(10,2) DEFAULT 0,
  ai_deduction DECIMAL(10,2) DEFAULT 0,
  ac_deduction DECIMAL(10,2) DEFAULT 0,
  lpp_deduction DECIMAL(10,2) DEFAULT 0,
  
  -- Autres revenus
  self_employment_income DECIMAL(12,2) DEFAULT 0,
  rental_income DECIMAL(12,2) DEFAULT 0,
  pension_income DECIMAL(12,2) DEFAULT 0,
  unemployment_benefits DECIMAL(12,2) DEFAULT 0,
  military_compensation DECIMAL(12,2) DEFAULT 0,
  other_income JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tax_profile_id, year)
);

-- Table pour les déductions fiscales
CREATE TABLE public.tax_deductions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  
  -- Frais professionnels
  transport_costs DECIMAL(10,2) DEFAULT 0,
  meal_costs DECIMAL(10,2) DEFAULT 0,
  other_professional_expenses DECIMAL(10,2) DEFAULT 0,
  home_office_deduction DECIMAL(10,2) DEFAULT 0,
  
  -- Primes d'assurance
  health_insurance DECIMAL(10,2) DEFAULT 0,
  life_insurance DECIMAL(10,2) DEFAULT 0,
  accident_insurance DECIMAL(10,2) DEFAULT 0,
  
  -- Épargne et prévoyance
  pillar_3a DECIMAL(10,2) DEFAULT 0,
  pillar_3b DECIMAL(10,2) DEFAULT 0,
  lpp_voluntary DECIMAL(10,2) DEFAULT 0,
  
  -- Autres déductions
  childcare_expenses DECIMAL(10,2) DEFAULT 0,
  donations_amount DECIMAL(10,2) DEFAULT 0,
  alimony_paid DECIMAL(10,2) DEFAULT 0,
  real_estate_expenses DECIMAL(10,2) DEFAULT 0,
  other_deductions JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tax_profile_id, year)
);

-- Table pour les actifs et fortune
CREATE TABLE public.tax_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  
  -- Comptes bancaires
  bank_accounts JSONB DEFAULT '[]', -- Array of {bankName, accountType, balance, interestEarned}
  
  -- Titres et investissements
  securities JSONB DEFAULT '{"stocks": [], "bonds": [], "funds": [], "totalValue": 0, "dividendsReceived": 0}',
  
  -- Crypto-actifs
  crypto_assets JSONB DEFAULT '{"holdings": [], "totalValue": 0}',
  
  -- Autres actifs
  other_assets JSONB DEFAULT '[]',
  
  -- Total fortune
  total_wealth DECIMAL(12,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tax_profile_id, year)
);

-- Table pour l'immobilier
CREATE TABLE public.tax_real_estate (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  
  type TEXT CHECK (type IN ('primary_residence', 'secondary_residence', 'rental_property')) NOT NULL,
  address TEXT NOT NULL,
  canton TEXT NOT NULL,
  
  purchase_date DATE,
  purchase_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  mortgage_debt DECIMAL(12,2) DEFAULT 0,
  mortgage_interest DECIMAL(10,2) DEFAULT 0,
  maintenance_costs DECIMAL(10,2) DEFAULT 0,
  rental_income DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les documents fiscaux
CREATE TABLE public.tax_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  
  type TEXT CHECK (type IN ('salary_certificate', 'pension_certificate', 'bank_statement', 
    'tax_statement', 'insurance_premium', 'rental_contract', 'mortgage_statement', 
    'donation_receipt', 'medical_expenses', 'other')) NOT NULL,
  
  file_name TEXT NOT NULL,
  encrypted_url TEXT NOT NULL, -- URL chiffrée vers le stockage
  extracted_data JSONB, -- Données extraites du document
  status TEXT CHECK (status IN ('pending', 'processed', 'error')) DEFAULT 'pending',
  
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  processed_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les sessions de chat fiscal
CREATE TABLE public.tax_assistant_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE,
  
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  
  current_section TEXT,
  progress INTEGER DEFAULT 0,
  collected_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les messages du chat fiscal
CREATE TABLE public.tax_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.tax_assistant_sessions(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  
  metadata JSONB DEFAULT '{}', -- {category, field, validated, confidence}
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les calculs et simulations fiscales
CREATE TABLE public.tax_calculations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  
  canton TEXT NOT NULL,
  taxable_income DECIMAL(12,2),
  taxable_wealth DECIMAL(12,2),
  
  federal_tax DECIMAL(10,2),
  cantonal_tax DECIMAL(10,2),
  communal_tax DECIMAL(10,2),
  church_tax DECIMAL(10,2),
  
  total_tax DECIMAL(10,2),
  effective_rate DECIMAL(5,2),
  marginal_rate DECIMAL(5,2),
  
  withheld_tax DECIMAL(10,2),
  remaining_tax DECIMAL(10,2),
  
  optimizations JSONB DEFAULT '[]', -- Liste des optimisations possibles
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tax_profile_id, year)
);

-- Table pour les exports de documents
CREATE TABLE public.tax_exports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tax_profile_id UUID REFERENCES public.tax_profiles(id) ON DELETE CASCADE NOT NULL,
  
  export_type TEXT CHECK (export_type IN ('PDF', 'DOCX', 'TAX', 'CSV')) NOT NULL,
  file_name TEXT NOT NULL,
  encrypted_url TEXT NOT NULL,
  
  metadata JSONB DEFAULT '{}', -- Informations supplémentaires sur l'export
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_income_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_assistant_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_exports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les tables fiscales
CREATE POLICY "Users can manage own tax profile" ON public.tax_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own income data" ON public.tax_income_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_income_data.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own deductions" ON public.tax_deductions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_deductions.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own assets" ON public.tax_assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_assets.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own real estate" ON public.tax_real_estate
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_real_estate.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own documents" ON public.tax_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_documents.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own assistant sessions" ON public.tax_assistant_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" ON public.tax_chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_assistant_sessions 
      WHERE tax_assistant_sessions.id = tax_chat_messages.session_id 
      AND tax_assistant_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own calculations" ON public.tax_calculations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_calculations.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own exports" ON public.tax_exports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tax_profiles 
      WHERE tax_profiles.id = tax_exports.tax_profile_id 
      AND tax_profiles.user_id = auth.uid()
    )
  );

-- Triggers pour mise à jour automatique des timestamps
CREATE TRIGGER update_tax_profiles_updated_at BEFORE UPDATE ON public.tax_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_income_data_updated_at BEFORE UPDATE ON public.tax_income_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_deductions_updated_at BEFORE UPDATE ON public.tax_deductions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_assets_updated_at BEFORE UPDATE ON public.tax_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_real_estate_updated_at BEFORE UPDATE ON public.tax_real_estate
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_assistant_sessions_updated_at BEFORE UPDATE ON public.tax_assistant_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les performances
CREATE INDEX idx_tax_profiles_user_id ON public.tax_profiles(user_id);
CREATE INDEX idx_tax_profiles_anonymized_id ON public.tax_profiles(anonymized_id);
CREATE INDEX idx_tax_income_data_profile_year ON public.tax_income_data(tax_profile_id, year);
CREATE INDEX idx_tax_deductions_profile_year ON public.tax_deductions(tax_profile_id, year);
CREATE INDEX idx_tax_assets_profile_year ON public.tax_assets(tax_profile_id, year);
CREATE INDEX idx_tax_documents_profile_type ON public.tax_documents(tax_profile_id, type);
CREATE INDEX idx_tax_documents_status ON public.tax_documents(status);
CREATE INDEX idx_tax_calculations_profile_year ON public.tax_calculations(tax_profile_id, year);
CREATE INDEX idx_tax_chat_messages_session ON public.tax_chat_messages(session_id);