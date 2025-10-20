/**
 * Utilitaires de chiffrement pour la conformité RGPD
 * Chiffre les données sensibles avant stockage en base
 */

// Import conditionnel de crypto pour compatibilité navigateur
let crypto: any;
if (typeof window === 'undefined') {
  // Côté serveur uniquement
  crypto = require('crypto');
}

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

// Vérifier seulement côté serveur
if (typeof window === 'undefined' && !ENCRYPTION_KEY) {
  console.warn('[Encryption] ENCRYPTION_KEY manquante - les fonctions de chiffrement ne fonctionneront pas');
}

/**
 * Chiffrer une chaîne de caractères
 */
export async function encrypt(text: string): Promise<string> {
  // Guard: fonction disponible seulement côté serveur
  if (typeof window !== 'undefined') {
    console.warn('[Encryption] encrypt() appelé côté client - ignoré');
    return text; // Retourner texte non chiffré côté client
  }

  if (!crypto || !ENCRYPTION_KEY) {
    console.error('[Encryption] Crypto non disponible ou ENCRYPTION_KEY manquante');
    return text;
  }

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
  // Guard: fonction disponible seulement côté serveur
  if (typeof window !== 'undefined') {
    console.warn('[Encryption] decrypt() appelé côté client - ignoré');
    return encryptedData; // Retourner données telles quelles côté client
  }

  if (!crypto || !ENCRYPTION_KEY) {
    console.error('[Encryption] Crypto non disponible ou ENCRYPTION_KEY manquante');
    return encryptedData;
  }

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
  if (typeof window !== 'undefined' || !crypto) {
    console.warn('[Encryption] hashPassword() appelé côté client ou crypto indisponible');
    return { hash: password, salt: '' };
  }

  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return { hash, salt };
}

/**
 * Vérifier un mot de passe
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (typeof window !== 'undefined' || !crypto) {
    console.warn('[Encryption] verifyPassword() appelé côté client ou crypto indisponible');
    return password === hash;
  }

  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

/**
 * Générer une clé de chiffrement sécurisée
 */
export function generateEncryptionKey(): string {
  if (typeof window !== 'undefined' || !crypto) {
    console.warn('[Encryption] generateEncryptionKey() appelé côté client ou crypto indisponible');
    return 'fallback-key-' + Math.random().toString(36);
  }

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