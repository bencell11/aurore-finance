import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simuler une base de données simple (en production, utiliser une vraie DB)
let waitlistEmails = new Set<string>();
let waitlistCount = 267; // Valeur initiale

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà inscrit
    if (waitlistEmails.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Cet email est déjà inscrit' },
        { status: 409 }
      );
    }

    // Ajouter l'email à la waitlist
    waitlistEmails.add(email.toLowerCase());
    waitlistCount++;

    // Envoyer l'email de confirmation
    try {
      await sendConfirmationEmail(email);
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Ne pas faire échouer l'inscription si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie',
      waitlistCount,
      email
    });

  } catch (error) {
    console.error('Erreur inscription waitlist:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    waitlistCount,
    totalEmails: waitlistEmails.size
  });
}

async function sendConfirmationEmail(email: string) {
  try {
    // Vérifier si on a une clé Resend configurée
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey) {
      // Utiliser Resend pour l'envoi d'email
      const resend = new Resend(resendKey);
      
      await resend.emails.send({
        from: 'Aurore Finance <noreply@aurore-finance.com>',
        to: [email],
        subject: '🎉 Bienvenue dans la liste d\'attente Aurore Finance !',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Bienvenue chez Aurore Finance</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bienvenue chez Aurore Finance !</h1>
              </div>
              
              <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #1e293b; margin-top: 0;">Merci de nous faire confiance !</h2>
                <p>Bonjour,</p>
                <p>Nous sommes ravis de vous compter parmi les pionniers d'Aurore Finance ! Vous faites maintenant partie d'une communauté exclusive qui façonnera l'avenir de la gestion financière personnelle.</p>
                
                <h3 style="color: #3b82f6;">🚀 Ce qui vous attend :</h3>
                <ul style="margin-left: 20px;">
                  <li><strong>Accès prioritaire</strong> à la version bêta</li>
                  <li><strong>Interface IA révolutionnaire</strong> pour vos finances</li>
                  <li><strong>Communauté exclusive</strong> de bêta-testeurs</li>
                  <li><strong>Impact direct</strong> sur le développement du produit</li>
                </ul>
              </div>
              
              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                <h3 style="color: #059669; margin-top: 0;">📅 Prochaines étapes</h3>
                <p>Nous vous tiendrons informé(e) de l'avancement du développement et vous contacterons dès que la version bêta sera disponible.</p>
                <p>En attendant, suivez-nous sur nos réseaux sociaux pour ne rien manquer !</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:contact@aurore-finance.com" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Nous contacter</a>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #64748b; font-size: 14px;">
                <p>© 2025 Aurore Finance. Tous droits réservés.</p>
                <p>Vous recevez cet email car vous vous êtes inscrit(e) à notre liste d'attente.</p>
              </div>
            </body>
          </html>
        `
      });
      
      console.log('✅ Email envoyé via Resend à:', email);
    } else {
      // Mode démo - juste log
      console.log('📧 [DEMO] Email de confirmation pour:', email);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    // Ne pas faire échouer l'inscription pour un problème d'email
    return false;
  }
}