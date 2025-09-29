/**
 * Types RGPD pour le module fiscal
 * Classification des données selon leur sensibilité RGPD
 */

export type DataSensitivityLevel = 'public' | 'internal' | 'confidential' | 'highly_sensitive';

export interface GDPRFieldMetadata {
  sensitive: boolean;
  sensitivityLevel: DataSensitivityLevel;
  purpose: string; // Finalité du traitement
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  retentionPeriod: number; // en jours
  encrypted: boolean;
  anonymizable: boolean;
  description: string;
}

export interface GDPRSchema {
  [fieldName: string]: GDPRFieldMetadata;
}

// Classification RGPD des champs fiscaux
export const GDPR_TAX_SCHEMA: GDPRSchema = {
  // === DONNÉES HAUTEMENT SENSIBLES ===
  'personalInfo.firstName': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Identification du contribuable',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555, // 7 ans (obligation légale)
    encrypted: true,
    anonymizable: true,
    description: 'Prénom du contribuable'
  },
  'personalInfo.lastName': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Identification du contribuable',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Nom de famille du contribuable'
  },
  'personalInfo.socialSecurityNumber': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Identification unique pour déclaration fiscale',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Numéro AVS (données hautement sensibles)'
  },
  'personalInfo.dateOfBirth': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Calcul des déductions liées à l\'âge',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Date de naissance'
  },
  'personalInfo.address.street': {
    sensitive: true,
    sensitivityLevel: 'confidential',
    purpose: 'Détermination du canton et commune pour calcul fiscal',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Adresse de domicile'
  },
  'personalInfo.address.postalCode': {
    sensitive: true,
    sensitivityLevel: 'confidential',
    purpose: 'Détermination du taux d\'imposition communal',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Code postal'
  },
  'personalInfo.phone': {
    sensitive: true,
    sensitivityLevel: 'confidential',
    purpose: 'Contact pour questions administratives',
    legalBasis: 'consent',
    retentionPeriod: 1095, // 3 ans
    encrypted: true,
    anonymizable: true,
    description: 'Numéro de téléphone'
  },
  'personalInfo.email': {
    sensitive: true,
    sensitivityLevel: 'confidential',
    purpose: 'Communication et envoi de documents',
    legalBasis: 'consent',
    retentionPeriod: 1095,
    encrypted: true,
    anonymizable: true,
    description: 'Adresse email'
  },

  // === DONNÉES FINANCIÈRES SENSIBLES ===
  'incomeData.mainEmployment.grossSalary': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Calcul de l\'impôt sur le revenu',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Salaire brut annuel'
  },
  'incomeData.mainEmployment.employer': {
    sensitive: true,
    sensitivityLevel: 'confidential',
    purpose: 'Vérification des certificats de salaire',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Nom de l\'employeur'
  },
  'incomeData.mainEmployment.bankAccount': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Vérification des revenus déclarés',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Numéro de compte bancaire'
  },
  'assets.bankAccounts.*.balance': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Calcul de l\'impôt sur la fortune',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Solde des comptes bancaires'
  },
  'assets.bankAccounts.*.accountNumber': {
    sensitive: true,
    sensitivityLevel: 'highly_sensitive',
    purpose: 'Identification des comptes pour déclaration',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: true,
    anonymizable: true,
    description: 'Numéro de compte bancaire'
  },

  // === DONNÉES INTERNES ===
  'personalInfo.canton': {
    sensitive: false,
    sensitivityLevel: 'internal',
    purpose: 'Calcul des taux d\'imposition cantonaux',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'Canton de résidence'
  },
  'personalInfo.civilStatus': {
    sensitive: false,
    sensitivityLevel: 'internal',
    purpose: 'Application des barèmes fiscaux appropriés',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'État civil'
  },
  'personalInfo.numberOfChildren': {
    sensitive: false,
    sensitivityLevel: 'internal',
    purpose: 'Calcul des déductions pour enfants',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'Nombre d\'enfants à charge'
  },
  'deductions.pillar3a.amount': {
    sensitive: false,
    sensitivityLevel: 'internal',
    purpose: 'Calcul des déductions fiscales',
    legalBasis: 'legal_obligation',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'Montant cotisé au 3e pilier A'
  },

  // === MÉTADONNÉES PUBLIQUES ===
  'id': {
    sensitive: false,
    sensitivityLevel: 'public',
    purpose: 'Identification technique du dossier',
    legalBasis: 'legitimate_interests',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'Identifiant unique du profil fiscal'
  },
  'createdAt': {
    sensitive: false,
    sensitivityLevel: 'public',
    purpose: 'Traçabilité des opérations',
    legalBasis: 'legitimate_interests',
    retentionPeriod: 2555,
    encrypted: false,
    anonymizable: false,
    description: 'Date de création du dossier'
  },
  'completionStatus.overall': {
    sensitive: false,
    sensitivityLevel: 'public',
    purpose: 'Affichage du progrès utilisateur',
    legalBasis: 'legitimate_interests',
    retentionPeriod: 365,
    encrypted: false,
    anonymizable: false,
    description: 'Pourcentage de complétion du profil'
  }
};

// Interface pour le consentement RGPD
export interface GDPRConsent {
  id: string;
  userId: string;
  purpose: string;
  legalBasis: string;
  consentGiven: boolean;
  consentDate: Date;
  withdrawalDate?: Date;
  ipAddress: string;
  userAgent: string;
  version: string; // Version de la politique de confidentialité
}

// Interface pour l'audit des accès
export interface GDPRAuditLog {
  id: string;
  userId: string;
  action: 'read' | 'write' | 'delete' | 'export' | 'anonymize';
  dataFields: string[];
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  purpose: string;
  success: boolean;
  errorMessage?: string;
}

// Interface pour les demandes RGPD
export interface GDPRRequest {
  id: string;
  userId: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestDate: Date;
  completionDate?: Date;
  description: string;
  responseData?: any;
  rejectionReason?: string;
}

// Configuration de sécurité
export interface SecurityConfig {
  encryption: {
    algorithm: 'AES-256-GCM';
    keyDerivation: 'PBKDF2' | 'Argon2';
    saltLength: number;
    ivLength: number;
    tagLength: number;
  };
  keyManagement: {
    provider: 'local' | 'aws-kms' | 'azure-keyvault' | 'gcp-kms';
    rotationInterval: number; // en jours
    keyId?: string;
  };
  anonymization: {
    hashAlgorithm: 'SHA-256' | 'Blake2b';
    saltLength: number;
    placeholderPattern: string;
  };
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyDerivation: 'Argon2',
    saltLength: 32,
    ivLength: 12,
    tagLength: 16
  },
  keyManagement: {
    provider: 'local',
    rotationInterval: 90,
  },
  anonymization: {
    hashAlgorithm: 'SHA-256',
    saltLength: 16,
    placeholderPattern: '<<{TYPE}_{HASH}>>'
  }
};