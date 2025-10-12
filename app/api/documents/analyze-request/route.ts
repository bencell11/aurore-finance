/**
 * API: Analyse de requête utilisateur avec OpenAI
 * Détermine quel template utiliser ou génère un nouveau template dynamiquement
 */

import { NextRequest, NextResponse } from 'next/server';
import { DocumentRoutingService } from '@/lib/services/documents/document-routing.service';
import { TemplateLoaderService } from '@/lib/services/documents/template-loader.service';
import { DynamicTemplateGeneratorService } from '@/lib/services/documents/dynamic-template-generator.service';
import { DataExtractionService } from '@/lib/services/documents/data-extraction.service';
import { ContentGeneratorService } from '@/lib/services/documents/content-generator.service';

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
      console.log('[API analyze-request] Using existing template:', template.id);
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
        // Génération dynamique du template avec l'IA
        console.log('[API analyze-request] No existing template found, generating dynamically...');

        try {
          template = await DynamicTemplateGeneratorService.generateTemplate(
            userInput,
            routing.documentType,
            routing.category
          );
          console.log('[API analyze-request] Successfully generated dynamic template:', template.id);
        } catch (generateError) {
          console.error('[API analyze-request] Error generating dynamic template:', generateError);

          // Fallback ultime: template générique simple
          console.log('[API analyze-request] Using fallback generic template');
          template = DynamicTemplateGeneratorService.generateFallbackTemplate(userInput);
        }
      }
    }

    // NOUVEAU: Extraire automatiquement les données du message utilisateur
    console.log('[API analyze-request] Extracting data from user input...');
    const extractedData = await DataExtractionService.extractDataCombined(
      userInput,
      template.requiredFields
    );
    console.log('[API analyze-request] Extracted data:', extractedData);

    // Note: Le contenu du document est maintenant écrit directement dans les contentBlocks
    // par le DynamicTemplateGeneratorService, donc pas besoin de ContentGeneratorService ici

    // Retourner l'analyse, le template ET les données extraites (avec contenu généré)
    return NextResponse.json({
      success: true,
      routing,
      template,
      extractedData, // NOUVEAU: Données pré-remplies + contenu généré
      dynamicallyGenerated: template.metadata?.dynamicallyGenerated || false,
      message: template.metadata?.dynamicallyGenerated
        ? 'Template généré dynamiquement avec succès'
        : 'Template existant trouvé'
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
