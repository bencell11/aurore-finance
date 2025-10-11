/**
 * API: Analyse de requête utilisateur avec OpenAI
 * Détermine quel template utiliser selon la demande
 */

import { NextRequest, NextResponse } from 'next/server';
import { DocumentRoutingService } from '@/lib/services/documents/document-routing.service';
import { TemplateLoaderService } from '@/lib/services/documents/template-loader.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput } = body;

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'userInput is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('[API analyze-request] User input:', userInput);

    // Analyser la demande avec OpenAI
    const routing = await DocumentRoutingService.analyzeRequest(userInput);

    console.log('[API analyze-request] Routing analysis:', routing);

    // Charger le template suggéré
    let template;
    try {
      template = await TemplateLoaderService.loadTemplate(routing.suggestedTemplate);
    } catch (error) {
      console.warn('[API analyze-request] Template not found, using fallback');

      // Si le template n'existe pas, retourner quand même l'analyse
      return NextResponse.json({
        success: true,
        routing,
        template: null,
        message: 'Template suggéré non trouvé, mais analyse effectuée'
      });
    }

    // Retourner l'analyse et le template
    return NextResponse.json({
      success: true,
      routing,
      template,
      message: 'Analyse effectuée avec succès'
    });

  } catch (error: any) {
    console.error('[API analyze-request] Error:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'analyse de la demande',
        details: error.message
      },
      { status: 500 }
    );
  }
}
