import { NextRequest, NextResponse } from 'next/server';

/**
 * Version mock pour l'upload de documents
 */
export async function POST(request: NextRequest) {
  try {
    // Récupération du FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileId = formData.get('fileId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validation du fichier
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      );
    }

    // Simulation d'upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUrl = `https://demo.aurore-finance.com/uploads/mock-${fileId}-${file.name}`;

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      url: mockUrl,
      message: 'Fichier téléchargé avec succès (MODE DEMO)'
    });

  } catch (error) {
    console.error('Erreur upload mock:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    );
  }
}