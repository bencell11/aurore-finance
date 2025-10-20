/**
 * Service de géocodage pour convertir les adresses en coordonnées GPS
 * Utilise Nominatim (OpenStreetMap) - gratuit et open-source
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  confidence: number; // 0-1
}

export class GeocodingService {
  private static readonly NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
  private static readonly USER_AGENT = 'AuroreFinance/1.0';

  // Cache en mémoire pour éviter les appels répétés
  private static cache = new Map<string, GeocodeResult>();

  // Rate limiting: max 1 requête par seconde pour Nominatim
  private static lastRequestTime = 0;
  private static readonly MIN_DELAY_MS = 1000;

  /**
   * Attendre le délai minimum entre les requêtes
   */
  private static async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_DELAY_MS) {
      const delay = this.MIN_DELAY_MS - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Geocode une adresse complète en Suisse
   */
  static async geocodeAddress(
    city: string,
    postalCode?: string,
    street?: string
  ): Promise<GeocodeResult | null> {
    try {
      // Construire la query
      const parts: string[] = [];
      if (street) parts.push(street);
      if (postalCode) parts.push(postalCode);
      parts.push(city);
      parts.push('Switzerland');

      const query = parts.join(', ');

      // Vérifier le cache
      const cacheKey = query.toLowerCase();
      if (this.cache.has(cacheKey)) {
        console.log('[Geocoding] Cache hit for:', query);
        return this.cache.get(cacheKey)!;
      }

      console.log('[Geocoding] Geocoding address:', query);

      // Respecter le rate limit
      await this.waitForRateLimit();

      // Requête à Nominatim
      const url = new URL(this.NOMINATIM_API);
      url.searchParams.append('q', query);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');
      url.searchParams.append('countrycodes', 'ch'); // Suisse uniquement
      url.searchParams.append('addressdetails', '1');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('[Geocoding] API error:', response.status);
        return null;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn('[Geocoding] No results for:', query);
        return null;
      }

      const result: GeocodeResult = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        confidence: parseFloat(data[0].importance || '0.5')
      };

      // Mettre en cache
      this.cache.set(cacheKey, result);

      console.log('[Geocoding] Success:', result);
      return result;

    } catch (error: any) {
      console.error('[Geocoding] Error:', error.message);
      return null;
    }
  }

  /**
   * Geocode une ville suisse
   */
  static async geocodeCity(city: string): Promise<GeocodeResult | null> {
    return this.geocodeAddress(city);
  }

  /**
   * Geocode un canton suisse
   */
  static async geocodeCanton(canton: string): Promise<GeocodeResult | null> {
    const cantonQuery = `${canton}, Switzerland`;
    return this.geocodeAddress(canton);
  }

  /**
   * Geocode une liste d'adresses en batch (avec rate limiting)
   */
  static async geocodeBatch(
    addresses: Array<{ city: string; postalCode?: string; street?: string }>
  ): Promise<(GeocodeResult | null)[]> {
    const results: (GeocodeResult | null)[] = [];

    for (const address of addresses) {
      const result = await this.geocodeAddress(
        address.city,
        address.postalCode,
        address.street
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Vider le cache
   */
  static clearCache(): void {
    this.cache.clear();
    console.log('[Geocoding] Cache cleared');
  }

  /**
   * Obtenir des coordonnées approximatives pour un canton suisse
   * (fallback quand le géocodage échoue)
   */
  static getCantonApproximateCoords(canton: string): { lat: number; lng: number } | null {
    const cantonCoords: Record<string, { lat: number; lng: number }> = {
      // Suisse romande
      'Genève': { lat: 46.2044, lng: 6.1432 },
      'Vaud': { lat: 46.5502, lng: 6.6328 },
      'Valais': { lat: 46.2334, lng: 7.3652 },
      'Neuchâtel': { lat: 47.0000, lng: 6.9300 },
      'Fribourg': { lat: 46.8000, lng: 7.1500 },
      'Jura': { lat: 47.3500, lng: 7.1500 },

      // Suisse alémanique
      'Bern': { lat: 46.9480, lng: 7.4474 },
      'Zürich': { lat: 47.3769, lng: 8.5417 },
      'Basel-Stadt': { lat: 47.5596, lng: 7.5886 },
      'Basel-Landschaft': { lat: 47.4832, lng: 7.7333 },
      'Aargau': { lat: 47.4000, lng: 8.1500 },
      'Solothurn': { lat: 47.2100, lng: 7.5300 },
      'Luzern': { lat: 47.0502, lng: 8.3093 },
      'Uri': { lat: 46.8800, lng: 8.6300 },
      'Schwyz': { lat: 47.0200, lng: 8.6500 },
      'Obwalden': { lat: 46.8800, lng: 8.2500 },
      'Nidwalden': { lat: 46.9500, lng: 8.3900 },
      'Glarus': { lat: 47.0400, lng: 9.0700 },
      'Zug': { lat: 47.1667, lng: 8.5167 },
      'Schaffhausen': { lat: 47.6970, lng: 8.6345 },
      'Appenzell Ausserrhoden': { lat: 47.3667, lng: 9.3000 },
      'Appenzell Innerrhoden': { lat: 47.3300, lng: 9.4200 },
      'St. Gallen': { lat: 47.4245, lng: 9.3767 },
      'Graubünden': { lat: 46.8500, lng: 9.5300 },
      'Thurgau': { lat: 47.5500, lng: 9.0000 },

      // Tessin
      'Ticino': { lat: 46.3317, lng: 8.8003 },
    };

    const normalized = canton.trim();
    return cantonCoords[normalized] || null;
  }

  /**
   * Obtenir des coordonnées approximatives pour une grande ville suisse
   */
  static getCityApproximateCoords(city: string): { lat: number; lng: number } | null {
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      'Genève': { lat: 46.2044, lng: 6.1432 },
      'Lausanne': { lat: 46.5197, lng: 6.6323 },
      'Zürich': { lat: 47.3769, lng: 8.5417 },
      'Bern': { lat: 46.9480, lng: 7.4474 },
      'Basel': { lat: 47.5596, lng: 7.5886 },
      'Winterthur': { lat: 47.5000, lng: 8.7500 },
      'Luzern': { lat: 47.0502, lng: 8.3093 },
      'St. Gallen': { lat: 47.4245, lng: 9.3767 },
      'Lugano': { lat: 46.0036, lng: 8.9512 },
      'Biel': { lat: 47.1368, lng: 7.2444 },
      'Thun': { lat: 46.7583, lng: 7.6278 },
      'Köniz': { lat: 46.9241, lng: 7.4145 },
      'La Chaux-de-Fonds': { lat: 47.1000, lng: 6.8333 },
      'Fribourg': { lat: 46.8067, lng: 7.1614 },
      'Schaffhausen': { lat: 47.6970, lng: 8.6345 },
      'Chur': { lat: 46.8480, lng: 9.5335 },
      'Vernier': { lat: 46.2167, lng: 6.0833 },
      'Neuchâtel': { lat: 47.0000, lng: 6.9300 },
      'Uster': { lat: 47.3500, lng: 8.7167 },
      'Sion': { lat: 46.2306, lng: 7.3594 },
      'Emmen': { lat: 47.0828, lng: 8.2972 },
      'Yverdon-les-Bains': { lat: 46.7786, lng: 6.6411 },
      'Zug': { lat: 47.1667, lng: 8.5167 },
      'Kriens': { lat: 47.0328, lng: 8.2789 },
      'Rapperswil': { lat: 47.2269, lng: 8.8193 },
      'Montreux': { lat: 46.4312, lng: 6.9106 },
      'Vevey': { lat: 46.4604, lng: 6.8430 },
      'Nyon': { lat: 46.3833, lng: 6.2333 },
      'Morges': { lat: 46.5122, lng: 6.4981 },
      'Renens': { lat: 46.5364, lng: 6.5881 },
      'Ecublens': { lat: 46.5281, lng: 6.5639 },
    };

    const normalized = city.trim();
    return cityCoords[normalized] || null;
  }
}
