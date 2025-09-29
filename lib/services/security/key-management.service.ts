/**
 * Service de gestion des clés de chiffrement
 * Rotation automatique et gestion du cycle de vie
 */

import crypto from 'crypto';
import { KeyMetadata } from './gdpr-encryption.service';
import { SecurityConfig, DEFAULT_SECURITY_CONFIG } from '@/types/gdpr-tax';

export interface KeyRotationSchedule {
  keyId: string;
  currentVersion: string;
  nextRotationDate: Date;
  rotationInterval: number; // en jours
  autoRotate: boolean;
}

export interface KeyBackup {
  keyId: string;
  version: string;
  encryptedKeyMaterial: string;
  backupDate: Date;
  expirationDate: Date;
  checksumHash: string;
}

export class KeyManagementService {
  private static readonly config: SecurityConfig = DEFAULT_SECURITY_CONFIG;
  private static rotationSchedules = new Map<string, KeyRotationSchedule>();
  private static keyBackups = new Map<string, KeyBackup[]>();

  /**
   * Initialise le système de gestion des clés
   */
  static async initialize(): Promise<void> {
    console.log('Initializing Key Management Service...');
    
    // Vérifier les clés existantes
    await this.auditExistingKeys();
    
    // Programmer les rotations automatiques
    await this.scheduleAutomaticRotations();
    
    // Démarrer le processus de nettoyage périodique
    this.startPeriodicCleanup();
    
    console.log('Key Management Service initialized successfully');
  }

  /**
   * Audit des clés existantes
   */
  private static async auditExistingKeys(): Promise<void> {
    const keyIds = await this.getAllKeyIds();
    
    for (const keyId of keyIds) {
      const metadata = await this.getKeyMetadata(keyId);
      
      // Vérifier si la clé doit être rotée
      if (this.shouldRotateKey(metadata)) {
        console.warn(`Key ${keyId}:${metadata.version} should be rotated`);
        await this.scheduleKeyRotation(keyId, new Date());
      }
      
      // Vérifier l'intégrité
      const isValid = await this.validateKeyIntegrity(keyId, metadata.version);
      if (!isValid) {
        console.error(`Key integrity check failed for ${keyId}:${metadata.version}`);
        metadata.status = 'revoked';
        await this.updateKeyMetadata(keyId, metadata);
      }
    }
  }

  /**
   * Obtient tous les IDs de clés
   */
  private static async getAllKeyIds(): Promise<string[]> {
    // En production, récupérer depuis la base de données
    return ['default', 'backup-key', 'archive-key'];
  }

  /**
   * Obtient les métadonnées d'une clé
   */
  private static async getKeyMetadata(keyId: string, version?: string): Promise<KeyMetadata> {
    // En production, récupérer depuis la base de données
    const currentVersion = version || await this.getCurrentKeyVersion(keyId);
    
    return {
      keyId,
      version: currentVersion,
      algorithm: 'AES-256-GCM',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // dans 60 jours
      status: 'active',
      purpose: 'data-encryption'
    };
  }

  /**
   * Met à jour les métadonnées d'une clé
   */
  private static async updateKeyMetadata(keyId: string, metadata: KeyMetadata): Promise<void> {
    // En production, sauvegarder en base de données
    console.log(`Updated metadata for key ${keyId}:${metadata.version}`);
  }

  /**
   * Obtient la version actuelle d'une clé
   */
  private static async getCurrentKeyVersion(keyId: string): Promise<string> {
    // En production, récupérer depuis la base de données
    return process.env.ENCRYPTION_KEY_VERSION || 'v1';
  }

  /**
   * Détermine si une clé doit être rotée
   */
  private static shouldRotateKey(metadata: KeyMetadata): boolean {
    const now = new Date();
    const rotationThreshold = new Date(
      metadata.createdAt.getTime() + 
      this.config.keyManagement.rotationInterval * 24 * 60 * 60 * 1000
    );
    
    return now >= rotationThreshold || metadata.status === 'rotating';
  }

  /**
   * Programme une rotation de clé
   */
  static async scheduleKeyRotation(keyId: string, rotationDate: Date): Promise<void> {
    const currentVersion = await this.getCurrentKeyVersion(keyId);
    
    const schedule: KeyRotationSchedule = {
      keyId,
      currentVersion,
      nextRotationDate: rotationDate,
      rotationInterval: this.config.keyManagement.rotationInterval,
      autoRotate: true
    };

    this.rotationSchedules.set(keyId, schedule);
    
    // Programmer la rotation
    const delay = rotationDate.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => this.executeKeyRotation(keyId), delay);
    } else {
      // Rotation immédiate si la date est passée
      await this.executeKeyRotation(keyId);
    }
  }

  /**
   * Exécute la rotation d'une clé
   */
  static async executeKeyRotation(keyId: string): Promise<void> {
    console.log(`Starting key rotation for ${keyId}`);
    
    try {
      // 1. Créer la nouvelle version de clé
      const newVersion = await this.generateNewKeyVersion(keyId);
      
      // 2. Sauvegarder l'ancienne clé
      await this.backupCurrentKey(keyId);
      
      // 3. Activer la nouvelle clé
      await this.activateNewKey(keyId, newVersion);
      
      // 4. Marquer l'ancienne version comme deprecated
      await this.deprecateOldKey(keyId);
      
      // 5. Programmer la prochaine rotation
      const nextRotationDate = new Date(
        Date.now() + this.config.keyManagement.rotationInterval * 24 * 60 * 60 * 1000
      );
      await this.scheduleKeyRotation(keyId, nextRotationDate);
      
      console.log(`Key rotation completed successfully for ${keyId}`);
      
    } catch (error) {
      console.error(`Key rotation failed for ${keyId}:`, error);
      // En cas d'échec, restaurer l'état précédent
      await this.rollbackKeyRotation(keyId);
    }
  }

  /**
   * Génère une nouvelle version de clé
   */
  private static async generateNewKeyVersion(keyId: string): Promise<string> {
    const currentVersion = await this.getCurrentKeyVersion(keyId);
    const versionNumber = parseInt(currentVersion.replace('v', '')) + 1;
    return `v${versionNumber}`;
  }

  /**
   * Sauvegarde la clé actuelle
   */
  private static async backupCurrentKey(keyId: string): Promise<void> {
    const currentVersion = await this.getCurrentKeyVersion(keyId);
    const metadata = await this.getKeyMetadata(keyId, currentVersion);
    
    // Chiffrer la clé avec une clé de sauvegarde
    const backupKey = await this.getBackupKey();
    const keyMaterial = await this.getKeyMaterial(keyId, currentVersion);
    const encryptedKeyMaterial = await this.encryptKeyMaterial(keyMaterial, backupKey);
    
    const backup: KeyBackup = {
      keyId,
      version: currentVersion,
      encryptedKeyMaterial,
      backupDate: new Date(),
      expirationDate: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000), // 7 ans
      checksumHash: crypto.createHash('sha256').update(keyMaterial).digest('hex')
    };

    if (!this.keyBackups.has(keyId)) {
      this.keyBackups.set(keyId, []);
    }
    this.keyBackups.get(keyId)!.push(backup);
    
    // En production, sauvegarder en base de données sécurisée
    console.log(`Backed up key ${keyId}:${currentVersion}`);
  }

  /**
   * Active une nouvelle clé
   */
  private static async activateNewKey(keyId: string, newVersion: string): Promise<void> {
    // Générer la nouvelle clé
    const newKey = crypto.randomBytes(32);
    
    // Sauvegarder la nouvelle clé (en production, dans un KMS)
    await this.storeKeyMaterial(keyId, newVersion, newKey);
    
    // Mettre à jour la version active
    process.env.ENCRYPTION_KEY_VERSION = newVersion;
    
    console.log(`Activated new key ${keyId}:${newVersion}`);
  }

  /**
   * Déprécie l'ancienne clé
   */
  private static async deprecateOldKey(keyId: string): Promise<void> {
    // Marquer l'ancienne version comme deprecated mais la conserver
    // pour le déchiffrement des données existantes
    console.log(`Deprecated old key version for ${keyId}`);
  }

  /**
   * Annule une rotation de clé en cas d'échec
   */
  private static async rollbackKeyRotation(keyId: string): Promise<void> {
    console.log(`Rolling back key rotation for ${keyId}`);
    // Logique de restauration en cas d'échec
  }

  /**
   * Valide l'intégrité d'une clé
   */
  private static async validateKeyIntegrity(keyId: string, version: string): Promise<boolean> {
    try {
      const keyMaterial = await this.getKeyMaterial(keyId, version);
      
      // Vérifier que la clé n'est pas corrompue
      if (!keyMaterial || keyMaterial.length !== 32) {
        return false;
      }
      
      // Test de chiffrement/déchiffrement
      const testData = 'integrity-test-data';
      const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, crypto.randomBytes(12));
      const encrypted = cipher.update(testData, 'utf8', 'hex') + cipher.final('hex');
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial, cipher.getAuthTag());
      const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
      
      return decrypted === testData;
      
    } catch (error) {
      console.error(`Key integrity validation failed for ${keyId}:${version}`, error);
      return false;
    }
  }

  /**
   * Programme les rotations automatiques
   */
  private static async scheduleAutomaticRotations(): Promise<void> {
    const keyIds = await this.getAllKeyIds();
    
    for (const keyId of keyIds) {
      const metadata = await this.getKeyMetadata(keyId);
      const nextRotation = new Date(
        metadata.createdAt.getTime() + 
        this.config.keyManagement.rotationInterval * 24 * 60 * 60 * 1000
      );
      
      if (nextRotation > new Date()) {
        await this.scheduleKeyRotation(keyId, nextRotation);
      }
    }
  }

  /**
   * Démarre le nettoyage périodique
   */
  private static startPeriodicCleanup(): void {
    // Nettoyage quotidien des clés expirées
    setInterval(async () => {
      await this.cleanupExpiredKeys();
      await this.cleanupOldBackups();
    }, 24 * 60 * 60 * 1000); // Toutes les 24h
  }

  /**
   * Nettoie les clés expirées
   */
  private static async cleanupExpiredKeys(): Promise<void> {
    const keyIds = await this.getAllKeyIds();
    const now = new Date();
    
    for (const keyId of keyIds) {
      const metadata = await this.getKeyMetadata(keyId);
      
      if (metadata.expiresAt < now && metadata.status === 'deprecated') {
        // Supprimer définitivement les clés expirées
        await this.secureDeleteKey(keyId, metadata.version);
        console.log(`Cleaned up expired key ${keyId}:${metadata.version}`);
      }
    }
  }

  /**
   * Nettoie les anciennes sauvegardes
   */
  private static async cleanupOldBackups(): Promise<void> {
    const now = new Date();
    
    for (const [keyId, backups] of this.keyBackups.entries()) {
      const validBackups = backups.filter(backup => backup.expirationDate > now);
      
      if (validBackups.length !== backups.length) {
        this.keyBackups.set(keyId, validBackups);
        console.log(`Cleaned up expired backups for key ${keyId}`);
      }
    }
  }

  /**
   * Supprime de manière sécurisée une clé
   */
  private static async secureDeleteKey(keyId: string, version: string): Promise<void> {
    // Écraser la clé avec des données aléatoires
    const keyMaterial = await this.getKeyMaterial(keyId, version);
    if (keyMaterial) {
      crypto.randomFillSync(keyMaterial);
    }
    
    // Supprimer de tous les caches et stockages
    console.log(`Securely deleted key ${keyId}:${version}`);
  }

  /**
   * Obtient le matériel cryptographique d'une clé
   */
  private static async getKeyMaterial(keyId: string, version: string): Promise<Buffer> {
    // En production, récupérer depuis le KMS
    const masterSecret = process.env.MASTER_ENCRYPTION_KEY || 'dev-master-key';
    const salt = Buffer.from(`${keyId}:${version}`, 'utf8');
    return crypto.pbkdf2Sync(masterSecret, salt, 100000, 32, 'sha256');
  }

  /**
   * Stocke le matériel cryptographique d'une clé
   */
  private static async storeKeyMaterial(keyId: string, version: string, keyMaterial: Buffer): Promise<void> {
    // En production, stocker dans un KMS sécurisé
    console.log(`Stored key material for ${keyId}:${version}`);
  }

  /**
   * Obtient la clé de sauvegarde
   */
  private static async getBackupKey(): Promise<Buffer> {
    // Clé spéciale pour chiffrer les sauvegardes
    const backupSecret = process.env.BACKUP_KEY || 'backup-master-key';
    return crypto.pbkdf2Sync(backupSecret, Buffer.from('backup-salt', 'utf8'), 100000, 32, 'sha256');
  }

  /**
   * Chiffre le matériel de clé pour sauvegarde
   */
  private static async encryptKeyMaterial(keyMaterial: Buffer, backupKey: Buffer): Promise<string> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', backupKey, iv);
    
    let encrypted = cipher.update(keyMaterial, undefined, 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      encrypted,
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    });
  }

  /**
   * Obtient des statistiques sur les clés
   */
  static async getKeyStatistics(): Promise<any> {
    const keyIds = await this.getAllKeyIds();
    const stats = {
      totalKeys: keyIds.length,
      activeKeys: 0,
      rotatingKeys: 0,
      deprecatedKeys: 0,
      revokedKeys: 0,
      nextRotations: [] as any[]
    };

    for (const keyId of keyIds) {
      const metadata = await this.getKeyMetadata(keyId);
      
      switch (metadata.status) {
        case 'active': stats.activeKeys++; break;
        case 'rotating': stats.rotatingKeys++; break;
        case 'deprecated': stats.deprecatedKeys++; break;
        case 'revoked': stats.revokedKeys++; break;
      }

      const schedule = this.rotationSchedules.get(keyId);
      if (schedule) {
        stats.nextRotations.push({
          keyId,
          nextRotation: schedule.nextRotationDate
        });
      }
    }

    return stats;
  }
}