/**
 * Types pour le système de génération de documents
 */

export type DocumentType =
  | 'lettre_resiliation'
  | 'demande_remboursement'
  | 'reclamation'
  | 'demande_administrative'
  | 'courrier_formel'
  | 'attestation'
  | 'facture';

export type DocumentCategory =
  | 'insurance'      // Assurances
  | 'housing'        // Logement
  | 'finance'        // Finance
  | 'administrative' // Administratif
  | 'legal'          // Juridique
  | 'employment';    // Emploi

export type FieldSource =
  | 'user_profile'      // Données du profil utilisateur Supabase
  | 'manual_input'      // Saisie manuelle par l'utilisateur
  | 'uploaded_document' // Extrait d'un document uploadé
  | 'calculated';       // Calculé automatiquement

export type FieldType =
  | 'text'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'address'
  | 'iban'
  | 'postal_code'
  | 'select';

export interface TemplateField {
  key: string;                    // ex: {{nom_destinataire}}
  label: string;                  // "Nom du destinataire"
  type: FieldType;
  required: boolean;
  source: FieldSource;
  supabaseColumn?: string;        // Colonne dans Supabase (ex: 'first_name')
  supabaseTable?: string;         // Table dans Supabase (ex: 'profiles')
  validation?: string;            // Regex de validation
  defaultValue?: string;
  options?: string[];             // Pour type 'select'
  placeholder?: string;
  helpText?: string;
}

export interface ContentBlock {
  type: 'header' | 'paragraph' | 'list' | 'signature' | 'footer' | 'address';
  content: string;                // Avec variables {{...}}
  conditional?: {
    field: string;
    operator: '===' | '!==' | 'exists' | '>' | '<' | 'includes';
    value?: any;
  };
  style?: {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    fontSize?: string;
  };
}

export interface DocumentTemplate {
  id: string;
  type: DocumentType;
  category: DocumentCategory;
  title: string;
  description: string;

  // Champs nécessaires pour générer le document
  requiredFields: TemplateField[];
  optionalFields?: TemplateField[];

  // Structure du document
  contentBlocks: ContentBlock[];

  // Métadonnées
  metadata: {
    language: 'fr' | 'de' | 'it' | 'en';
    legalCompliance: boolean;      // Validé juridiquement?
    swissLawReference?: string;    // Référence légale suisse
    cantonSpecific?: string[];     // Cantons spécifiques si applicable
    version: string;
    createdAt: string;
    updatedAt: string;
    author: string;
  };

  // Personnalisation du ton (optionnel)
  toneOptions?: {
    formal: boolean;               // Ton formel/informel
    firm: boolean;                 // Ferme/souple
    urgent: boolean;               // Urgent/normal
  };
}

export interface DocumentGenerationRequest {
  templateId: string;
  userInput: string;               // Demande en langage naturel
  userData?: Record<string, any>;  // Données utilisateur depuis Supabase
  manualFields?: Record<string, any>; // Champs saisis manuellement
  toneAdjustment?: {
    formal?: number;               // 0-10
    firm?: number;                 // 0-10
    urgent?: boolean;
  };
}

export interface DocumentGenerationResult {
  success: boolean;
  documentId?: string;
  html?: string;
  pdf?: Buffer;
  missingFields?: string[];        // Champs manquants à demander à l'utilisateur
  error?: string;
  metadata?: {
    templateUsed: string;
    generatedAt: string;
    wordCount: number;
  };
}

export interface RoutingAnalysis {
  documentType: DocumentType;
  category: DocumentCategory;
  suggestedTemplate: string;
  requiredFields: string[];
  tone: 'formal' | 'informal';
  language: 'fr' | 'de' | 'it' | 'en';
  confidence: number;              // 0-1
  reasoning?: string;
}
