import { NextRequest, NextResponse } from 'next/server';

/**
 * Version mock pour l'extraction de documents
 */

const mockExtractions = {
  'certificat': {
    type: 'salary_certificate',
    data: {
      employer: 'UBS AG',
      grossSalary: 85000,
      netSalary: 68420,
      socialDeductions: {
        avs: 3612.50,
        lpp: 4250,
        ac: 850
      }
    }
  },
  'relevé': {
    type: 'bank_statement',
    data: {
      bankName: 'Banque Cantonale Vaudoise',
      accountType: 'savings',
      balance: 45680.50,
      interestEarned: 287.40
    }
  },
  'assurance': {
    type: 'insurance_premium',
    data: {
      type: 'health',
      premium: 4800,
      provider: 'Helsana'
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, fileUrl } = body;

    if (!fileId || !fileUrl) {
      return NextResponse.json(
        { error: 'ID de fichier et URL requis' },
        { status: 400 }
      );
    }

    // Simulation d'extraction basée sur le nom du fichier
    await new Promise(resolve => setTimeout(resolve, 2000));

    let documentType = 'other';
    let extractedData = {};

    // Détection du type basée sur l'URL (simulation)
    if (fileUrl.includes('certificat') || fileUrl.includes('salary')) {
      documentType = mockExtractions.certificat.type;
      extractedData = mockExtractions.certificat.data;
    } else if (fileUrl.includes('relevé') || fileUrl.includes('bank')) {
      documentType = mockExtractions.relevé.type;
      extractedData = mockExtractions.relevé.data;
    } else if (fileUrl.includes('assurance') || fileUrl.includes('prime')) {
      documentType = mockExtractions.assurance.type;
      extractedData = mockExtractions.assurance.data;
    } else {
      // Données génériques pour demo
      documentType = 'other';
      extractedData = {
        montants: [1200, 850, 4500],
        dates: ['31.12.2024'],
        text: 'Document fiscal reconnu mais type non spécifique'
      };
    }

    return NextResponse.json({
      success: true,
      documentType,
      extractedData,
      message: 'Données extraites avec succès (MODE DEMO - OCR simulé)'
    });

  } catch (error) {
    console.error('Erreur extraction mock:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'extraction des données' },
      { status: 500 }
    );
  }
}