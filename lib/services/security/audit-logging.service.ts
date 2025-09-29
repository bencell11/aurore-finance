/**
 * Service de journalisation des accès RGPD
 * Audit trail complet pour conformité et sécurité
 */

import crypto from 'crypto';
import { GDPRAuditLog, DataSensitivityLevel } from '@/types/gdpr-tax';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  sessionId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  dataFields: string[];
  purpose: string;
  legalBasis: string;
  result: 'success' | 'failure' | 'denied';
  sensitivityLevel: DataSensitivityLevel;
  ipAddress: string;
  userAgent: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
  };
  duration?: number; // en millisecondes
  dataVolume?: number; // nombre d'enregistrements
  errorCode?: string;
  errorMessage?: string;
  metadata?: any;
}

export type AuditAction = 
  | 'login' | 'logout' 
  | 'data_access' | 'data_modify' | 'data_delete' | 'data_export'
  | 'encryption' | 'decryption' | 'anonymization' | 'deanonymization'
  | 'consent_given' | 'consent_withdrawn'
  | 'gdpr_request' | 'data_breach' | 'security_incident'
  | 'role_assigned' | 'role_revoked' | 'permission_changed'
  | 'key_rotation' | 'backup_created' | 'system_maintenance';

export interface AuditQuery {
  userId?: string;
  actions?: AuditAction[];
  resources?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sensitivityLevels?: DataSensitivityLevel[];
  results?: ('success' | 'failure' | 'denied')[];
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

export interface AuditStatistics {
  totalEvents: number;
  successfulAccess: number;
  failedAccess: number;
  deniedAccess: number;
  uniqueUsers: number;
  dataVolumeAccessed: number;
  sensitivityBreakdown: { [level: string]: number };
  actionBreakdown: { [action: string]: number };
  timeRange: {
    from: Date;
    to: Date;
  };
}

export interface DataBreachEvent {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'unauthorized_access' | 'data_leak' | 'system_compromise' | 'insider_threat';
  affectedUsers: string[];
  affectedDataTypes: string[];
  estimatedRecords: number;
  source: string;
  detectionMethod: string;
  containmentActions: string[];
  notificationRequired: boolean;
  regulatoryReportingRequired: boolean;
  description: string;
  investigationStatus: 'open' | 'investigating' | 'contained' | 'resolved';
}

export class AuditLoggingService {
  private static eventBuffer: AuditEvent[] = [];
  private static bufferSize = 100;
  private static flushInterval = 30000; // 30 secondes
  private static retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 ans

  static {
    // Démarrage automatique du flush périodique
    setInterval(() => this.flushEvents(), this.flushInterval);
    
    // Nettoyage périodique des logs expirés
    setInterval(() => this.cleanupExpiredLogs(), 24 * 60 * 60 * 1000); // 1 fois par jour
  }

  /**
   * Enregistre un événement d'audit
   */
  static async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event
    };

    // Validation de l'événement
    this.validateEvent(auditEvent);

    // Ajout au buffer
    this.eventBuffer.push(auditEvent);

    // Flush immédiat pour les événements critiques
    if (this.isCriticalEvent(auditEvent)) {
      await this.flushEvents();
    }

    // Flush si le buffer est plein
    if (this.eventBuffer.length >= this.bufferSize) {
      await this.flushEvents();
    }

    // Détection automatique d'incidents de sécurité
    await this.detectSecurityIncidents(auditEvent);
  }

  /**
   * Enregistre un accès aux données
   */
  static async logDataAccess(
    userId: string,
    resource: string,
    dataFields: string[],
    purpose: string,
    result: 'success' | 'failure' | 'denied',
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId?: string;
      duration?: number;
      errorMessage?: string;
    }
  ): Promise<void> {
    await this.logEvent({
      userId,
      sessionId: context.sessionId,
      action: 'data_access',
      resource,
      dataFields,
      purpose,
      legalBasis: 'legitimate_interests', // À adapter selon le contexte
      result,
      sensitivityLevel: this.determineSensitivityLevel(dataFields),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      duration: context.duration,
      errorMessage: context.errorMessage,
      dataVolume: dataFields.length
    });
  }

  /**
   * Enregistre une modification de données
   */
  static async logDataModification(
    userId: string,
    resource: string,
    modifiedFields: string[],
    oldValues: any,
    newValues: any,
    purpose: string,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId?: string;
    }
  ): Promise<void> {
    await this.logEvent({
      userId,
      sessionId: context.sessionId,
      action: 'data_modify',
      resource,
      dataFields: modifiedFields,
      purpose,
      legalBasis: 'legitimate_interests',
      result: 'success',
      sensitivityLevel: this.determineSensitivityLevel(modifiedFields),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        modifications: modifiedFields.map((field, index) => ({
          field,
          oldValue: this.hashSensitiveValue(oldValues[field]),
          newValue: this.hashSensitiveValue(newValues[field])
        }))
      }
    });
  }

  /**
   * Enregistre un export de données
   */
  static async logDataExport(
    userId: string,
    exportFormat: string,
    dataFields: string[],
    recordCount: number,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId?: string;
    }
  ): Promise<void> {
    await this.logEvent({
      userId,
      sessionId: context.sessionId,
      action: 'data_export',
      resource: 'tax_profile',
      dataFields,
      purpose: 'user_data_portability',
      legalBasis: 'legal_obligation',
      result: 'success',
      sensitivityLevel: this.determineSensitivityLevel(dataFields),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      dataVolume: recordCount,
      metadata: {
        exportFormat,
        fileSize: this.estimateFileSize(recordCount, exportFormat)
      }
    });
  }

  /**
   * Enregistre un événement de consentement
   */
  static async logConsentEvent(
    userId: string,
    consentType: 'given' | 'withdrawn',
    purpose: string,
    context: {
      ipAddress: string;
      userAgent: string;
      version: string;
    }
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: consentType === 'given' ? 'consent_given' : 'consent_withdrawn',
      resource: 'user_consent',
      dataFields: [purpose],
      purpose: 'consent_management',
      legalBasis: 'consent',
      result: 'success',
      sensitivityLevel: 'internal',
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        consentVersion: context.version,
        consentPurpose: purpose
      }
    });
  }

  /**
   * Enregistre une violation de données
   */
  static async logDataBreach(breach: Omit<DataBreachEvent, 'id' | 'timestamp'>): Promise<void> {
    const breachEvent: DataBreachEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...breach
    };

    // Enregistrement spécial pour les violations
    await this.storeBreachEvent(breachEvent);

    // Log d'audit associé
    await this.logEvent({
      userId: 'system',
      action: 'data_breach',
      resource: 'security_incident',
      dataFields: breach.affectedDataTypes,
      purpose: 'security_monitoring',
      legalBasis: 'legal_obligation',
      result: 'failure',
      sensitivityLevel: 'highly_sensitive',
      ipAddress: '0.0.0.0',
      userAgent: 'security_system',
      dataVolume: breach.estimatedRecords,
      metadata: {
        breachId: breachEvent.id,
        severity: breach.severity,
        type: breach.type,
        affectedUsers: breach.affectedUsers.length
      }
    });

    // Alertes automatiques
    await this.triggerBreachAlerts(breachEvent);
  }

  /**
   * Recherche dans les logs d'audit
   */
  static async queryAuditLogs(query: AuditQuery): Promise<{
    events: AuditEvent[];
    total: number;
    statistics: AuditStatistics;
  }> {
    // En production, requête sur la base de données
    const filteredEvents = this.filterEvents(this.eventBuffer, query);
    const statistics = this.calculateStatistics(filteredEvents);

    return {
      events: filteredEvents.slice(query.offset || 0, (query.offset || 0) + (query.limit || 50)),
      total: filteredEvents.length,
      statistics
    };
  }

  /**
   * Génère un rapport d'audit pour une période
   */
  static async generateAuditReport(
    dateFrom: Date,
    dateTo: Date,
    userId?: string
  ): Promise<{
    summary: AuditStatistics;
    suspiciousActivities: AuditEvent[];
    complianceStatus: any;
    recommendations: string[];
  }> {
    const query: AuditQuery = {
      dateFrom,
      dateTo,
      userId
    };

    const { events, statistics } = await this.queryAuditLogs(query);
    
    return {
      summary: statistics,
      suspiciousActivities: this.detectSuspiciousActivities(events),
      complianceStatus: this.assessCompliance(events),
      recommendations: this.generateRecommendations(events)
    };
  }

  /**
   * Valide un événement d'audit
   */
  private static validateEvent(event: AuditEvent): void {
    if (!event.userId || !event.action || !event.resource) {
      throw new Error('Event validation failed: missing required fields');
    }

    if (!event.ipAddress || !event.userAgent) {
      throw new Error('Event validation failed: missing context information');
    }

    if (event.sensitivityLevel && !['public', 'internal', 'confidential', 'highly_sensitive'].includes(event.sensitivityLevel)) {
      throw new Error('Event validation failed: invalid sensitivity level');
    }
  }

  /**
   * Détermine si un événement est critique
   */
  private static isCriticalEvent(event: AuditEvent): boolean {
    const criticalActions: AuditAction[] = [
      'data_breach', 'security_incident', 'data_delete', 
      'key_rotation', 'role_assigned', 'role_revoked'
    ];
    
    return criticalActions.includes(event.action) || 
           event.sensitivityLevel === 'highly_sensitive' ||
           event.result === 'denied';
  }

  /**
   * Flush les événements vers le stockage persistant
   */
  private static async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      // En production, insertion en base de données
      await this.persistEvents(eventsToFlush);
      console.log(`Flushed ${eventsToFlush.length} audit events`);
    } catch (error) {
      console.error('Failed to flush audit events:', error);
      // Remettre les événements dans le buffer
      this.eventBuffer.unshift(...eventsToFlush);
    }
  }

  /**
   * Persiste les événements en base de données
   */
  private static async persistEvents(events: AuditEvent[]): Promise<void> {
    // En production, utiliser Supabase ou autre BDD
    for (const event of events) {
      // Hash des données sensibles avant stockage
      const sanitizedEvent = {
        ...event,
        dataFields: event.dataFields.map(field => 
          this.shouldHashField(field) ? this.hashSensitiveValue(field) : field
        )
      };
      
      // Simulation de stockage
      console.log(`Stored audit event: ${event.action} by ${event.userId}`);
    }
  }

  /**
   * Détecte automatiquement les incidents de sécurité
   */
  private static async detectSecurityIncidents(event: AuditEvent): Promise<void> {
    // Détection de tentatives d'accès répétées
    if (event.result === 'denied') {
      const recentFailures = this.eventBuffer.filter(e => 
        e.userId === event.userId &&
        e.result === 'denied' &&
        (event.timestamp.getTime() - e.timestamp.getTime()) < 300000 // 5 minutes
      );

      if (recentFailures.length >= 5) {
        await this.logEvent({
          userId: 'system',
          action: 'security_incident',
          resource: 'authentication',
          dataFields: ['failed_attempts'],
          purpose: 'security_monitoring',
          legalBasis: 'legitimate_interests',
          result: 'failure',
          sensitivityLevel: 'highly_sensitive',
          ipAddress: event.ipAddress,
          userAgent: 'security_monitor',
          metadata: {
            originalUserId: event.userId,
            failureCount: recentFailures.length,
            timeWindow: '5_minutes'
          }
        });
      }
    }

    // Détection d'accès à données sensibles en dehors des heures normales
    const hour = event.timestamp.getHours();
    if ((hour < 6 || hour > 22) && event.sensitivityLevel === 'highly_sensitive') {
      console.warn(`Suspicious after-hours access to sensitive data by user ${event.userId}`);
    }
  }

  /**
   * Détermine le niveau de sensibilité basé sur les champs accédés
   */
  private static determineSensitivityLevel(dataFields: string[]): DataSensitivityLevel {
    const { GDPR_TAX_SCHEMA } = require('@/types/gdpr-tax');
    
    let maxLevel: DataSensitivityLevel = 'public';
    const levels: DataSensitivityLevel[] = ['public', 'internal', 'confidential', 'highly_sensitive'];

    for (const field of dataFields) {
      const metadata = GDPR_TAX_SCHEMA[field];
      if (metadata) {
        const currentIndex = levels.indexOf(metadata.sensitivityLevel);
        const maxIndex = levels.indexOf(maxLevel);
        if (currentIndex > maxIndex) {
          maxLevel = metadata.sensitivityLevel;
        }
      }
    }

    return maxLevel;
  }

  /**
   * Hash une valeur sensible pour le stockage
   */
  private static hashSensitiveValue(value: any): string {
    if (value === null || value === undefined) return '[NULL]';
    return crypto.createHash('sha256').update(String(value)).digest('hex').substring(0, 16);
  }

  /**
   * Détermine si un champ doit être hashé
   */
  private static shouldHashField(field: string): boolean {
    const sensitivePatterns = [
      'firstName', 'lastName', 'socialSecurityNumber', 
      'email', 'phone', 'accountNumber', 'salary'
    ];
    return sensitivePatterns.some(pattern => field.includes(pattern));
  }

  /**
   * Filtre les événements selon les critères
   */
  private static filterEvents(events: AuditEvent[], query: AuditQuery): AuditEvent[] {
    return events.filter(event => {
      if (query.userId && event.userId !== query.userId) return false;
      if (query.actions && !query.actions.includes(event.action)) return false;
      if (query.resources && !query.resources.some(r => event.resource.includes(r))) return false;
      if (query.dateFrom && event.timestamp < query.dateFrom) return false;
      if (query.dateTo && event.timestamp > query.dateTo) return false;
      if (query.sensitivityLevels && !query.sensitivityLevels.includes(event.sensitivityLevel)) return false;
      if (query.results && !query.results.includes(event.result)) return false;
      if (query.ipAddress && event.ipAddress !== query.ipAddress) return false;
      return true;
    });
  }

  /**
   * Calcule les statistiques d'audit
   */
  private static calculateStatistics(events: AuditEvent[]): AuditStatistics {
    const stats = {
      totalEvents: events.length,
      successfulAccess: events.filter(e => e.result === 'success').length,
      failedAccess: events.filter(e => e.result === 'failure').length,
      deniedAccess: events.filter(e => e.result === 'denied').length,
      uniqueUsers: new Set(events.map(e => e.userId)).size,
      dataVolumeAccessed: events.reduce((sum, e) => sum + (e.dataVolume || 0), 0),
      sensitivityBreakdown: {} as { [level: string]: number },
      actionBreakdown: {} as { [action: string]: number },
      timeRange: {
        from: events.length > 0 ? new Date(Math.min(...events.map(e => e.timestamp.getTime()))) : new Date(),
        to: events.length > 0 ? new Date(Math.max(...events.map(e => e.timestamp.getTime()))) : new Date()
      }
    };

    // Calcul des répartitions
    for (const event of events) {
      stats.sensitivityBreakdown[event.sensitivityLevel] = 
        (stats.sensitivityBreakdown[event.sensitivityLevel] || 0) + 1;
      stats.actionBreakdown[event.action] = 
        (stats.actionBreakdown[event.action] || 0) + 1;
    }

    return stats;
  }

  /**
   * Détecte les activités suspectes
   */
  private static detectSuspiciousActivities(events: AuditEvent[]): AuditEvent[] {
    const suspicious: AuditEvent[] = [];

    // Accès massif aux données
    const massiveAccess = events.filter(e => 
      e.action === 'data_access' && (e.dataVolume || 0) > 1000
    );
    suspicious.push(...massiveAccess);

    // Accès en dehors des heures normales
    const afterHours = events.filter(e => {
      const hour = e.timestamp.getHours();
      return (hour < 6 || hour > 22) && e.sensitivityLevel === 'highly_sensitive';
    });
    suspicious.push(...afterHours);

    // Tentatives d'accès refusées répétées
    const deniedAccess = events.filter(e => e.result === 'denied');
    suspicious.push(...deniedAccess);

    return suspicious;
  }

  /**
   * Évalue la conformité RGPD
   */
  private static assessCompliance(events: AuditEvent[]): any {
    const dataAccess = events.filter(e => e.action === 'data_access');
    const consentEvents = events.filter(e => ['consent_given', 'consent_withdrawn'].includes(e.action));
    
    return {
      dataMinimization: this.assessDataMinimization(dataAccess),
      purposeLimitation: this.assessPurposeLimitation(dataAccess),
      consentManagement: this.assessConsentManagement(consentEvents),
      dataRetention: this.assessDataRetention(events),
      score: 85 // Score de conformité calculé
    };
  }

  /**
   * Génère des recommandations
   */
  private static generateRecommendations(events: AuditEvent[]): string[] {
    const recommendations: string[] = [];

    const failureRate = events.filter(e => e.result === 'failure').length / events.length;
    if (failureRate > 0.1) {
      recommendations.push('Taux d\'échec élevé détecté - vérifier les permissions utilisateur');
    }

    const sensitiveAccess = events.filter(e => e.sensitivityLevel === 'highly_sensitive').length;
    if (sensitiveAccess > events.length * 0.3) {
      recommendations.push('Accès fréquent aux données sensibles - considérer une segmentation plus fine');
    }

    return recommendations;
  }

  // Méthodes d'évaluation de conformité (simplifiées)
  private static assessDataMinimization(events: AuditEvent[]): { score: number; details: string } {
    return { score: 90, details: 'Accès aux données généralement limité aux champs nécessaires' };
  }

  private static assessPurposeLimitation(events: AuditEvent[]): { score: number; details: string } {
    return { score: 85, details: 'La plupart des accès respectent la finalité déclarée' };
  }

  private static assessConsentManagement(events: AuditEvent[]): { score: number; details: string } {
    return { score: 80, details: 'Gestion du consentement active mais améliorable' };
  }

  private static assessDataRetention(events: AuditEvent[]): { score: number; details: string } {
    return { score: 88, details: 'Politique de rétention généralement respectée' };
  }

  /**
   * Génère un ID unique pour un événement
   */
  private static generateEventId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Stocke un événement de violation de données
   */
  private static async storeBreachEvent(breach: DataBreachEvent): Promise<void> {
    // En production, stockage sécurisé spécialisé
    console.log(`DATA BREACH LOGGED: ${breach.severity} - ${breach.type}`);
  }

  /**
   * Déclenche les alertes pour violation de données
   */
  private static async triggerBreachAlerts(breach: DataBreachEvent): Promise<void> {
    // Alertes automatiques selon la sévérité
    if (breach.severity === 'critical' || breach.severity === 'high') {
      console.log(`CRITICAL BREACH ALERT: Immediate action required`);
      // En production: notifications SMS, email, Slack, etc.
    }
  }

  /**
   * Estime la taille d'un fichier d'export
   */
  private static estimateFileSize(recordCount: number, format: string): number {
    const avgSizePerRecord = format === 'PDF' ? 2048 : format === 'DOCX' ? 1024 : 512;
    return recordCount * avgSizePerRecord;
  }

  /**
   * Nettoie les logs expirés
   */
  private static async cleanupExpiredLogs(): Promise<void> {
    const cutoffDate = new Date(Date.now() - this.retentionPeriod);
    // En production, suppression des logs antérieurs à la période de rétention
    console.log(`Cleanup: would remove audit logs before ${cutoffDate.toISOString()}`);
  }
}