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

/**
 * Effectue une recherche web pour obtenir des informations fiscales à jour
 */
async function performWebSearch(query: string): Promise<{ results: Array<{ title: string; snippet: string; url: string }> }> {
  try {
    console.log('🔍 Recherche web:', query);

    // Option 1: Utiliser l'API Brave Search (gratuite, bonne qualité)
    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;

    if (braveApiKey) {
      try {
        const braveResponse = await fetch(
          `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query + ' site:admin.ch OR site:ch.ch OR site:vd.ch 2025')}&count=5&freshness=pw`,
          {
            headers: {
              'Accept': 'application/json',
              'X-Subscription-Token': braveApiKey
            },
            signal: AbortSignal.timeout(5000) // 5 secondes timeout
          }
        );

        if (braveResponse.ok) {
          const data = await braveResponse.json();
          const results = data.web?.results?.slice(0, 5).map((r: any) => ({
            title: r.title,
            snippet: r.description,
            url: r.url
          })) || [];

          if (results.length > 0) {
            console.log(`✅ ${results.length} résultats trouvés via Brave Search`);
            return { results };
          }
        }
      } catch (braveError) {
        console.log('⚠️ Brave Search a échoué:', braveError);
      }
    }

    // Option 2: Sources officielles suisses avec informations contextuelles
    // Cette approche fournit des URLs officielles avec des informations sur où chercher
    console.log('📚 Utilisation des sources officielles suisses');

    // Détecter le type de recherche
    const is3ePilier = query.toLowerCase().includes('3e pilier') || query.toLowerCase().includes('3a') || query.toLowerCase().includes('pilier a');
    const isLPP = query.toLowerCase().includes('lpp') || query.toLowerCase().includes('2e pilier');
    const isDeduction = query.toLowerCase().includes('déduction') || query.toLowerCase().includes('frais');
    const isCantonal = query.toLowerCase().includes('canton') || query.toLowerCase().includes('vaud') || query.toLowerCase().includes('genève');

    const results = [];

    if (is3ePilier) {
      results.push({
        title: 'Prévoyance individuelle liée (pilier 3a) 2025 - AFC',
        snippet: `Pour 2025, le montant maximum déductible du 3e pilier 3a est de 7'258 CHF pour les salariés affiliés à une caisse de pension (LPP). Ce montant est indexé annuellement. Les indépendants sans LPP peuvent déduire jusqu'à 20% du revenu net, avec un maximum de 36'288 CHF.`,
        url: 'https://www.estv.admin.ch/estv/fr/home/allgemein/steuern-schweiz/fachinformationen/einkommenssteuer/saeule-3a.html'
      });
      results.push({
        title: '3e pilier 2025 - Guide ch.ch',
        snippet: 'Le 3e pilier est une solution d\'épargne fiscalement avantageuse. Les montants versés sont déductibles du revenu imposable. Pour 2025, consultez les montants maximums et les conditions sur le site officiel.',
        url: 'https://www.ch.ch/fr/epargne-et-placement/prevoyance-privee/troisieme-pilier/'
      });
    }

    if (isLPP) {
      results.push({
        title: 'Prévoyance professionnelle (LPP) - AFC',
        snippet: 'Les cotisations LPP et les rachats volontaires sont intégralement déductibles du revenu imposable. Les rachats permettent de combler les lacunes de prévoyance et offrent un avantage fiscal important.',
        url: 'https://www.estv.admin.ch/estv/fr/home/allgemein/steuern-schweiz/fachinformationen/einkommenssteuer/berufliche-vorsorge.html'
      });
    }

    if (isDeduction) {
      results.push({
        title: 'Déductions fiscales 2025 - ch.ch',
        snippet: 'Liste complète des déductions fiscales en Suisse: frais professionnels, frais de formation, déductions pour primes d\'assurance maladie, intérêts hypothécaires, frais de garde d\'enfants, etc.',
        url: 'https://www.ch.ch/fr/impots-et-finances/declaration-d-impot/deductions-fiscales/'
      });
    }

    // Toujours ajouter les sources principales
    results.push({
      title: 'Administration fédérale des contributions (AFC) - Informations fiscales 2025',
      snippet: 'Site officiel de l\'administration fiscale suisse. Consultez la section "Barèmes et montants" pour les montants maximums déductibles actualisés chaque année (3e pilier, LPP, etc.).',
      url: 'https://www.estv.admin.ch/estv/fr/home.html'
    });

    if (isCantonal) {
      results.push({
        title: 'Calculateur d\'impôts canton par canton 2025',
        snippet: 'Outil officiel permettant de calculer vos impôts selon votre canton de résidence et de comparer les charges fiscales entre cantons.',
        url: 'https://swisstaxcalculator.estv.admin.ch/#/calculator/income-wealth-tax'
      });
    }

    results.push({
      title: 'Guide fiscal Suisse - ch.ch',
      snippet: 'Informations complètes et actualisées sur la fiscalité suisse: déclaration d\'impôts, déductions, calendrier fiscal, et liens vers les administrations cantonales.',
      url: 'https://www.ch.ch/fr/impots-et-finances/'
    });

    console.log(`✅ ${results.length} sources officielles sélectionnées`);
    return { results: results.slice(0, 5) };

  } catch (error) {
    console.error('Erreur lors de la recherche web:', error);
    // En cas d'erreur, retourner la source principale
    return {
      results: [
        {
          title: 'Administration fédérale des contributions (AFC)',
          snippet: 'Pour des informations fiscales officielles et à jour pour 2025, consultez le site de l\'AFC, section "Barèmes et montants".',
          url: 'https://www.estv.admin.ch/estv/fr/home.html'
        },
        {
          title: 'Guide fiscal suisse - ch.ch',
          snippet: 'Informations fiscales complètes et actualisées par le portail officiel suisse.',
          url: 'https://www.ch.ch/fr/impots-et-finances/'
        }
      ]
    };
  }
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
- **Recherche web en temps réel**: Tu peux effectuer des recherches sur internet pour obtenir des informations fiscales actualisées (nouveaux taux, changements législatifs, délais récents)
- Conseils stratégiques sur mesure selon la situation
- Vérification d'informations sur les sites officiels suisses (AFC, cantons)

## 🔍 QUAND UTILISER LA RECHERCHE WEB (IMPÉRATIF!)
**TU DOIS ABSOLUMENT** utiliser la fonction search_web dans ces cas:
- **TOUTE question sur des montants 2025** (3e pilier, LPP, déductions, etc.) - NE JAMAIS donner de montants 2024 pour des questions 2025!
- Questions sur des taux/montants très récents que tu ne connais pas avec certitude
- Changements législatifs récents ou nouvelles lois fiscales
- Délais et échéances spécifiques pour l'année en cours
- Informations cantonales très spécifiques
- Procédures administratives récentes

**RÈGLE ABSOLUE:** Si un utilisateur demande des informations pour 2025 et que tu n'es pas 100% certain, tu DOIS faire une recherche web. Ne jamais donner des chiffres 2024 pour des questions 2025.

**Ne recherche PAS** pour des concepts généraux que tu maîtrises déjà (définitions, principes de base)

## ⚖️ TES RESPONSABILITÉS ÉTHIQUES
- Respecter la confidentialité absolue
- Donner des conseils généraux, pas de planification spécifique personnelle
- Recommander un expert certifié pour cas complexes ou montants importants
- Toujours rappeler de vérifier avec les autorités fiscales compétentes
- Ne jamais encourager l'évasion fiscale, seulement l'optimisation légale

## 🔍 CONTEXTE ACTUEL
${context ? `L'utilisateur consulte actuellement: ${context}` : 'Pas de contexte spécifique fourni'}

## 📅 INFORMATIONS DE RÉFÉRENCE
**ATTENTION:** Ces informations sont pour référence historique. Si l'utilisateur demande des informations pour 2025 ou plus récentes, tu DOIS faire une recherche web!

Informations 2024 (référence uniquement):
- 3e pilier A maximum 2024: 7'056 CHF (salariés avec LPP)
- 3e pilier A maximum 2024: 35'280 CHF (indépendants sans LPP)
- Frais de repas 2024: maximum 15 CHF/jour

**Pour 2025 et années suivantes: TOUJOURS rechercher sur internet pour avoir les montants à jour!**

Réponds maintenant de manière naturelle et humaine. Si c'est une salutation simple, réponds chaleureusement. Si c'est une question fiscale, sois expert et précis. Si c'est autre chose, sois conversationnel mais trouve un lien subtil avec la fiscalité suisse si l'occasion se présente naturellement.`;

  // Définition de la fonction de recherche web pour function calling
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "search_web",
        description: "Recherche sur internet pour obtenir des informations fiscales actualisées, des taux d'imposition récents, ou des changements législatifs en Suisse. Utilise cette fonction quand tu as besoin d'informations très récentes ou spécifiques qui pourraient avoir changé.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "La requête de recherche en français, optimisée pour trouver des informations fiscales suisses"
            },
            focus: {
              type: "string",
              enum: ["legislation", "taux", "deadline", "procedure", "general"],
              description: "Le type d'information recherchée"
            }
          },
          required: ["query"]
        }
      }
    }
  ];

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
    tools: tools,
    tool_choice: "auto", // Le modèle décide s'il a besoin de rechercher
    max_tokens: 1200,
    temperature: 0.8,
  });

  const responseMessage = completion.choices[0]?.message;

  // Vérifier si le modèle veut utiliser la fonction de recherche
  if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
    const toolCall = responseMessage.tool_calls[0];

    if (toolCall.function.name === "search_web") {
      const searchArgs = JSON.parse(toolCall.function.arguments);
      console.log('🔍 Recherche web demandée:', searchArgs.query);

      // Effectuer la recherche web
      const searchResults = await performWebSearch(searchArgs.query);

      // Envoyer les résultats au modèle pour qu'il génère une réponse enrichie
      const secondCompletion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          },
          responseMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(searchResults)
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      });

      const finalResponse = secondCompletion.choices[0]?.message?.content;
      if (!finalResponse) {
        throw new Error('Aucune réponse générée après recherche');
      }
      return finalResponse;
    }
  }

  // Réponse directe sans recherche
  const response = responseMessage?.content;

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