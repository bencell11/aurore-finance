import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Lire les emails stockés en mode demo
    const emailsPath = path.join(process.cwd(), 'demo-emails.json');
    
    try {
      const emailsData = await fs.readFile(emailsPath, 'utf-8');
      const emails = JSON.parse(emailsData);
      
      return NextResponse.json({
        success: true,
        message: 'Emails de démonstration',
        emails: emails,
        note: 'Ces emails auraient été envoyés si RESEND_API_KEY était configuré'
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        message: 'Aucun email de démonstration trouvé',
        emails: [],
        configuration: {
          RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Configuré' : 'Non configuré',
          SMTP_USER: process.env.SMTP_USER ? 'Configuré' : 'Non configuré',
          EMAIL_DEBUG_MODE: process.env.EMAIL_DEBUG_MODE
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la lecture des emails'
    });
  }
}