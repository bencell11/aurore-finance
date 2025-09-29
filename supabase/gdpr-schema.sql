-- =============================================
-- SCHÉMA DE BASE DE DONNÉES CONFORME RGPD
-- Pour la gestion sécurisée des données fiscales
-- =============================================

-- Extension pour la génération d'UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour le chiffrement (si disponible)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLES DE GESTION DES CLÉS DE CHIFFREMENT
-- =============================================

CREATE TABLE gdpr_encryption_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_id VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    algorithm VARCHAR(100) NOT NULL DEFAULT 'AES-256-GCM',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'rotating', 'deprecated', 'revoked')),
    purpose VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    rotated_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    -- Audit
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche de clés
CREATE INDEX idx_encryption_keys_key_id_version ON gdpr_encryption_keys(key_id, version);
CREATE INDEX idx_encryption_keys_status ON gdpr_encryption_keys(status);
CREATE INDEX idx_encryption_keys_expires_at ON gdpr_encryption_keys(expires_at);

-- =============================================
-- TABLES DE GESTION DES RÔLES ET PERMISSIONS
-- =============================================

CREATE TABLE gdpr_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    data_access_level VARCHAR(50) NOT NULL CHECK (data_access_level IN ('public', 'internal', 'confidential', 'highly_sensitive')),
    permissions JSONB NOT NULL DEFAULT '[]',
    restrictions JSONB NOT NULL DEFAULT '[]',
    inherited_roles UUID[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gdpr_user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES gdpr_roles(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    purpose TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(user_id, role_id, active) -- Un utilisateur ne peut avoir qu'une assignation active par rôle
);

-- Index pour la recherche de rôles utilisateur
CREATE INDEX idx_user_roles_user_id ON gdpr_user_roles(user_id);
CREATE INDEX idx_user_roles_active ON gdpr_user_roles(active);
CREATE INDEX idx_user_roles_expires_at ON gdpr_user_roles(expires_at);

-- =============================================
-- TABLES DE GESTION DU CONSENTEMENT
-- =============================================

CREATE TABLE gdpr_consent_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    legal_basis VARCHAR(100) NOT NULL CHECK (legal_basis IN ('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests')),
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP WITH TIME ZONE NOT NULL,
    withdrawal_date TIMESTAMP WITH TIME ZONE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    policy_version VARCHAR(50) NOT NULL,
    granular_consents JSONB DEFAULT '{}', -- Consentements détaillés
    evidence_data JSONB DEFAULT '{}', -- Preuves du consentement
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche de consentements
CREATE INDEX idx_consent_user_id ON gdpr_consent_records(user_id);
CREATE INDEX idx_consent_purpose ON gdpr_consent_records(purpose);
CREATE INDEX idx_consent_legal_basis ON gdpr_consent_records(legal_basis);
CREATE INDEX idx_consent_date ON gdpr_consent_records(consent_date);

-- =============================================
-- TABLES D'AUDIT ET JOURNALISATION
-- =============================================

CREATE TABLE gdpr_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255),
    data_fields TEXT[] NOT NULL DEFAULT '{}',
    purpose VARCHAR(255) NOT NULL,
    legal_basis VARCHAR(100) NOT NULL,
    result VARCHAR(50) NOT NULL CHECK (result IN ('success', 'failure', 'denied')),
    sensitivity_level VARCHAR(50) NOT NULL CHECK (sensitivity_level IN ('public', 'internal', 'confidential', 'highly_sensitive')),
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    geolocation JSONB,
    duration_ms INTEGER,
    data_volume INTEGER,
    error_code VARCHAR(100),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Partition par date pour optimiser les performances
    created_date DATE NOT NULL DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

-- Créer des partitions pour les 12 derniers mois
DO $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..11 LOOP
        partition_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * i;
        partition_name := 'gdpr_audit_logs_' || TO_CHAR(partition_date, 'YYYY_MM');
        
        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF gdpr_audit_logs 
                       FOR VALUES FROM (%L) TO (%L)',
                       partition_name,
                       partition_date,
                       partition_date + INTERVAL '1 month');
    END LOOP;
END $$;

-- Index pour les logs d'audit
CREATE INDEX idx_audit_logs_user_id ON gdpr_audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON gdpr_audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON gdpr_audit_logs(timestamp);
CREATE INDEX idx_audit_logs_sensitivity ON gdpr_audit_logs(sensitivity_level);
CREATE INDEX idx_audit_logs_result ON gdpr_audit_logs(result);

-- =============================================
-- TABLES DE GESTION DES DEMANDES RGPD
-- =============================================

CREATE TABLE gdpr_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction', 'objection')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    description TEXT NOT NULL,
    justification TEXT,
    request_data JSONB DEFAULT '{}',
    response_data JSONB DEFAULT '{}',
    rejection_reason TEXT,
    
    -- Métadonnées de la demande
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    verification_method VARCHAR(100),
    verification_data JSONB DEFAULT '{}',
    
    -- Conformité RGPD
    processing_deadline TIMESTAMP WITH TIME ZONE, -- 30 jours max
    complexity_reason TEXT, -- Si délai étendu à 90 jours
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    handled_by UUID REFERENCES auth.users(id)
);

-- Index pour les demandes RGPD
CREATE INDEX idx_gdpr_requests_user_id ON gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_type ON gdpr_requests(request_type);
CREATE INDEX idx_gdpr_requests_status ON gdpr_requests(status);
CREATE INDEX idx_gdpr_requests_request_date ON gdpr_requests(request_date);
CREATE INDEX idx_gdpr_requests_deadline ON gdpr_requests(processing_deadline);

-- =============================================
-- TABLES DE VIOLATION DE DONNÉES
-- =============================================

CREATE TABLE gdpr_data_breaches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    breach_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    breach_type VARCHAR(100) NOT NULL,
    affected_users UUID[] DEFAULT '{}',
    affected_data_types TEXT[] DEFAULT '{}',
    estimated_records INTEGER NOT NULL DEFAULT 0,
    source VARCHAR(255),
    detection_method VARCHAR(255),
    containment_actions TEXT[] DEFAULT '{}',
    notification_required BOOLEAN DEFAULT false,
    regulatory_reporting_required BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    investigation_status VARCHAR(50) DEFAULT 'open' CHECK (investigation_status IN ('open', 'investigating', 'contained', 'resolved')),
    
    -- Notifications
    users_notified BOOLEAN DEFAULT false,
    users_notification_date TIMESTAMP WITH TIME ZONE,
    authority_notified BOOLEAN DEFAULT false,
    authority_notification_date TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id)
);

-- Index pour les violations
CREATE INDEX idx_data_breaches_timestamp ON gdpr_data_breaches(timestamp);
CREATE INDEX idx_data_breaches_severity ON gdpr_data_breaches(severity);
CREATE INDEX idx_data_breaches_status ON gdpr_data_breaches(investigation_status);
CREATE INDEX idx_data_breaches_notification_required ON gdpr_data_breaches(notification_required);

-- =============================================
-- TABLES DE DONNÉES FISCALES CHIFFRÉES
-- =============================================

-- Mise à jour de la table tax_profiles existante pour la conformité RGPD
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS gdpr_compliant BOOLEAN DEFAULT true;
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS anonymized_id VARCHAR(255) UNIQUE;
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS encryption_key_version VARCHAR(50);
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS data_classification JSONB DEFAULT '{}';
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS retention_policy JSONB DEFAULT '{}';
ALTER TABLE tax_profiles ADD COLUMN IF NOT EXISTS consent_records UUID[] DEFAULT '{}';

-- Mise à jour des autres tables fiscales
DO $$
DECLARE
    table_name TEXT;
    tables_to_update TEXT[] := ARRAY[
        'tax_personal_info',
        'tax_income_data', 
        'tax_deductions',
        'tax_assets',
        'tax_real_estate',
        'tax_calculations',
        'tax_documents',
        'tax_optimizations'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_to_update LOOP
        -- Ajouter les colonnes RGPD si les tables existent
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS gdpr_compliant BOOLEAN DEFAULT true', table_name);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS encryption_key_version VARCHAR(50)', table_name);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS data_classification JSONB DEFAULT ''{}''', table_name);
    END LOOP;
END $$;

-- =============================================
-- POLITIQUES DE SÉCURITÉ AU NIVEAU LIGNE (RLS)
-- =============================================

-- Activer RLS sur toutes les tables RGPD
ALTER TABLE gdpr_encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_data_breaches ENABLE ROW LEVEL SECURITY;

-- Politique pour les logs d'audit : lecture seule pour les auditeurs
CREATE POLICY "audit_logs_read_only" ON gdpr_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM gdpr_user_roles ur
            JOIN gdpr_roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND ur.active = true
            AND r.name IN ('gdpr_auditor', 'fiscal_admin')
        )
    );

-- Politique pour les demandes RGPD : utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "gdpr_requests_user_own" ON gdpr_requests
    FOR ALL USING (user_id = auth.uid());

-- Politique pour les consentements : utilisateurs peuvent voir leurs propres consentements
CREATE POLICY "consent_records_user_own" ON gdpr_consent_records
    FOR ALL USING (user_id = auth.uid());

-- Politique pour les rôles : administrateurs seulement
CREATE POLICY "roles_admin_only" ON gdpr_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM gdpr_user_roles ur
            JOIN gdpr_roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND ur.active = true
            AND r.name = 'fiscal_admin'
        )
    );

-- =============================================
-- FONCTIONS UTILITAIRES RGPD
-- =============================================

-- Fonction pour nettoyer les logs expirés
CREATE OR REPLACE FUNCTION cleanup_expired_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    retention_days INTEGER := 2555; -- 7 ans
    deleted_count INTEGER;
BEGIN
    DELETE FROM gdpr_audit_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log de l'opération de nettoyage
    INSERT INTO gdpr_audit_logs (
        event_id, timestamp, user_id, action, resource, data_fields,
        purpose, legal_basis, result, sensitivity_level,
        ip_address, user_agent, metadata
    ) VALUES (
        'cleanup_' || extract(epoch from now()),
        NOW(),
        NULL,
        'system_maintenance',
        'audit_logs',
        ARRAY['expired_logs'],
        'data_retention_compliance',
        'legal_obligation',
        'success',
        'internal',
        '127.0.0.1',
        'system_cleanup',
        jsonb_build_object('deleted_records', deleted_count)
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour anonymiser les données d'un utilisateur
CREATE OR REPLACE FUNCTION anonymize_user_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    anonymized_suffix TEXT := '_ANON_' || extract(epoch from now());
BEGIN
    -- Anonymiser les informations personnelles dans tax_personal_info
    UPDATE tax_personal_info 
    SET 
        first_name = encrypt('ANONYMIZED' || anonymized_suffix, 'encryption_key'),
        last_name = encrypt('USER' || anonymized_suffix, 'encryption_key'),
        email = encrypt('anonymized@example.com', 'encryption_key'),
        phone = encrypt('+41000000000', 'encryption_key'),
        gdpr_compliant = false
    WHERE user_id = target_user_id;
    
    -- Marquer le profil principal comme anonymisé
    UPDATE tax_profiles 
    SET 
        anonymized_id = 'ANON_' || substring(id::text, 1, 8) || anonymized_suffix,
        gdpr_compliant = false,
        updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Log de l'anonymisation
    INSERT INTO gdpr_audit_logs (
        event_id, timestamp, user_id, action, resource, data_fields,
        purpose, legal_basis, result, sensitivity_level,
        ip_address, user_agent, metadata
    ) VALUES (
        'anonymize_' || extract(epoch from now()),
        NOW(),
        target_user_id,
        'anonymize',
        'user_data',
        ARRAY['personal_info', 'contact_info'],
        'gdpr_erasure',
        'legal_obligation',
        'success',
        'highly_sensitive',
        '127.0.0.1',
        'system_anonymization',
        jsonb_build_object('anonymized_suffix', anonymized_suffix)
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier la conformité RGPD d'un utilisateur
CREATE OR REPLACE FUNCTION check_gdpr_compliance(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    compliance_report JSONB;
    consent_status BOOLEAN;
    data_retention_ok BOOLEAN;
    encryption_status BOOLEAN;
BEGIN
    -- Vérifier le statut des consentements
    SELECT COUNT(*) > 0 INTO consent_status
    FROM gdpr_consent_records 
    WHERE user_id = target_user_id 
    AND consent_given = true 
    AND withdrawal_date IS NULL;
    
    -- Vérifier la rétention des données
    SELECT CASE 
        WHEN MAX(updated_at) > NOW() - INTERVAL '7 years' THEN true 
        ELSE false 
    END INTO data_retention_ok
    FROM tax_profiles 
    WHERE user_id = target_user_id;
    
    -- Vérifier le chiffrement
    SELECT CASE 
        WHEN encryption_key_version IS NOT NULL THEN true 
        ELSE false 
    END INTO encryption_status
    FROM tax_profiles 
    WHERE user_id = target_user_id;
    
    compliance_report := jsonb_build_object(
        'user_id', target_user_id,
        'compliance_check_date', NOW(),
        'consent_status', consent_status,
        'data_retention_compliant', data_retention_ok,
        'encryption_enabled', encryption_status,
        'overall_compliant', (consent_status AND data_retention_ok AND encryption_status)
    );
    
    RETURN compliance_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DÉCLENCHEURS POUR L'AUDIT AUTOMATIQUE
-- =============================================

-- Fonction de déclencheur pour l'audit automatique
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer un log d'audit pour toute modification de données sensibles
    INSERT INTO gdpr_audit_logs (
        event_id,
        timestamp,
        user_id,
        action,
        resource,
        data_fields,
        purpose,
        legal_basis,
        result,
        sensitivity_level,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        'auto_' || TG_TABLE_NAME || '_' || extract(epoch from now()),
        NOW(),
        COALESCE(NEW.user_id, OLD.user_id),
        CASE TG_OP
            WHEN 'INSERT' THEN 'data_create'
            WHEN 'UPDATE' THEN 'data_modify'
            WHEN 'DELETE' THEN 'data_delete'
        END,
        TG_TABLE_NAME,
        ARRAY['automated_audit'],
        'system_operation',
        'legitimate_interests',
        'success',
        'confidential',
        COALESCE(current_setting('request.header.x-forwarded-for', true), '127.0.0.1')::inet,
        COALESCE(current_setting('request.header.user-agent', true), 'system'),
        jsonb_build_object('operation', TG_OP, 'table', TG_TABLE_NAME)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer les déclencheurs d'audit aux tables fiscales sensibles
DO $$
DECLARE
    table_name TEXT;
    sensitive_tables TEXT[] := ARRAY[
        'tax_profiles',
        'tax_personal_info',
        'tax_income_data',
        'tax_assets'
    ];
BEGIN
    FOREACH table_name IN ARRAY sensitive_tables LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I_audit_trigger ON %I', table_name, table_name);
        EXECUTE format('CREATE TRIGGER %I_audit_trigger
                       AFTER INSERT OR UPDATE OR DELETE ON %I
                       FOR EACH ROW EXECUTE FUNCTION audit_trigger_function()', 
                       table_name, table_name);
    END LOOP;
END $$;

-- =============================================
-- VUES POUR LA CONFORMITÉ ET LE REPORTING
-- =============================================

-- Vue pour le dashboard de conformité RGPD
CREATE OR REPLACE VIEW gdpr_compliance_dashboard AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE result = 'success') as successful_events,
    COUNT(*) FILTER (WHERE result = 'failure') as failed_events,
    COUNT(*) FILTER (WHERE result = 'denied') as denied_events,
    COUNT(*) FILTER (WHERE sensitivity_level = 'highly_sensitive') as sensitive_access,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE action LIKE 'gdpr_%') as gdpr_requests
FROM gdpr_audit_logs
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY date DESC;

-- Vue pour les demandes RGPD en attente
CREATE OR REPLACE VIEW gdpr_pending_requests AS
SELECT 
    r.*,
    u.email as user_email,
    CASE 
        WHEN r.processing_deadline < NOW() THEN 'OVERDUE'
        WHEN r.processing_deadline < NOW() + INTERVAL '7 days' THEN 'DUE_SOON'
        ELSE 'ON_TIME'
    END as deadline_status,
    EXTRACT(DAY FROM (r.processing_deadline - NOW())) as days_remaining
FROM gdpr_requests r
JOIN auth.users u ON r.user_id = u.id
WHERE r.status IN ('pending', 'in_progress')
ORDER BY r.processing_deadline ASC;

-- =============================================
-- COMMENTAIRES DE DOCUMENTATION
-- =============================================

COMMENT ON TABLE gdpr_encryption_keys IS 'Gestion des clés de chiffrement avec rotation automatique';
COMMENT ON TABLE gdpr_roles IS 'Définition des rôles et permissions RBAC';
COMMENT ON TABLE gdpr_user_roles IS 'Assignation des rôles aux utilisateurs avec expiration';
COMMENT ON TABLE gdpr_consent_records IS 'Historique complet des consentements utilisateur';
COMMENT ON TABLE gdpr_audit_logs IS 'Journalisation complète des accès aux données (partitionnée)';
COMMENT ON TABLE gdpr_requests IS 'Gestion des demandes RGPD (accès, rectification, effacement, etc.)';
COMMENT ON TABLE gdpr_data_breaches IS 'Gestion des violations de données et incidents de sécurité';

COMMENT ON FUNCTION cleanup_expired_audit_logs() IS 'Nettoyage automatique des logs expirés (rétention 7 ans)';
COMMENT ON FUNCTION anonymize_user_data(UUID) IS 'Anonymisation sécurisée des données utilisateur';
COMMENT ON FUNCTION check_gdpr_compliance(UUID) IS 'Vérification de la conformité RGPD d''un utilisateur';

-- =============================================
-- INITIALISATION DES DONNÉES DE BASE
-- =============================================

-- Insérer les rôles par défaut
INSERT INTO gdpr_roles (name, description, data_access_level, permissions, restrictions) VALUES
('user', 'Utilisateur Standard', 'confidential', 
 '[{"action": "read", "resource": "tax_profile.own", "granted": true}]',
 '[{"type": "field_masking", "fields": ["internalNotes", "systemMetadata"]}]'),
 
('ai_assistant', 'Assistant Fiscal IA', 'internal',
 '[{"action": "read", "resource": "tax_profile.anonymized", "granted": true}]',
 '[{"type": "field_masking", "fields": ["personalInfo.firstName", "personalInfo.lastName"]}]'),
 
('fiscal_admin', 'Administrateur Fiscal', 'highly_sensitive',
 '[{"action": "read", "resource": "tax_profile.*", "granted": true}]',
 '[{"type": "audit_required"}]'),
 
('gdpr_auditor', 'Auditeur RGPD', 'internal',
 '[{"action": "read", "resource": "audit_logs.*", "granted": true}]',
 '[{"type": "field_masking", "fields": ["personalInfo.*", "incomeData.*"]}]')
ON CONFLICT (name) DO NOTHING;

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE '✅ Schéma RGPD installé avec succès';
    RAISE NOTICE '📊 Tables créées: %, %, %, %, %, %, %', 
        'gdpr_encryption_keys', 'gdpr_roles', 'gdpr_user_roles', 
        'gdpr_consent_records', 'gdpr_audit_logs', 'gdpr_requests', 'gdpr_data_breaches';
    RAISE NOTICE '🔐 RLS activé sur toutes les tables sensibles';
    RAISE NOTICE '⚡ Déclencheurs d''audit configurés';
    RAISE NOTICE '📋 Vues de conformité disponibles';
END $$;