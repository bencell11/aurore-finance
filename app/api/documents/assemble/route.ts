/**
 * API: Assemblage du document final
 * Combine template + données = document HTML prêt à télécharger
 */

import { NextRequest, NextResponse } from 'next/server';
import { TemplateLoaderService } from '@/lib/services/documents/template-loader.service';
import { DocumentAssemblerService } from '@/lib/services/documents/document-assembler.service';
import { DataGatheringService } from '@/lib/services/documents/data-gathering.service';
import { DocumentRoutingService } from '@/lib/services/documents/document-routing.service';
import { calculateInvoiceTotals } from '@/lib/services/documents/facture-template';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, template: providedTemplate, manualData, signatureDataUrl, format = 'HTML' } = body;

    if (!templateId && !providedTemplate) {
      return NextResponse.json(
        { error: 'templateId or template is required' },
        { status: 400 }
      );
    }

    console.log('[API assemble] Assembling document for template:', templateId || providedTemplate?.id);

    // Charger le template (soit depuis le fichier, soit utiliser celui fourni pour les templates dynamiques)
    let template;
    if (providedTemplate) {
      template = providedTemplate;
      console.log('[API assemble] Using provided template (dynamic)');
    } else {
      template = await TemplateLoaderService.loadTemplate(templateId);
      console.log('[API assemble] Loaded template from file');
    }

    // Utiliser uniquement les données manuelles fournies par l'utilisateur
    const allData = { ...manualData };

    // Ajouter la signature si fournie
    if (signatureDataUrl) {
      allData['signature_digitale'] = signatureDataUrl;
    }

    // Ajouter des champs calculés spéciaux
    if (template.id === 'assurance-maladie' && allData['nom_assurance']) {
      allData['adresse_assurance'] = DocumentRoutingService.getInsuranceAddress(allData['nom_assurance']);
    }

    // Calculs automatiques pour les factures
    if (template.id === 'facture_professionnelle_suisse') {
      const totals = calculateInvoiceTotals(allData);
      Object.assign(allData, totals);
      console.log('[API assemble] Facture totals calculated:', totals);
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
    const html = DocumentAssemblerService.assembleDocument(template, allData, signatureDataUrl);

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
