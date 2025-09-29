/**
 * Service de contrôle d'accès basé sur les rôles (RBAC)
 * Gestion fine des permissions pour les données fiscales sensibles
 */

import { GDPR_TAX_SCHEMA, GDPRFieldMetadata, DataSensitivityLevel } from '@/types/gdpr-tax';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  dataAccessLevel: DataSensitivityLevel;
  restrictions: AccessRestriction[];
  inherited?: string[]; // Rôles parents
}

export interface Permission {
  action: 'read' | 'write' | 'delete' | 'export' | 'anonymize' | 'decrypt';
  resource: string; // pattern ou champ spécifique
  conditions?: AccessCondition[];
  granted: boolean;
  reason?: string;
}

export interface AccessCondition {
  type: 'time_window' | 'ip_whitelist' | 'purpose' | 'consent_required' | 'mfa_required';
  value: any;
  operator: 'equals' | 'contains' | 'between' | 'in' | 'not_in';
}

export interface AccessRestriction {
  type: 'field_masking' | 'read_only' | 'audit_required' | 'approval_required';
  fields?: string[];
  message?: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  active: boolean;
  purpose: string;
}

export interface AccessRequest {
  id: string;
  userId: string;
  action: string;
  resource: string;
  purpose: string;
  requestedAt: Date;
  ipAddress: string;
  userAgent: string;
  context?: any;
}

export interface AccessResult {
  granted: boolean;
  reason: string;
  restrictions: AccessRestriction[];
  auditRequired: boolean;
  conditions: AccessCondition[];
  maskedFields?: string[];
}

export class RBACService {
  private static roles = new Map<string, Role>();
  private static userRoles = new Map<string, UserRole[]>();
  private static permissions = new Map<string, Permission[]>();

  /**
   * Initialise les rôles par défaut
   */
  static initialize(): void {
    this.defineDefaultRoles();
    this.setupPermissionMatrix();
  }

  /**
   * Définit les rôles par défaut du système
   */
  private static defineDefaultRoles(): void {
    // Rôle utilisateur standard
    const userRole: Role = {
      id: 'user',
      name: 'Utilisateur Standard',
      description: 'Accès à ses propres données fiscales',
      dataAccessLevel: 'confidential',
      permissions: [
        {
          action: 'read',
          resource: 'tax_profile.own',
          granted: true,
          conditions: [
            { type: 'purpose', value: 'personal_use', operator: 'equals' }
          ]
        },
        {
          action: 'write',
          resource: 'tax_profile.own',
          granted: true,
          conditions: [
            { type: 'consent_required', value: true, operator: 'equals' }
          ]
        },
        {
          action: 'export',
          resource: 'tax_profile.own',
          granted: true,
          restrictions: [
            { type: 'audit_required', message: 'Export des données personnelles' }
          ]
        }
      ],
      restrictions: [
        {
          type: 'field_masking',
          fields: ['internalNotes', 'systemMetadata'],
          message: 'Champs système masqués'
        }
      ]
    };

    // Rôle assistant fiscal (IA)
    const aiAssistantRole: Role = {
      id: 'ai_assistant',
      name: 'Assistant Fiscal IA',
      description: 'Accès anonymisé pour assistance fiscale',
      dataAccessLevel: 'internal',
      permissions: [
        {
          action: 'read',
          resource: 'tax_profile.anonymized',
          granted: true,
          conditions: [
            { type: 'purpose', value: 'ai_assistance', operator: 'equals' }
          ]
        }
      ],
      restrictions: [
        {
          type: 'field_masking',
          fields: ['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.socialSecurityNumber'],
          message: 'Données personnelles automatiquement anonymisées'
        }
      ]
    };

    // Rôle administrateur fiscal
    const fiscalAdminRole: Role = {
      id: 'fiscal_admin',
      name: 'Administrateur Fiscal',
      description: 'Accès complet pour support client',
      dataAccessLevel: 'highly_sensitive',
      permissions: [
        {
          action: 'read',
          resource: 'tax_profile.*',
          granted: true,
          conditions: [
            { type: 'purpose', value: 'customer_support', operator: 'equals' },
            { type: 'mfa_required', value: true, operator: 'equals' }
          ]
        },
        {
          action: 'write',
          resource: 'tax_profile.*',
          granted: true,
          conditions: [
            { type: 'approval_required', value: true, operator: 'equals' }
          ]
        }
      ],
      restrictions: [
        {
          type: 'audit_required',
          message: 'Tous les accès admin sont audités'
        }
      ]
    };

    // Rôle auditeur RGPD
    const gdprAuditorRole: Role = {
      id: 'gdpr_auditor',
      name: 'Auditeur RGPD',
      description: 'Accès aux métadonnées pour audit de conformité',
      dataAccessLevel: 'internal',
      permissions: [
        {
          action: 'read',
          resource: 'audit_logs.*',
          granted: true
        },
        {
          action: 'read',
          resource: 'gdpr_requests.*',
          granted: true
        },
        {
          action: 'read',
          resource: 'consent_records.*',
          granted: true
        }
      ],
      restrictions: [
        {
          type: 'field_masking',
          fields: ['personalInfo.*', 'incomeData.*', 'assets.*'],
          message: 'Données fiscales masquées pour audit'
        }
      ]
    };

    // Stockage des rôles
    this.roles.set('user', userRole);
    this.roles.set('ai_assistant', aiAssistantRole);
    this.roles.set('fiscal_admin', fiscalAdminRole);
    this.roles.set('gdpr_auditor', gdprAuditorRole);
  }

  /**
   * Configure la matrice des permissions
   */
  private static setupPermissionMatrix(): void {
    for (const [roleId, role] of this.roles.entries()) {
      this.permissions.set(roleId, role.permissions);
    }
  }

  /**
   * Assigne un rôle à un utilisateur
   */
  static async assignRole(
    userId: string,
    roleId: string,
    assignedBy: string,
    purpose: string,
    expiresAt?: Date
  ): Promise<void> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }

    const userRole: UserRole = {
      userId,
      roleId,
      assignedBy,
      assignedAt: new Date(),
      expiresAt,
      active: true,
      purpose
    };

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, []);
    }
    
    this.userRoles.get(userId)!.push(userRole);
    
    // En production, sauvegarder en base de données
    console.log(`Assigned role ${roleId} to user ${userId} for purpose: ${purpose}`);
  }

  /**
   * Vérifie l'accès à une ressource
   */
  static async checkAccess(
    userId: string,
    action: string,
    resource: string,
    context: any = {}
  ): Promise<AccessResult> {
    const userRoles = this.getUserRoles(userId);
    
    if (userRoles.length === 0) {
      return {
        granted: false,
        reason: 'Aucun rôle assigné',
        restrictions: [],
        auditRequired: true,
        conditions: []
      };
    }

    // Évaluer chaque rôle
    for (const userRole of userRoles) {
      if (!userRole.active || (userRole.expiresAt && userRole.expiresAt < new Date())) {
        continue;
      }

      const role = this.roles.get(userRole.roleId);
      if (!role) {
        continue;
      }

      const accessResult = await this.evaluateRoleAccess(role, action, resource, context);
      if (accessResult.granted) {
        return accessResult;
      }
    }

    return {
      granted: false,
      reason: 'Permissions insuffisantes',
      restrictions: [],
      auditRequired: true,
      conditions: []
    };
  }

  /**
   * Évalue l'accès pour un rôle spécifique
   */
  private static async evaluateRoleAccess(
    role: Role,
    action: string,
    resource: string,
    context: any
  ): Promise<AccessResult> {
    // Rechercher une permission correspondante
    const matchingPermission = role.permissions.find(permission => 
      permission.action === action && this.resourceMatches(permission.resource, resource)
    );

    if (!matchingPermission || !matchingPermission.granted) {
      return {
        granted: false,
        reason: `Action ${action} non autorisée pour le rôle ${role.name}`,
        restrictions: [],
        auditRequired: false,
        conditions: []
      };
    }

    // Vérifier les conditions
    const conditionResults = await this.evaluateConditions(matchingPermission.conditions || [], context);
    if (!conditionResults.satisfied) {
      return {
        granted: false,
        reason: `Conditions non satisfaites: ${conditionResults.failedConditions.join(', ')}`,
        restrictions: [],
        auditRequired: true,
        conditions: matchingPermission.conditions || []
      };
    }

    // Appliquer les restrictions du rôle
    const maskedFields = this.getMaskedFields(role, resource);
    const auditRequired = this.isAuditRequired(role, action);

    return {
      granted: true,
      reason: `Accès autorisé via le rôle ${role.name}`,
      restrictions: role.restrictions,
      auditRequired,
      conditions: matchingPermission.conditions || [],
      maskedFields
    };
  }

  /**
   * Vérifie si une ressource correspond au pattern
   */
  private static resourceMatches(pattern: string, resource: string): boolean {
    if (pattern === resource) return true;
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return resource.startsWith(prefix);
    }
    if (pattern === '*') return true;
    return false;
  }

  /**
   * Évalue les conditions d'accès
   */
  private static async evaluateConditions(
    conditions: AccessCondition[],
    context: any
  ): Promise<{ satisfied: boolean; failedConditions: string[] }> {
    const failedConditions: string[] = [];

    for (const condition of conditions) {
      const satisfied = await this.evaluateCondition(condition, context);
      if (!satisfied) {
        failedConditions.push(condition.type);
      }
    }

    return {
      satisfied: failedConditions.length === 0,
      failedConditions
    };
  }

  /**
   * Évalue une condition spécifique
   */
  private static async evaluateCondition(condition: AccessCondition, context: any): Promise<boolean> {
    switch (condition.type) {
      case 'purpose':
        return context.purpose === condition.value;
        
      case 'time_window':
        return this.isWithinTimeWindow(condition.value);
        
      case 'ip_whitelist':
        return this.isIpWhitelisted(context.ipAddress, condition.value);
        
      case 'consent_required':
        return context.hasConsent === true;
        
      case 'mfa_required':
        return context.mfaVerified === true;
        
      default:
        return true;
    }
  }

  /**
   * Vérifie si l'accès est dans une fenêtre temporelle autorisée
   */
  private static isWithinTimeWindow(timeWindow: any): boolean {
    // Logique de vérification des horaires d'accès
    return true; // Simplifié pour la démo
  }

  /**
   * Vérifie si l'IP est dans la liste blanche
   */
  private static isIpWhitelisted(ipAddress: string, whitelist: string[]): boolean {
    return whitelist.includes(ipAddress);
  }

  /**
   * Obtient les champs masqués pour un rôle
   */
  private static getMaskedFields(role: Role, resource: string): string[] {
    const maskedFields: string[] = [];
    
    for (const restriction of role.restrictions) {
      if (restriction.type === 'field_masking' && restriction.fields) {
        maskedFields.push(...restriction.fields);
      }
    }

    return maskedFields;
  }

  /**
   * Détermine si l'audit est requis
   */
  private static isAuditRequired(role: Role, action: string): boolean {
    return role.restrictions.some(r => r.type === 'audit_required') ||
           ['delete', 'export', 'decrypt'].includes(action);
  }

  /**
   * Obtient les rôles d'un utilisateur
   */
  private static getUserRoles(userId: string): UserRole[] {
    return this.userRoles.get(userId) || [];
  }

  /**
   * Filtre les données selon les permissions
   */
  static async filterDataByPermissions(
    data: any,
    userId: string,
    purpose: string
  ): Promise<any> {
    const accessResult = await this.checkAccess(userId, 'read', 'tax_profile', { purpose });
    
    if (!accessResult.granted) {
      throw new Error(accessResult.reason);
    }

    if (!accessResult.maskedFields || accessResult.maskedFields.length === 0) {
      return data;
    }

    // Appliquer le masquage des champs
    const filtered = { ...data };
    for (const fieldPath of accessResult.maskedFields) {
      this.maskField(filtered, fieldPath);
    }

    return filtered;
  }

  /**
   * Masque un champ dans les données
   */
  private static maskField(data: any, fieldPath: string): void {
    const keys = fieldPath.split('.');
    let current = data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key === '*') {
        // Traiter tous les éléments d'un array
        if (Array.isArray(current)) {
          for (const item of current) {
            this.maskField(item, keys.slice(i + 1).join('.'));
          }
        }
        return;
      }
      if (!current[key]) return;
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (current[lastKey] !== undefined) {
      current[lastKey] = '[MASQUÉ]';
    }
  }

  /**
   * Révoque un rôle
   */
  static async revokeRole(userId: string, roleId: string, revokedBy: string): Promise<void> {
    const userRoles = this.userRoles.get(userId);
    if (userRoles) {
      const roleIndex = userRoles.findIndex(ur => ur.roleId === roleId && ur.active);
      if (roleIndex !== -1) {
        userRoles[roleIndex].active = false;
        console.log(`Revoked role ${roleId} from user ${userId} by ${revokedBy}`);
      }
    }
  }

  /**
   * Obtient les permissions effectives d'un utilisateur
   */
  static async getEffectivePermissions(userId: string): Promise<Permission[]> {
    const userRoles = this.getUserRoles(userId);
    const effectivePermissions: Permission[] = [];

    for (const userRole of userRoles) {
      if (!userRole.active) continue;
      
      const role = this.roles.get(userRole.roleId);
      if (role) {
        effectivePermissions.push(...role.permissions);
      }
    }

    return effectivePermissions;
  }

  /**
   * Génère un rapport d'accès
   */
  static async generateAccessReport(userId: string): Promise<any> {
    const userRoles = this.getUserRoles(userId);
    const effectivePermissions = await this.getEffectivePermissions(userId);

    return {
      userId,
      roles: userRoles.map(ur => ({
        roleId: ur.roleId,
        roleName: this.roles.get(ur.roleId)?.name,
        active: ur.active,
        assignedAt: ur.assignedAt,
        expiresAt: ur.expiresAt,
        purpose: ur.purpose
      })),
      permissions: effectivePermissions,
      dataAccessLevel: this.getHighestDataAccessLevel(userRoles),
      generatedAt: new Date()
    };
  }

  /**
   * Obtient le niveau d'accès le plus élevé
   */
  private static getHighestDataAccessLevel(userRoles: UserRole[]): DataSensitivityLevel {
    const levels: DataSensitivityLevel[] = ['public', 'internal', 'confidential', 'highly_sensitive'];
    let highestLevel: DataSensitivityLevel = 'public';

    for (const userRole of userRoles) {
      if (!userRole.active) continue;
      
      const role = this.roles.get(userRole.roleId);
      if (role) {
        const currentIndex = levels.indexOf(role.dataAccessLevel);
        const highestIndex = levels.indexOf(highestLevel);
        if (currentIndex > highestIndex) {
          highestLevel = role.dataAccessLevel;
        }
      }
    }

    return highestLevel;
  }
}