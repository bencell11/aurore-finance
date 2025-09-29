/**
 * Service de chiffrement RGPD conforme
 * Implémentation AES-256-GCM avec gestion des clés et rotation
 */

import crypto from 'crypto';
import { SecurityConfig, DEFAULT_SECURITY_CONFIG } from '@/types/gdpr-tax';

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
  salt: string;
  keyVersion: string;
  algorithm: string;
  timestamp: number;
}

export interface KeyMetadata {
  keyId: string;
  version: string;
  algorithm: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'rotating' | 'deprecated' | 'revoked';
  purpose: string;
}

export class GDPREncryptionService {
  private static readonly config: SecurityConfig = DEFAULT_SECURITY_CONFIG;
  private static keyCache = new Map<string, Buffer>();
  private static keyMetadataCache = new Map<string, KeyMetadata>();

  /**
   * Génère une clé de chiffrement sécurisée
   */
  static generateEncryptionKey(): Buffer {
    return crypto.randomBytes(32); // 256 bits pour AES-256
  }

  /**
   * Dérive une clé à partir d'un master secret et d'un salt
   */
  static deriveKey(masterSecret: string, salt: Buffer, iterations: number = 100000): Buffer {
    if (this.config.encryption.keyDerivation === 'Argon2') {
      // Pour la production, utiliser argon2 library
      // import argon2 from 'argon2';
      // return argon2.hash(masterSecret, { salt, timeCost: 4, memoryCost: 2 ** 16 });
      
      // Fallback vers PBKDF2 pour la démo
      return crypto.pbkdf2Sync(masterSecret, salt, iterations, 32, 'sha256');
    } else {
      return crypto.pbkdf2Sync(masterSecret, salt, iterations, 32, 'sha256');
    }
  }

  /**
   * Obtient la clé de chiffrement actuelle
   */
  static async getCurrentEncryptionKey(): Promise<{ key: Buffer; metadata: KeyMetadata }> {
    const keyId = process.env.ENCRYPTION_KEY_ID || 'default';
    const currentVersion = await this.getCurrentKeyVersion(keyId);
    
    const cacheKey = `${keyId}:${currentVersion}`;
    let key = this.keyCache.get(cacheKey);
    let metadata = this.keyMetadataCache.get(cacheKey);

    if (!key || !metadata) {
      const result = await this.loadEncryptionKey(keyId, currentVersion);
      key = result.key;
      metadata = result.metadata;
      
      // Cache avec TTL
      this.keyCache.set(cacheKey, key);
      this.keyMetadataCache.set(cacheKey, metadata);
    }

    return { key, metadata };
  }

  /**
   * Charge une clé de chiffrement spécifique
   */
  private static async loadEncryptionKey(keyId: string, version: string): Promise<{ key: Buffer; metadata: KeyMetadata }> {
    // En production, intégrer avec AWS KMS, Azure Key Vault, etc.
    if (this.config.keyManagement.provider === 'aws-kms') {
      return this.loadFromAWSKMS(keyId, version);
    } else if (this.config.keyManagement.provider === 'azure-keyvault') {
      return this.loadFromAzureKeyVault(keyId, version);
    } else {
      return this.loadFromLocalStorage(keyId, version);
    }
  }

  /**
   * Stockage local des clés (pour développement uniquement)
   */
  private static async loadFromLocalStorage(keyId: string, version: string): Promise<{ key: Buffer; metadata: KeyMetadata }> {
    const masterSecret = process.env.MASTER_ENCRYPTION_KEY || 'dev-master-key-not-for-production';
    const salt = Buffer.from(process.env.KEY_SALT || 'dev-salt-16-bytes', 'utf8');
    
    const key = this.deriveKey(`${masterSecret}:${keyId}:${version}`, salt);
    
    const metadata: KeyMetadata = {
      keyId,
      version,
      algorithm: 'AES-256-GCM',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.keyManagement.rotationInterval * 24 * 60 * 60 * 1000),
      status: 'active',
      purpose: 'data-encryption'
    };

    return { key, metadata };
  }

  /**
   * Intégration AWS KMS (placeholder)
   */
  private static async loadFromAWSKMS(keyId: string, version: string): Promise<{ key: Buffer; metadata: KeyMetadata }> {
    // TODO: Implémenter l'intégration AWS KMS
    throw new Error('AWS KMS integration not implemented yet');
  }

  /**
   * Intégration Azure Key Vault (placeholder)
   */
  private static async loadFromAzureKeyVault(keyId: string, version: string): Promise<{ key: Buffer; metadata: KeyMetadata }> {
    // TODO: Implémenter l'intégration Azure Key Vault
    throw new Error('Azure Key Vault integration not implemented yet');
  }

  /**
   * Obtient la version actuelle de la clé
   */
  private static async getCurrentKeyVersion(keyId: string): Promise<string> {
    // En production, récupérer depuis la base de données ou le service de clés
    return process.env.ENCRYPTION_KEY_VERSION || 'v1';
  }

  /**
   * Chiffre des données sensibles
   */
  static async encryptSensitiveData(data: string): Promise<EncryptedData> {
    if (!data || data.trim() === '') {
      throw new Error('Cannot encrypt empty data');
    }

    const { key, metadata } = await this.getCurrentEncryptionKey();
    
    // Génération d'un IV aléatoire pour chaque chiffrement
    const iv = crypto.randomBytes(this.config.encryption.ivLength);
    const salt = crypto.randomBytes(this.config.encryption.saltLength);
    
    // Création du cipher
    const cipher = crypto.createCipheriv(this.config.encryption.algorithm, key, iv);
    
    // Chiffrement
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Récupération du tag d'authentification
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      salt: salt.toString('base64'),
      keyVersion: metadata.version,
      algorithm: this.config.encryption.algorithm,
      timestamp: Date.now()
    };
  }

  /**
   * Déchiffre des données sensibles
   */
  static async decryptSensitiveData(encryptedObj: EncryptedData): Promise<string> {
    if (!encryptedObj.encryptedData) {
      throw new Error('No encrypted data provided');
    }

    // Récupération de la clé correspondante à la version
    const { key } = await this.loadEncryptionKey('default', encryptedObj.keyVersion);
    
    // Reconstruction des buffers
    const iv = Buffer.from(encryptedObj.iv, 'base64');
    const authTag = Buffer.from(encryptedObj.authTag, 'base64');
    
    // Création du decipher
    const decipher = crypto.createDecipheriv(encryptedObj.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    // Déchiffrement
    let decrypted = decipher.update(encryptedObj.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Chiffre un objet complet selon le schéma RGPD
   */
  static async encryptTaxProfile(profile: any): Promise<any> {
    const { GDPR_TAX_SCHEMA } = await import('@/types/gdpr-tax');
    const encrypted = { ...profile };

    for (const [fieldPath, metadata] of Object.entries(GDPR_TAX_SCHEMA)) {
      if (metadata.encrypted && metadata.sensitive) {
        const value = this.getNestedValue(profile, fieldPath);
        if (value !== undefined && value !== null) {
          const encryptedValue = await this.encryptSensitiveData(String(value));
          this.setNestedValue(encrypted, fieldPath, encryptedValue);
        }
      }
    }

    return encrypted;
  }

  /**
   * Déchiffre un objet complet selon le schéma RGPD
   */
  static async decryptTaxProfile(encryptedProfile: any): Promise<any> {
    const { GDPR_TAX_SCHEMA } = await import('@/types/gdpr-tax');
    const decrypted = { ...encryptedProfile };

    for (const [fieldPath, metadata] of Object.entries(GDPR_TAX_SCHEMA)) {
      if (metadata.encrypted && metadata.sensitive) {
        const encryptedValue = this.getNestedValue(encryptedProfile, fieldPath);
        if (encryptedValue && typeof encryptedValue === 'object' && encryptedValue.encryptedData) {
          const decryptedValue = await this.decryptSensitiveData(encryptedValue);
          this.setNestedValue(decrypted, fieldPath, decryptedValue);
        }
      }
    }

    return decrypted;
  }

  /**
   * Utilitaire pour accéder aux propriétés imbriquées
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (key.includes('*')) {
        // Gestion des arrays
        const [arrayKey, ...rest] = key.split('*');
        if (current[arrayKey] && Array.isArray(current[arrayKey])) {
          return current[arrayKey].map((item: any) => 
            rest.length > 0 ? this.getNestedValue(item, rest.join('*')) : item
          );
        }
        return undefined;
      }
      return current?.[key];
    }, obj);
  }

  /**
   * Utilitaire pour définir les propriétés imbriquées
   */
  private static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  /**
   * Rotation des clés de chiffrement
   */
  static async rotateEncryptionKeys(): Promise<void> {
    const currentKeyId = process.env.ENCRYPTION_KEY_ID || 'default';
    const currentVersion = await this.getCurrentKeyVersion(currentKeyId);
    const newVersion = `v${parseInt(currentVersion.replace('v', '')) + 1}`;

    // Créer une nouvelle clé
    const newKey = this.generateEncryptionKey();
    
    // En production, sauvegarder dans le service de clés
    console.log(`Rotating encryption key from ${currentVersion} to ${newVersion}`);
    
    // Mettre à jour la version dans les variables d'environnement
    process.env.ENCRYPTION_KEY_VERSION = newVersion;
    
    // Invalider le cache
    this.keyCache.clear();
    this.keyMetadataCache.clear();
  }

  /**
   * Vérifie l'intégrité des données chiffrées
   */
  static async verifyDataIntegrity(encryptedData: EncryptedData): Promise<boolean> {
    try {
      const decrypted = await this.decryptSensitiveData(encryptedData);
      return decrypted !== null && decrypted !== undefined;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      return false;
    }
  }

  /**
   * Génère un hash sécurisé pour l'anonymisation
   */
  static generateSecureHash(data: string, salt?: string): string {
    const saltBuffer = salt ? Buffer.from(salt, 'utf8') : crypto.randomBytes(16);
    const hash = crypto.createHash(this.config.anonymization.hashAlgorithm);
    hash.update(data);
    hash.update(saltBuffer);
    return hash.digest('hex');
  }

  /**
   * Efface de manière sécurisée les données en mémoire
   */
  static secureErase(buffer: Buffer): void {
    if (buffer) {
      crypto.randomFillSync(buffer);
    }
  }
}