/**
 * API: Récupération des données utilisateur depuis Supabase
 * Sécurisé - Authentification requise
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DataGatheringService } from '@/lib/services/documents/data-gathering.service';
import { TemplateLoaderService } from '@/lib/services/documents/template-loader.service';
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
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    console.log('[API gather-data] Gathering data for user:', user.id, 'template:', templateId);

    // Charger le template
    const template = await TemplateLoaderService.loadTemplate(templateId);

    // Récupérer les données utilisateur depuis Supabase
    const gatheredData = await DataGatheringService.gatherUserData(
      user.id,
      template.requiredFields,
      template.optionalFields
    );

    // Ajouter des champs calculés spéciaux
    if (template.id === 'resiliation-assurance-maladie-ch') {
      // Ajouter l'adresse de l'assurance si le nom est fourni
      const nomAssurance = gatheredData.availableFields['nom_assurance'];
      if (nomAssurance) {
        gatheredData.availableFields['adresse_assurance'] =
          await DocumentRoutingService.getInsuranceAddress(nomAssurance);
      }
    }

    console.log('[API gather-data] Data gathered:', {
      availableCount: Object.keys(gatheredData.availableFields).length,
      missingCount: gatheredData.missingFields.length
    });

    return NextResponse.json({
      success: true,
      data: gatheredData.availableFields,
      missing: gatheredData.missingFields,
      warnings: gatheredData.warnings,
      template
    });

  } catch (error: any) {
    console.error('[API gather-data] Error:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des données',
        details: error.message
      },
      { status: 500 }
    );
  }
}
