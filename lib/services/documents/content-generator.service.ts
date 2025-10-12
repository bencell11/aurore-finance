/**
 * Service de génération de contenu de documents
 * Génère le texte complet des documents de manière professionnelle
 */

import OpenAI from 'openai';

export class ContentGeneratorService {
  private static openai: OpenAI | null = null;

  private static getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  /**
   * Génère le contenu complet d'un document professionnel
   */
  static async generateDocumentContent(
    userRequest: string,
    documentType: string,
    userData: Record<string, any>
  ): Promise<string> {
    try {
      const openai = this.getOpenAI();

      const systemPrompt = `Tu es un expert en rédaction de documents administratifs, juridiques et commerciaux suisses.
Ton rôle est de rédiger le contenu complet d'un document professionnel.

RÈGLES IMPORTANTES:
1. Utilise le vouvoiement (forme de politesse suisse) pour documents formels
2. Pour les contrats commerciaux, utilise un ton professionnel mais adapté
3. Sois professionnel, clair et courtois
4. Structure le texte en paragraphes cohérents
5. Utilise les formules de politesse appropriées
6. Inclus les références légales suisses pertinentes si applicable
7. N'utilise PAS de variables {{}} - écris le texte complet avec les vraies valeurs fournies
8. Adapte le ton selon le type de document (formel, commercial, etc.)
9. Intègre TOUTES les informations fournies de manière naturelle et professionnelle

Format attendu:
- Paragraphe d'introduction expliquant le contexte et l'objet
- Corps du texte avec tous les détails fournis (montants, dates, conditions, etc.)
- Conditions spécifiques mentionnées dans la demande
- Conclusion avec formule appropriée
- PAS de signature (elle sera ajoutée automatiquement)

Retourne UNIQUEMENT le contenu textuel, sans formatage markdown ni balises HTML.`;

      const userDataSummary = Object.entries(userData)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const userPrompt = `Demande de l'utilisateur: "${userRequest}"

Type de document: ${documentType}

Informations disponibles:
${userDataSummary}

Rédige le contenu complet et professionnel de ce document.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log('[ContentGenerator] Generated content length:', content.length);
      return content.trim();

    } catch (error) {
      console.error('[ContentGenerator] Error:', error);
      throw new Error('Erreur lors de la génération du contenu');
    }
  }

  /**
   * Génère une formule de politesse appropriée selon le contexte
   */
  static generateClosingFormula(documentType: string, isUrgent: boolean = false): string {
    const urgentSuffix = isUrgent
      ? ' et vous remercie par avance de traiter cette demande dans les meilleurs délais'
      : '';

    const formulas: Record<string, string> = {
      'resiliation': `Je vous remercie de bien vouloir accuser réception de cette résiliation${urgentSuffix} et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      'reclamation': `Dans l'attente de votre retour${urgentSuffix}, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      'demande': `Je reste à votre disposition pour toute information complémentaire${urgentSuffix} et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      'notification': `Je vous prie de prendre acte de cette notification${urgentSuffix} et vous adresse, Madame, Monsieur, mes salutations distinguées.`,
      'default': `Je reste à votre disposition pour tout complément d'information et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`
    };

    return formulas[documentType] || formulas['default'];
  }
}
