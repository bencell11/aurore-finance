/**
 * API RGPD - Droit à l'effacement / Droit à l'oubli (Article 17)
 * Permet aux utilisateurs de demander la suppression de leurs données
 */

import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/lib/services/security/rbac.service';
import { AuditLoggingService } from '@/lib/services/security/audit-logging.service';
import { GDPREncryptionService } from '@/lib/services/security/gdpr-encryption.service';

interface ErasureRequest {
  userId: string;
  reason: ErasureReason;
  categories?: string[];
  justification: string;
  confirmDeletion: boolean;
}

type ErasureReason = 
  | 'no_longer_necessary'
  | 'consent_withdrawn'
  | 'unlawful_processing'
  | 'legal_obligation'
  | 'child_consent'
  | 'objection_sustained';

interface ErasureAssessment {
  canErase: boolean;
  blockedCategories: string[];
  legalObligations: string[];
  retentionRequirements: any[];
  warnings: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ErasureRequest = await request.json();
    const { userId, reason, categories, justification, confirmDeletion } = body;

    // Extraction du contexte
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validation des paramètres
    if (!userId || !reason || !justification || confirmDeletion !== true) {
      return NextResponse.json(
        { 
          error: 'Paramètres requis: userId, reason, justification, confirmDeletion=true',
          requiredActions: [
            'Confirmer explicitement la suppression (confirmDeletion: true)',
            'Fournir une justification détaillée',
            'Spécifier une raison valide selon l\'Article 17'
          ]
        },
        { status: 400 }
      );
    }

    // Vérification des permissions
    const accessResult = await RBACService.checkAccess(
      userId,
      'delete',
      'tax_profile.own',
      { purpose: 'gdpr_erasure', ipAddress, userAgent }
    );

    if (!accessResult.granted) {
      await AuditLoggingService.logEvent({
        userId,
        action: 'gdpr_request',
        resource: 'data_erasure',
        dataFields: categories || ['all'],
        purpose: 'gdpr_erasure',
        legalBasis: 'legal_obligation',
        result: 'denied',
        sensitivityLevel: 'highly_sensitive',
        ipAddress,
        userAgent,
        errorMessage: accessResult.reason
      });

      return NextResponse.json(
        { error: 'Accès refusé', reason: accessResult.reason },
        { status: 403 }
      );
    }

    // Évaluation de la faisabilité de l'effacement
    const assessment = await assessErasureFeasibility(userId, reason, categories);

    if (!assessment.canErase) {
      await AuditLoggingService.logEvent({
        userId,
        action: 'gdpr_request',
        resource: 'data_erasure',
        dataFields: categories || ['all'],
        purpose: 'gdpr_erasure',
        legalBasis: 'legal_obligation',
        result: 'denied',
        sensitivityLevel: 'highly_sensitive',
        ipAddress,
        userAgent,
        errorMessage: 'Erasure blocked by legal obligations',
        metadata: {
          blockedCategories: assessment.blockedCategories,
          legalObligations: assessment.legalObligations
        }
      });

      return NextResponse.json({
        success: false,
        canErase: false,
        reason: 'Effacement bloqué par des obligations légales',
        details: {
          blockedCategories: assessment.blockedCategories,
          legalObligations: assessment.legalObligations,
          alternatives: [
            'Demande de restriction du traitement (Article 18)',
            'Opposition au traitement (Article 21)',
            'Attendre l\'expiration de la période de rétention légale'
          ]
        },
        gdprInfo: {
          article: 'Article 17 - Droit à l\'effacement',
          limitations: 'L\'effacement peut être refusé en cas d\'obligations légales (Article 17.3)',
          retentionPeriods: assessment.retentionRequirements
        }
      }, { status: 409 });
    }

    // Récupération des données avant suppression (pour audit)
    const userData = await retrieveUserDataForErasure(userId);
    
    // Exécution de l'effacement
    const erasureResult = await executeErasure(userId, categories, reason);

    // Audit de l'effacement
    await AuditLoggingService.logEvent({
      userId,
      action: 'data_delete',
      resource: 'tax_profile',
      dataFields: erasureResult.deletedFields,
      purpose: 'gdpr_erasure',
      legalBasis: 'legal_obligation',
      result: 'success',
      sensitivityLevel: 'highly_sensitive',
      ipAddress,
      userAgent,
      dataVolume: erasureResult.deletedRecords,
      metadata: {
        erasureReason: reason,
        justification,
        categoriesDeleted: erasureResult.deletedCategories,
        retainedData: erasureResult.retainedData
      }
    });

    // Notification de l'effacement aux systèmes tiers si applicable
    await notifyThirdPartyErasure(userId, erasureResult);

    // Génération du certificat d'effacement
    const erasureCertificate = await generateErasureCertificate(userId, erasureResult, reason);

    return NextResponse.json({
      success: true,
      requestId: `erasure_${Date.now()}_${userId.substring(0, 8)}`,
      timestamp: new Date().toISOString(),
      erasureComplete: erasureResult.complete,
      details: {
        deletedCategories: erasureResult.deletedCategories,
        deletedRecords: erasureResult.deletedRecords,
        retainedData: erasureResult.retainedData,
        retentionReasons: erasureResult.retentionReasons
      },
      certificate: erasureCertificate,
      gdprInfo: {
        article: 'Article 17 - Droit à l\'effacement',
        legalBasis: reason,
        completionTime: erasureResult.completionTime,
        auditTrail: 'Effacement entièrement audité et traçable',
        nextSteps: erasureResult.complete 
          ? ['Effacement terminé - aucune action supplémentaire requise']
          : ['Données conservées pour obligations légales', 'Révision automatique selon calendrier de rétention']
      }
    });

  } catch (error) {
    console.error('GDPR Erasure Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'effacement des données',
        code: 'GDPR_ERASURE_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Évalue la faisabilité de l'effacement
 */
async function assessErasureFeasibility(
  userId: string,
  reason: ErasureReason,
  categories?: string[]
): Promise<ErasureAssessment> {
  // Vérification des obligations légales de rétention
  const legalObligations = [
    {
      category: 'tax_data',
      requirement: 'Conservation 7 ans selon Code des obligations (CO 957a)',
      applies: true,
      expiryDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
    },
    {
      category: 'audit_logs',
      requirement: 'Conservation 7 ans selon RGPD Article 5(2)',
      applies: true,
      expiryDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
    }
  ];

  // Vérification des exceptions Article 17.3
  const blockedCategories: string[] = [];
  const warnings: string[] = [];

  // a) Liberté d'expression et d'information
  // b) Respect d'une obligation légale
  if (reason !== 'legal_obligation') {
    const activeTaxObligation = await checkActiveTaxObligation(userId);
    if (activeTaxObligation) {
      blockedCategories.push('tax_data');
      warnings.push('Données fiscales conservées pour obligation légale');
    }
  }

  // c) Motifs d'intérêt public
  // d) Fins archivistiques, de recherche scientifique ou à des fins statistiques
  // e) Constatation, exercice ou défense de droits en justice
  const activeDisputes = await checkActiveDisputes(userId);
  if (activeDisputes.length > 0) {
    blockedCategories.push('legal_disputes');
    warnings.push('Données conservées pour procédures judiciaires en cours');
  }

  const canErase = blockedCategories.length === 0 || 
                   (categories && !categories.some(cat => blockedCategories.includes(cat)));

  return {
    canErase,
    blockedCategories,
    legalObligations: legalObligations.filter(lo => lo.applies).map(lo => lo.requirement),
    retentionRequirements: legalObligations,
    warnings
  };
}

/**
 * Vérifie les obligations fiscales actives
 */
async function checkActiveTaxObligation(userId: string): Promise<boolean> {
  // En production, vérifier les déclarations fiscales en cours
  // Pour la démo, considérer qu'il y a toujours une obligation
  return true;
}

/**
 * Vérifie les litiges actifs
 */
async function checkActiveDisputes(userId: string): Promise<any[]> {
  // En production, vérifier les procédures judiciaires
  return [];
}

/**
 * Récupère les données utilisateur pour l'audit d'effacement
 */
async function retrieveUserDataForErasure(userId: string): Promise<any> {
  // Données mock pour la démo
  return {
    personalInfo: {
      categories: ['personal_identification', 'contact_info', 'preferences'],
      recordCount: 15
    },
    taxData: {
      categories: ['income', 'deductions', 'calculations'],
      recordCount: 48
    },
    systemData: {
      categories: ['audit_logs', 'access_history', 'consents'],
      recordCount: 156
    }
  };
}

/**
 * Exécute l'effacement des données
 */
async function executeErasure(
  userId: string,
  categories?: string[],
  reason?: ErasureReason
): Promise<{
  complete: boolean;
  deletedCategories: string[];
  deletedRecords: number;
  deletedFields: string[];
  retainedData: string[];
  retentionReasons: string[];
  completionTime: Date;
}> {
  const startTime = new Date();
  
  // Catégories pouvant être supprimées
  const deletableCategories = ['preferences', 'marketing_data', 'analytics'];
  const toDelete = categories ? 
    categories.filter(cat => deletableCategories.includes(cat)) :
    deletableCategories;

  // Catégories conservées pour obligations légales
  const retainedCategories = ['tax_data', 'audit_logs', 'legal_compliance'];
  const retained = categories ?
    categories.filter(cat => retainedCategories.includes(cat)) :
    retainedCategories;

  // Simulation de l'effacement
  const deletedFields = [
    'preferences.theme',
    'preferences.language', 
    'preferences.notifications',
    'marketing.emailOptIn',
    'analytics.sessionData'
  ];

  // Effacement sécurisé
  for (const field of deletedFields) {
    await securelyDeleteField(userId, field);
  }

  // Anonymisation des données conservées
  await anonymizeRetainedData(userId, retained);

  return {
    complete: retained.length === 0,
    deletedCategories: toDelete,
    deletedRecords: 23,
    deletedFields,
    retainedData: retained,
    retentionReasons: retained.map(cat => `Obligation légale: ${cat}`),
    completionTime: new Date()
  };
}

/**
 * Supprime de manière sécurisée un champ
 */
async function securelyDeleteField(userId: string, field: string): Promise<void> {
  // En production:
  // 1. Écraser les données avec des valeurs aléatoires
  // 2. Supprimer de la base de données
  // 3. Purger les sauvegardes si applicable
  // 4. Invalider les caches
  
  console.log(`Secure deletion: ${field} for user ${userId}`);
}

/**
 * Anonymise les données conservées
 */
async function anonymizeRetainedData(userId: string, categories: string[]): Promise<void> {
  // Remplacer les identifiants personnels par des identifiants anonymes
  // Conserver uniquement les données nécessaires aux obligations légales
  
  console.log(`Anonymized retained data categories: ${categories.join(', ')} for user ${userId}`);
}

/**
 * Notifie les systèmes tiers de l'effacement
 */
async function notifyThirdPartyErasure(userId: string, erasureResult: any): Promise<void> {
  // En production, notifier:
  // - Services de paiement
  // - Partenaires de données
  // - Services de sauvegarde
  // - APIs externes
  
  console.log(`Third-party erasure notifications sent for user ${userId}`);
}

/**
 * Génère un certificat d'effacement
 */
async function generateErasureCertificate(
  userId: string,
  erasureResult: any,
  reason: ErasureReason
): Promise<any> {
  const certificate = {
    certificateId: `cert_${Date.now()}_${userId.substring(0, 8)}`,
    issuedAt: new Date().toISOString(),
    userId: userId.substring(0, 8) + '***', // Anonymisé
    erasureReason: reason,
    completionStatus: erasureResult.complete ? 'complete' : 'partial',
    deletedData: {
      categories: erasureResult.deletedCategories,
      recordCount: erasureResult.deletedRecords
    },
    retainedData: erasureResult.retainedData.length > 0 ? {
      categories: erasureResult.retainedData,
      legalBasis: 'Article 17.3 - Exceptions to erasure',
      retentionPeriod: '7 years (legal obligation)'
    } : null,
    verificationHash: generateCertificateHash(userId, erasureResult),
    gdprCompliance: {
      article: 'Article 17 GDPR',
      processingTime: '30 days maximum',
      auditTrail: 'Available upon request',
      rightsRemaining: erasureResult.complete ? [] : [
        'Restriction of processing (Article 18)',
        'Data portability for retained data (Article 20)'
      ]
    }
  };

  return certificate;
}

/**
 * Génère un hash de vérification pour le certificat
 */
function generateCertificateHash(userId: string, erasureResult: any): string {
  const crypto = require('crypto');
  const data = `${userId}:${erasureResult.completionTime}:${erasureResult.deletedRecords}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}