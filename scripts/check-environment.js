#!/usr/bin/env node

/**
 * Script de vérification de l'environnement de production
 * Vérifie que toutes les variables nécessaires sont configurées
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
  'DEMO_MODE'
];

const optionalEnvVars = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'AFC_API_URL',
  'GENEVA_TAX_API',
  'VAUD_TAX_API'
];

console.log('🔍 Vérification de l\'environnement de production...\n');

let hasErrors = false;

// Vérifier les variables obligatoires
console.log('📋 Variables obligatoires :');
for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value || value.includes('your-') || value.includes('demo')) {
    console.log(`❌ ${envVar}: MANQUANT ou valeur de démo`);
    hasErrors = true;
  } else {
    console.log(`✅ ${envVar}: Configuré`);
  }
}

// Vérifier les variables optionnelles
console.log('\n📋 Variables optionnelles :');
for (const envVar of optionalEnvVars) {
  const value = process.env[envVar];
  if (!value) {
    console.log(`⚠️  ${envVar}: Non configuré (optionnel)`);
  } else {
    console.log(`✅ ${envVar}: Configuré`);
  }
}

// Vérifier le mode démo
console.log('\n🎭 Mode de fonctionnement :');
if (process.env.DEMO_MODE === 'false') {
  console.log('✅ Mode Production activé');
} else {
  console.log('❌ Mode Démo actif - Définir DEMO_MODE=false');
  hasErrors = true;
}

// Vérifier la clé de chiffrement
console.log('\n🔐 Sécurité :');
if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length >= 32) {
  console.log('✅ Clé de chiffrement valide (256 bits)');
} else {
  console.log('❌ Clé de chiffrement invalide ou trop courte');
  hasErrors = true;
}

// Résumé
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ ERREURS DÉTECTÉES - Configuration incomplète');
  console.log('📖 Consultez le fichier DEPLOYMENT_GUIDE.md');
  console.log('🔧 Exécutez: npm run setup-production');
  process.exit(1);
} else {
  console.log('✅ ENVIRONNEMENT PRÊT POUR LA PRODUCTION');
  console.log('🚀 Vous pouvez déployer l\'application');
  console.log('📊 Mode démo désactivé - Données réelles utilisées');
  process.exit(0);
}