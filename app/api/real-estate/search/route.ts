/**
 * API: Recherche immobilière avec IA
 * Génère des propriétés réalistes basées sur le marché suisse
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIPropertyGeneratorService } from '@/lib/services/real-estate/ai-property-generator.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userIncome } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('[API real-estate/search] Query:', query);
    console.log('[API real-estate/search] User income:', userIncome);

    // Étape 1: Parser la requête pour extraire les critères
    const criteria = await AIPropertyGeneratorService.parseSearchQuery(query);

    // Étape 2: Générer les propriétés avec l'IA
    const properties = await AIPropertyGeneratorService.generateProperties(
      query,
      criteria,
      userIncome
    );

    return NextResponse.json({
      success: true,
      query,
      criteria,
      properties,
      count: properties.length
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
