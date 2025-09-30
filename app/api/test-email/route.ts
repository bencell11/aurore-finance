import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Vérifier la configuration Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔍 Configuration Supabase:');
    console.log('URL:', supabaseUrl ? 'Configuré' : 'MANQUANT');
    console.log('Service Key:', supabaseServiceKey ? 'Configuré' : 'MANQUANT');
    
    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('demo')) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Supabase manquante',
        debug: {
          url: supabaseUrl ? 'OK' : 'MANQUANT',
          serviceKey: supabaseServiceKey ? 'OK' : 'MANQUANT'
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test 1: Vérifier la connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from('waitlist')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('❌ Erreur connexion Supabase:', testError);
      return NextResponse.json({
        success: false,
        error: 'Connexion Supabase échouée',
        details: testError.message
      });
    }

    console.log('✅ Connexion Supabase OK');

    // Test 2: Essayer de créer un utilisateur de test avec email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false, // Forcer l'envoi de l'email de confirmation
      user_metadata: {
        source: 'test',
        test_date: new Date().toISOString()
      }
    });

    if (authError) {
      console.error('❌ Erreur création utilisateur:', authError);
      
      // Si l'utilisateur existe déjà, essayer de renvoyer l'email
      if (authError.message.includes('already exists')) {
        console.log('👤 Utilisateur existe, tentative de renvoi d\'email...');
        
        // Essayer de récupérer l'utilisateur et renvoyer l'email
        const { data: userData } = await supabase.auth.admin.listUsers();
        const existingUser = userData.users?.find(u => u.email === email);
        
        if (existingUser) {
          // Forcer le renvoi de l'email de confirmation
          const { error: resendError } = await supabase.auth.admin.generateLink({
            type: 'signup',
            email: email
          });
          
          if (resendError) {
            console.error('❌ Erreur renvoi email:', resendError);
            return NextResponse.json({
              success: false,
              error: 'Erreur renvoi email',
              details: resendError.message
            });
          }
          
          return NextResponse.json({
            success: true,
            message: 'Email de confirmation renvoyé',
            user_id: existingUser.id
          });
        }
      }
      
      return NextResponse.json({
        success: false,
        error: 'Erreur création utilisateur',
        details: authError.message
      });
    }

    console.log('✅ Utilisateur créé:', authData.user?.id);

    return NextResponse.json({
      success: true,
      message: 'Email de test envoyé avec succès',
      user_id: authData.user?.id,
      debug: {
        email_sent: true,
        supabase_auth: 'OK'
      }
    });

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

// GET pour vérifier la configuration
export async function GET() {
  const config = {
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configuré' : 'MANQUANT',
    service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configuré' : 'MANQUANT',
    resend_key: process.env.RESEND_API_KEY ? 'Configuré' : 'MANQUANT',
    environment: process.env.NODE_ENV,
    vercel_url: process.env.VERCEL_URL || 'localhost'
  };

  return NextResponse.json({
    message: 'Configuration email',
    config
  });
}