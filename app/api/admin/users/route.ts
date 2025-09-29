import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Vérifier que nous avons les credentials admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Vérifier si on a de vraies clés Supabase ou des clés de démo
    const isDemoMode = !supabaseUrl || 
                      !supabaseServiceKey || 
                      supabaseUrl.includes('demo-') || 
                      supabaseServiceKey.includes('demo_');

    if (isDemoMode) {
      // Mode démo : retourner des utilisateurs simulés basés sur la waitlist
      const { getStoredEmails } = await import('../../waitlist/preview-store');
      const waitlistEmails = getStoredEmails();
      
      const demoUsers = waitlistEmails.map((emailRecord, index) => ({
        id: `demo-user-${index + 1}`,
        email: emailRecord.to,
        phone: null,
        created_at: emailRecord.sentAt,
        updated_at: emailRecord.sentAt,
        last_sign_in_at: null,
        email_confirmed_at: emailRecord.sentAt,
        app_metadata: { provider: 'waitlist' },
        user_metadata: { source: 'waitlist_registration' },
        providers: ['email'],
        source: 'waitlist'
      }));

      return NextResponse.json({
        users: demoUsers,
        count: demoUsers.length,
        timestamp: new Date().toISOString(),
        mode: 'demo',
        message: 'Mode démo - Utilisateurs basés sur la waitlist'
      });
    }

    // Mode production : utiliser la vraie API Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Erreur Supabase listUsers:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des utilisateurs', details: error.message },
        { status: 500 }
      );
    }

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
      providers: user.identities?.map(identity => identity.provider) || [],
      source: 'supabase'
    }));

    return NextResponse.json({
      users: formattedUsers,
      count: users.length,
      timestamp: new Date().toISOString(),
      mode: 'production'
    });

  } catch (error) {
    console.error('Erreur API admin users:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// API pour récupérer un utilisateur spécifique
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}