/**
 * Service d'extraction de données depuis le texte utilisateur
 * Utilise l'IA pour extraire automatiquement les informations pertinentes
 */

import OpenAI from 'openai';
import { TemplateField } from '@/lib/types/document-templates';

export class DataExtractionService {
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
   * Extrait les données du texte utilisateur pour pré-remplir les champs
   */
  static async extractDataFromText(
    userInput: string,
    requiredFields: TemplateField[]
  ): Promise<Record<string, any>> {
    try {
      const openai = this.getOpenAI();

      // Créer une description des champs à extraire
      const fieldsDescription = requiredFields.map(field =>
        `- ${field.key} (${field.label}): ${field.type}${field.helpText ? ' - ' + field.helpText : ''}`
      ).join('\n');

      const systemPrompt = `Tu es un expert en extraction de données depuis du texte en langage naturel.
Ton rôle est d'extraire automatiquement les informations pertinentes du message de l'utilisateur.

Champs à extraire:
${fieldsDescription}

RÈGLES IMPORTANTES:
1. Extrais UNIQUEMENT les informations explicitement mentionnées dans le texte
2. Ne DEVINE PAS ou n'INVENTE PAS de données manquantes
3. Pour les dates, utilise le format ISO (YYYY-MM-DD)
4. Pour les montants, extrais uniquement le chiffre (sans devise)
5. Si une information n'est pas présente, ne la retourne PAS dans le JSON
6. Sois précis et fidèle au texte original

Exemples:
- "Je m'appelle Jean Dupont" → {"prenom": "Jean", "nom": "Dupont"}
- "Je veux résilier mon assurance Helsana numéro 123456" → {"nom_assurance": "Helsana", "numero_police": "123456"}
- "Mon adresse est Rue du test 5, 1000 Lausanne" → {"adresse": "Rue du test 5", "npa": "1000", "ville": "Lausanne"}

Retourne UNIQUEMENT un JSON valide (sans markdown) avec les données extraites.`;

      const userPrompt = `Texte de l'utilisateur: "${userInput}"

Extrais toutes les informations pertinentes mentionnées dans ce texte.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Très bas pour être précis
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        console.warn('[DataExtraction] No response from OpenAI');
        return {};
      }

      const extractedData = JSON.parse(content);

      console.log('[DataExtraction] Extracted data:', extractedData);
      return extractedData;

    } catch (error) {
      console.error('[DataExtraction] Error:', error);
      // En cas d'erreur, retourner un objet vide plutôt que de crasher
      return {};
    }
  }

  /**
   * Extraction simple par regex (fallback si OpenAI échoue)
   */
  static extractDataSimple(userInput: string): Record<string, any> {
    const data: Record<string, any> = {};

    // Extraction de noms/prénoms
    const nameMatch = userInput.match(/(?:je\s+(?:m'appelle|suis)|mon\s+nom\s+est)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)(?:\s+([A-ZÀ-Ÿ][a-zà-ÿ]+))?/i);
    if (nameMatch) {
      if (nameMatch[2]) {
        data.prenom = nameMatch[1];
        data.nom = nameMatch[2];
      } else {
        data.nom = nameMatch[1];
      }
    }

    // Extraction de numéros (police, référence, etc.)
    const numberMatch = userInput.match(/num[ée]ro\s+(?:de\s+)?(?:police|r[ée]f[ée]rence|contrat)?\s*:?\s*(\d+)/i);
    if (numberMatch) {
      data.numero_police = numberMatch[1];
    }

    // Extraction d'adresses email
    const emailMatch = userInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
    if (emailMatch) {
      data.email = emailMatch[1];
    }

    // Extraction de téléphone suisse
    const phoneMatch = userInput.match(/(?:\+41|0)[\s.-]?(?:\d{2})[\s.-]?(?:\d{3})[\s.-]?(?:\d{2})[\s.-]?(?:\d{2})/);
    if (phoneMatch) {
      data.telephone = phoneMatch[0];
    }

    // Extraction de dates (format flexible)
    const dateMatch = userInput.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      data.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Extraction d'adresse
    const addressMatch = userInput.match(/(?:habite|adresse|domicile)[^\n]*?([A-Z][a-zà-ÿ]+(?:\s+[a-zà-ÿ]+)*)\s+(\d+)(?:,\s*)?(\d{4})?\s*([A-ZÀ-Ÿ][a-zà-ÿ]+)?/i);
    if (addressMatch) {
      if (addressMatch[1] && addressMatch[2]) {
        data.adresse = `${addressMatch[1]} ${addressMatch[2]}`;
      }
      if (addressMatch[3]) {
        data.npa = addressMatch[3];
      }
      if (addressMatch[4]) {
        data.ville = addressMatch[4];
      }
    }

    // Extraction de montants
    const amountMatch = userInput.match(/(\d+(?:[.,]\d{2})?)\s*(?:CHF|francs?|fr\.?)/i);
    if (amountMatch) {
      data.montant = amountMatch[1].replace(',', '.');
    }

    // Extraction de noms d'assurance
    const insuranceMatch = userInput.match(/(?:assurance|assureur)\s+([A-Z][a-zA-Z]+)/i);
    if (insuranceMatch) {
      data.nom_assurance = insuranceMatch[1];
    }

    return data;
  }

  /**
   * Combine extraction IA + regex pour maximiser les résultats
   */
  static async extractDataCombined(
    userInput: string,
    requiredFields: TemplateField[]
  ): Promise<Record<string, any>> {
    // Tentative d'extraction avec l'IA
    const aiData = await this.extractDataFromText(userInput, requiredFields);

    // Extraction par regex en fallback
    const regexData = this.extractDataSimple(userInput);

    // Fusionner les deux (priorité à l'IA)
    const combinedData = {
      ...regexData,
      ...aiData
    };

    console.log('[DataExtraction] Combined data:', combinedData);
    return combinedData;
  }
}
