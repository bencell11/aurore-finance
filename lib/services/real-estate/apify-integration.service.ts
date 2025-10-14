/**
 * Service d'intégration Apify pour scraper les plateformes immobilières suisses
 * Utilise les scrapers Apify pour ImmoScout24.ch et Homegate.ch
 */

import { Property, PropertySearchCriteria } from '@/lib/types/real-estate';

export interface ApifyScraperConfig {
  actorId: string;
  token?: string;
}

export class ApifyIntegrationService {
  private static readonly APIFY_API_URL = 'https://api.apify.com/v2';
  private static readonly APIFY_TOKEN = process.env.APIFY_API_TOKEN;

  // IDs des scrapers Apify (à adapter selon les scrapers réels disponibles)
  private static readonly IMMOSCOUT24_ACTOR_ID = 'immoscout24-scraper';
  private static readonly HOMEGATE_ACTOR_ID = 'homegate-scraper';

  /**
   * Recherche de propriétés sur ImmoScout24.ch via Apify
   */
  static async searchImmoScout24(
    criteria: PropertySearchCriteria
  ): Promise<Property[]> {
    try {
      if (!this.APIFY_TOKEN) {
        console.warn('[Apify] API token not configured, skipping ImmoScout24 scraping');
        return [];
      }

      const input = this.buildImmoScout24Input(criteria);

      const properties = await this.runApifyActor(
        this.IMMOSCOUT24_ACTOR_ID,
        input
      );

      return properties.map(item => this.transformImmoScout24ToProperty(item));
    } catch (error) {
      console.error('[Apify] Error searching ImmoScout24:', error);
      return [];
    }
  }

  /**
   * Recherche de propriétés sur Homegate.ch via Apify
   */
  static async searchHomegate(
    criteria: PropertySearchCriteria
  ): Promise<Property[]> {
    try {
      if (!this.APIFY_TOKEN) {
        console.warn('[Apify] API token not configured, skipping Homegate scraping');
        return [];
      }

      const input = this.buildHomegateInput(criteria);

      const properties = await this.runApifyActor(
        this.HOMEGATE_ACTOR_ID,
        input
      );

      return properties.map(item => this.transformHomegateToProperty(item));
    } catch (error) {
      console.error('[Apify] Error searching Homegate:', error);
      return [];
    }
  }

  /**
   * Recherche combinée sur toutes les plateformes
   */
  static async searchAllPlatforms(
    criteria: PropertySearchCriteria
  ): Promise<Property[]> {
    const [immoscout, homegate] = await Promise.all([
      this.searchImmoScout24(criteria),
      this.searchHomegate(criteria)
    ]);

    // Combiner et dédupliquer les résultats
    return this.deduplicateProperties([...immoscout, ...homegate]);
  }

  /**
   * Exécute un actor Apify et récupère les résultats
   */
  private static async runApifyActor(
    actorId: string,
    input: any
  ): Promise<any[]> {
    try {
      // Lancer l'actor
      const runResponse = await fetch(
        `${this.APIFY_API_URL}/acts/${actorId}/runs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.APIFY_TOKEN}`
          },
          body: JSON.stringify(input)
        }
      );

      if (!runResponse.ok) {
        throw new Error(`Failed to start Apify actor: ${runResponse.statusText}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;

      // Attendre la fin de l'exécution (avec timeout)
      const results = await this.waitForActorResults(actorId, runId);

      return results;
    } catch (error) {
      console.error('[Apify] Error running actor:', error);
      throw error;
    }
  }

  /**
   * Attend les résultats d'un actor Apify
   */
  private static async waitForActorResults(
    actorId: string,
    runId: string,
    maxWaitTime: number = 60000
  ): Promise<any[]> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 secondes

    while (Date.now() - startTime < maxWaitTime) {
      const statusResponse = await fetch(
        `${this.APIFY_API_URL}/acts/${actorId}/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.APIFY_TOKEN}`
          }
        }
      );

      const statusData = await statusResponse.json();
      const status = statusData.data.status;

      if (status === 'SUCCEEDED') {
        // Récupérer les résultats
        const datasetId = statusData.data.defaultDatasetId;
        const resultsResponse = await fetch(
          `${this.APIFY_API_URL}/datasets/${datasetId}/items`,
          {
            headers: {
              'Authorization': `Bearer ${this.APIFY_TOKEN}`
            }
          }
        );

        return await resultsResponse.json();
      }

      if (status === 'FAILED' || status === 'ABORTED') {
        throw new Error(`Actor execution ${status.toLowerCase()}`);
      }

      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Actor execution timeout');
  }

  /**
   * Construit l'input pour ImmoScout24 scraper
   */
  private static buildImmoScout24Input(criteria: PropertySearchCriteria): any {
    return {
      searchUrl: this.buildImmoScout24SearchUrl(criteria),
      maxItems: criteria.limit || 20,
      proxyConfiguration: {
        useApifyProxy: true
      }
    };
  }

  /**
   * Construit l'URL de recherche ImmoScout24
   */
  private static buildImmoScout24SearchUrl(criteria: PropertySearchCriteria): string {
    const baseUrl = 'https://www.immoscout24.ch/fr/immobilier';
    const params = new URLSearchParams();

    if (criteria.transactionType === 'rent') {
      params.append('t', 'rent');
    } else if (criteria.transactionType === 'buy') {
      params.append('t', 'buy');
    }

    if (criteria.location) {
      params.append('pn', criteria.location.city || '');
    }

    if (criteria.priceMin) {
      params.append('pf', criteria.priceMin.toString());
    }

    if (criteria.priceMax) {
      params.append('pt', criteria.priceMax.toString());
    }

    if (criteria.roomsMin) {
      params.append('nrf', criteria.roomsMin.toString());
    }

    if (criteria.roomsMax) {
      params.append('nrt', criteria.roomsMax.toString());
    }

    if (criteria.surfaceMin) {
      params.append('slf', criteria.surfaceMin.toString());
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Construit l'input pour Homegate scraper
   */
  private static buildHomegateInput(criteria: PropertySearchCriteria): any {
    return {
      searchUrl: this.buildHomegateSearchUrl(criteria),
      maxItems: criteria.limit || 20,
      proxyConfiguration: {
        useApifyProxy: true
      }
    };
  }

  /**
   * Construit l'URL de recherche Homegate
   */
  private static buildHomegateSearchUrl(criteria: PropertySearchCriteria): string {
    const baseUrl = 'https://www.homegate.ch/fr';
    const type = criteria.transactionType === 'rent' ? 'louer' : 'acheter';

    const params = new URLSearchParams();

    if (criteria.location) {
      params.append('loc', criteria.location.city || '');
    }

    if (criteria.priceMin) {
      params.append('ap', criteria.priceMin.toString());
    }

    if (criteria.priceMax) {
      params.append('ax', criteria.priceMax.toString());
    }

    if (criteria.roomsMin) {
      params.append('nr', criteria.roomsMin.toString());
    }

    if (criteria.surfaceMin) {
      params.append('as', criteria.surfaceMin.toString());
    }

    return `${baseUrl}/${type}?${params.toString()}`;
  }

  /**
   * Transforme un résultat ImmoScout24 en Property
   */
  private static transformImmoScout24ToProperty(item: any): Property {
    return {
      id: `immoscout24-${item.id || Date.now()}`,
      title: item.title || 'Propriété sans titre',
      description: item.description || '',
      propertyType: this.normalizePropertyType(item.propertyType),
      transactionType: item.transactionType === 'rent' ? 'rent' : 'buy',
      address: {
        street: item.street,
        city: item.city || 'Non spécifié',
        postalCode: item.postalCode || '',
        canton: item.canton || '',
        coordinates: item.coordinates ? {
          lat: item.coordinates.lat,
          lng: item.coordinates.lng
        } : undefined
      },
      price: item.price || 0,
      charges: item.charges,
      rooms: item.rooms || 0,
      surface: item.surface || 0,
      features: item.features || [],
      pricePerSqm: item.surface ? Math.round(item.price / item.surface) : undefined,
      source: 'immoscout24',
      images: item.images || [],
      publishedAt: item.publishedAt,
      url: item.url
    };
  }

  /**
   * Transforme un résultat Homegate en Property
   */
  private static transformHomegateToProperty(item: any): Property {
    return {
      id: `homegate-${item.id || Date.now()}`,
      title: item.title || 'Propriété sans titre',
      description: item.description || '',
      propertyType: this.normalizePropertyType(item.propertyType),
      transactionType: item.type === 'rent' ? 'rent' : 'buy',
      address: {
        street: item.address?.street,
        city: item.address?.city || 'Non spécifié',
        postalCode: item.address?.zip || '',
        canton: item.address?.canton || '',
        coordinates: item.location ? {
          lat: item.location.lat,
          lng: item.location.lng
        } : undefined
      },
      price: item.price || 0,
      charges: item.additionalCosts,
      rooms: item.numberOfRooms || 0,
      surface: item.livingSpace || 0,
      features: item.features || [],
      pricePerSqm: item.livingSpace ? Math.round(item.price / item.livingSpace) : undefined,
      source: 'homegate',
      images: item.images || [],
      publishedAt: item.publishedDate,
      url: item.url
    };
  }

  /**
   * Normalise le type de propriété
   */
  private static normalizePropertyType(type: string): Property['propertyType'] {
    const normalized = type?.toLowerCase() || '';

    if (normalized.includes('apartment') || normalized.includes('appartement')) {
      return 'apartment';
    }
    if (normalized.includes('house') || normalized.includes('maison')) {
      return 'house';
    }
    if (normalized.includes('studio')) {
      return 'studio';
    }
    if (normalized.includes('commercial')) {
      return 'commercial';
    }
    if (normalized.includes('land') || normalized.includes('terrain')) {
      return 'land';
    }

    return 'apartment'; // Par défaut
  }

  /**
   * Déduplique les propriétés basé sur l'adresse et le prix
   */
  private static deduplicateProperties(properties: Property[]): Property[] {
    const seen = new Map<string, Property>();

    for (const property of properties) {
      const key = `${property.address.city}-${property.address.postalCode}-${property.price}-${property.rooms}`;

      if (!seen.has(key)) {
        seen.set(key, property);
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Vérifie si l'API Apify est configurée
   */
  static isConfigured(): boolean {
    return !!this.APIFY_TOKEN;
  }
}
