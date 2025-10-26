/**
 * Service de génération de propriétés immobilières avec l'IA
 * Phase 1 MVP: Génère des résultats réalistes basés sur le marché suisse
 */

import OpenAI from 'openai';
import { Property, PropertySearchCriteria } from '@/lib/types/real-estate';
import { AffordabilityService } from './affordability.service';

export class AIPropertyGeneratorService {
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
   * Génère des propriétés réalistes basées sur les critères de recherche
   */
  static async generateProperties(
    userQuery: string,
    criteria?: PropertySearchCriteria,
    userIncome?: number
  ): Promise<Property[]> {
    try {
      const openai = this.getOpenAI();

      const systemPrompt = `Tu es un expert immobilier suisse spécialisé dans le marché locatif et d'achat.
Tu connais parfaitement les prix du marché dans toutes les villes et cantons suisses.

Ton rôle est de générer des annonces immobilières RÉALISTES basées sur les prix réels du marché suisse en 2025.

RÈGLES IMPORTANTES:
1. Utilise des PRIX RÉALISTES selon la ville/canton:
   - Genève/Zurich: 2500-4000 CHF/mois pour 3.5 pièces
   - Lausanne/Bâle: 2000-3000 CHF/mois pour 3.5 pièces
   - Berne/Lucerne: 1800-2500 CHF/mois pour 3.5 pièces
   - Villes moyennes: 1500-2200 CHF/mois pour 3.5 pièces

2. Pour l'ACHAT, multiplie par 150-200 fois le loyer mensuel

3. Génère 5-8 annonces variées et réalistes

4. Inclus des détails concrets: adresse plausible, caractéristiques, équipements

5. Varie les types de biens: appartements récents, vieux bâtiments charmants, maisons, etc.

Retourne UNIQUEMENT un JSON array valide avec cette structure:
[
  {
    "id": "unique-id",
    "title": "Titre accrocheur",
    "description": "Description détaillée en français",
    "propertyType": "apartment|house|studio",
    "transactionType": "rent|buy",
    "address": {
      "street": "Rue exemple 12",
      "city": "Lausanne",
      "postalCode": "1000",
      "canton": "VD",
      "coordinates": {"lat": 46.52, "lng": 6.63}
    },
    "price": 2500,
    "charges": 200,
    "rooms": 3.5,
    "surface": 85,
    "floor": 2,
    "totalFloors": 5,
    "yearBuilt": 2010,
    "features": ["balcony", "parking", "elevator"],
    "images": ["https://placeholder-image-url"],
    "source": "ai-generated",
    "publishedDate": "2025-01-15",
    "availability": "Immediate"
  }
]`;

      const criteriaText = criteria
        ? `
Type: ${criteria.propertyType || 'any'}
Transaction: ${criteria.transactionType || 'any'}
Ville: ${criteria.location?.city || 'any'}
Canton: ${criteria.location?.canton || 'any'}
Prix: ${criteria.price?.min || 0} - ${criteria.price?.max || 'illimité'} CHF
Pièces: ${criteria.rooms?.min || 1} - ${criteria.rooms?.max || 'illimité'}
Surface: ${criteria.surface?.min || 0} - ${criteria.surface?.max || 'illimité'} m²
`
        : '';

      const incomeText = userIncome
        ? `\nRevenu mensuel de l'utilisateur: ${userIncome} CHF (adapte les résultats à son budget)`
        : '';

      const userPrompt = `Requête de l'utilisateur: "${userQuery}"
${criteriaText}${incomeText}

Génère 5-8 annonces immobilières réalistes pour le marché suisse qui correspondent à cette recherche.
Assure-toi que les prix sont COHÉRENTS avec le marché suisse actuel.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const response = JSON.parse(content);
      let properties: Property[] = response.properties || response.result || response;

      // S'assurer que c'est un array
      if (!Array.isArray(properties)) {
        properties = [properties];
      }

      // Calculer le score d'affordabilité si revenu fourni
      if (userIncome) {
        properties = properties.map(prop => ({
          ...prop,
          affordabilityScore: AffordabilityService.calculateAffordabilityScore(
            userIncome,
            prop.transactionType === 'rent' ? prop.price : prop.price,
            prop.transactionType
          ),
          pricePerSqm: prop.surface ? Math.round(prop.price / prop.surface) : undefined
        }));

        // Trier par affordabilityScore décroissant
        properties.sort((a, b) => (b.affordabilityScore || 0) - (a.affordabilityScore || 0));
      } else {
        // Calculer prix au m²
        properties = properties.map(prop => ({
          ...prop,
          pricePerSqm: prop.surface ? Math.round(prop.price / prop.surface) : undefined
        }));
      }

      console.log(`[AIPropertyGenerator] Generated ${properties.length} properties`);
      return properties;

    } catch (error) {
      console.error('[AIPropertyGenerator] Error:', error);
      throw new Error('Erreur lors de la génération des propriétés');
    }
  }

  /**
   * Analyse une requête en langage naturel pour extraire les critères
   */
  static async parseSearchQuery(userQuery: string): Promise<PropertySearchCriteria> {
    try {
      const openai = this.getOpenAI();

      const systemPrompt = `Tu es un assistant qui extrait les critères de recherche immobilière depuis du texte en langage naturel.

Retourne UNIQUEMENT un JSON valide avec cette structure:
{
  "propertyType": "apartment|house|studio|commercial|land",
  "transactionType": "rent|buy",
  "location": {
    "city": "ville si mentionnée",
    "canton": "canton si mentionné (code à 2 lettres)",
    "postalCode": "NPA si mentionné"
  },
  "price": {
    "min": nombre ou null,
    "max": nombre ou null
  },
  "rooms": {
    "min": nombre ou null,
    "max": nombre ou null
  },
  "surface": {
    "min": nombre ou null,
    "max": nombre ou null
  },
  "features": ["feature1", "feature2"]
}

Exemples:
- "3.5 pièces" → rooms: {min: 3.5, max: 3.5}
- "max 2500" → price: {max: 2500}
- "balcon" → features: ["balcony"]
- "parking" → features: ["parking"]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Requête: "${userQuery}"` }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        return {};
      }

      const criteria = JSON.parse(content);
      console.log('[AIPropertyGenerator] Parsed criteria:', criteria);
      return criteria;

    } catch (error) {
      console.error('[AIPropertyGenerator] Parse error:', error);
      return {};
    }
  }
}
