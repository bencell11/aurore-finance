import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Simuler une base de données simple (en production, utiliser une vraie DB)
let waitlistEmails = new Set<string>();
let waitlistCount = 0; // Valeur initiale

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

    // Envoyer les emails de confirmation et remerciements
    try {
      await sendConfirmationEmail(email);
      // Programmer l'email de remerciements dans 1 minute (pour demo)
      setTimeout(() => sendThankYouEmail(email), 60000);
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
    const emailSent = await sendEmailWithFallback({
      to: email,
      subject: '🎉 Bienvenue dans la liste d\'attente Aurore Finances !',
      html: generateConfirmationEmailHTML(email)
    });

    if (emailSent) {
      console.log('✅ Email de confirmation envoyé à:', email);
    } else {
      console.log('📧 [DEMO] Email de confirmation simulé pour:', email);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email de confirmation:', error);
    return false;
  }
}

async function sendThankYouEmail(email: string) {
  try {
    const emailSent = await sendEmailWithFallback({
      to: email,
      subject: '💙 Merci de nous faire confiance - Aurore Finances',
      html: generateThankYouEmailHTML(email)
    });

    if (emailSent) {
      console.log('✅ Email de remerciements envoyé à:', email);
    } else {
      console.log('📧 [DEMO] Email de remerciements simulé pour:', email);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email de remerciements:', error);
    return false;
  }
}

async function sendEmailWithFallback({ to, subject, html }: { to: string, subject: string, html: string }) {
  // 1. Essayer Resend d'abord
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Aurore Finances <noreply@aurorefinances.ch>',
        to: [to],
        subject,
        html
      });
      console.log('✅ Email envoyé via Resend');
      return true;
    } catch (error) {
      console.error('❌ Erreur Resend:', error);
    }
  }

  // 2. Essayer Nodemailer avec Gmail (si configuré)
  const gmailUser = process.env.SMTP_USER;
  const gmailPass = process.env.SMTP_PASS;
  
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      });

      await transporter.sendMail({
        from: `"Aurore Finances" <${gmailUser}>`,
        to: to,
        subject: subject,
        html: html
      });
      
      console.log('✅ Email envoyé via Gmail');
      return true;
    } catch (error) {
      console.error('❌ Erreur Gmail:', error);
    }
  }

  // 3. Essayer service d'email Vercel (si disponible)
  try {
    if (process.env.VERCEL_URL) {
      // Utiliser l'API email de Vercel si disponible
      console.log('🔄 Tentative d\'envoi via Vercel...');
      // Pour l'instant, simulé - Vercel n'a pas de service email intégré
    }
  } catch (error) {
    console.error('❌ Erreur Vercel email:', error);
  }

  // 4. Mode démo : stocker l'email pour prévisualisation
  try {
    // Stocker l'email localement pour démonstration
    const { storeEmailForPreview } = await import('./preview-store');
    await storeEmailForPreview({ to, subject, html });
    
    console.log('\n📧 =============== EMAIL DEMO MODE ===============');
    console.log('📬 À:', to);
    console.log('📝 Sujet:', subject);
    console.log('🎨 Type: Email HTML professionnel');
    console.log('⏰ Heure:', new Date().toLocaleString('fr-CH'));
    console.log('👀 Voir l\'email: http://localhost:3001/emails');
    console.log('💡 Pour activer les vrais emails, configurez RESEND_API_KEY');
    console.log('===============================================\n');
    
    return true; // Mode démo activé
  } catch (error) {
    console.error('❌ Erreur mode démo:', error);
    console.log('\n📧 =============== SIMULATION EMAIL ===============');
    console.log('📬 À:', to);
    console.log('📝 Sujet:', subject);
    console.log('===============================================\n');
    return false;
  }
}

function generateConfirmationEmailHTML(email: string): string {
  const firstName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue chez Aurore Finances</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
        
        <!-- Header avec gradient -->
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 20px; text-align: center; border-radius: 0 0 20px 20px;">
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🎉 Bienvenue ${firstName} !</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Votre place est réservée chez Aurore Finances</p>
          </div>
        </div>
        
        <div style="padding: 40px 20px;">
          
          <!-- Message principal -->
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px; font-weight: 600;">Merci de nous faire confiance ! 🚀</h2>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">Bonjour ${firstName},</p>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
              Nous sommes <strong>ravis</strong> de vous compter parmi les pionniers d'Aurore Finances ! 
              Vous faites maintenant partie d'une communauté exclusive de ${waitlistCount} visionnaires qui façonneront l'avenir de la gestion financière personnelle.
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff, #f3e8ff); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 20px; display: flex; align-items: center;">
                🚀 Ce qui vous attend
              </h3>
              <ul style="margin: 15px 0; padding-left: 0; list-style: none;">
                <li style="margin: 12px 0; padding-left: 25px; position: relative; font-size: 15px; color: #374151;">
                  <span style="position: absolute; left: 0; color: #10b981;">✨</span>
                  <strong>Accès prioritaire</strong> à la version bêta avant tout le monde
                </li>
                <li style="margin: 12px 0; padding-left: 25px; position: relative; font-size: 15px; color: #374151;">
                  <span style="position: absolute; left: 0; color: #10b981;">🤖</span>
                  <strong>Interface IA révolutionnaire</strong> pour optimiser vos finances
                </li>
                <li style="margin: 12px 0; padding-left: 25px; position: relative; font-size: 15px; color: #374151;">
                  <span style="position: absolute; left: 0; color: #10b981;">👥</span>
                  <strong>Communauté exclusive</strong> de bêta-testeurs privilégiés
                </li>
                <li style="margin: 12px 0; padding-left: 25px; position: relative; font-size: 15px; color: #374151;">
                  <span style="position: absolute; left: 0; color: #10b981;">💡</span>
                  <strong>Impact direct</strong> sur le développement du produit
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Prochaines étapes -->
          <div style="background: linear-gradient(135deg, #ecfdf5, #f0f9ff); border: 2px solid #10b981; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
            <h3 style="color: #059669; margin-top: 0; font-size: 20px; display: flex; align-items: center;">
              📅 Prochaines étapes
            </h3>
            <p style="color: #065f46; margin-bottom: 15px; font-size: 15px;">
              Nous vous tiendrons informé(e) de l'avancement du développement et vous contacterons <strong>dès que la version bêta sera disponible</strong>.
            </p>
            <p style="color: #065f46; margin: 0; font-size: 15px;">
              En attendant, restez connecté(e) avec nous pour ne rien manquer des actualités !
            </p>
          </div>
          
          <!-- Bouton d'action -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="mailto:hello@aurorefinances.ch" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: transform 0.2s;">
              💬 Nous contacter
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 14px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #1e293b; font-size: 16px;">Aurore Finances</strong>
          </div>
          <p style="margin: 8px 0;">© 2025 Aurore Finances. Tous droits réservés.</p>
          <p style="margin: 8px 0;">Vous recevez cet email car vous vous êtes inscrit(e) à notre liste d'attente.</p>
          <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
            Email envoyé à : ${email}
          </p>
        </div>
        
      </body>
    </html>
  `;
}

function generateThankYouEmailHTML(email: string): string {
  const firstName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Merci de nous faire confiance</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
        
        <!-- Header personnalisé -->
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 40px 20px; text-align: center; border-radius: 0 0 20px 20px;">
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">💙 Merci ${firstName} !</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Votre confiance nous motive chaque jour</p>
          </div>
        </div>
        
        <div style="padding: 40px 20px;">
          
          <!-- Message de remerciements -->
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px; font-weight: 600;">Un grand merci ! 🙏</h2>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">Cher ${firstName},</p>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
              Quelques minutes après votre inscription, nous tenions à vous <strong>remercier personnellement</strong> 
              de nous avoir fait confiance pour votre futur compagnon financier.
            </p>
            <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
              Votre soutien dès les premiers instants est <strong>précieux</strong> et nous motive à créer 
              la meilleure expérience possible pour vous.
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7, #fce7f3); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #d97706; margin-top: 0; font-size: 18px;">
                🎯 Notre engagement envers vous
              </h3>
              <ul style="margin: 15px 0; padding-left: 0; list-style: none;">
                <li style="margin: 10px 0; padding-left: 25px; position: relative; font-size: 15px; color: #92400e;">
                  <span style="position: absolute; left: 0; color: #d97706;">📱</span>
                  Une interface simple et intuitive
                </li>
                <li style="margin: 10px 0; padding-left: 25px; position: relative; font-size: 15px; color: #92400e;">
                  <span style="position: absolute; left: 0; color: #d97706;">🔒</span>
                  La sécurité maximum de vos données
                </li>
                <li style="margin: 10px 0; padding-left: 25px; position: relative; font-size: 15px; color: #92400e;">
                  <span style="position: absolute; left: 0; color: #d97706;">⚡</span>
                  Des conseils IA pertinents et actionables
                </li>
                <li style="margin: 10px 0; padding-left: 25px; position: relative; font-size: 15px; color: #92400e;">
                  <span style="position: absolute; left: 0; color: #d97706;">💖</span>
                  Un service client qui vous écoute vraiment
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Timeline du développement -->
          <div style="background: linear-gradient(135deg, #f0f9ff, #faf5ff); border: 2px solid #3b82f6; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 20px;">
              📈 Aperçu de notre roadmap
            </h3>
            <div style="margin: 20px 0;">
              <div style="display: flex; align-items: center; margin: 15px 0; padding: 10px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                <span style="color: #10b981; font-size: 18px; margin-right: 10px;">✅</span>
                <span style="color: #1e40af; font-weight: 500;">Janvier 2025 : Landing page et système de waitlist</span>
              </div>
              <div style="display: flex; align-items: center; margin: 15px 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border-radius: 8px;">
                <span style="color: #f59e0b; font-size: 18px; margin-right: 10px;">🔄</span>
                <span style="color: #92400e; font-weight: 500;">Février 2025 : Version bêta fermée (accès prioritaire !)</span>
              </div>
              <div style="display: flex; align-items: center; margin: 15px 0; padding: 10px; background: rgba(168, 85, 247, 0.1); border-radius: 8px;">
                <span style="color: #8b5cf6; font-size: 18px; margin-right: 10px;">🚀</span>
                <span style="color: #6b21a8; font-weight: 500;">Mars 2025 : Lancement public officiel</span>
              </div>
            </div>
          </div>
          
          <!-- Message personnel -->
          <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #ec4899;">
            <p style="font-size: 16px; color: #4b5563; font-style: italic; margin: 0;">
              <strong>"${firstName}, vous faites partie des ${waitlistCount} premiers à croire en notre vision. 
              Nous nous engageons à vous offrir une expérience exceptionnelle dès les premiers jours. 
              Merci de nous accompagner dans cette aventure !"</strong>
            </p>
            <p style="text-align: right; color: #6b7280; margin: 15px 0 0 0; font-size: 14px;">
              — L'équipe Aurore Finances 💙
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; color: white; padding: 30px 20px; text-align: center; border-radius: 20px 20px 0 0;">
          <div style="margin-bottom: 15px;">
            <strong style="font-size: 18px;">💙 Aurore Finances</strong>
          </div>
          <p style="margin: 8px 0; opacity: 0.8;">Votre nouveau compagnon financier alimenté par l'IA</p>
          <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.6;">
            Email de remerciements envoyé à : ${email}
          </p>
        </div>
        
      </body>
    </html>
  `;
}