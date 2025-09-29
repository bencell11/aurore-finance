/**
 * API RGPD - Droit d'accès aux données personnelles (Article 15)
 * Permet aux utilisateurs d'obtenir une copie de leurs données
 */

import { NextRequest, NextResponse } from 'next/server';
import { GDPREncryptionService } from '@/lib/services/security/gdpr-encryption.service';
import { RBACService } from '@/lib/services/security/rbac.service';
import { AuditLoggingService } from '@/lib/services/security/audit-logging.service';
import { GDPR_TAX_SCHEMA } from '@/types/gdpr-tax';

interface AccessRequest {
  userId: string;
  format: 'json' | 'pdf' | 'csv';
  categories?: string[];
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AccessRequest = await request.json();
    const { userId, format = 'json', categories, purpose } = body;

    // Extraction du contexte de la requête
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validation des paramètres
    if (!userId || !purpose) {
      await AuditLoggingService.logEvent({
        userId: userId || 'unknown',
        action: 'gdpr_request',
        resource: 'data_access',
        dataFields: [],
        purpose: 'gdpr_access_request',
        legalBasis: 'legal_obligation',
        result: 'failure',
        sensitivityLevel: 'internal',
        ipAddress,
        userAgent,
        errorMessage: 'Missing required parameters'
      });

      return NextResponse.json(
        { error: 'UserId et purpose sont requis' },
        { status: 400 }
      );
    }

    // Vérification des permissions d'accès
    const accessResult = await RBACService.checkAccess(
      userId,
      'read',
      'tax_profile.own',
      { purpose: 'gdpr_access_request', ipAddress, userAgent }
    );

    if (!accessResult.granted) {
      await AuditLoggingService.logEvent({
        userId,
        action: 'gdpr_request',
        resource: 'data_access',
        dataFields: [],
        purpose: 'gdpr_access_request',
        legalBasis: 'legal_obligation',
        result: 'denied',
        sensitivityLevel: 'internal',
        ipAddress,
        userAgent,
        errorMessage: accessResult.reason
      });

      return NextResponse.json(
        { error: 'Accès refusé', reason: accessResult.reason },
        { status: 403 }
      );
    }

    // Récupération des données utilisateur
    const userData = await retrieveUserData(userId, categories);
    
    // Déchiffrement des données sensibles
    const decryptedData = await GDPREncryptionService.decryptTaxProfile(userData);

    // Application du filtrage selon les permissions
    const filteredData = await RBACService.filterDataByPermissions(
      decryptedData,
      userId,
      'gdpr_access_request'
    );

    // Génération de la réponse selon le format demandé
    let responseData: any;
    let contentType: string;
    let fileName: string;

    switch (format) {
      case 'pdf':
        responseData = await generatePDFReport(filteredData, userId);
        contentType = 'application/pdf';
        fileName = `donnees-personnelles-${userId}-${new Date().toISOString().split('T')[0]}.pdf`;
        break;
        
      case 'csv':
        responseData = await generateCSVReport(filteredData);
        contentType = 'text/csv';
        fileName = `donnees-personnelles-${userId}-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      default:
        responseData = await generateJSONReport(filteredData, userId);
        contentType = 'application/json';
        fileName = `donnees-personnelles-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    }

    // Enrichissement avec métadonnées RGPD
    const enrichedResponse = {
      gdprInfo: {
        requestType: 'data_access',
        article: 'Article 15 - Droit d\'accès',
        timestamp: new Date().toISOString(),
        userId,
        format,
        categories: categories || ['all']
      },
      legalBasis: 'Article 6(1)(f) - Intérêts légitimes',
      dataRetention: {
        collectePrincipale: '7 ans (obligation légale fiscale)',
        metadonneesAudit: '7 ans (conformité RGPD)',
        donneesMarketing: '3 ans (consentement)'
      },
      yourRights: {
        rectification: 'POST /api/gdpr/rectification',
        erasure: 'POST /api/gdpr/erasure',
        portability: 'POST /api/gdpr/portability',
        restriction: 'POST /api/gdpr/restriction',
        objection: 'POST /api/gdpr/objection'
      },
      data: responseData
    };

    // Audit de l'accès
    await AuditLoggingService.logDataAccess(
      userId,
      'tax_profile',
      Object.keys(GDPR_TAX_SCHEMA),
      'gdpr_access_request',
      'success',
      {
        ipAddress,
        userAgent,
        duration: Date.now() - Date.now() // Simplifié pour la démo
      }
    );

    // Réponse selon le format
    if (format === 'json') {
      return NextResponse.json(enrichedResponse);
    } else {
      return new NextResponse(responseData, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'X-GDPR-Request': 'data-access',
          'X-Request-ID': `access_${Date.now()}`
        }
      });
    }

  } catch (error) {
    console.error('GDPR Access Request Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données',
        code: 'GDPR_ACCESS_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Récupère les données utilisateur depuis la base
 */
async function retrieveUserData(userId: string, categories?: string[]): Promise<any> {
  // En mode démo, retourner des données mock
  const mockData = {
    id: userId,
    personalInfo: {
      firstName: { encryptedData: 'encrypted_jean', iv: 'iv1', authTag: 'tag1', salt: 'salt1', keyVersion: 'v1', algorithm: 'AES-256-GCM', timestamp: Date.now() },
      lastName: { encryptedData: 'encrypted_dupont', iv: 'iv2', authTag: 'tag2', salt: 'salt2', keyVersion: 'v1', algorithm: 'AES-256-GCM', timestamp: Date.now() },
      email: { encryptedData: 'encrypted_jean.dupont@email.com', iv: 'iv3', authTag: 'tag3', salt: 'salt3', keyVersion: 'v1', algorithm: 'AES-256-GCM', timestamp: Date.now() },
      canton: 'GE',
      civilStatus: 'single',
      numberOfChildren: 0
    },
    incomeData: {
      mainEmployment: {
        grossSalary: { encryptedData: 'encrypted_85000', iv: 'iv4', authTag: 'tag4', salt: 'salt4', keyVersion: 'v1', algorithm: 'AES-256-GCM', timestamp: Date.now() },
        employer: { encryptedData: 'encrypted_tech_corp', iv: 'iv5', authTag: 'tag5', salt: 'salt5', keyVersion: 'v1', algorithm: 'AES-256-GCM', timestamp: Date.now() }
      }
    },
    auditInfo: {
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-09-20'),
      accessCount: 15,
      lastAccess: new Date('2024-09-25')
    }
  };

  return mockData;
}

/**
 * Génère un rapport JSON structuré
 */
async function generateJSONReport(data: any, userId: string): Promise<any> {
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      userId,
      version: '1.0',
      gdprCompliance: true
    },
    personalData: data.personalInfo,
    financialData: data.incomeData,
    systemData: {
      accountCreated: data.auditInfo?.createdAt,
      lastActivity: data.auditInfo?.lastAccess,
      totalAccess: data.auditInfo?.accessCount
    },
    dataCategories: this.categorizeData(data),
    processingPurposes: {
      taxDeclaration: 'Préparation et soumission de déclarations fiscales',
      legalCompliance: 'Respect des obligations légales fiscales',
      customerSupport: 'Support client et assistance technique'
    }
  };
}

/**
 * Génère un rapport PDF
 */
async function generatePDFReport(data: any, userId: string): Promise<Buffer> {
  // En production, utiliser une vraie librairie PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rapport RGPD - Données Personnelles</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
        .section { margin: 20px 0; }
        .data-item { margin: 10px 0; padding: 10px; border-left: 3px solid #007bff; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rapport d'Accès aux Données Personnelles</h1>
        <p>Généré le: ${new Date().toLocaleDateString('fr-CH')}</p>
        <p>Utilisateur: ${userId}</p>
        <p>Conformément à l'Article 15 du RGPD</p>
      </div>

      <div class="section">
        <h2>Informations Personnelles</h2>
        <div class="data-item">
          <strong>Canton:</strong> ${data.personalInfo?.canton || 'Non spécifié'}
        </div>
        <div class="data-item">
          <strong>Situation familiale:</strong> ${data.personalInfo?.civilStatus || 'Non spécifié'}
        </div>
      </div>

      <div class="section">
        <h2>Données Fiscales</h2>
        <div class="data-item">
          <strong>Employeur principal:</strong> [Données chiffrées - disponibles après authentification]
        </div>
      </div>

      <div class="section">
        <h2>Métadonnées du Compte</h2>
        <div class="data-item">
          <strong>Compte créé:</strong> ${data.auditInfo?.createdAt || 'Non disponible'}
        </div>
        <div class="data-item">
          <strong>Dernière activité:</strong> ${data.auditInfo?.lastAccess || 'Non disponible'}
        </div>
      </div>

      <div class="section">
        <h2>Vos Droits RGPD</h2>
        <ul>
          <li>Droit de rectification (corriger vos données)</li>
          <li>Droit à l'effacement (supprimer vos données)</li>
          <li>Droit à la portabilité (récupérer vos données)</li>
          <li>Droit d'opposition (refuser le traitement)</li>
        </ul>
      </div>
    </body>
    </html>
  `;

  // Simulation de génération PDF
  return Buffer.from(htmlContent, 'utf-8');
}

/**
 * Génère un rapport CSV
 */
async function generateCSVReport(data: any): Promise<string> {
  const csvRows = [
    'Catégorie,Champ,Valeur,Finalité,Base Légale,Rétention',
    `Personnel,Canton,${data.personalInfo?.canton || ''},Calcul fiscal,Obligation légale,7 ans`,
    `Personnel,Situation familiale,${data.personalInfo?.civilStatus || ''},Calcul fiscal,Obligation légale,7 ans`,
    `Financier,Employeur,[Chiffré],Déclaration fiscale,Obligation légale,7 ans`,
    `Système,Date création,${data.auditInfo?.createdAt || ''},Gestion compte,Intérêt légitime,3 ans`,
    `Système,Dernière activité,${data.auditInfo?.lastAccess || ''},Sécurité,Intérêt légitime,1 an`
  ];

  return csvRows.join('\n');
}

/**
 * Catégorise les données pour le rapport
 */
function categorizeData(data: any): any {
  return {
    personal: ['firstName', 'lastName', 'email', 'canton', 'civilStatus'],
    financial: ['grossSalary', 'employer', 'bankAccounts'],
    technical: ['userId', 'createdAt', 'lastAccess'],
    preferences: ['language', 'notifications']
  };
}