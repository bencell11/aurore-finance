import { NextRequest, NextResponse } from 'next/server';
import { OfficialFormFillerService } from '@/lib/services/tax/official-form-filler.service';
import { ExactPDFTemplateService } from '@/lib/services/tax/exact-pdf-template.service';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * API pour générer le formulaire officiel rempli
 * Basé sur le template di-template-test.pdf officiel
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format = 'HTML', includeMetadata = true } = body;
    
    console.log('[Official Form] Génération du formulaire officiel rempli');
    
    // Récupérer le profil utilisateur complet
    const storage = ProfileStorageService.getInstance();
    const profile = storage.getProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Aucun profil trouvé. Veuillez d\'abord remplir vos informations.' },
        { status: 400 }
      );
    }
    
    console.log('[Official Form] Profil récupéré:', {
      canton: profile.personalInfo?.canton,
      nom: profile.firstName,
      salaire: profile.incomeData?.mainEmployment?.grossSalary,
      enfants: profile.personalInfo?.numberOfChildren
    });
    
    // Conversion vers le formulaire officiel complet
    const officialFormData = OfficialFormFillerService.convertProfileToOfficialForm(profile);
    
    console.log('[Official Form] Formulaire officiel créé:', {
      canton: officialFormData.canton,
      contribuable: `${officialFormData.contribuable1.nom}, ${officialFormData.contribuable1.prenom}`,
      revenuTotal: officialFormData.revenus.totalRevenus,
      revenuImposable: officialFormData.calculs.revenuImposable,
      enfants: officialFormData.enfants.length
    });
    
    let fileContent: string;
    let fileName: string;
    let contentType: string;
    
    switch (format.toUpperCase()) {
      case 'HTML':
        // Utiliser le service qui reproduit exactement le PDF original
        fileContent = ExactPDFTemplateService.generateExactHTML(profile);
        fileName = `declaration-officielle-${profile.personalInfo?.canton || 'VD'}-2025.html`;
        contentType = 'text/html; charset=utf-8';
        break;
        
      case 'JSON':
        fileContent = JSON.stringify(officialFormData, null, 2);
        fileName = `declaration-data-${officialFormData.canton}-${officialFormData.periodeImpots}.json`;
        contentType = 'application/json';
        break;
        
      default:
        return NextResponse.json(
          { error: `Format ${format} non supporté. Formats disponibles: HTML, JSON` },
          { status: 400 }
        );
    }
    
    // Ajouter métadonnées si demandé
    if (includeMetadata && format.toUpperCase() === 'HTML') {
      const metadata = `
<!-- MÉTADONNÉES DE GÉNÉRATION -->
<!-- 
Canton: ${officialFormData.canton}
Commune: ${officialFormData.commune}
Contribuable: ${officialFormData.contribuable1.prenom} ${officialFormData.contribuable1.nom}
Date de génération: ${new Date().toISOString()}
Formulaire officiel: Formule 2 605.040.11f (période fiscale ${officialFormData.periodeImpots})
Généré par: Aurore Finance Assistant Fiscal Suisse
Statut: Formulaire officiel complet

RÉSUMÉ FISCAL:
- Revenu imposable: CHF ${officialFormData.calculs.revenuImposable.toLocaleString('fr-CH')}
- Fortune nette: CHF ${officialFormData.fortune.fortuneNette.toLocaleString('fr-CH')}
- Enfants à charge: ${officialFormData.enfants.length}
- Déductions totales: CHF ${officialFormData.deductions.totalDeductions.toLocaleString('fr-CH')}
-->
`;
      fileContent = fileContent.replace('<head>', '<head>' + metadata);
    }
    
    const response = new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Generated-By': 'Aurore Finance Assistant Fiscal',
        'X-Form-Version': `Formule 2 605.040.11f (${officialFormData.periodeImpots})`,
        'X-Canton': officialFormData.canton
      }
    });
    
    console.log('[Official Form] Formulaire généré avec succès:', fileName);
    
    return response;
    
  } catch (error) {
    console.error('[Official Form] Erreur lors de la génération:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du formulaire officiel',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retourner les informations sur les formats disponibles
    const storage = ProfileStorageService.getInstance();
    const profile = storage.getProfile();
    
    if (!profile) {
      return NextResponse.json({
        available: false,
        message: 'Aucun profil trouvé. Remplissez d\'abord vos informations.',
        formats: []
      });
    }
    
    const officialFormData = OfficialFormFillerService.convertProfileToOfficialForm(profile);
    
    return NextResponse.json({
      available: true,
      profile: {
        canton: officialFormData.canton,
        commune: officialFormData.commune,
        contribuable: `${officialFormData.contribuable1.prenom} ${officialFormData.contribuable1.nom}`,
        enfants: officialFormData.enfants.length,
        revenuImposable: officialFormData.calculs.revenuImposable,
        fortuneNette: officialFormData.fortune.fortuneNette
      },
      formats: [
        {
          format: 'HTML',
          description: 'Formulaire officiel complet prêt pour impression',
          extension: '.html',
          recommended: true
        },
        {
          format: 'JSON',
          description: 'Données structurées pour import/export',
          extension: '.json',
          recommended: false
        }
      ],
      metadata: {
        formulaireOfficial: `Formule 2 605.040.11f (période fiscale ${officialFormData.periodeImpots})`,
        dateGeneration: new Date().toISOString(),
        statutValidation: 'Formulaire officiel complet'
      }
    });
    
  } catch (error) {
    console.error('[Official Form] Erreur GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations' },
      { status: 500 }
    );
  }
}