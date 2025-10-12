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
    try {
      const openai = this.getOpenAI();

      const systemPrompt = `Tu es un expert en rédaction de documents administratifs et juridiques suisses.
Ton rôle est de créer un template de document professionnel en JSON.

Le template doit contenir:
1. requiredFields: Liste des champs nécessaires (nom, prénom, adresse, etc.)
2. contentBlocks: Blocs de contenu du document avec variables {{nom_variable}}

Types de champs disponibles:
- text: Texte simple
- date: Date (format ISO)
- email: Email
- phone: Téléphone
- address: Adresse
- postal_code: Code postal
- select: Liste de choix

Types de blocs de contenu:
- address: Bloc d'adresse (expéditeur/destinataire)
- header: Titre/En-tête
- paragraph: Paragraphe de texte complet (pas de placeholder)
- signature: Bloc de signature
- list: Liste à puces

Variables disponibles dans le contenu:
{{prenom}}, {{nom}}, {{adresse}}, {{npa}}, {{ville}}, {{email}}, {{telephone}}, {{date_envoi}}
Et toutes les variables des champs que tu définis

RÈGLES CRITIQUES:
- NE CRÉE PAS de champ "contenu_principal" ou "contenu_courrier"
- ÉCRIS le texte complet directement dans les contentBlocks (paragraphes)
- Utilise le format suisse (vouvoiement, formules de politesse)
- Sois professionnel et respectueux des normes juridiques
- Inclus les références légales suisses pertinentes
- Le document doit être complet et prêt à l'envoi
- Les paragraphes doivent contenir le texte complet, pas {{contenu_principal}}

Retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure:
{
  "id": "nom-du-document",
  "type": "type_document",
  "category": "categorie",
  "title": "Titre du document",
  "description": "Description courte",
  "requiredFields": [
    {
      "key": "nom_variable",
      "label": "Label affiché",
      "type": "text|date|email|etc",
      "required": true,
      "source": "manual_input",
      "placeholder": "Exemple de valeur",
      "helpText": "Aide pour l'utilisateur"
    }
  ],
  "contentBlocks": [
    {
      "type": "address",
      "content": "{{prenom}} {{nom}}\\n{{adresse}}\\n{{npa}} {{ville}}",
      "style": { "align": "left" }
    },
    {
      "type": "paragraph",
      "content": "Contenu avec {{variables}}"
    },
    {
      "type": "signature",
      "content": "{{prenom}} {{nom}}\\n\\n_________________________\\nSignature"
    }
  ],
  "metadata": {
    "language": "fr",
    "legalCompliance": true,
    "swissLawReference": "Référence légale si applicable"
  }
}`;

      const userPrompt = `Demande: "${userInput}"
Type de document: ${documentType}
Catégorie: ${category}

Génère un template de document professionnel complet pour cette demande.

IMPORTANT: Écris le contenu COMPLET du document dans les contentBlocks.
Par exemple, pour une résiliation d'assurance, écris des paragraphes comme:
"Par la présente, je vous informe de ma décision de résilier mon contrat d'assurance maladie numéro {{numero_police}} auprès de {{nom_assurance}}, avec effet au {{date_resiliation}}."

NE PAS mettre {{contenu_principal}} - écris le texte réel !`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const templateData = JSON.parse(content);

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

      console.log('[DynamicTemplate] Generated template:', template.id);
      return template;

    } catch (error) {
      console.error('[DynamicTemplate] Error:', error);
      throw new Error('Erreur lors de la génération du template');
    }
  }

  /**
   * Génère un template simple pour les cas non reconnus
   */
  static generateFallbackTemplate(userInput: string): DocumentTemplate {
    const templateId = `courrier-${Date.now()}`;

    return {
      id: templateId,
      type: 'courrier_formel',
      category: 'administrative',
      title: 'Courrier formel',
      description: 'Courrier formel généré automatiquement',

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
        },
        {
          key: 'objet',
          label: 'Objet du courrier',
          type: 'text',
          required: true,
          source: 'manual_input',
          placeholder: 'Ex: Demande d\'information'
        },
        {
          key: 'contenu_principal',
          label: 'Contenu du courrier',
          type: 'text',
          required: true,
          source: 'manual_input',
          helpText: 'Décrivez votre demande en détail'
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
          content: 'Objet: {{objet}}',
          style: { bold: true }
        },
        {
          type: 'paragraph',
          content: 'Madame, Monsieur,'
        },
        {
          type: 'paragraph',
          content: '{{contenu_principal}}'
        },
        {
          type: 'paragraph',
          content: 'Je reste à votre disposition pour toute information complémentaire et vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.'
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
