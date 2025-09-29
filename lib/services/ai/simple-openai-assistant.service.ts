/**
 * Service assistant fiscal OpenAI simplifié
 * Interface directe avec OpenAI - pas d'analyse d'intention ni de réponses prédéfinies
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startTime: Date;
  lastActivity: Date;
}

export class SimpleOpenAIAssistantService {
  
  /**
   * Prompt système d'expert fiscal suisse professionnel
   */
  private static readonly SWISS_TAX_EXPERT_PROMPT = `Tu es un expert-comptable et conseiller fiscal spécialisé dans le système fiscal suisse.

EXPERTISE :
- Fiscalité fédérale, cantonale et communale suisse
- Optimisations fiscales légales
- Droit fiscal suisse en vigueur
- Calculs d'impôts précis
- Déductions et avantages fiscaux
- Planification fiscale stratégique

STYLE PROFESSIONNEL :
- Réponses précises et détaillées
- Explications claires et pédagogiques
- Conseils pratiques et actionables
- Références aux bases légales quand pertinent
- Ton professionnel mais accessible

CAPACITÉS :
- Répondre à toute question fiscale suisse
- Calculer des estimations d'impôts
- Expliquer les concepts fiscaux complexes
- Proposer des optimisations légales
- Informer sur les échéances et obligations
- Adapter les conseils selon le canton de résidence

CONTEXTE TEMPOREL :
Date actuelle : ${new Date().toLocaleDateString('fr-CH')}
Année fiscale en cours : ${new Date().getFullYear()}

Tu peux répondre naturellement à toute question, faire des recherches conceptuelles et donner des conseils professionnels en matière de fiscalité suisse.`;

  /**
   * Crée une nouvelle session de chat
   */
  static createSession(userId: string): ChatSession {
    const sessionId = this.generateSessionId();
    const now = new Date();
    
    return {
      id: sessionId,
      userId,
      messages: [],
      startTime: now,
      lastActivity: now
    };
  }

  /**
   * Traite un message utilisateur via OpenAI
   */
  static async processMessage(
    session: ChatSession, 
    userMessage: string
  ): Promise<{
    response: string;
    updatedSession: ChatSession;
  }> {
    // Ajouter le message utilisateur à la session
    const userMsg: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    session.messages.push(userMsg);
    session.lastActivity = new Date();

    // Préparer les messages pour OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: this.SWISS_TAX_EXPERT_PROMPT
      },
      ...session.messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    try {
      // Debug: vérifier la clé API
      const apiKey = process.env.OPENAI_API_KEY;
      console.log('🔑 Clé OpenAI utilisée:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'AUCUNE');
      
      if (!apiKey) {
        throw new Error('Clé OpenAI manquante');
      }

      // Appel direct à OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu traiter votre demande.';

      // Ajouter la réponse de l'assistant à la session
      const assistantMsg: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      session.messages.push(assistantMsg);

      return {
        response: assistantResponse,
        updatedSession: session
      };

    } catch (error) {
      console.error('Erreur lors de l\'appel OpenAI:', error);
      
      // Message d'erreur informatif
      const errorResponse = `Je rencontre actuellement des difficultés techniques pour accéder à mes services d'intelligence artificielle.

En attendant, je peux vous rappeler quelques points importants de la fiscalité suisse :

• **Échéance déclaration ${new Date().getFullYear()}** : 31 mars ${new Date().getFullYear() + 1}
• **3e pilier A** : Maximum déductible 7'056 CHF par an
• **Taux marginaux** : Variables selon canton et revenus

Pour une assistance immédiate, consultez l'administration fiscale de votre canton ou un expert-comptable.`;

      const errorMsg: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: errorResponse,
        timestamp: new Date()
      };
      
      session.messages.push(errorMsg);

      return {
        response: errorResponse,
        updatedSession: session
      };
    }
  }

  /**
   * Génère un ID de session unique
   */
  private static generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Génère un ID de message unique
   */
  private static generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}