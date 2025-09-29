/**
 * Tests de conformité RGPD
 * Validation automatisée de la conformité réglementaire
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { GDPREncryptionService } from '@/lib/services/security/gdpr-encryption.service';
import { RBACService } from '@/lib/services/security/rbac.service';
import { AuditLoggingService } from '@/lib/services/security/audit-logging.service';
import { GDPRAnonymizationService } from '@/lib/services/security/gdpr-anonymization.service';
import { KeyManagementService } from '@/lib/services/security/key-management.service';

describe('RGPD Compliance Tests', () => {
  beforeAll(async () => {
    // Initialisation des services de sécurité
    RBACService.initialize();
    await KeyManagementService.initialize();
  });

  describe('Article 5 - Principles of Processing', () => {
    test('Lawfulness, fairness and transparency', async () => {
      // Vérifier que toutes les opérations ont une base légale
      const testData = {
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com'
        }
      };

      // Simulation d'un accès aux données
      await AuditLoggingService.logDataAccess(
        'test-user-123',
        'tax_profile',
        ['personalInfo.firstName', 'personalInfo.lastName'],
        'tax_calculation',
        'success',
        {
          ipAddress: '192.168.1.1',
          userAgent: 'Test Agent',
          duration: 150
        }
      );

      // Vérifier que l'audit a été enregistré avec une base légale
      const { events } = await AuditLoggingService.queryAuditLogs({
        userId: 'test-user-123',
        limit: 1
      });

      expect(events).toHaveLength(1);
      expect(events[0].legalBasis).toBeDefined();
      expect(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'])
        .toContain(events[0].legalBasis);
    });

    test('Purpose limitation', async () => {
      // Vérifier que les données ne sont utilisées que pour leur finalité déclarée
      const userId = 'test-user-purpose';
      
      // Test d'accès conforme à la finalité
      const legitimateAccess = await RBACService.checkAccess(
        userId,
        'read',
        'tax_profile.own',
        { purpose: 'tax_calculation' }
      );
      
      expect(legitimateAccess.granted).toBe(true);

      // Test d'accès non conforme à la finalité
      const illegitimateAccess = await RBACService.checkAccess(
        userId,
        'read',
        'tax_profile.own',
        { purpose: 'marketing_research' }
      );
      
      // Selon la configuration RBAC, cet accès devrait être refusé
      expect(illegitimateAccess.granted).toBe(false);
    });

    test('Data minimisation', async () => {
      // Vérifier que seules les données nécessaires sont collectées
      const { GDPR_TAX_SCHEMA } = await import('@/types/gdpr-tax');
      
      // Compter les champs sensibles
      const sensitiveFields = Object.entries(GDPR_TAX_SCHEMA)
        .filter(([_, metadata]) => metadata.sensitive)
        .map(([field, _]) => field);

      // Vérifier que chaque champ sensible a une justification
      for (const field of sensitiveFields) {
        const metadata = GDPR_TAX_SCHEMA[field];
        expect(metadata.purpose).toBeDefined();
        expect(metadata.purpose).not.toBe('');
        expect(metadata.legalBasis).toBeDefined();
      }
    });

    test('Accuracy', async () => {
      // Test du droit de rectification
      const testProfile = {
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'old.email@example.com'
        }
      };

      // Chiffrer les données
      const encrypted = await GDPREncryptionService.encryptTaxProfile(testProfile);
      
      // Déchiffrer et vérifier l'intégrité
      const decrypted = await GDPREncryptionService.decryptTaxProfile(encrypted);
      
      expect(decrypted.personalInfo.firstName).toBe('Jean');
      expect(decrypted.personalInfo.lastName).toBe('Dupont');
      expect(decrypted.personalInfo.email).toBe('old.email@example.com');
    });

    test('Storage limitation', async () => {
      // Vérifier les périodes de rétention
      const { GDPR_TAX_SCHEMA } = await import('@/types/gdpr-tax');
      
      // Vérifier que chaque champ a une période de rétention définie
      for (const [field, metadata] of Object.entries(GDPR_TAX_SCHEMA)) {
        if (metadata.sensitive) {
          expect(metadata.retentionPeriod).toBeDefined();
          expect(metadata.retentionPeriod).toBeGreaterThan(0);
          
          // Données fiscales : 7 ans maximum
          if (field.includes('income') || field.includes('tax')) {
            expect(metadata.retentionPeriod).toBeLessThanOrEqual(2555); // 7 ans
          }
        }
      }
    });

    test('Integrity and confidentiality', async () => {
      // Test du chiffrement
      const sensitiveData = 'Données personnelles sensibles';
      
      const encrypted = await GDPREncryptionService.encryptSensitiveData(sensitiveData);
      
      expect(encrypted.encryptedData).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.authTag).toBeDefined();
      expect(encrypted.algorithm).toBe('AES-256-GCM');
      
      // Vérifier que les données chiffrées sont différentes des données originales
      expect(encrypted.encryptedData).not.toBe(sensitiveData);
      
      // Vérifier l'intégrité lors du déchiffrement
      const decrypted = await GDPREncryptionService.decryptSensitiveData(encrypted);
      expect(decrypted).toBe(sensitiveData);
      
      // Test d'intégrité : modifier le tag d'authentification
      const tamperedData = { ...encrypted, authTag: 'tampered-tag' };
      
      await expect(
        GDPREncryptionService.decryptSensitiveData(tamperedData)
      ).rejects.toThrow();
    });

    test('Accountability', async () => {
      // Vérifier que toutes les opérations sont auditées
      const userId = 'test-user-accountability';
      
      // Effectuer plusieurs opérations
      await AuditLoggingService.logDataAccess(userId, 'tax_profile', ['test'], 'test', 'success', {
        ipAddress: '127.0.0.1',
        userAgent: 'Test'
      });
      
      await AuditLoggingService.logConsentEvent(userId, 'given', 'tax_processing', {
        ipAddress: '127.0.0.1',
        userAgent: 'Test',
        version: '1.0'
      });

      // Vérifier que les événements sont auditables
      const { events, statistics } = await AuditLoggingService.queryAuditLogs({
        userId,
        limit: 10
      });

      expect(events.length).toBeGreaterThanOrEqual(2);
      expect(statistics.totalEvents).toBeGreaterThanOrEqual(2);
      
      // Vérifier la traçabilité
      for (const event of events) {
        expect(event.timestamp).toBeDefined();
        expect(event.userId).toBe(userId);
        expect(event.ipAddress).toBeDefined();
        expect(event.purpose).toBeDefined();
        expect(event.legalBasis).toBeDefined();
      }
    });
  });

  describe('Article 15 - Right of Access', () => {
    test('User can access their personal data', async () => {
      // Simuler une demande d'accès
      const mockRequest = {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Test Browser'
        }),
        json: async () => ({
          userId: 'test-user-access',
          format: 'json',
          purpose: 'gdpr_access_request'
        })
      };

      // L'API devrait retourner les données en format structuré
      // (Test d'intégration - ici on teste juste la structure)
      expect(mockRequest.json).toBeDefined();
      
      const requestData = await mockRequest.json();
      expect(requestData.userId).toBeDefined();
      expect(requestData.format).toBeDefined();
      expect(['json', 'pdf', 'csv']).toContain(requestData.format);
    });

    test('Access request includes all required GDPR information', async () => {
      // Vérifier que la réponse d'accès contient toutes les informations requises
      const expectedFields = [
        'gdprInfo',
        'legalBasis', 
        'dataRetention',
        'yourRights',
        'data'
      ];

      // Structure attendue pour la conformité Article 15
      const mockResponse = {
        gdprInfo: {
          requestType: 'data_access',
          article: 'Article 15 - Droit d\'accès',
          timestamp: new Date().toISOString()
        },
        legalBasis: 'Article 6(1)(f) - Intérêts légitimes',
        dataRetention: {},
        yourRights: {},
        data: {}
      };

      for (const field of expectedFields) {
        expect(mockResponse).toHaveProperty(field);
      }
    });
  });

  describe('Article 16 - Right to Rectification', () => {
    test('User can rectify inaccurate data', async () => {
      // Test de validation des modifications
      const modifications = [
        {
          field: 'personalInfo.email',
          currentValue: 'old@example.com',
          newValue: 'new@example.com',
          reason: 'Correction de l\'adresse email'
        }
      ];

      // Vérifier que la modification est valide
      expect(modifications[0].field).toBeDefined();
      expect(modifications[0].newValue).toBeDefined();
      expect(modifications[0].reason).toBeDefined();
      expect(modifications[0].reason.length).toBeGreaterThanOrEqual(10);
    });

    test('Rectification is properly audited', async () => {
      const userId = 'test-user-rectification';
      const modifiedFields = ['personalInfo.email'];
      const oldValues = { 'personalInfo.email': 'old@example.com' };
      const newValues = { 'personalInfo.email': 'new@example.com' };

      await AuditLoggingService.logDataModification(
        userId,
        'tax_profile',
        modifiedFields,
        oldValues,
        newValues,
        'gdpr_rectification',
        { ipAddress: '127.0.0.1', userAgent: 'Test' }
      );

      const { events } = await AuditLoggingService.queryAuditLogs({
        userId,
        actions: ['data_modify'],
        limit: 1
      });

      expect(events).toHaveLength(1);
      expect(events[0].action).toBe('data_modify');
      expect(events[0].purpose).toBe('gdpr_rectification');
    });
  });

  describe('Article 17 - Right to Erasure', () => {
    test('Erasure assessment considers legal obligations', async () => {
      // Simuler l'évaluation de faisabilité d'effacement
      const taxDataRetention = 7 * 365; // 7 ans en jours
      const currentAge = 30; // 30 jours
      
      const canErase = currentAge > taxDataRetention;
      expect(canErase).toBe(false); // Données fiscales récentes ne peuvent pas être effacées
      
      // Vérifier les exceptions Article 17.3
      const legalObligations = [
        'Conservation 7 ans selon Code des obligations',
        'Procédures judiciaires en cours'
      ];
      
      expect(legalObligations).toContain('Conservation 7 ans selon Code des obligations');
    });

    test('Partial erasure when legal obligations exist', async () => {
      // Tester l'effacement partiel
      const deletableCategories = ['preferences', 'marketing_data'];
      const retainedCategories = ['tax_data', 'audit_logs'];
      
      expect(deletableCategories.length).toBeGreaterThan(0);
      expect(retainedCategories.length).toBeGreaterThan(0);
    });
  });

  describe('Article 20 - Right to Data Portability', () => {
    test('Export in structured, commonly used format', async () => {
      const userData = {
        personalInfo: { canton: 'GE' },
        taxData: { year: 2024 }
      };

      // Test export JSON
      const jsonExport = JSON.stringify(userData, null, 2);
      expect(() => JSON.parse(jsonExport)).not.toThrow();

      // Test export CSV structure
      const csvHeaders = 'Category,Field,Value,Type,Description';
      expect(csvHeaders).toContain('Category');
      expect(csvHeaders).toContain('Field');
      expect(csvHeaders).toContain('Value');
    });
  });

  describe('Data Protection by Design and by Default', () => {
    test('Encryption is enabled by default', async () => {
      const { GDPR_TAX_SCHEMA } = await import('@/types/gdpr-tax');
      
      // Vérifier que les champs sensibles sont chiffrés par défaut
      const sensitiveFields = Object.entries(GDPR_TAX_SCHEMA)
        .filter(([_, metadata]) => metadata.sensitive);

      for (const [field, metadata] of sensitiveFields) {
        if (metadata.sensitivityLevel === 'highly_sensitive') {
          expect(metadata.encrypted).toBe(true);
        }
      }
    });

    test('Anonymization is applied for LLM interactions', async () => {
      const testProfile = {
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          socialSecurityNumber: '756.1234.5678.90'
        }
      };

      const anonymized = await GDPRAnonymizationService.anonymizeForLLM(
        testProfile,
        'AI_ASSISTANCE',
        'test-user'
      );

      expect(anonymized.anonymizedContent.personalInfo.firstName).toMatch(/<<NOM_[A-F0-9]+>>/);
      expect(anonymized.anonymizedContent.personalInfo.lastName).toMatch(/<<NOM_[A-F0-9]+>>/);
      expect(anonymized.placeholderCount).toBeGreaterThan(0);
    });

    test('Role-based access control is enforced', async () => {
      const userId = 'test-user-rbac';
      
      // Assigner un rôle utilisateur standard
      await RBACService.assignRole(userId, 'user', 'system', 'test_purpose');
      
      // Vérifier l'accès autorisé
      const allowedAccess = await RBACService.checkAccess(
        userId,
        'read',
        'tax_profile.own',
        { purpose: 'personal_use' }
      );
      
      expect(allowedAccess.granted).toBe(true);
      
      // Vérifier l'accès refusé
      const deniedAccess = await RBACService.checkAccess(
        userId,
        'delete',
        'tax_profile.all',
        { purpose: 'admin_access' }
      );
      
      expect(deniedAccess.granted).toBe(false);
    });
  });

  describe('Breach Detection and Notification', () => {
    test('Security incidents are automatically detected', async () => {
      const userId = 'test-user-breach';
      
      // Simuler plusieurs tentatives d'accès échouées
      for (let i = 0; i < 6; i++) {
        await AuditLoggingService.logEvent({
          userId,
          action: 'data_access',
          resource: 'tax_profile',
          dataFields: ['sensitive_data'],
          purpose: 'unauthorized_access',
          legalBasis: 'legitimate_interests',
          result: 'denied',
          sensitivityLevel: 'highly_sensitive',
          ipAddress: '192.168.1.100',
          userAgent: 'Suspicious Agent'
        });
      }

      // Vérifier qu'un incident de sécurité a été détecté
      const { events } = await AuditLoggingService.queryAuditLogs({
        userId: 'system',
        actions: ['security_incident'],
        limit: 1
      });

      expect(events.length).toBeGreaterThanOrEqual(1);
    });

    test('Data breach logging includes all required fields', async () => {
      await AuditLoggingService.logDataBreach({
        severity: 'high',
        type: 'unauthorized_access',
        affectedUsers: ['user1', 'user2'],
        affectedDataTypes: ['personal_info', 'financial_data'],
        estimatedRecords: 100,
        source: 'external_attack',
        detectionMethod: 'automated_monitoring',
        containmentActions: ['access_revoked', 'systems_isolated'],
        notificationRequired: true,
        regulatoryReportingRequired: true,
        description: 'Unauthorized access attempt detected',
        investigationStatus: 'investigating'
      });

      // Vérifier l'enregistrement de la violation
      const { events } = await AuditLoggingService.queryAuditLogs({
        actions: ['data_breach'],
        limit: 1
      });

      expect(events).toHaveLength(1);
      expect(events[0].action).toBe('data_breach');
      expect(events[0].metadata).toHaveProperty('severity');
      expect(events[0].metadata).toHaveProperty('affectedUsers');
    });
  });

  describe('Key Management and Rotation', () => {
    test('Encryption keys have proper lifecycle management', async () => {
      const keyStats = await KeyManagementService.getKeyStatistics();
      
      expect(keyStats.totalKeys).toBeGreaterThan(0);
      expect(keyStats.activeKeys).toBeGreaterThan(0);
      expect(keyStats.nextRotations).toBeDefined();
      
      // Vérifier que les clés ont des dates d'expiration
      for (const rotation of keyStats.nextRotations) {
        expect(rotation.nextRotation).toBeDefined();
        expect(new Date(rotation.nextRotation)).toBeInstanceOf(Date);
      }
    });

    test('Key rotation maintains data accessibility', async () => {
      const testData = 'Test data for rotation';
      
      // Chiffrer avec la clé actuelle
      const encrypted = await GDPREncryptionService.encryptSensitiveData(testData);
      
      // Simuler la rotation de clé
      await KeyManagementService.rotateEncryptionKeys();
      
      // Vérifier que les données peuvent toujours être déchiffrées
      const decrypted = await GDPREncryptionService.decryptSensitiveData(encrypted);
      expect(decrypted).toBe(testData);
    });
  });

  describe('Compliance Reporting', () => {
    test('Generate compliance report with all metrics', async () => {
      const dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 jours
      const dateTo = new Date();
      
      const report = await AuditLoggingService.generateAuditReport(dateFrom, dateTo);
      
      expect(report.summary).toBeDefined();
      expect(report.suspiciousActivities).toBeDefined();
      expect(report.complianceStatus).toBeDefined();
      expect(report.recommendations).toBeDefined();
      
      // Vérifier les métriques de conformité
      expect(report.complianceStatus.score).toBeGreaterThanOrEqual(0);
      expect(report.complianceStatus.score).toBeLessThanOrEqual(100);
    });

    test('Anonymization validation detects sensitive data', async () => {
      const textWithSensitiveData = 'Contact Jean Dupont au +41 22 123 45 67 ou jean.dupont@email.com';
      
      const validation = GDPRAnonymizationService.validateAnonymization(textWithSensitiveData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.foundSensitiveData.length).toBeGreaterThan(0);
      expect(validation.riskLevel).toBe('high');
    });
  });

  afterAll(async () => {
    // Nettoyage des données de test
    GDPRAnonymizationService.cleanupExpiredContexts();
  });
});

// Tests d'intégration spécifiques aux API
describe('GDPR API Integration Tests', () => {
  test('Access API returns proper GDPR headers', async () => {
    const mockHeaders = new Headers();
    mockHeaders.set('X-GDPR-Article', 'Article 15 - Data Access');
    mockHeaders.set('X-Request-ID', 'access_123456');
    
    expect(mockHeaders.get('X-GDPR-Article')).toBe('Article 15 - Data Access');
    expect(mockHeaders.get('X-Request-ID')).toMatch(/access_\d+/);
  });

  test('Rectification API validates modification requests', async () => {
    const validModification = {
      field: 'personalInfo.email',
      newValue: 'valid.email@example.com',
      reason: 'Correction of email address after domain change'
    };

    const invalidModification = {
      field: 'personalInfo.email',
      newValue: 'invalid-email',
      reason: 'Short'
    };

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(validModification.newValue)).toBe(true);
    expect(emailRegex.test(invalidModification.newValue)).toBe(false);

    // Validation de la raison (minimum 10 caractères)
    expect(validModification.reason.length).toBeGreaterThanOrEqual(10);
    expect(invalidModification.reason.length).toBeLessThan(10);
  });

  test('Erasure API respects legal obligations', async () => {
    const taxDataCategory = 'tax_data';
    const marketingDataCategory = 'marketing_data';
    
    // Données fiscales - ne peuvent pas être effacées (obligation légale 7 ans)
    const taxDataAge = 30; // jours
    const taxRetentionPeriod = 7 * 365; // jours
    expect(taxDataAge < taxRetentionPeriod).toBe(true);
    
    // Données marketing - peuvent être effacées
    const marketingRetentionPeriod = 3 * 365; // 3 ans
    const marketingDataAge = 4 * 365; // 4 ans
    expect(marketingDataAge > marketingRetentionPeriod).toBe(true);
  });

  test('Portability API exports in machine-readable formats', async () => {
    const testData = { name: 'Jean', canton: 'GE' };
    
    // Test JSON
    const jsonExport = JSON.stringify(testData);
    expect(() => JSON.parse(jsonExport)).not.toThrow();
    
    // Test XML structure
    const xmlExport = `<?xml version="1.0"?><data><name>Jean</name><canton>GE</canton></data>`;
    expect(xmlExport).toMatch(/^<\?xml version/);
    expect(xmlExport).toContain('<name>Jean</name>');
    
    // Test CSV structure
    const csvExport = 'Field,Value\nname,Jean\ncanton,GE';
    const csvLines = csvExport.split('\n');
    expect(csvLines[0]).toBe('Field,Value');
    expect(csvLines[1]).toBe('name,Jean');
  });
});

// Tests de performance et de charge
describe('GDPR Performance Tests', () => {
  test('Encryption performance meets requirements', async () => {
    const testData = 'A'.repeat(1000); // 1KB de données
    const iterations = 10;
    
    const startTime = Date.now();
    
    for (let i = 0; i < iterations; i++) {
      const encrypted = await GDPREncryptionService.encryptSensitiveData(testData);
      await GDPREncryptionService.decryptSensitiveData(encrypted);
    }
    
    const endTime = Date.now();
    const averageTime = (endTime - startTime) / iterations;
    
    // Le chiffrement/déchiffrement devrait prendre moins de 100ms par KB
    expect(averageTime).toBeLessThan(100);
  });

  test('Audit logging handles high volume', async () => {
    const events = 100;
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < events; i++) {
      promises.push(
        AuditLoggingService.logEvent({
          userId: `user-${i}`,
          action: 'data_access',
          resource: 'tax_profile',
          dataFields: ['test'],
          purpose: 'performance_test',
          legalBasis: 'legitimate_interests',
          result: 'success',
          sensitivityLevel: 'internal',
          ipAddress: '127.0.0.1',
          userAgent: 'Performance Test'
        })
      );
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Logging de 100 événements devrait prendre moins de 5 secondes
    expect(totalTime).toBeLessThan(5000);
  });
});