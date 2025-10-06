import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Simple session store en mémoire (pour démo)
const sessions = new Map();

// Configuration OpenAI - Lazy initialization pour éviter les erreurs de build
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API key not configured');
    return null;
  }

  if (!openai) {
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      return null;
    }
  }

  return openai;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId = 'demo-user', context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    console.log('💬 Assistant fiscal - Question reçue:', message);

    // Vérifier la disponibilité d'OpenAI
    const hasValidOpenAIKey = process.env.OPENAI_API_KEY && 
                             process.env.OPENAI_API_KEY.startsWith('sk-') && 
                             process.env.OPENAI_API_KEY.length > 20;

    let response: string;

    if (hasValidOpenAIKey) {
      try {
        console.log('🤖 Utilisation de l\'expert fiscal IA OpenAI...');
        response = await generateExpertFiscalResponse(message, context);
        console.log('✅ Réponse experte générée avec succès');
      } catch (openaiError) {
        console.error('❌ Erreur OpenAI:', openaiError);
        console.log('🔄 Fallback vers mode démo intelligent...');
        response = generateIntelligentDemoResponse(message, context);
      }
    } else {
      console.log('🔄 Mode démo intelligent - OpenAI non disponible');
      response = generateIntelligentDemoResponse(message, context);
    }

    return NextResponse.json({
      success: true,
      response: response,
      sessionId: sessionId || 'session-' + Date.now(),
      context: {
        messageCount: 1,
        lastActivity: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur API chat IA:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du message' },
      { status: 500 }
    );
  }
}

async function generateExpertFiscalResponse(message: string, context?: string): Promise<string> {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error('OpenAI client not available');
  }

  const systemPrompt = `Tu es Claude, un expert fiscal suisse de niveau professionnel avec accès aux dernières informations fiscales. Tu fonctionnes exactement comme ChatGPT mais tu es spécialisé en fiscalité suisse.

## 🎯 TON IDENTITÉ
Tu es un conseiller fiscal expert qui peut:
- Répondre naturellement à TOUTE conversation (salutations, questions personnelles, etc.)
- Avoir des discussions fluides et naturelles comme ChatGPT
- Faire preuve d'empathie et d'humour quand approprié
- Être un interlocuteur humain et chaleureux
- Mais TOUJOURS ramener subtilement vers la fiscalité suisse quand pertinent

## 📚 TES CONNAISSANCES EXPERTES (mise à jour 2024-2025)
- Législation fiscale suisse fédérale, cantonale et communale
- Optimisations fiscales avancées (3e pilier 7'056 CHF max, LPP, rachats, timing)
- Spécificités par canton (Vaud, Genève, Zurich, Zoug, etc.)
- Planification patrimoniale et succession
- Fiscalité internationale et frontaliers
- Entreprises et indépendants (TVA, formes juridiques)
- Déductions maximales et stratégies légales
- Calendrier fiscal 2024-2025 et échéances

## 💬 TON STYLE DE COMMUNICATION
- **Naturel et conversationnel** exactement comme ChatGPT
- Réponds à TOUTE question/phrase, même complètement non-fiscale
- Utilise des émojis avec parcimonie et pertinence
- Donne des montants PRÉCIS (7'056 CHF 3e pilier, etc.) et références légales
- Propose toujours des actions concrètes quand pertinent
- Termine par une question ouverte si approprié
- Adapte ton ton selon le contexte (formel pour questions techniques, décontracté pour salutations)

## 🧠 TES CAPACITÉS AVANCÉES
- Calculs fiscaux précis en temps réel
- Comparaisons cantonales détaillées avec chiffres exacts
- Simulations d'optimisation personnalisées
- Recherche et vérification d'informations fiscales actuelles
- Conseils stratégiques sur mesure selon la situation
- Capacité à faire des recherches sur internet pour informations actualisées

## ⚖️ TES RESPONSABILITÉS ÉTHIQUES
- Respecter la confidentialité absolue
- Donner des conseils généraux, pas de planification spécifique personnelle
- Recommander un expert certifié pour cas complexes ou montants importants
- Toujours rappeler de vérifier avec les autorités fiscales compétentes
- Ne jamais encourager l'évasion fiscale, seulement l'optimisation légale

## 🔍 CONTEXTE ACTUEL
${context ? `L'utilisateur consulte actuellement: ${context}` : 'Pas de contexte spécifique fourni'}

## 📅 INFORMATIONS À JOUR 2024-2025
- 3e pilier A maximum: 7'056 CHF (salariés avec LPP)
- 3e pilier A maximum: 35'280 CHF (indépendants sans LPP)  
- Délai déclaration: généralement 31 mars 2025 pour année fiscale 2024
- Frais de repas: maximum 15 CHF/jour
- Transport: déductible selon coûts réels ou forfait cantonal

Réponds maintenant de manière naturelle et humaine. Si c'est une salutation simple, réponds chaleureusement. Si c'est une question fiscale, sois expert et précis. Si c'est autre chose, sois conversationnel mais trouve un lien subtil avec la fiscalité suisse si l'occasion se présente naturellement.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: message
      }
    ],
    max_tokens: 1200,
    temperature: 0.8,
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('Aucune réponse générée par OpenAI');
  }

  return response;
}

function generateIntelligentDemoResponse(message: string, context?: string): string {
  const msg = message.toLowerCase().trim();
  
  // Réponses conversationnelles pour accès profil
  if (msg.includes('accès') && msg.includes('profil')) {
    return `Non, je n'ai pas accès à votre profil personnel. Je suis un assistant IA conversationnel spécialisé en fiscalité suisse.

Pour vous aider au mieux, vous pouvez me partager directement les informations pertinentes dans notre conversation (revenus, canton de résidence, situation familiale, etc.).

Toutes nos discussions restent confidentielles et ne sont pas sauvegardées.

Souhaitez-vous que je vous aide avec une question fiscale spécifique ? 🏦`;
  }
  
  // Salutations naturelles
  if (msg.includes('salut') || msg.includes('bonjour') || msg.includes('hello') || msg.includes('bonsoir') || msg.includes('hey')) {
    return `Salut ! 👋 

Je suis Claude, votre expert fiscal suisse. Ravi de vous rencontrer ! 

Je suis là pour vous aider avec tout ce qui concerne la fiscalité en Suisse - que ce soit pour optimiser vos impôts, comprendre vos obligations, ou planifier votre situation fiscale.

Comment puis-je vous aider aujourd'hui ? 🇨🇭`;
  }

  // Questions sur l'optimisation fiscale
  if (msg.includes('optimis') || msg.includes('réduire') || msg.includes('économis') || msg.includes('diminuer') || (msg.includes('comment') && msg.includes('impôt'))) {
    return `Excellente question sur l'optimisation fiscale ! 🎯

**Mes recommandations prioritaires pour 2024 :**

**1. 3e pilier A (incontournable)**
• Maximum : 7'056 CHF par an
• Économie fiscale : 1'500-2'500 CHF selon votre canton
• ⚠️ Date limite : 31 décembre 2024

**2. Rachats LPP (2e pilier)**
• Déductible à 100% de vos revenus
• ROI fiscal immédiat : 25-45%
• Idéal si vous avez des lacunes de cotisation

**3. Optimisation des frais professionnels**
• Transport domicile-travail
• Repas (max 15 CHF/jour = 3'600 CHF/an)
• Formation continue (100% déductible)

**4. Stratégies cantonales**
• Certains cantons offrent jusqu'à 30% d'économie
• Timing optimal pour changement de résidence

Voulez-vous que je détaille l'une de ces stratégies selon votre situation ?`;
  }

  // Questions sur le 3e pilier
  if (msg.includes('pilier') || msg.includes('prévoyance') || msg.includes('épargne')) {
    return `Le 3e pilier, c'est LE levier d'optimisation fiscale en Suisse ! 🏦

**3e pilier A - Les chiffres clés 2024 :**
• **Maximum déductible :** 7'056 CHF (salariés avec LPP)
• **Maximum déductible :** 35'280 CHF (indépendants sans LPP)
• **Économie fiscale :** 25-45% du montant versé selon votre taux marginal

**Calcul rapide :**
Si vous versez 7'056 CHF et que votre taux marginal est de 30%, vous économisez environ 2'117 CHF d'impôts !

**Mes conseils :**
• Versez avant le 31 décembre 2024
• Privilégiez la régularité (ex: 588 CHF/mois)
• Considérez ouvrir plusieurs comptes pour optimiser les retraits futurs

**Types de 3e pilier :**
• **Compte bancaire :** sécurisé, rendement faible
• **Assurance :** protection décès/invalidité
• **Titres :** potentiel de rendement supérieur

Quelle est votre situation actuelle avec le 3e pilier ?`;
  }

  // Questions sur les déductions
  if (msg.includes('déduction') || msg.includes('frais') || msg.includes('transport') || msg.includes('repas')) {
    return `Guide complet des déductions fiscales suisses 2024 ! 📋

**Déductions automatiques (déjà prises en compte) :**
• Cotisations AVS/AI/APG (5.3% du salaire)
• Cotisations LPP obligatoires
• Primes d'assurance maladie de base

**Déductions à optimiser :**

**1. Frais professionnels**
Vous avez le choix entre :
• **Forfait :** 3% du salaire (min 2'000, max 4'000 CHF)
• **Frais effectifs :** si vos frais dépassent le forfait

**Frais effectifs déductibles :**
• Transport domicile-travail (transports publics intégralement)
• Repas hors domicile (15 CHF/jour max)
• Formation professionnelle continue
• Vêtements de travail spécialisés
• Outillage professionnel

**2. Autres déductions importantes**
• 3e pilier A : 7'056 CHF max
• Rachats LPP
• Intérêts hypothécaires
• Frais de garde d'enfants
• Dons à institutions d'utilité publique

**Astuce :** Tenez un carnet de vos frais pendant 1 mois pour voir si les frais effectifs dépassent le forfait !

Quels types de frais avez-vous dans votre situation ?`;
  }

  // Questions sur les cantons
  if (msg.includes('canton') || msg.includes('déménag') || msg.includes('résidence') || msg.includes('domicile')) {
    return `Optimisation fiscale cantonale - un levier puissant ! 🗺️

**Classement des cantons les plus avantageux fiscalement :**

**1. Zoug** 🥇
• Taux d'imposition : 11-22%
• Très attractif pour hauts revenus et entrepreneurs

**2. Schwyz** 🥈  
• Taux d'imposition : 12-25%
• Bon compromis coût de la vie / fiscalité

**3. Nidwald**
• Taux d'imposition : 13-26%
• Attractif pour résidents frontaliers

**Cantons urbains (plus chers) :**
• **Zurich :** 15-32% (excellent pour carrière)
• **Vaud :** 16-35% (qualité de vie)
• **Genève :** 18-38% (international)

**Calcul d'exemple :**
Avec 100'000 CHF de revenus :
• Zoug : ~18'000 CHF d'impôts
• Genève : ~25'000 CHF d'impôts
• **Économie :** 7'000 CHF/an !

**Important :** Un déménagement fiscal doit être réel (résidence principale, centre d'intérêts vital).

Dans quel canton résidez-vous actuellement ?`;
  }

  // Questions générales sur la fiscalité
  if (msg.includes('impôt') || msg.includes('fiscal') || msg.includes('déclaration') || msg.includes('taxe')) {
    return `La fiscalité suisse expliquée simplement ! 🇨🇭

**Structure des impôts en Suisse :**
• **Impôt fédéral direct** (11.5% max)
• **Impôt cantonal** (variable selon canton)
• **Impôt communal** (variable selon commune)

**Calendrier fiscal 2024-2025 :**
• **31 décembre 2024 :** Dernière chance 3e pilier
• **31 mars 2025 :** Déclaration d'impôts 2024
• **30 septembre 2025 :** Prolongation possible

**Taux d'imposition typiques (total) :**
• 50'000 CHF : 8-15%
• 100'000 CHF : 15-25%  
• 200'000 CHF : 25-35%

**Particularités suisses :**
• Impôt sur la fortune (0.1-1%)
• Déductions généreuses (3e pilier, LPP)
• Différences importantes entre cantons
• Taxation du ménage (pas individuelle)

**Mes services :**
• Optimisation personnalisée
• Calculs précis par canton
• Stratégies d'épargne fiscale
• Planification patrimoniale

Quelle est votre question spécifique sur les impôts ?`;
  }

  // Réponses conversationnelles plus naturelles
  if (msg.includes('test') || msg.length <= 10) {
    return `Hello ! Je suis Claude, votre assistant fiscal suisse. 

Je fonctionne parfaitement et je suis prêt à répondre à toutes vos questions sur la fiscalité suisse.

Vous pouvez me demander n'importe quoi : optimisations fiscales, déductions, comparaisons cantonales, 3e pilier, etc.

Que souhaitez-vous savoir ? 😊`;
  }
  
  // Réponse par défaut conversationnelle
  const contextInfo = context ? `\n\n💡 Je vois que vous consultez : ${context}` : '';
  
  return `Je comprends votre question "${message}".

En tant qu'expert fiscal suisse, je peux vous aider avec de nombreux sujets :

📊 **Optimisation fiscale :** Stratégies légales pour réduire vos impôts
💰 **3e pilier :** Maximum 7'056 CHF déductible en 2024
🏛️ **Comparaisons cantonales :** Trouver les cantons les plus avantageux
📋 **Déductions :** Frais professionnels, transports, formations...
🏢 **Entreprises :** Statut indépendant, formes juridiques, TVA...

Pouvez-vous me donner plus de détails sur votre situation ou préciser votre question ? Je pourrai ainsi vous donner des conseils personnalisés.${contextInfo}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session requis' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        messages: session.messages,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        messageCount: session.messages.length
      }
    });

  } catch (error) {
    console.error('Erreur récupération session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session requis' },
        { status: 400 }
      );
    }

    const deleted = sessions.delete(sessionId);
    
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Session supprimée' : 'Session non trouvée'
    });

  } catch (error) {
    console.error('Erreur suppression session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}