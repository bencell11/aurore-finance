/**
 * Service d'anonymisation RGPD
 * Pipeline sécurisé pour interactions avec LLM et APIs externes
 */

import crypto from 'crypto';
import { GDPR_TAX_SCHEMA, GDPRFieldMetadata } from '@/types/gdpr-tax';
import { GDPREncryptionService } from './gdpr-encryption.service';

export interface AnonymizationContext {
  sessionId: string;
  userId: string;
  purpose: string;
  timestamp: Date;
  placeholderMap: Map<string, string>;
  sensitiveFields: string[];
}

export interface AnonymizedData {
  anonymizedContent: any;
  context: AnonymizationContext;
  reversible: boolean;
  placeholderCount: number;
}

export interface PlaceholderMapping {
  original: string;
  placeholder: string;
  type: 'name' | 'address' | 'financial' | 'identifier' | 'date' | 'contact';
  hash: string;
  encrypted: boolean;
}

export class GDPRAnonymizationService {
  private static readonly PLACEHOLDER_PATTERNS = {
    name: '<<NOM_{HASH}>>',
    address: '<<ADRESSE_{HASH}>>',
    financial: '<<MONTANT_{HASH}>>',
    identifier: '<<ID_{HASH}>>',
    date: '<<DATE_{HASH}>>',
    contact: '<<CONTACT_{HASH}>>',
    generic: '<<DONNEE_{HASH}>>'
  };

  private static contextStore = new Map<string, AnonymizationContext>();

  /**
   * Anonymise un profil fiscal pour interaction LLM
   */
  static async anonymizeForLLM(
    profile: any,
    purpose: string = 'AI_ASSISTANCE',
    userId: string
  ): Promise<AnonymizedData> {
    const sessionId = this.generateSessionId();
    const context: AnonymizationContext = {
      sessionId,
      userId,
      purpose,
      timestamp: new Date(),
      placeholderMap: new Map(),
      sensitiveFields: []
    };

    const anonymizedProfile = await this.anonymizeObject(profile, context);

    // Stocker le contexte pour la dé-anonymisation
    this.contextStore.set(sessionId, context);

    return {
      anonymizedContent: anonymizedProfile,
      context,
      reversible: true,
      placeholderCount: context.placeholderMap.size
    };
  }

  /**
   * Anonymise un objet selon le schéma RGPD
   */
  private static async anonymizeObject(obj: any, context: AnonymizationContext): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const anonymized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = this.buildFieldPath(obj, key);
      const metadata = this.getFieldMetadata(fieldPath);

      if (metadata?.sensitive && metadata.anonymizable) {
        // Champ sensible à anonymiser
        if (value !== null && value !== undefined) {
          const anonymizedValue = await this.anonymizeValue(
            value,
            this.getValueType(fieldPath),
            context
          );
          (anonymized as any)[key] = anonymizedValue;
          context.sensitiveFields.push(fieldPath);
        } else {
          (anonymized as any)[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Objet imbriqué à traiter récursivement
        (anonymized as any)[key] = await this.anonymizeObject(value, context);
      } else {
        // Champ non sensible, copie directe
        (anonymized as any)[key] = value;
      }
    }

    return anonymized;
  }

  /**
   * Anonymise une valeur spécifique
   */
  private static async anonymizeValue(
    value: any,
    type: string,
    context: AnonymizationContext
  ): Promise<string> {
    const stringValue = String(value);
    
    // Générer un hash stable pour la même valeur
    const hash = this.generateStableHash(stringValue, context.sessionId);
    const shortHash = hash.substring(0, 8).toUpperCase();
    
    // Créer le placeholder selon le type
    const placeholder = this.createPlaceholder(type, shortHash);
    
    // Stocker le mapping pour la dé-anonymisation
    context.placeholderMap.set(placeholder, stringValue);
    
    return placeholder;
  }

  /**
   * Crée un placeholder selon le type de données
   */
  private static createPlaceholder(type: string, hash: string): string {
    const pattern = this.PLACEHOLDER_PATTERNS[type as keyof typeof this.PLACEHOLDER_PATTERNS] 
                   || this.PLACEHOLDER_PATTERNS.generic;
    return pattern.replace('{HASH}', hash);
  }

  /**
   * Génère un hash stable pour une valeur
   */
  private static generateStableHash(value: string, sessionId: string): string {
    const salt = crypto.createHash('sha256').update(sessionId).digest('hex').substring(0, 16);
    return crypto.createHash('sha256').update(value + salt).digest('hex');
  }

  /**
   * Dé-anonymise le contenu en restaurant les valeurs originales
   */
  static async deanonymizeContent(
    anonymizedContent: string,
    sessionId: string
  ): Promise<string> {
    const context = this.contextStore.get(sessionId);
    if (!context) {
      throw new Error('Anonymization context not found');
    }

    let deanonymized = anonymizedContent;

    // Remplacer tous les placeholders par les valeurs originales
    for (const [placeholder, originalValue] of context.placeholderMap.entries()) {
      deanonymized = deanonymized.replace(new RegExp(placeholder, 'g'), originalValue);
    }

    return deanonymized;
  }

  /**
   * Prépare un message pour envoi à un LLM externe
   */
  static async prepareForExternalLLM(
    userMessage: string,
    taxProfile: any,
    userId: string
  ): Promise<{
    sanitizedMessage: string;
    contextualData: string;
    sessionId: string;
  }> {
    // Anonymiser le profil fiscal
    const anonymizedProfile = await this.anonymizeForLLM(taxProfile, 'LLM_CONSULTATION', userId);
    
    // Détecter et anonymiser les données sensibles dans le message
    const sanitizedMessage = await this.sanitizeUserMessage(userMessage, anonymizedProfile.context);
    
    // Créer un contexte sécurisé pour le LLM
    const contextualData = this.createSecureContext(anonymizedProfile.anonymizedContent);

    return {
      sanitizedMessage,
      contextualData,
      sessionId: anonymizedProfile.context.sessionId
    };
  }

  /**
   * Nettoie un message utilisateur des données sensibles
   */
  private static async sanitizeUserMessage(
    message: string,
    context: AnonymizationContext
  ): Promise<string> {
    let sanitized = message;

    // Patterns pour détecter des données sensibles courantes
    const patterns = {
      socialSecurity: /\b756\.\d{4}\.\d{4}\.\d{2}\b/g, // Format AVS
      phoneNumber: /\b(?:\+41|0)[0-9\s\-\.]{8,}\b/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      bankAccount: /\bCH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{1}\b/g,
      amount: /\b\d{1,3}(?:[''\s]?\d{3})*(?:[.,]\d{2})?\s?CHF?\b/g
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      sanitized = sanitized.replace(pattern, (match) => {
        const hash = this.generateStableHash(match, context.sessionId);
        const placeholder = this.createPlaceholder(this.mapPatternToType(type), hash.substring(0, 8));
        context.placeholderMap.set(placeholder, match);
        return placeholder;
      });
    }

    return sanitized;
  }

  /**
   * Mappe les patterns aux types de placeholders
   */
  private static mapPatternToType(patternType: string): string {
    const mapping: { [key: string]: string } = {
      socialSecurity: 'identifier',
      phoneNumber: 'contact',
      email: 'contact',
      bankAccount: 'financial',
      amount: 'financial'
    };
    return mapping[patternType] || 'generic';
  }

  /**
   * Crée un contexte sécurisé pour le LLM
   */
  private static createSecureContext(anonymizedProfile: any): string {
    const contextData = {
      type: 'swiss_tax_profile',
      canton: anonymizedProfile.personalInfo?.canton || 'non_specifie',
      civilStatus: anonymizedProfile.personalInfo?.civilStatus || 'non_specifie',
      hasChildren: anonymizedProfile.personalInfo?.numberOfChildren > 0,
      hasEmployment: !!anonymizedProfile.incomeData?.mainEmployment,
      hasPillar3a: !!anonymizedProfile.deductions?.pillar3a?.amount,
      hasRealEstate: !!anonymizedProfile.realEstate?.primaryResidence,
      profileCompleteness: anonymizedProfile.completionStatus?.overall || 0,
      year: new Date().getFullYear()
    };

    return `Contexte fiscal suisse (données anonymisées) : ${JSON.stringify(contextData, null, 2)}`;
  }

  /**
   * Traite la réponse d'un LLM pour restaurer les données
   */
  static async processLLMResponse(
    llmResponse: string,
    sessionId: string,
    shouldDeanonymize: boolean = true
  ): Promise<string> {
    if (!shouldDeanonymize) {
      return llmResponse;
    }

    try {
      return await this.deanonymizeContent(llmResponse, sessionId);
    } catch (error) {
      console.error('Failed to deanonymize LLM response:', error);
      // En cas d'erreur, retourner la réponse anonymisée avec un avertissement
      return `${llmResponse}\n\n[Note: Certaines données personnelles n'ont pas pu être restaurées]`;
    }
  }

  /**
   * Efface le contexte d'anonymisation
   */
  static clearAnonymizationContext(sessionId: string): void {
    this.contextStore.delete(sessionId);
  }

  /**
   * Génère un ID de session unique
   */
  private static generateSessionId(): string {
    return `anon_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Construit le chemin d'un champ dans l'objet
   */
  private static buildFieldPath(obj: any, key: string): string {
    // Logique simplifiée pour la démo
    // En production, implémenter une traversée complète
    return key;
  }

  /**
   * Obtient les métadonnées RGPD d'un champ
   */
  private static getFieldMetadata(fieldPath: string): GDPRFieldMetadata | undefined {
    return GDPR_TAX_SCHEMA[fieldPath];
  }

  /**
   * Détermine le type de valeur selon le chemin du champ
   */
  private static getValueType(fieldPath: string): string {
    if (fieldPath.includes('name') || fieldPath.includes('Name')) return 'name';
    if (fieldPath.includes('address') || fieldPath.includes('Address')) return 'address';
    if (fieldPath.includes('salary') || fieldPath.includes('amount') || fieldPath.includes('balance')) return 'financial';
    if (fieldPath.includes('email') || fieldPath.includes('phone')) return 'contact';
    if (fieldPath.includes('date') || fieldPath.includes('Date')) return 'date';
    if (fieldPath.includes('id') || fieldPath.includes('number')) return 'identifier';
    return 'generic';
  }

  /**
   * Valide qu'un contenu ne contient plus de données sensibles
   */
  static validateAnonymization(content: string): {
    isValid: boolean;
    foundSensitiveData: string[];
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const foundSensitive: string[] = [];
    
    // Patterns de détection de données sensibles non anonymisées
    const sensitivePatterns = {
      avs: /756\.\d{4}\.\d{4}\.\d{2}/g,
      phone: /(?:\+41|0)[0-9\s\-\.]{8,}/g,
      email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g,
      iban: /CH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{1}/g
    };

    for (const [type, pattern] of Object.entries(sensitivePatterns)) {
      const matches = content.match(pattern);
      if (matches) {
        foundSensitive.push(...matches);
      }
    }

    const riskLevel = foundSensitive.length === 0 ? 'low' :
                     foundSensitive.length <= 2 ? 'medium' : 'high';

    return {
      isValid: foundSensitive.length === 0,
      foundSensitiveData: foundSensitive,
      riskLevel
    };
  }

  /**
   * Génère un rapport d'anonymisation
   */
  static generateAnonymizationReport(sessionId: string): any {
    const context = this.contextStore.get(sessionId);
    if (!context) {
      return null;
    }

    return {
      sessionId,
      userId: context.userId,
      purpose: context.purpose,
      timestamp: context.timestamp,
      anonymizedFields: context.sensitiveFields.length,
      placeholderCount: context.placeholderMap.size,
      fieldTypes: this.analyzeFieldTypes(context.sensitiveFields),
      status: 'completed'
    };
  }

  /**
   * Analyse les types de champs anonymisés
   */
  private static analyzeFieldTypes(fields: string[]): { [type: string]: number } {
    const types: { [type: string]: number } = {};
    
    for (const field of fields) {
      const type = this.getValueType(field);
      types[type] = (types[type] || 0) + 1;
    }
    
    return types;
  }

  /**
   * Nettoie les contextes expirés
   */
  static cleanupExpiredContexts(): void {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [sessionId, context] of this.contextStore.entries()) {
      if (now.getTime() - context.timestamp.getTime() > maxAge) {
        this.contextStore.delete(sessionId);
      }
    }
  }
}