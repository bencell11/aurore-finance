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
      console.warn('[API analyze-request] Exact template not found, trying fuzzy match...');

      // Essayer de trouver un template similaire
      const allTemplates = await TemplateLoaderService.listAllTemplates();

      // Recherche fuzzy : chercher par mots-clés
      const searchTerms = routing.suggestedTemplate.toLowerCase().split('-');
      const matchedTemplate = allTemplates.find(t => {
        const templateName = t.id.toLowerCase();
        return searchTerms.every(term => templateName.includes(term));
      });

      if (matchedTemplate) {
        console.log('[API analyze-request] Found similar template:', matchedTemplate.id);
        template = matchedTemplate;
      } else {
        // Si vraiment aucun template ne correspond, retourner l'analyse quand même
        console.warn('[API analyze-request] No matching template found');
        return NextResponse.json({
          success: true,
          routing,
          template: null,
          availableTemplates: allTemplates.map(t => ({ id: t.id, title: t.title })),
          message: 'Aucun template exact trouvé. Reformulez votre demande ou choisissez parmi les templates disponibles.'
        });
      }
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
