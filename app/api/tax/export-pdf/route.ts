import { NextRequest, NextResponse } from 'next/server';
import { ExactPDFTemplateService } from '@/lib/services/tax/exact-pdf-template.service';
import ProfileStorageService from '@/lib/services/storage/profile-storage.service';

/**
 * API pour export PDF direct de la déclaration fiscale
 */
export async function POST(request: NextRequest) {
  return await generatePDFDocument();
}

export async function GET(request: NextRequest) {
  return await generatePDFDocument();
}

async function generatePDFDocument() {
  try {
    console.log('[PDF Export] Génération PDF de la déclaration fiscale');
    
    const storage = ProfileStorageService.getInstance();
    const profile = storage.getProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Aucun profil trouvé. Veuillez d\'abord remplir vos informations.' },
        { status: 400 }
      );
    }
    
    // Générer le HTML optimisé pour PDF
    const htmlContent = ExactPDFTemplateService.generateExactHTML(profile);
    
    // Optimiser le HTML pour l'impression PDF
    const pdfOptimizedHTML = htmlContent.replace(
      '<body>',
      `<body>
        <style>
          @media print, screen {
            .action-buttons { display: none !important; }
            body { margin: 0 !important; }
            .page { 
              page-break-after: always !important; 
              margin: 0 !important;
              padding: 15mm 20mm !important;
            }
            .page:last-child { page-break-after: avoid !important; }
          }
        </style>
        <script>
          // Auto-trigger print dialog
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>`
    );
    
    const fileName = `declaration-fiscale-${profile.personalInfo?.canton || 'VD'}-2025.html`;
    
    console.log(`[PDF Export] Fichier généré: ${fileName}`);
    
    return new NextResponse(pdfOptimizedHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-PDF-Ready': 'true'
      }
    });
    
  } catch (error) {
    console.error('[PDF Export] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération PDF' },
      { status: 500 }
    );
  }
}

