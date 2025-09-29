#!/usr/bin/env node

/**
 * Script de configuration automatique pour sortir du mode démo
 * Usage: node scripts/setup-production.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupProduction() {
  console.log('🚀 Configuration de l\'Assistant Fiscal Suisse - Mode Production\n');
  
  // Vérifier si .env.local existe déjà
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('❓ Le fichier .env.local existe déjà. L\'écraser ? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('✅ Configuration annulée. Modifiez manuellement .env.local');
      process.exit(0);
    }
  }

  console.log('\n📊 Configuration Supabase (Base de données)');
  const supabaseUrl = await question('🔗 URL Supabase (https://xxx.supabase.co): ');
  const supabaseAnonKey = await question('🔑 Clé anonyme Supabase: ');
  const supabaseServiceKey = await question('🛡️  Clé service Supabase: ');

  console.log('\n🤖 Configuration IA');
  const aiProvider = await question('🔄 Provider IA (openai/anthropic): ');
  let aiApiKey = '';
  
  if (aiProvider === 'openai') {
    aiApiKey = await question('🔑 Clé API OpenAI (sk-...): ');
  } else if (aiProvider === 'anthropic') {
    aiApiKey = await question('🔑 Clé API Anthropic (sk-ant-...): ');
  }

  console.log('\n🔐 Configuration Sécurité');
  const encryptionKey = await question('🛡️  Clé de chiffrement (256 bits): ') || generateRandomKey();
  const jwtSecret = await question('🔐 JWT Secret: ') || generateRandomKey();

  console.log('\n📧 Configuration Email (optionnel)');
  const smtpHost = await question('📮 SMTP Host (ex: smtp.gmail.com): ');
  const smtpUser = await question('📧 Email utilisateur: ');
  const smtpPass = await question('🔑 Mot de passe app: ');

  // Générer le fichier .env.local
  const envContent = `# Configuration Assistant Fiscal Suisse - Mode Production
# Généré automatiquement le ${new Date().toISOString()}

# ====================================
# SUPABASE (Base de données)
# ====================================
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# ====================================
# INTELLIGENCE ARTIFICIELLE
# ====================================
${aiProvider === 'openai' ? `OPENAI_API_KEY=${aiApiKey}` : ''}
${aiProvider === 'anthropic' ? `ANTHROPIC_API_KEY=${aiApiKey}` : ''}

# ====================================
# SÉCURITÉ ET CHIFFREMENT
# ====================================
ENCRYPTION_KEY=${encryptionKey}
JWT_SECRET=${jwtSecret}

# ====================================
# CONFIGURATION EMAIL
# ====================================
${smtpHost ? `SMTP_HOST=${smtpHost}` : '# SMTP_HOST=smtp.gmail.com'}
${smtpUser ? `SMTP_USER=${smtpUser}` : '# SMTP_USER=votre-email@gmail.com'}
${smtpPass ? `SMTP_PASS=${smtpPass}` : '# SMTP_PASS=votre-mot-de-passe'}

# ====================================
# MODE PRODUCTION
# ====================================
NODE_ENV=production
DEMO_MODE=false

# ====================================
# APIs FISCALES SUISSES
# ====================================
AFC_API_URL=https://www.estv.admin.ch/api/v1/
GENEVA_TAX_API=https://www.ge.ch/api/fiscalite/
VAUD_TAX_API=https://www.vd.ch/api/impots/
`;

  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Fichier .env.local créé avec succès !');
  console.log('\n📋 Prochaines étapes :');
  console.log('1. ⚡ Relancez le serveur : npm run dev');
  console.log('2. 🗄️  Exécutez les migrations Supabase : npm run db:migrate');
  console.log('3. 🌱 Initialisez les données : npm run db:seed');
  console.log('4. 🧪 Testez l\'application sans mode démo');
  
  console.log('\n🔗 Liens utiles :');
  console.log('- Supabase Dashboard: https://app.supabase.com/');
  console.log('- OpenAI API Keys: https://platform.openai.com/api-keys');
  console.log('- Documentation: ./README.md');
  
  rl.close();
}

function generateRandomKey() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Gestion des erreurs
process.on('SIGINT', () => {
  console.log('\n\n❌ Configuration interrompue');
  process.exit(0);
});

// Exécution
setupProduction().catch((error) => {
  console.error('❌ Erreur lors de la configuration :', error);
  process.exit(1);
});