import OpenAI from 'openai';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testOpenAI() {
  console.log('🧪 Test de l\'API OpenAI...\n');

  // Vérifier la clé API
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY non trouvée dans .env.local');
    process.exit(1);
  }

  console.log('✅ Clé API trouvée:', apiKey.substring(0, 10) + '...');

  try {
    const openai = new OpenAI({ apiKey });

    console.log('\n📤 Envoi d\'une requête de test à OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant qui génère des templates de documents en JSON.'
        },
        {
          role: 'user',
          content: 'Génère un JSON simple avec un champ "test" contenant "Hello World"'
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
      response_format: { type: 'json_object' }
    });

    console.log('\n✅ Réponse reçue d\'OpenAI:');
    console.log('Model:', completion.model);
    console.log('Usage:', completion.usage);
    console.log('Content:', completion.choices[0].message.content);

    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('\n✅ JSON parsé:', parsed);

    console.log('\n🎉 Test réussi! L\'API OpenAI fonctionne correctement.');

  } catch (error: any) {
    console.error('\n❌ ERREUR lors de l\'appel OpenAI:');
    console.error('Type:', error.constructor.name);
    console.error('Message:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    if (error.code) {
      console.error('Code:', error.code);
    }

    process.exit(1);
  }
}

testOpenAI();
