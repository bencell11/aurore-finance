/**
 * Service d'enrichissement de données immobilières
 * Combine les données réelles (scrapers) et générées par IA
 */

import { Property, PropertySearchCriteria } from '@/lib/types/real-estate';
import { ApifyIntegrationService } from './apify-integration.service';
import { AIPropertyGeneratorService } from './ai-property-generator.service';
import { AffordabilityService } from './affordability.service';
import { GeocodingService } from './geocoding.service';

export interface EnrichedSearchResult {
  properties: Property[];
  sources: {
    real: number;
    ai: number;
    total: number;
  };
  searchStrategy: 'real-only' | 'ai-only' | 'hybrid';
  timestamp: string;
}

export class DataEnrichmentService {
  /**
   * Recherche hybride combinant données réelles et IA
   */
  static async hybridSearch(
    userQuery: string,
    criteria?: PropertySearchCriteria,
    userIncome?: number,
    preferReal: boolean = true
  ): Promise<EnrichedSearchResult> {
    const startTime = Date.now();

    // Vérifier si Apify est configuré
    const apifyConfigured = ApifyIntegrationService.isConfigured();

    let realProperties: Property[] = [];
    let aiProperties: Property[] = [];
    let searchStrategy: EnrichedSearchResult['searchStrategy'];

    if (apifyConfigured && preferReal) {
      // Stratégie 1: Essayer d'abord les données réelles
      console.log('[DataEnrichment] Attempting real data search...');

      try {
        // Parser la query en critères si non fournis
        const searchCriteria = criteria || await AIPropertyGeneratorService.parseSearchQuery(userQuery);

        // Rechercher sur toutes les plateformes
        realProperties = await ApifyIntegrationService.searchAllPlatforms(searchCriteria);

        console.log(`[DataEnrichment] Found ${realProperties.length} real properties`);

        // Si on a suffisamment de résultats réels, on s'arrête là
        if (realProperties.length >= 5) {
          searchStrategy = 'real-only';
        } else {
          // Sinon, compléter avec l'IA
          console.log('[DataEnrichment] Completing with AI properties...');

          const remaining = Math.max(0, 8 - realProperties.length);
          aiProperties = await AIPropertyGeneratorService.generateProperties(
            userQuery,
            searchCriteria,
            userIncome
          );

          // Limiter le nombre de propriétés IA
          aiProperties = aiProperties.slice(0, remaining);

          searchStrategy = 'hybrid';
        }
      } catch (error) {
        console.error('[DataEnrichment] Real search failed, falling back to AI:', error);

        // Fallback complet sur l'IA
        const searchCriteria = criteria || await AIPropertyGeneratorService.parseSearchQuery(userQuery);
        aiProperties = await AIPropertyGeneratorService.generateProperties(
          userQuery,
          searchCriteria,
          userIncome
        );

        searchStrategy = 'ai-only';
      }
    } else {
      // Stratégie 2: Utiliser uniquement l'IA
      console.log('[DataEnrichment] Using AI-only search (Apify not configured or not preferred)');

      const searchCriteria = criteria || await AIPropertyGeneratorService.parseSearchQuery(userQuery);
      aiProperties = await AIPropertyGeneratorService.generateProperties(
        userQuery,
        searchCriteria,
        userIncome
      );

      searchStrategy = 'ai-only';
    }

    // Combiner les résultats
    let allProperties = [...realProperties, ...aiProperties];

    // Enrichir avec les coordonnées GPS (géocodage)
    allProperties = await this.enrichWithCoordinates(allProperties);

    // Enrichir avec les scores d'affordabilité si revenu fourni
    if (userIncome && userIncome > 0) {
      allProperties = this.enrichWithAffordability(allProperties, userIncome);
    }

    // Trier par affordabilité ou pertinence
    allProperties = this.sortProperties(allProperties, userIncome);

    const duration = Date.now() - startTime;
    console.log(`[DataEnrichment] Search completed in ${duration}ms - Strategy: ${searchStrategy}`);

    return {
      properties: allProperties,
      sources: {
        real: realProperties.length,
        ai: aiProperties.length,
        total: allProperties.length
      },
      searchStrategy,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Enrichit les propriétés avec les coordonnées GPS via géocodage
   */
  private static async enrichWithCoordinates(
    properties: Property[]
  ): Promise<Property[]> {
    const enriched: Property[] = [];

    for (const property of properties) {
      // Vérifier que l'adresse existe
      if (!property.address) {
        console.warn('[DataEnrichment] Skipping property without address:', property.id || property.title);
        // Ne PAS ajouter les propriétés sans adresse
        continue;
      }

      // Si les coordonnées existent déjà, on garde la propriété telle quelle
      if (property.address.coordinates?.lat && property.address.coordinates?.lng) {
        enriched.push(property);
        continue;
      }

      // Sinon, essayer le géocodage
      try {
        let geocoded = await GeocodingService.geocodeAddress(
          property.address.city,
          property.address.postalCode,
          property.address.street
        );

        // Fallback: essayer avec approximation canton/ville
        if (!geocoded) {
          const cityApprox = GeocodingService.getCityApproximateCoords(property.address.city);
          if (cityApprox) {
            geocoded = {
              lat: cityApprox.lat,
              lng: cityApprox.lng,
              displayName: `${property.address.city}, Switzerland (approximative)`,
              confidence: 0.5
            };
          } else {
            const cantonApprox = GeocodingService.getCantonApproximateCoords(property.address.canton);
            if (cantonApprox) {
              geocoded = {
                lat: cantonApprox.lat,
                lng: cantonApprox.lng,
                displayName: `${property.address.canton}, Switzerland (approximative)`,
                confidence: 0.3
              };
            }
          }
        }

        if (geocoded) {
          enriched.push({
            ...property,
            address: {
              ...property.address,
              coordinates: {
                lat: geocoded.lat,
                lng: geocoded.lng
              }
            }
          });
        } else {
          // Si tout échoue, garder la propriété sans coordonnées
          console.warn(`[DataEnrichment] Could not geocode: ${property.address.city}`);
          enriched.push(property);
        }
      } catch (error) {
        console.error('[DataEnrichment] Geocoding error:', error);
        enriched.push(property);
      }
    }

    return enriched;
  }

  /**
   * Enrichit les propriétés avec les scores d'affordabilité
   */
  private static enrichWithAffordability(
    properties: Property[],
    monthlyIncome: number
  ): Property[] {
    return properties.map(property => {
      const affordability = AffordabilityService.canAffordProperty(
        monthlyIncome,
        property.price,
        property.transactionType
      );

      return {
        ...property,
        affordabilityScore: affordability.affordabilityScore
      };
    });
  }

  /**
   * Trie les propriétés par pertinence
   */
  private static sortProperties(
    properties: Property[],
    userIncome?: number
  ): Property[] {
    // Si revenu fourni, trier par affordabilité décroissante
    if (userIncome && userIncome > 0) {
      return properties.sort((a, b) => {
        const scoreA = a.affordabilityScore ?? 0;
        const scoreB = b.affordabilityScore ?? 0;
        return scoreB - scoreA;
      });
    }

    // Sinon, prioriser les données réelles, puis par date de publication
    return properties.sort((a, b) => {
      // Prioriser les sources réelles
      if (a.source !== 'ai-generated' && b.source === 'ai-generated') return -1;
      if (a.source === 'ai-generated' && b.source !== 'ai-generated') return 1;

      // Puis par date de publication (plus récent en premier)
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }

      // Sinon, par prix croissant
      return a.price - b.price;
    });
  }

  /**
   * Met en cache les résultats de recherche
   */
  static async cacheSearchResults(
    cacheKey: string,
    results: EnrichedSearchResult,
    ttlMinutes: number = 30
  ): Promise<void> {
    try {
      // TODO: Implémenter le cache (Redis ou solution similaire)
      // Pour l'instant, cache en mémoire simple
      const cache = this.getInMemoryCache();
      cache.set(cacheKey, {
        data: results,
        expiresAt: Date.now() + ttlMinutes * 60 * 1000
      });

      console.log(`[DataEnrichment] Cached results with key: ${cacheKey}`);
    } catch (error) {
      console.error('[DataEnrichment] Error caching results:', error);
    }
  }

  /**
   * Récupère les résultats depuis le cache
   */
  static async getCachedResults(
    cacheKey: string
  ): Promise<EnrichedSearchResult | null> {
    try {
      const cache = this.getInMemoryCache();
      const cached = cache.get(cacheKey);

      if (!cached) {
        return null;
      }

      // Vérifier l'expiration
      if (cached.expiresAt < Date.now()) {
        cache.delete(cacheKey);
        return null;
      }

      console.log(`[DataEnrichment] Cache hit for key: ${cacheKey}`);
      return cached.data;
    } catch (error) {
      console.error('[DataEnrichment] Error reading cache:', error);
      return null;
    }
  }

  /**
   * Génère une clé de cache basée sur les critères de recherche
   */
  static generateCacheKey(
    query: string,
    criteria?: PropertySearchCriteria,
    userIncome?: number
  ): string {
    const parts = [
      query.toLowerCase().trim(),
      criteria?.transactionType || 'any',
      criteria?.location?.city || 'any',
      criteria?.priceMin || '0',
      criteria?.priceMax || 'max',
      criteria?.roomsMin || '0',
      userIncome || '0'
    ];

    return `search:${parts.join(':')}`;
  }

  /**
   * Enrichit une propriété avec des données supplémentaires
   */
  static async enrichProperty(property: Property): Promise<Property> {
    // Calculer le prix au m² si manquant
    if (!property.pricePerSqm && property.surface > 0) {
      property.pricePerSqm = Math.round(property.price / property.surface);
    }

    // Ajouter des métadonnées
    property.metadata = {
      ...property.metadata,
      enrichedAt: new Date().toISOString(),
      dataQuality: this.assessDataQuality(property)
    };

    return property;
  }

  /**
   * Évalue la qualité des données d'une propriété
   */
  private static assessDataQuality(property: Property): number {
    let score = 0;
    const maxScore = 100;

    // Données de base présentes (+30 points)
    if (property.title) score += 10;
    if (property.description && property.description.length > 50) score += 10;
    if (property.price > 0) score += 10;

    // Localisation complète (+20 points)
    if (property.address.street) score += 5;
    if (property.address.postalCode) score += 5;
    if (property.address.city) score += 5;
    if (property.address.coordinates) score += 5;

    // Caractéristiques (+20 points)
    if (property.rooms > 0) score += 10;
    if (property.surface > 0) score += 10;

    // Détails supplémentaires (+15 points)
    if (property.features && property.features.length > 0) score += 10;
    if (property.images && property.images.length > 0) score += 5;

    // Source réelle (+15 points)
    if (property.source !== 'ai-generated') score += 15;

    return Math.min(score, maxScore);
  }

  /**
   * Cache en mémoire simple (à remplacer par Redis en production)
   */
  private static inMemoryCache: Map<string, any> | null = null;

  private static getInMemoryCache(): Map<string, any> {
    if (!this.inMemoryCache) {
      this.inMemoryCache = new Map();
    }
    return this.inMemoryCache;
  }

  /**
   * Nettoie le cache expiré
   */
  static cleanExpiredCache(): void {
    const cache = this.getInMemoryCache();
    const now = Date.now();

    for (const [key, value] of cache.entries()) {
      if (value.expiresAt < now) {
        cache.delete(key);
      }
    }

    console.log(`[DataEnrichment] Cache cleaned, ${cache.size} entries remaining`);
  }
}
