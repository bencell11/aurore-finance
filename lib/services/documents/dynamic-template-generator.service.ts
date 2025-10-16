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

🚨 ATTENTION: TU DOIS ÉCRIRE LE CONTENU COMPLET DU DOCUMENT, PAS DES PLACEHOLDERS ! 🚨

❌ MAUVAIS EXEMPLE (À NE JAMAIS FAIRE):
{
  "contentBlocks": [
    {"type": "header", "content": "Objet: [OBJET]"},
    {"type": "paragraph", "content": "Madame, Monsieur,"},
    {"type": "paragraph", "content": "[CONTENU_PRINCIPAL]"},
    {"type": "paragraph", "content": "Je vous prie d'agréer..."}
  ]
}

✅ BON EXEMPLE (CE QU'IL FAUT FAIRE - résiliation assurance maladie):
{
  "contentBlocks": [
    {"type": "header", "content": "Objet: Résiliation de contrat d'assurance maladie de base", "style": {"bold": true}},
    {"type": "paragraph", "content": "Madame, Monsieur,"},
    {"type": "paragraph", "content": "Par la présente, je vous informe de ma décision de résilier mon contrat d'assurance maladie de base numéro {{numero_police}} auprès de votre établissement, avec effet au {{date_resiliation}}, conformément aux dispositions de la Loi fédérale sur l'assurance-maladie (LAMal, Art. 7)."},
    {"type": "paragraph", "content": "Je vous prie de bien vouloir m'adresser une confirmation écrite de cette résiliation dans les meilleurs délais, ainsi que le décompte final de mes cotisations."},
    {"type": "paragraph", "content": "Je vous remercie de votre compréhension et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."}
  ]
}

✅ AUTRE BON EXEMPLE (réclamation retard paiement):
{
  "contentBlocks": [
    {"type": "header", "content": "Objet: Réclamation pour retard de paiement - Facture N° {{numero_facture}}", "style": {"bold": true}},
    {"type": "paragraph", "content": "Madame, Monsieur,"},
    {"type": "paragraph", "content": "Je me permets de vous contacter concernant la facture N° {{numero_facture}} d'un montant de {{montant_facture}} CHF, émise le {{date_facture}}, dont le règlement devait intervenir dans un délai de {{delai_paiement}} jours."},
    {"type": "paragraph", "content": "À ce jour, malgré l'expiration du délai de paiement convenu, je n'ai pas reçu le règlement de cette facture. Cette situation m'oblige à vous adresser une mise en demeure formelle."},
    {"type": "paragraph", "content": "Je vous prie donc de bien vouloir procéder au règlement de cette facture dans un délai de 10 jours à compter de la réception de ce courrier, faute de quoi je me verrais contraint d'entreprendre les démarches juridiques nécessaires."},
    {"type": "paragraph", "content": "Je vous remercie de votre compréhension et reste à votre disposition pour tout renseignement complémentaire."},
    {"type": "paragraph", "content": "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."}
  ]
}

MAINTENANT, POUR LA DEMANDE "${userInput}", TU DOIS:

1. Identifier le TYPE de document (résiliation, réclamation, demande, etc.)
2. Rédiger un OBJET SPÉCIFIQUE et complet (pas un placeholder)
3. Rédiger des PARAGRAPHES COMPLETS avec le contenu réel professionnel
4. Utiliser {{variables}} UNIQUEMENT pour les données qui changent (numéros, montants, dates, noms)
5. Respecter le style formel suisse (vouvoiement, formules de politesse)

RÈGLES ABSOLUES:
✅ L'objet doit être écrit en toutes lettres: "Objet: Résiliation de..." pas "Objet: {{objet}}"
✅ Les paragraphes doivent contenir le texte complet, pas [CONTENU_PRINCIPAL] ou {{contenu_principal}}
✅ Créer des champs spécifiques: numero_police, date_resiliation, montant_facture, etc.
❌ INTERDICTION TOTALE d'utiliser: [OBJET], [CONTENU_PRINCIPAL], {{objet}}, {{contenu_principal}}, {{contenu_courrier}}

GÉNÈRE UN DOCUMENT COMPLET MAINTENANT !`;

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

      const content = completion.choices[0].message.content;
      if (!content) {
        console.error('[DynamicTemplate] ❌ Pas de contenu dans la réponse OpenAI');
        throw new Error('No response from OpenAI');
      }

      console.log('[DynamicTemplate] 📥 Réponse brute OpenAI (premiers 500 chars):', content.substring(0, 500));

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

      // VALIDATION: Vérifier qu'il n'y a pas de placeholders interdits
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
        console.error('[DynamicTemplate] ⚠️ Placeholders interdits détectés:', foundForbidden);
        console.error('[DynamicTemplate] ContentBlocks problématiques:', contentStr);

        // Au lieu de throw, essayer de régénérer avec température plus élevée
        console.warn('[DynamicTemplate] 🔄 Tentative de régénération avec instructions renforcées...');

        const retryCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt + '\n\n🚨 CRITIQUE: Tu as généré des placeholders [OBJET] ou {{objet}}. C\'est INTERDIT. Écris le contenu COMPLET en toutes lettres!'
            },
            {
              role: 'user',
              content: userPrompt + '\n\n⚠️ ATTENTION: Ta réponse précédente contenait des placeholders interdits. RÉESSAYE en écrivant le contenu COMPLET cette fois!'
            }
          ],
          temperature: 1.0, // Maximum de créativité
          max_tokens: 3000,
          response_format: { type: 'json_object' }
        });

        const retryContent = retryCompletion.choices[0].message.content;
        if (!retryContent) {
          console.error('[DynamicTemplate] Régénération échouée, utilisation fallback');
          throw new Error('Régénération échouée');
        }

        templateData = JSON.parse(retryContent);
        console.log('[DynamicTemplate] ✅ Template régénéré avec succès');

        // Revérifier
        const retryContentStr = JSON.stringify(templateData.contentBlocks);
        const retryForbidden = forbiddenPatterns.filter(pattern =>
          retryContentStr.includes(pattern)
        );

        if (retryForbidden.length > 0) {
          console.error('[DynamicTemplate] ❌ Même après régénération, placeholders présents');
          throw new Error('Impossible de générer template sans placeholders');
        }
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
