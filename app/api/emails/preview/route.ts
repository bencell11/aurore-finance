import { NextResponse } from 'next/server';
import { getStoredEmails, getEmailCount, getEmailById } from '../../waitlist/preview-store';

export async function GET() {
  return NextResponse.json({
    emails: getStoredEmails(),
    count: getEmailCount()
  });
}

// API pour afficher un email spécifique
export async function PUT(request: Request) {
  try {
    const { emailId } = await request.json();
    const email = getEmailById(emailId);
    
    if (!email) {
      return NextResponse.json({ error: 'Email non trouvé' }, { status: 404 });
    }
    
    return new Response(email.html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}