/**
 * API: Assemblage du document final
 * Combine template + données = document HTML prêt à télécharger
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TemplateLoaderService } from '@/lib/services/documents/template-loader.service';
import { DocumentAssemblerService } from '@/lib/services/documents/document-assembler.service';
import { DataGatheringService } from '@/lib/services/documents/data-gathering.service';
import { DocumentRoutingService } from '@/lib/services/documents/document-routing.service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { templateId, manualData, format = 'HTML' } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    console.log('[API assemble] Assembling document for user:', user.id, 'template:', templateId);

    // Charger le template
    const template = await TemplateLoaderService.loadTemplate(templateId);

    // Récupérer les données utilisateur depuis Supabase
    const gatheredData = await DataGatheringService.gatherUserData(
      user.id,
      template.requiredFields,
      template.optionalFields
    );

    // Fusionner avec les données manuelles fournies
    const allData = {
      ...gatheredData.availableFields,
      ...manualData
    };

    // Ajouter des champs calculés spéciaux
    if (template.id === 'resiliation-assurance-maladie-ch' && allData['nom_assurance']) {
      allData['adresse_assurance'] = DocumentRoutingService.getInsuranceAddress(allData['nom_assurance']);
    }

    // Valider que toutes les données requises sont présentes
    const validation = DataGatheringService.validateRequiredData(
      allData,
      template.requiredFields
    );

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Données manquantes',
          missing: validation.missing,
          providedData: allData
        },
        { status: 400 }
      );
    }

    // Assembler le document
    const html = DocumentAssemblerService.assembleDocument(template, allData);

    console.log('[API assemble] Document assembled successfully');

    // Retourner selon le format demandé
    if (format === 'HTML') {
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${template.id}-${new Date().toISOString().split('T')[0]}.html"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Pour PDF (à implémenter)
    if (format === 'PDF') {
      try {
        const pdfBuffer = await DocumentAssemblerService.generatePDF(html);

        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${template.id}-${new Date().toISOString().split('T')[0]}.pdf"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Génération PDF non disponible pour le moment. Utilisez le format HTML et Ctrl+P pour imprimer en PDF.'
          },
          { status: 501 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Format non supporté. Formats disponibles: HTML, PDF' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('[API assemble] Error:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'assemblage du document',
        details: error.message
      },
      { status: 500 }
    );
  }
}
