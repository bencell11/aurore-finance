/**
 * Utilitaires de chiffrement pour la conformité RGPD
 * Chiffre les données sensibles avant stockage en base
 */

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY manquante dans les variables d\'environnement');
}

/**
 * Chiffrer une chaîne de caractères
 */
export async function encrypt(text: string): Promise<string> {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combiner IV + AuthTag + données chiffrées
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('[Encryption] Erreur chiffrement:', error);
    throw new Error('Erreur lors du chiffrement des données');
  }
}

/**
 * Déchiffrer une chaîne de caractères
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Format de données chiffrées invalide');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Erreur déchiffrement:', error);
    throw new Error('Erreur lors du déchiffrement des données');
  }
}

/**
 * Hacher un mot de passe avec salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return { hash, salt };
}

/**
 * Vérifier un mot de passe
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

/**
 * Générer une clé de chiffrement sécurisée
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Anonymiser des données pour export (RGPD)
 */
export function anonymizeData(data: any): any {
  const anonymized = JSON.parse(JSON.stringify(data));
  
  // Remplacer les données sensibles
  if (anonymized.personalInfo) {
    anonymized.personalInfo.nom = 'ANONYMISÉ';
    anonymized.personalInfo.prenom = 'ANONYMISÉ';
    anonymized.personalInfo.email = 'anonyme@example.com';
    anonymized.personalInfo.telephone = '***********';
    anonymized.personalInfo.adresse = 'ADRESSE ANONYMISÉE';
  }
  
  if (anonymized.incomeData?.mainEmployment) {
    anonymized.incomeData.mainEmployment.employer = 'EMPLOYEUR ANONYMISÉ';
  }
  
  return anonymized;
}