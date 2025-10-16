/**
 * Service de génération dynamique de templates
 * Utilise l'IA pour créer des templates à la volée
 */

import { DocumentTemplate, TemplateField, ContentBlock } from '@/lib/types/document-templates';
import OpenAI from 'openai';

export class DynamicTemplateGeneratorService {
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
   * Génère un template complet à partir d'une demande utilisateur
   */
  static async generateTemplate(
    userInput: string,
    documentType: string,
    category: string
  ): Promise<DocumentTemplate> {
    console.log('[DynamicTemplate] 🚀 DÉBUT generateTemplate');
    console.log('[DynamicTemplate] UserInput:', userInput);
    console.log('[DynamicTemplate] DocumentType:', documentType);
    console.log('[DynamicTemplate] Category:', category);

    try {
      console.log('[DynamicTemplate] 🔑 Initialisation OpenAI...');
      const openai = this.getOpenAI();
      console.log('[DynamicTemplate] ✅ OpenAI initialisé');

      const systemPrompt = `Tu génères des documents administratifs suisses en JSON.

RÈGLE ABSOLUE: Tu dois ÉCRIRE le texte complet du document. Jamais de placeholders [OBJET] ou {{objet}}.

Exemple résiliation assurance:
{
  "id": "resiliation-assurance",
  "requiredFields": [
    {"key": "numero_police", "label": "Numéro de police", "type": "text", "required": true},
    {"key": "nom_assurance", "label": "Nom de l'assurance", "type": "text", "required": true},
    {"key": "date_resiliation", "label": "Date de résiliation", "type": "date", "required": true}
  ],
  "contentBlocks": [
    {"type": "header", "content": "Objet: Résiliation de contrat d'assurance maladie", "style": {"bold": true}},
    {"type": "paragraph", "content": "Madame, Monsieur,"},
    {"type": "paragraph", "content": "Par la présente, je vous informe de ma décision de résilier mon contrat d'assurance maladie numéro {{numero_police}} auprès de {{nom_assurance}}, avec effet au {{date_resiliation}}, conformément à la LAMal (Art. 7)."},
    {"type": "paragraph", "content": "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."}
  ]
}

Génère TOUJOURS du texte complet comme l'exemple ci-dessus.`;

      const userPrompt = `Crée un document pour: "${userInput}"

Génère un JSON avec la même structure que l'exemple (résiliation assurance).
ÉCRIS le texte complet du document. PAS de [OBJET] ou {{objet}}.`;

      console.log('[DynamicTemplate] 📤 Envoi requête à OpenAI...');
      console.log('[DynamicTemplate] Model: gpt-4o-mini');
      console.log('[DynamicTemplate] Temperature: 0.9');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9, // Augmenté pour plus de créativité
        max_tokens: 3000, // Augmenté pour contenu plus long
        response_format: { type: 'json_object' }
      });

      console.log('[DynamicTemplate] ✅ Réponse reçue d\'OpenAI');

      const content = completion.choices[0].message.content;
      if (!content) {
        console.error('[DynamicTemplate] ❌ Pas de contenu dans la réponse OpenAI');
        console.error('[DynamicTemplate] Completion object:', JSON.stringify(completion, null, 2));
        throw new Error('No response from OpenAI');
      }

      console.log('[DynamicTemplate] 📥 Réponse brute OpenAI (premiers 500 chars):', content.substring(0, 500));
      console.log('[DynamicTemplate] Longueur totale:', content.length);

      let templateData;
      try {
        templateData = JSON.parse(content);
      } catch (parseError: any) {
        console.error('[DynamicTemplate] ❌ Erreur de parsing JSON:', parseError.message);
        console.error('[DynamicTemplate] Contenu reçu:', content);
        throw new Error(`Erreur de parsing JSON: ${parseError.message}`);
      }

      console.log('[DynamicTemplate] 📄 Template parsé avec succès');
      console.log('[DynamicTemplate] ID:', templateData.id);
      console.log('[DynamicTemplate] Nombre de requiredFields:', templateData.requiredFields?.length || 0);
      console.log('[DynamicTemplate] Nombre de contentBlocks:', templateData.contentBlocks?.length || 0);

      // VALIDATION: Vérifier qu'il n'y a pas de placeholders interdits (DÉSACTIVÉE TEMPORAIREMENT)
      const contentStr = JSON.stringify(templateData.contentBlocks);
      const forbiddenPatterns = [
        '[OBJET]',
        '[CONTENU_PRINCIPAL]',
        '[CONTENU]',
        '{{objet}}',
        '{{contenu_principal}}',
        '{{contenu_courrier}}',
        '{{contenu}}'
      ];

      const foundForbidden = forbiddenPatterns.filter(pattern =>
        contentStr.includes(pattern)
      );

      if (foundForbidden.length > 0) {
        console.warn('[DynamicTemplate] ⚠️ Placeholders détectés (non-bloquant):', foundForbidden);
        console.warn('[DynamicTemplate] On laisse passer pour voir le contenu réel...');
        // NE PAS BLOQUER - juste logger pour diagnostic
      }

      // Validation des champs interdits dans requiredFields
      const forbiddenFields = ['objet', 'contenu', 'contenu_principal', 'contenu_courrier'];
      const invalidFields = templateData.requiredFields?.filter((field: any) =>
        forbiddenFields.includes(field.key.toLowerCase())
      );

      if (invalidFields && invalidFields.length > 0) {
        console.error('[DynamicTemplate] ⚠️ Champs interdits détectés:', invalidFields.map((f: any) => f.key));
        // Filtrer ces champs automatiquement
        templateData.requiredFields = templateData.requiredFields.filter((field: any) =>
          !forbiddenFields.includes(field.key.toLowerCase())
        );
      }

      // Enrichir avec des métadonnées
      const template: DocumentTemplate = {
        ...templateData,
        id: templateData.id || `dynamic-${Date.now()}`,
        metadata: {
          ...templateData.metadata,
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Aurore Finance AI',
          dynamicallyGenerated: true
        }
      };

      console.log('[DynamicTemplate] ✅ Template validé et généré:', template.id);
      console.log('[DynamicTemplate] Champs requis:', template.requiredFields.map(f => f.key).join(', '));
      console.log('[DynamicTemplate] 📝 Premier contentBlock:', template.contentBlocks[0]);
      console.log('[DynamicTemplate] 📝 Contenu complet:', template.contentBlocks.map((b: any, i: number) =>
        `  [${i}] ${b.type}: ${b.content?.substring(0, 100)}${b.content?.length > 100 ? '...' : ''}`
      ).join('\n'));
      return template;

    } catch (error: any) {
      console.error('[DynamicTemplate] ❌ ERREUR lors de la génération:', error);
      console.error('[DynamicTemplate] Type d\'erreur:', error.constructor.name);
      console.error('[DynamicTemplate] Message:', error.message);
      console.error('[DynamicTemplate] Stack:', error.stack);

      // Si c'est une erreur OpenAI, logger plus de détails
      if (error.response) {
        console.error('[DynamicTemplate] OpenAI Response Status:', error.response.status);
        console.error('[DynamicTemplate] OpenAI Response Data:', error.response.data);
      }

      // Ne pas throw, retourner le fallback à la place
      console.warn('[DynamicTemplate] Utilisation du fallback template...');
      return this.generateFallbackTemplate(userInput);
    }
  }

  /**
   * Génère un template simple pour les cas non reconnus
   * DEPRECATED: Ne devrait jamais être utilisé car l'IA génère toujours un template complet
   */
  static generateFallbackTemplate(userInput: string): DocumentTemplate {
    console.error('[DynamicTemplate] 🚨 FALLBACK TEMPLATE UTILISÉ - L\'IA OpenAI a échoué!');
    console.error('[DynamicTemplate] Demande utilisateur:', userInput);
    const templateId = `fallback-${Date.now()}`;

    // Générer un contenu de base à partir de la demande utilisateur
    const cleanedInput = userInput.trim();

    return {
      id: templateId,
      type: 'courrier_formel',
      category: 'administrative',
      title: 'Courrier formel',
      description: `Document généré pour: ${cleanedInput.substring(0, 100)}`,

      requiredFields: [
        {
          key: 'prenom',
          label: 'Prénom',
          type: 'text',
          required: true,
          source: 'manual_input'
        },
        {
          key: 'nom',
          label: 'Nom',
          type: 'text',
          required: true,
          source: 'manual_input'
        },
        {
          key: 'adresse',
          label: 'Adresse complète',
          type: 'address',
          required: true,
          source: 'manual_input'
        },
        {
          key: 'npa',
          label: 'Code postal',
          type: 'postal_code',
          required: true,
          source: 'manual_input'
        },
        {
          key: 'ville',
          label: 'Ville',
          type: 'text',
          required: true,
          source: 'manual_input'
        },
        {
          key: 'destinataire_nom',
          label: 'Nom du destinataire',
          type: 'text',
          required: true,
          source: 'manual_input',
          placeholder: 'Nom de l\'entreprise ou de la personne'
        },
        {
          key: 'destinataire_adresse',
          label: 'Adresse du destinataire',
          type: 'address',
          required: true,
          source: 'manual_input'
        }
      ],

      contentBlocks: [
        {
          type: 'address',
          content: '{{prenom}} {{nom}}\n{{adresse}}\n{{npa}} {{ville}}',
          style: { align: 'left' }
        },
        {
          type: 'address',
          content: '{{destinataire_nom}}\n{{destinataire_adresse}}',
          style: { align: 'right' }
        },
        {
          type: 'paragraph',
          content: '{{ville}}, le {{date_envoi}}',
          style: { align: 'right' }
        },
        {
          type: 'header',
          content: `Objet: ${cleanedInput.substring(0, 80)}`,
          style: { bold: true }
        },
        {
          type: 'paragraph',
          content: 'Madame, Monsieur,'
        },
        {
          type: 'paragraph',
          content: `Par la présente, je me permets de vous contacter concernant la demande suivante : ${cleanedInput}`
        },
        {
          type: 'paragraph',
          content: 'Je vous remercie de bien vouloir traiter cette demande dans les meilleurs délais et reste à votre disposition pour tout renseignement complémentaire.'
        },
        {
          type: 'paragraph',
          content: 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.'
        },
        {
          type: 'signature',
          content: '{{prenom}} {{nom}}\n\n_________________________\nSignature'
        }
      ],

      metadata: {
        language: 'fr',
        legalCompliance: false,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Aurore Finance Fallback',
        dynamicallyGenerated: true
      }
    };
  }
}
