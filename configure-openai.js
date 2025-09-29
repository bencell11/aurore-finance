#!/usr/bin/env node

/**
 * Script de configuration OpenAI
 * Remplace automatiquement la clé de démonstration par votre vraie clé
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Configuration de votre clé OpenAI\n');
console.log('Pour obtenir votre clé OpenAI :');
console.log('1. Allez sur https://platform.openai.com/api-keys');
console.log('2. Créez une nouvelle clé API');
console.log('3. Copiez la clé qui commence par "sk-"\n');

rl.question('Entrez votre clé OpenAI (sk-...): ', (apiKey) => {
  if (!apiKey.startsWith('sk-')) {
    console.log('❌ Erreur: La clé doit commencer par "sk-"');
    rl.close();
    return;
  }

  try {
    // Lire le fichier .env.local
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remplacer la clé
    envContent = envContent.replace(
      /OPENAI_API_KEY=.*/,
      `OPENAI_API_KEY=${apiKey}`
    );
    
    // Écrire le fichier
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Clé OpenAI configurée avec succès !');
    console.log('🔄 Redémarrez le serveur de développement pour que les changements prennent effet.');
    console.log('\nnpm run dev\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
  }
  
  rl.close();
});