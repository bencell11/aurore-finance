/**
 * API RGPD - Droit de rectification (Article 16)
 * Permet aux utilisateurs de corriger leurs données personnelles
 */

import { NextRequest, NextResponse } from 'next/server';
import { GDPREncryptionService } from '@/lib/services/security/gdpr-encryption.service';
import { RBACService } from '@/lib/services/security/rbac.service';
import { AuditLoggingService } from '@/lib/services/security/audit-logging.service';
import { GDPR_TAX_SCHEMA } from '@/types/gdpr-tax';

interface RectificationRequest {
  userId: string;
  modifications: {
    field: string;
    currentValue?: any;
    newValue: any;
    reason: string;
  }[];
  purpose: string;
  justification?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RectificationRequest = await request.json();
    const { userId, modifications, purpose, justification } = body;

    // Extraction du contexte
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validation des paramètres
    if (!userId || !modifications || !Array.isArray(modifications) || modifications.length === 0) {
      return NextResponse.json(
        { error: 'UserId et modifications sont requis' },
        { status: 400 }
      );
    }

    // Validation des champs à modifier
    const validationErrors = await validateRectificationRequest(modifications);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Erreurs de validation', details: validationErrors },
        { status: 400 }
      );
    }

    // Vérification des permissions
    const accessResult = await RBACService.checkAccess(
      userId,
      'write',
      'tax_profile.own',
      { purpose: 'gdpr_rectification', ipAddress, userAgent }
    );

    if (!accessResult.granted) {
      await AuditLoggingService.logEvent({
        userId,
        action: 'gdpr_request',
        resource: 'data_rectification',
        dataFields: modifications.map(m => m.field),
        purpose: 'gdpr_rectification',
        legalBasis: 'legal_obligation',
        result: 'denied',
        sensitivityLevel: 'confidential',
        ipAddress,
        userAgent,
        errorMessage: accessResult.reason
      });

      return NextResponse.json(
        { error: 'Accès refusé', reason: accessResult.reason },
        { status: 403 }
      );
    }

    // Récupération des données actuelles
    const currentData = await retrieveCurrentUserData(userId);
    
    // Application des modifications
    const modificationResults = await applyModifications(currentData, modifications, userId);

    // Chiffrement des nouvelles données sensibles
    const encryptedData = await GDPREncryptionService.encryptTaxProfile(modificationResults.updatedData);

    // Sauvegarde des modifications
    await saveUserData(userId, encryptedData);

    // Audit des modifications
    await AuditLoggingService.logDataModification(
      userId,
      'tax_profile',
      modifications.map(m => m.field),
      modificationResults.oldValues,
      modificationResults.newValues,
      purpose,
      { ipAddress, userAgent }
    );

    // Notification des changements si nécessaire
    await notifyDataChanges(userId, modifications);

    return NextResponse.json({
      success: true,
      requestId: `rect_${Date.now()}_${userId.substring(0, 8)}`,
      timestamp: new Date().toISOString(),
      modificationsApplied: modificationResults.successful.length,
      modificationsRejected: modificationResults.rejected.length,
      details: {
        successful: modificationResults.successful,
        rejected: modificationResults.rejected
      },
      gdprInfo: {
        article: 'Article 16 - Droit de rectification',
        legalBasis: 'Article 6(1)(f) - Intérêts légitimes',
        retentionImpact: 'Les données corrigées conservent la même période de rétention',
        auditTrail: 'Toutes les modifications sont auditées et traçables'
      }
    });

  } catch (error) {
    console.error('GDPR Rectification Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la rectification des données',
        code: 'GDPR_RECTIFICATION_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Valide la demande de rectification
 */
async function validateRectificationRequest(modifications: any[]): Promise<string[]> {
  const errors: string[] = [];

  for (const modification of modifications) {
    // Vérification des champs requis
    if (!modification.field || modification.newValue === undefined) {
      errors.push(`Modification invalide: field et newValue requis`);
      continue;
    }

    // Vérification que le champ existe dans le schéma RGPD
    const fieldMetadata = GDPR_TAX_SCHEMA[modification.field];
    if (!fieldMetadata) {
      errors.push(`Champ inconnu: ${modification.field}`);
      continue;
    }

    // Vérification que le champ est modifiable
    if (!isFieldModifiable(modification.field)) {
      errors.push(`Champ non modifiable: ${modification.field}`);
      continue;
    }

    // Validation du format de la nouvelle valeur
    const formatError = validateFieldFormat(modification.field, modification.newValue);
    if (formatError) {
      errors.push(`Format invalide pour ${modification.field}: ${formatError}`);
    }

    // Validation de la raison
    if (!modification.reason || modification.reason.trim().length < 10) {
      errors.push(`Raison requise pour ${modification.field} (minimum 10 caractères)`);
    }
  }

  return errors;
}

/**
 * Détermine si un champ peut être modifié
 */
function isFieldModifiable(field: string): boolean {
  // Champs non modifiables
  const nonModifiableFields = [
    'id',
    'userId',
    'createdAt',
    'lastModified',
    'anonymizedId'
  ];

  if (nonModifiableFields.includes(field)) {
    return false;
  }

  // Champs avec restrictions spéciales
  const restrictedFields = [
    'personalInfo.socialSecurityNumber', // Nécessite validation administrative
    'incomeData.mainEmployment.grossSalary' // Nécessite justificatif
  ];

  return !restrictedFields.includes(field);
}

/**
 * Valide le format d'un champ
 */
function validateFieldFormat(field: string, value: any): string | null {
  switch (field) {
    case 'personalInfo.email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Format email invalide';
      }
      break;

    case 'personalInfo.phone':
      const phoneRegex = /^(\+41|0)[0-9\s\-\.]{8,}$/;
      if (!phoneRegex.test(value)) {
        return 'Format téléphone suisse invalide';
      }
      break;

    case 'personalInfo.canton':
      const validCantons = ['GE', 'VD', 'VS', 'NE', 'JU', 'FR', 'BE', 'SO', 'BL', 'BS', 'AG', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'SH', 'AR', 'AI', 'SG', 'GR', 'TG', 'TI', 'ZH'];
      if (!validCantons.includes(value)) {
        return 'Canton suisse invalide';
      }
      break;

    case 'personalInfo.civilStatus':
      const validStatuses = ['single', 'married', 'divorced', 'widowed', 'separated'];
      if (!validStatuses.includes(value)) {
        return 'Statut civil invalide';
      }
      break;

    case 'incomeData.mainEmployment.grossSalary':
      if (typeof value !== 'number' || value < 0 || value > 10000000) {
        return 'Salaire doit être un nombre entre 0 et 10\'000\'000';
      }
      break;

    default:
      // Validation générique
      if (typeof value === 'string' && value.length > 1000) {
        return 'Valeur trop longue (maximum 1000 caractères)';
      }
  }

  return null;
}

/**
 * Récupère les données actuelles de l'utilisateur
 */
async function retrieveCurrentUserData(userId: string): Promise<any> {
  // En mode démo, données mock
  return {
    id: userId,
    personalInfo: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      canton: 'GE',
      civilStatus: 'single',
      numberOfChildren: 0
    },
    incomeData: {
      mainEmployment: {
        grossSalary: 85000,
        employer: 'Tech Corp SA'
      }
    },
    lastModified: new Date('2024-09-20')
  };
}

/**
 * Applique les modifications aux données
 */
async function applyModifications(
  currentData: any,
  modifications: any[],
  userId: string
): Promise<{
  updatedData: any;
  successful: any[];
  rejected: any[];
  oldValues: any;
  newValues: any;
}> {
  const updatedData = JSON.parse(JSON.stringify(currentData));
  const successful: any[] = [];
  const rejected: any[] = [];
  const oldValues: any = {};
  const newValues: any = {};

  for (const modification of modifications) {
    try {
      // Récupération de la valeur actuelle
      const currentValue = getNestedValue(currentData, modification.field);
      
      // Vérification si une modification est nécessaire
      if (currentValue === modification.newValue) {
        rejected.push({
          field: modification.field,
          reason: 'Nouvelle valeur identique à la valeur actuelle',
          currentValue,
          requestedValue: modification.newValue
        });
        continue;
      }

      // Application de la modification
      setNestedValue(updatedData, modification.field, modification.newValue);
      
      // Enregistrement des changements
      oldValues[modification.field] = currentValue;
      newValues[modification.field] = modification.newValue;

      successful.push({
        field: modification.field,
        oldValue: currentValue,
        newValue: modification.newValue,
        reason: modification.reason,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      rejected.push({
        field: modification.field,
        reason: `Erreur lors de l'application: ${error}`,
        requestedValue: modification.newValue
      });
    }
  }

  // Mise à jour des métadonnées
  updatedData.lastModified = new Date();
  updatedData.modificationHistory = updatedData.modificationHistory || [];
  updatedData.modificationHistory.push({
    timestamp: new Date(),
    userId,
    modificationsCount: successful.length,
    purpose: 'gdpr_rectification'
  });

  return {
    updatedData,
    successful,
    rejected,
    oldValues,
    newValues
  };
}

/**
 * Sauvegarde les données utilisateur
 */
async function saveUserData(userId: string, encryptedData: any): Promise<void> {
  // En production, sauvegarde en base de données
  console.log(`Données utilisateur ${userId} mises à jour avec succès`);
}

/**
 * Notifie les changements de données
 */
async function notifyDataChanges(userId: string, modifications: any[]): Promise<void> {
  // Notification pour les champs critiques
  const criticalFields = ['personalInfo.email', 'personalInfo.socialSecurityNumber'];
  const criticalChanges = modifications.filter(m => criticalFields.includes(m.field));

  if (criticalChanges.length > 0) {
    // En production, envoyer notification email/SMS
    console.log(`Notification envoyée à ${userId} pour modifications critiques`);
  }
}

/**
 * Utilitaires pour accéder aux propriétés imbriquées
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}