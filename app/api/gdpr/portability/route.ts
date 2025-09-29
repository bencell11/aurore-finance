/**
 * API RGPD - Droit à la portabilité des données (Article 20)
 * Export structuré des données pour transfert vers un autre service
 */

import { NextRequest, NextResponse } from 'next/server';
import { GDPREncryptionService } from '@/lib/services/security/gdpr-encryption.service';
import { RBACService } from '@/lib/services/security/rbac.service';
import { AuditLoggingService } from '@/lib/services/security/audit-logging.service';

interface PortabilityRequest {
  userId: string;
  format: 'json' | 'xml' | 'csv';
  categories?: string[];
  destination?: string;
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PortabilityRequest = await request.json();
    const { userId, format = 'json', categories, destination, purpose } = body;

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validation
    if (!userId || !purpose) {
      return NextResponse.json(
        { error: 'UserId et purpose requis' },
        { status: 400 }
      );
    }

    // Vérification permissions
    const accessResult = await RBACService.checkAccess(
      userId,
      'export',
      'tax_profile.own',
      { purpose: 'gdpr_portability', ipAddress, userAgent }
    );

    if (!accessResult.granted) {
      return NextResponse.json(
        { error: 'Accès refusé', reason: accessResult.reason },
        { status: 403 }
      );
    }

    // Récupération et déchiffrement des données
    const userData = await retrievePortableUserData(userId, categories);
    const decryptedData = await GDPREncryptionService.decryptTaxProfile(userData);

    // Génération de l'export selon le format
    const exportData = await generatePortabilityExport(decryptedData, format, categories);

    // Audit de l'export
    await AuditLoggingService.logDataExport(
      userId,
      format.toUpperCase(),
      Object.keys(decryptedData),
      1,
      { ipAddress, userAgent }
    );

    const fileName = `portability-export-${userId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.${format}`;

    return new NextResponse(exportData.content, {
      headers: {
        'Content-Type': exportData.contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-GDPR-Article': 'Article 20 - Data Portability',
        'X-Export-Format': format,
        'X-Export-Date': new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GDPR Portability Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export de portabilité' },
      { status: 500 }
    );
  }
}

async function retrievePortableUserData(userId: string, categories?: string[]): Promise<any> {
  // Données mock structurées pour la portabilité
  return {
    metadata: {
      exportDate: new Date().toISOString(),
      userId: userId,
      version: '1.0',
      standard: 'GDPR Article 20',
      categories: categories || ['personal', 'financial', 'preferences']
    },
    personalInfo: {
      canton: 'GE',
      civilStatus: 'single',
      numberOfChildren: 0,
      preferredLanguage: 'fr'
    },
    taxData: {
      year: 2024,
      incomeData: {
        mainEmployment: {
          grossSalary: 85000,
          socialDeductions: 9100
        }
      },
      deductions: {
        pillar3a: { amount: 7056 },
        professionalExpenses: { total: 2500 }
      }
    },
    preferences: {
      notifications: {
        email: true,
        sms: false
      },
      privacy: {
        analyticsConsent: true,
        marketingConsent: false
      }
    }
  };
}

async function generatePortabilityExport(data: any, format: string, categories?: string[]): Promise<{
  content: string;
  contentType: string;
}> {
  switch (format) {
    case 'json':
      return {
        content: JSON.stringify(data, null, 2),
        contentType: 'application/json'
      };

    case 'xml':
      const xmlContent = generateXMLExport(data);
      return {
        content: xmlContent,
        contentType: 'application/xml'
      };

    case 'csv':
      const csvContent = generateCSVExport(data);
      return {
        content: csvContent,
        contentType: 'text/csv'
      };

    default:
      throw new Error('Format non supporté');
  }
}

function generateXMLExport(data: any): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<gdpr-portability-export>
  <metadata>
    <exportDate>${data.metadata.exportDate}</exportDate>
    <version>${data.metadata.version}</version>
    <standard>${data.metadata.standard}</standard>
  </metadata>
  
  <personalInfo>
    <canton>${data.personalInfo.canton}</canton>
    <civilStatus>${data.personalInfo.civilStatus}</civilStatus>
    <numberOfChildren>${data.personalInfo.numberOfChildren}</numberOfChildren>
    <preferredLanguage>${data.personalInfo.preferredLanguage}</preferredLanguage>
  </personalInfo>
  
  <taxData year="${data.taxData.year}">
    <incomeData>
      <mainEmployment>
        <grossSalary>${data.taxData.incomeData.mainEmployment.grossSalary}</grossSalary>
        <socialDeductions>${data.taxData.incomeData.mainEmployment.socialDeductions}</socialDeductions>
      </mainEmployment>
    </incomeData>
    
    <deductions>
      <pillar3a amount="${data.taxData.deductions.pillar3a.amount}" />
      <professionalExpenses total="${data.taxData.deductions.professionalExpenses.total}" />
    </deductions>
  </taxData>
  
  <preferences>
    <notifications>
      <email>${data.preferences.notifications.email}</email>
      <sms>${data.preferences.notifications.sms}</sms>
    </notifications>
    <privacy>
      <analyticsConsent>${data.preferences.privacy.analyticsConsent}</analyticsConsent>
      <marketingConsent>${data.preferences.privacy.marketingConsent}</marketingConsent>
    </privacy>
  </preferences>
</gdpr-portability-export>`;
}

function generateCSVExport(data: any): string {
  const rows = [
    'Category,Field,Value,Type,Description',
    `Personal,Canton,${data.personalInfo.canton},String,Canton de résidence`,
    `Personal,CivilStatus,${data.personalInfo.civilStatus},String,État civil`,
    `Personal,NumberOfChildren,${data.personalInfo.numberOfChildren},Integer,Nombre d'enfants`,
    `Personal,PreferredLanguage,${data.personalInfo.preferredLanguage},String,Langue préférée`,
    `Tax,GrossSalary,${data.taxData.incomeData.mainEmployment.grossSalary},Number,Salaire brut annuel`,
    `Tax,SocialDeductions,${data.taxData.incomeData.mainEmployment.socialDeductions},Number,Déductions sociales`,
    `Tax,Pillar3A,${data.taxData.deductions.pillar3a.amount},Number,Montant 3e pilier A`,
    `Tax,ProfessionalExpenses,${data.taxData.deductions.professionalExpenses.total},Number,Frais professionnels`,
    `Preferences,EmailNotifications,${data.preferences.notifications.email},Boolean,Notifications par email`,
    `Preferences,SMSNotifications,${data.preferences.notifications.sms},Boolean,Notifications par SMS`,
    `Preferences,AnalyticsConsent,${data.preferences.privacy.analyticsConsent},Boolean,Consentement analytics`,
    `Preferences,MarketingConsent,${data.preferences.privacy.marketingConsent},Boolean,Consentement marketing`
  ];

  return rows.join('\n');
}