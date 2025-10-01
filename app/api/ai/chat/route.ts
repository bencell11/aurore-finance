import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId = 'demo-user' } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    console.log('💬 Assistant fiscal - Question reçue:', message);

    // Générer une réponse basée sur des mots-clés
    let response = generateTaxResponse(message);

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

function generateTaxResponse(message: string): string {
  const msg = message.toLowerCase();
  
  // Réponses pour les impôts et optimisations
  if (msg.includes('impôt') || msg.includes('fiscal') || msg.includes('optimis') || msg.includes('économi')) {
    return `🎯 **Excellente question sur l'optimisation fiscale !**

💡 **Mes recommandations prioritaires :**

**1. 3e pilier A - Urgent !**
• Maximum 2024 : 7'056 CHF
• Déduction immédiate de vos revenus
• **Économie estimée :** ~1'500-2'000 CHF d'impôts

**2. LPP/2e pilier**
• Rachat de cotisations manquantes
• Déductible intégralement
• Rentabilité fiscale garantie

**3. Frais professionnels**
• Transport domicile-travail
• Repas à midi (3'600 CHF/an maximum)
• Formation continue déductible

**4. Optimisations avancées**
• Étalement sur 3 ans pour gros revenus
• Fractionnement familial optimal
• Planification succession

🔍 **Souhaitez-vous que je détaille l'une de ces optimisations ?**
Ou posez-moi une question plus précise sur votre situation !`;
  }
  
  // Réponses pour les déductions
  if (msg.includes('déduction') || msg.includes('pilier') || msg.includes('lpp')) {
    return `📋 **Guide des déductions fiscales suisses 2024**

**🏛️ Déductions fédérales principales :**

**Prévoyance liée (pilier 3a) :**
• Maximum : 7'056 CHF (salariés)
• 35'280 CHF (indépendants sans LPP)

**Prévoyance professionnelle (LPP) :**
• Rachats de cotisations manquantes
• 100% déductible

**Frais professionnels :**
• Transport : coûts effectifs ou forfait
• Repas : 15 CHF/jour maximum
• Formation continue
• Outils/équipement professionnel

**Déductions sociales :**
• Assurance maladie : primes et participations
• Assurance vie/invalidité
• Cotisations AVS/AI (indépendants)

**💡 Astuce :** Groupez vos dépenses déductibles en fin d'année pour maximiser l'impact !

**Quelle déduction vous intéresse le plus ?**`;
  }
  
  // Réponses pour les échéances
  if (msg.includes('échéance') || msg.includes('délai') || msg.includes('quand') || msg.includes('date')) {
    return `📅 **Calendrier fiscal suisse 2024-2025**

**🚨 Échéances cruciales :**

**31 décembre 2024 :**
• Dernier jour pour versement 3e pilier 2024
• Paiement des primes d'assurance déductibles
• Dons aux œuvres d'utilité publique

**31 mars 2025 :**
• Déclaration d'impôts 2024 (dans la plupart des cantons)
• Prolongation possible jusqu'au 30 septembre

**Échéances mensuelles :**
• Acomptes provisionnels (si applicables)
• Cotisations AVS indépendants

**💡 Pro-tip :** Anticipez dès janvier vos optimisations pour 2025 !

**Avez-vous des questions sur une échéance spécifique ?**`;
  }
  
  // Réponses pour les documents
  if (msg.includes('document') || msg.includes('certificat') || msg.includes('attestation')) {
    return `📄 **Documents essentiels pour votre déclaration**

**🎯 Documents obligatoires :**

**Revenus :**
• Certificat de salaire (employeur)
• Attestation prestations sociales (AVS, AI, chômage)
• Revenus locatifs/mobiliers

**Déductions :**
• Attestation 3e pilier (banque/assurance)
• Confirmation rachat LPP
• Primes assurance maladie/vie
• Frais médicaux/dentaires

**Fortune :**
• Extraits bancaires au 31.12
• Valeur locative résidence principale
• Dettes hypothécaires

**🔍 Documents spéciaux :**
• Contrats de mariage/divorce
• Attestations garde d'enfants
• Justificatifs formation continue

**✅ Mon conseil :** Créez un dossier fiscal dès janvier et collectez au fur et à mesure !

**Quel type de document vous pose problème ?**`;
  }
  
  // Réponses pour le calcul/aide générale
  if (msg.includes('calcul') || msg.includes('aide') || msg.includes('guide') || msg.includes('comment')) {
    return `🤝 **Je suis là pour vous accompagner !**

**📚 Voici comment je peux vous aider :**

**1. Optimisation fiscale personnalisée**
• Analyse de votre situation
• Calcul d'économies possibles
• Stratégies sur mesure

**2. Questions techniques précises**
• Interprétation des lois fiscales
• Cas particuliers et exceptions
• Différences cantonales

**3. Planification fiscale**
• Préparation année suivante
• Stratégies long terme
• Éviter les pièges courants

**🎯 Pour commencer :**
• "Calcule mes impôts" → simulation
• "Optimise ma situation" → conseils personnalisés
• "Explique-moi [sujet]" → informations détaillées

**Quelle est votre préoccupation fiscale principale ?**
💰 Réduire vos impôts ? 📋 Comprendre vos obligations ? 📅 Respecter les délais ?`;
  }
  
  // Réponse par défaut
  return `👋 **Bonjour ! Je suis votre expert fiscal suisse.**

J'ai bien reçu votre question : "${message}"

💡 **Je peux vous renseigner sur :**
• **Optimisations fiscales** (3e pilier, LPP, déductions...)
• **Calculs d'impôts** et simulations
• **Échéances et obligations** légales
• **Documents requis** pour votre déclaration
• **Législation cantonale** et fédérale

**Questions fréquentes :**
🔸 "Comment optimiser mes impôts ?"
🔸 "Quelles déductions puis-je faire ?"
🔸 "Quand sont les échéances importantes ?"
🔸 "De quels documents ai-je besoin ?"

**Posez-moi une question plus précise et je vous donnerai des conseils détaillés !**`;
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