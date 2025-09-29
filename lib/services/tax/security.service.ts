import crypto from 'crypto';

/**
 * Service de sécurité pour le module fiscal
 * Gère le chiffrement, l'anonymisation et la protection des données sensibles
 */
export class TaxSecurityService {
  private static algorithm = 'aes-256-gcm';
  private static saltLength = 32;
  private static tagLength = 16;
  private static ivLength = 16;
  
  /**
   * Génère un identifiant anonyme unique pour un utilisateur
   */
  static generateAnonymizedId(userId: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(userId + process.env.ANONYMIZATION_SALT || 'default-salt');
    return `ANON-${hash.digest('hex').substring(0, 16).toUpperCase()}`;
  }
  
  /**
   * Chiffre des données sensibles (AVS, date de naissance, etc.)
   */
  static encryptSensitiveData(data: any): string {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    if (key.length !== 32) {
      throw new Error('Invalid encryption key length');
    }
    
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const jsonData = JSON.stringify(data);
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine IV + tag + encrypted data
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  }
  
  /**
   * Déchiffre des données sensibles
   */
  static decryptSensitiveData(encryptedData: string): any {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    if (key.length !== 32) {
      throw new Error('Invalid encryption key length');
    }
    
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
  
  /**
   * Anonymise les données avant envoi à l'IA
   */
  static anonymizeForAI(data: any): any {
    const anonymized = JSON.parse(JSON.stringify(data));
    
    // Liste des champs à masquer
    const sensitiveFields = [
      'avsNumber', 'numeroAVS', 'dateOfBirth', 'dateNaissance',
      'nom', 'prenom', 'lastName', 'firstName', 'address', 'adresse',
      'email', 'phone', 'telephone', 'bankAccount', 'iban'
    ];
    
    const maskField = (obj: any, field: string) => {
      if (obj[field]) {
        if (typeof obj[field] === 'string') {
          obj[field] = '***MASKED***';
        } else if (typeof obj[field] === 'number') {
          obj[field] = 0;
        }
      }
    };
    
    // Parcours récursif pour masquer les champs sensibles
    const processObject = (obj: any) => {
      for (const key in obj) {
        if (sensitiveFields.includes(key)) {
          maskField(obj, key);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          processObject(obj[key]);
        }
      }
    };
    
    processObject(anonymized);
    
    return anonymized;
  }
  
  /**
   * Valide et nettoie les entrées utilisateur
   */
  static sanitizeInput(input: string): string {
    // Supprime les caractères potentiellement dangereux
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[<>\"']/g, '')
      .trim();
  }
  
  /**
   * Hache un mot de passe ou une donnée sensible
   */
  static hashData(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + (process.env.HASH_SALT || ''))
      .digest('hex');
  }
  
  /**
   * Génère un token sécurisé pour les exports
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Valide qu'un utilisateur a accès à des données
   */
  static validateAccess(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
  }
  
  /**
   * Chiffre une URL de document
   */
  static encryptDocumentUrl(url: string, userId: string): string {
    const data = {
      url,
      userId,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 heures
    };
    
    return this.encryptSensitiveData(data);
  }
  
  /**
   * Déchiffre et valide une URL de document
   */
  static decryptDocumentUrl(encryptedUrl: string, userId: string): string | null {
    try {
      const data = this.decryptSensitiveData(encryptedUrl);
      
      // Vérifie l'utilisateur
      if (data.userId !== userId) {
        return null;
      }
      
      // Vérifie l'expiration
      if (data.expires < Date.now()) {
        return null;
      }
      
      return data.url;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Nettoie les données avant stockage en base
   */
  static prepareForStorage(data: any): any {
    const prepared = JSON.parse(JSON.stringify(data));
    
    // Champs à chiffrer avant stockage
    const encryptFields = ['avsNumber', 'dateOfBirth', 'bankAccounts'];
    
    for (const field of encryptFields) {
      if (prepared[field]) {
        prepared[`encrypted_${field}`] = this.encryptSensitiveData(prepared[field]);
        delete prepared[field];
      }
    }
    
    return prepared;
  }
  
  /**
   * Restaure les données après récupération de la base
   */
  static restoreFromStorage(data: any): any {
    const restored = JSON.parse(JSON.stringify(data));
    
    // Champs à déchiffrer
    const encryptFields = ['avsNumber', 'dateOfBirth', 'bankAccounts'];
    
    for (const field of encryptFields) {
      const encryptedField = `encrypted_${field}`;
      if (restored[encryptedField]) {
        try {
          restored[field] = this.decryptSensitiveData(restored[encryptedField]);
          delete restored[encryptedField];
        } catch (error) {
          console.error(`Failed to decrypt ${field}:`, error);
        }
      }
    }
    
    return restored;
  }
}