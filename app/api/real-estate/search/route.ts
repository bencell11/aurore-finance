/**
 * API: Recherche immobilière hybride (IA + données réelles)
 * Combine les données scrapées et générées par IA
 */

import { NextRequest, NextResponse } from 'next/server';
import { DataEnrichmentService } from '@/lib/services/real-estate/data-enrichment.service';
import { AIPropertyGeneratorService } from '@/lib/services/real-estate/ai-property-generator.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userIncome, useRealData = true, useCache = true } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('[API real-estate/search] Query:', query);
    console.log('[API real-estate/search] User income:', userIncome);
    console.log('[API real-estate/search] Use real data:', useRealData);

    // Étape 1: Vérifier le cache si activé
    if (useCache) {
      const criteria = await AIPropertyGeneratorService.parseSearchQuery(query);
      const cacheKey = DataEnrichmentService.generateCacheKey(query, criteria, userIncome);
      const cachedResult = await DataEnrichmentService.getCachedResults(cacheKey);

      if (cachedResult) {
        console.log('[API real-estate/search] Returning cached results');
        return NextResponse.json({
          success: true,
          query,
          cached: true,
          ...cachedResult
        });
      }
    }

    // Étape 2: Recherche hybride (données réelles + IA)
    const result = await DataEnrichmentService.hybridSearch(
      query,
      undefined, // criteria will be parsed inside
      userIncome,
      useRealData
    );

    // Étape 3: Mettre en cache les résultats
    if (useCache) {
      const criteria = await AIPropertyGeneratorService.parseSearchQuery(query);
      const cacheKey = DataEnrichmentService.generateCacheKey(query, criteria, userIncome);
      await DataEnrichmentService.cacheSearchResults(cacheKey, result, 30);
    }

    return NextResponse.json({
      success: true,
      query,
      cached: false,
      ...result
    });

  } catch (error: any) {
    console.error('[API real-estate/search] Error:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la recherche',
        details: error.message
      },
      { status: 500 }
    );
  }
}
