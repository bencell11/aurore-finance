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
- NE CRÉE JAMAIS de champ "contenu_principal", "contenu_courrier", "objet", ou autres champs génériques de contenu
- ÉCRIS le texte complet directement dans les contentBlocks (paragraphes)
- L'objet et le contenu doivent être écrits EN DUR dans les contentBlocks, pas demandés à l'utilisateur
- Utilise le format suisse (vouvoiement, formules de politesse)
- Sois professionnel et respectueux des normes juridiques
- Inclus les références légales suisses pertinentes
- Le document doit être complet et prêt à l'envoi
- Les paragraphes doivent contenir le texte complet réel, PAS de variables {{contenu_principal}} ou {{objet}}

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

      const userPrompt = `Demande de l'utilisateur: "${userInput}"
Type de document: ${documentType}
Catégorie: ${category}

Génère un template de document professionnel complet pour cette demande SPÉCIFIQUE.

RÈGLES ABSOLUMENT CRITIQUES - À RESPECTER IMPÉRATIVEMENT:

1. TU DOIS ÉCRIRE TOI-MÊME LE CONTENU COMPLET DU DOCUMENT
   - L'OBJET doit être rédigé par toi, adapté à la demande
   - Le CONTENU (paragraphes) doit être rédigé par toi, professionnel et complet
   - Inspire-toi du style formel suisse comme dans l'exemple de résiliation d'assurance maladie

2. EXEMPLE PARFAIT DE CE QUI EST ATTENDU (résiliation assurance maladie):
   contentBlocks: [
     {"type": "header", "content": "Objet: Résiliation de contrat d'assurance maladie", "style": {"bold": true}},
     {"type": "paragraph", "content": "Madame, Monsieur,"},
     {"type": "paragraph", "content": "Par la présente, je vous informe de ma décision de résilier mon contrat d'assurance maladie de base numéro {{numero_police}} auprès de {{nom_assurance}}, avec effet au {{date_resiliation}}, conformément aux dispositions de la LAMal (Art. 7)."},
     {"type": "paragraph", "content": "Je vous remercie de bien vouloir m'adresser une confirmation écrite de cette résiliation..."}
   ]

3. POUR LA DEMANDE ACTUELLE, RÉDIGE UN CONTENU SIMILAIRE:
   - Écris l'objet spécifique (pas "Objet: {{objet}}" mais "Objet: [titre adapté]")
   - Écris des paragraphes complets et professionnels
   - Utilise le vouvoiement et les formules suisses
   - Intègre les variables {{}} UNIQUEMENT pour les données spécifiques (montants, noms, dates)
   - NE METS JAMAIS {{objet}} ou {{contenu_principal}}

4. Crée des champs SPÉCIFIQUES pour les données variables:
   Exemples:
   - Contrat web: montant_creation, tarif_maintenance_mensuel, description_services, delai_livraison
   - Location: montant_loyer, charges_mensuelles, duree_bail, date_debut_location
   - Vente: prix_vente, conditions_paiement, garanties

5. INTERDIT ABSOLU:
   ❌ NE JAMAIS créer de champ "objet" dans requiredFields
   ❌ NE JAMAIS créer de champ "contenu_principal" dans requiredFields
   ❌ NE JAMAIS utiliser {{objet}} ou {{contenu_principal}} dans les contentBlocks

GÉNÈRE MAINTENANT UN DOCUMENT PROFESSIONNEL COMPLET COMME CELUI DE L'ASSURANCE MALADIE !`;

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
   * DEPRECATED: Ne devrait jamais être utilisé car l'IA génère toujours un template complet
   */
  static generateFallbackTemplate(userInput: string): DocumentTemplate {
    console.warn('[DynamicTemplate] Using fallback template - AI generation should have succeeded');
    const templateId = `document-${Date.now()}`;

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
