import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Mode démo si pas de Supabase configuré
    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('demo')) {
      console.log('⚠️ Mode démo - Supabase non configuré');
      
      // Stocker localement en mode démo
      const waitlistPath = './waitlist-demo.json';
      const fs = (await import('fs/promises')).default;
      
      try {
        const data = await fs.readFile(waitlistPath, 'utf-8');
        const waitlist = JSON.parse(data);
        
        // Vérifier si déjà inscrit
        if (waitlist.emails.includes(email)) {
          return NextResponse.json(
            { error: 'Cet email est déjà inscrit' },
            { status: 400 }
          );
        }
        
        waitlist.emails.push(email);
        waitlist.count = waitlist.emails.length;
        await fs.writeFile(waitlistPath, JSON.stringify(waitlist, null, 2));
        
        return NextResponse.json({
          success: true,
          message: 'Inscription simulée en mode démo',
          waitlistCount: waitlist.count + 267
        });
      } catch {
        // Créer le fichier s'il n'existe pas
        const newWaitlist = { emails: [email], count: 1 };
        await fs.writeFile(waitlistPath, JSON.stringify(newWaitlist, null, 2));
        
        return NextResponse.json({
          success: true,
          message: 'Inscription simulée en mode démo',
          waitlistCount: 268
        });
      }
    }

    // Connexion à Supabase avec la clé de service
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Méthode 1: Utiliser Supabase Auth pour créer un utilisateur
    // Cela enverra automatiquement un email de confirmation via Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false, // Supabase enverra l'email de confirmation
      user_metadata: {
        source: 'waitlist',
        signup_date: new Date().toISOString()
      }
    });

    if (authError) {
      // Si l'utilisateur existe déjà, c'est OK, on le met à jour
      if (authError.message.includes('already exists')) {
        // Mettre à jour les métadonnées
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          authData?.user?.id || '',
          {
            user_metadata: {
              waitlist: true,
              waitlist_date: new Date().toISOString()
            }
          }
        );
        
        if (updateError) {
          console.error('Erreur mise à jour utilisateur:', updateError);
        }
        
        return NextResponse.json({
          success: true,
          message: 'Vous êtes déjà inscrit sur la liste d\'attente',
          waitlistCount: 300 // Estimation
        });
      }
      
      console.error('Erreur création utilisateur Supabase:', authError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    // Méthode 2: Stocker aussi dans une table waitlist
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({
        email,
        created_at: new Date().toISOString(),
        status: 'pending'
      });

    if (dbError && !dbError.message.includes('duplicate')) {
      console.error('Erreur base de données:', dbError);
    }

    // Compter le nombre total d'inscrits
    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const totalCount = count || 1;

    // Supabase enverra automatiquement l'email de confirmation
    console.log('✅ Utilisateur créé dans Supabase Auth - Email de confirmation envoyé automatiquement');

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie! Un email de confirmation a été envoyé.',
      waitlistCount: totalCount + 267
    });

  } catch (error) {
    console.error('Erreur API waitlist:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET pour récupérer le compteur
export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('demo')) {
      // Mode démo
      try {
        const fs = (await import('fs/promises')).default;
        const data = await fs.readFile('./waitlist-demo.json', 'utf-8');
        const waitlist = JSON.parse(data);
        return NextResponse.json({ waitlistCount: waitlist.count + 267 });
      } catch {
        return NextResponse.json({ waitlistCount: 267 });
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      waitlistCount: (count || 0) + 267
    });
  } catch (error) {
    console.error('Erreur récupération compteur:', error);
    return NextResponse.json({ waitlistCount: 267 });
  }
}