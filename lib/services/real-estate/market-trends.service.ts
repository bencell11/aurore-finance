/**
 * Service d'analyse des tendances du marché immobilier suisse
 */

import type { Property } from '@/lib/types/real-estate';

export interface MarketTrends {
  location: string;
  averagePrice: number;
  medianPrice: number;
  pricePerSqm: number;
  priceChange: number; // % change over last year
  inventory: number;
  daysOnMarket: number;
  priceDistribution: Array<{ range: string; count: number }>;
  popularFeatures: Array<{ feature: string; percentage: number }>;
  trend: 'up' | 'down' | 'stable';
}

export class MarketTrendsService {
  // Données de marché simulées par canton (prix médian au m²)
  private static readonly MARKET_DATA_2025: Record<string, {
    pricePerSqm: number;
    yearlyChange: number;
    inventory: number;
    daysOnMarket: number;
  }> = {
    'GE': { pricePerSqm: 12000, yearlyChange: 3.5, inventory: 1200, daysOnMarket: 45 },
    'VD': { pricePerSqm: 9500, yearlyChange: 2.8, inventory: 1500, daysOnMarket: 52 },
    'ZH': { pricePerSqm: 13500, yearlyChange: 4.2, inventory: 2000, daysOnMarket: 38 },
    'BE': { pricePerSqm: 7800, yearlyChange: 1.5, inventory: 1800, daysOnMarket: 60 },
    'VS': { pricePerSqm: 6500, yearlyChange: 2.0, inventory: 900, daysOnMarket: 75 },
    'FR': { pricePerSqm: 7200, yearlyChange: 1.8, inventory: 700, daysOnMarket: 65 },
    'NE': { pricePerSqm: 6800, yearlyChange: 1.2, inventory: 600, daysOnMarket: 70 },
    'TI': { pricePerSqm: 8500, yearlyChange: 2.5, inventory: 1100, daysOnMarket: 55 },
    'LU': { pricePerSqm: 9200, yearlyChange: 3.0, inventory: 950, daysOnMarket: 48 },
    'default': { pricePerSqm: 8000, yearlyChange: 2.0, inventory: 1000, daysOnMarket: 60 }
  };

  /**
   * Analyse les tendances du marché pour une localisation
   */
  static analyzeMarket(properties: Property[], canton: string, city?: string): MarketTrends {
    // Filtrer les propriétés par localisation
    const localProperties = city
      ? properties.filter(p => p.address.canton === canton && p.address.city.toLowerCase().includes(city.toLowerCase()))
      : properties.filter(p => p.address.canton === canton);

    if (localProperties.length === 0) {
      return this.getDefaultTrends(canton, city);
    }

    // Prix moyens
    const prices = localProperties.map(p => p.price);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const medianPrice = this.calculateMedian(prices);

    // Prix au m²
    const pricesPerSqm = localProperties
      .filter(p => p.pricePerSqm)
      .map(p => p.pricePerSqm!);
    const avgPricePerSqm = pricesPerSqm.length > 0
      ? pricesPerSqm.reduce((a, b) => a + b, 0) / pricesPerSqm.length
      : 0;

    // Données de marché
    const marketData = this.MARKET_DATA_2025[canton] || this.MARKET_DATA_2025['default'];

    // Distribution des prix
    const priceDistribution = this.calculatePriceDistribution(prices);

    // Caractéristiques populaires
    const popularFeatures = this.calculatePopularFeatures(localProperties);

    // Tendance
    const trend = marketData.yearlyChange > 2 ? 'up' : marketData.yearlyChange < 0 ? 'down' : 'stable';

    return {
      location: city ? `${city}, ${canton}` : canton,
      averagePrice: Math.round(averagePrice),
      medianPrice: Math.round(medianPrice),
      pricePerSqm: Math.round(avgPricePerSqm || marketData.pricePerSqm),
      priceChange: marketData.yearlyChange,
      inventory: marketData.inventory,
      daysOnMarket: marketData.daysOnMarket,
      priceDistribution,
      popularFeatures,
      trend
    };
  }

  /**
   * Calcule la médiane
   */
  private static calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calcule la distribution des prix
   */
  private static calculatePriceDistribution(prices: number[]): Array<{ range: string; count: number }> {
    const ranges = [
      { min: 0, max: 500000, label: '< 500k' },
      { min: 500000, max: 1000000, label: '500k-1M' },
      { min: 1000000, max: 1500000, label: '1M-1.5M' },
      { min: 1500000, max: 2000000, label: '1.5M-2M' },
      { min: 2000000, max: Infinity, label: '> 2M' }
    ];

    return ranges.map(range => ({
      range: range.label,
      count: prices.filter(p => p >= range.min && p < range.max).length
    }));
  }

  /**
   * Calcule les caractéristiques populaires
   */
  private static calculatePopularFeatures(properties: Property[]): Array<{ feature: string; percentage: number }> {
    const featureCounts = new Map<string, number>();
    const total = properties.length;

    properties.forEach(p => {
      p.features?.forEach(feature => {
        featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
      });
    });

    return Array.from(featureCounts.entries())
      .map(([feature, count]) => ({
        feature,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }

  /**
   * Retourne les tendances par défaut basées sur les données de marché
   */
  private static getDefaultTrends(canton: string, city?: string): MarketTrends {
    const data = this.MARKET_DATA_2025[canton] || this.MARKET_DATA_2025['default'];
    const trend = data.yearlyChange > 2 ? 'up' : data.yearlyChange < 0 ? 'down' : 'stable';

    return {
      location: city ? `${city}, ${canton}` : canton,
      averagePrice: data.pricePerSqm * 100, // Estimation pour 100m²
      medianPrice: data.pricePerSqm * 95,
      pricePerSqm: data.pricePerSqm,
      priceChange: data.yearlyChange,
      inventory: data.inventory,
      daysOnMarket: data.daysOnMarket,
      priceDistribution: [],
      popularFeatures: [],
      trend
    };
  }

  /**
   * Compare les tendances entre plusieurs localisations
   */
  static compareLocations(cantons: string[]): Array<MarketTrends> {
    return cantons.map(canton => this.getDefaultTrends(canton));
  }

  /**
   * Prédit le prix futur d'une propriété
   */
  static predictFuturePrice(
    currentPrice: number,
    canton: string,
    years: number
  ): {
    estimatedPrice: number;
    appreciation: number;
    yearlyGrowth: number;
  } {
    const data = this.MARKET_DATA_2025[canton] || this.MARKET_DATA_2025['default'];
    const yearlyGrowth = data.yearlyChange / 100;
    const estimatedPrice = currentPrice * Math.pow(1 + yearlyGrowth, years);
    const appreciation = estimatedPrice - currentPrice;

    return {
      estimatedPrice: Math.round(estimatedPrice),
      appreciation: Math.round(appreciation),
      yearlyGrowth: data.yearlyChange
    };
  }

  /**
   * Génère des insights sur le marché
   */
  static generateInsights(trends: MarketTrends): string[] {
    const insights: string[] = [];

    // Tendance du marché
    if (trends.trend === 'up') {
      insights.push(`📈 Marché en hausse: +${trends.priceChange.toFixed(1)}% sur l'année écoulée.`);
    } else if (trends.trend === 'down') {
      insights.push(`📉 Marché en baisse: ${trends.priceChange.toFixed(1)}% sur l'année écoulée.`);
    } else {
      insights.push(`➡️ Marché stable: ${Math.abs(trends.priceChange).toFixed(1)}% de variation.`);
    }

    // Inventaire
    if (trends.inventory < 800) {
      insights.push(`⚠️ Inventaire faible (${trends.inventory} propriétés): forte demande, négociation difficile.`);
    } else if (trends.inventory > 1500) {
      insights.push(`✅ Inventaire élevé (${trends.inventory} propriétés): bon pouvoir de négociation.`);
    } else {
      insights.push(`ℹ️ Inventaire équilibré (${trends.inventory} propriétés): marché sain.`);
    }

    // Jours sur le marché
    if (trends.daysOnMarket < 45) {
      insights.push(`⚡ Ventes rapides (${trends.daysOnMarket} jours): marché dynamique, agissez vite.`);
    } else if (trends.daysOnMarket > 70) {
      insights.push(`🕐 Ventes lentes (${trends.daysOnMarket} jours): prenez votre temps pour négocier.`);
    }

    // Prix au m²
    insights.push(`💰 Prix moyen: ${trends.pricePerSqm.toLocaleString()} CHF/m².`);

    return insights;
  }
}
