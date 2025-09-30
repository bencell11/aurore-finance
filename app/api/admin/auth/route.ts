import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// Mot de passe admin (en production, à mettre dans les variables d'environnement)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aurore2025';


// Emails admin autorisés (optionnel)
const ADMIN_EMAILS = [
  'admin@aurorefinances.com',
  'test@aurorefinances.com',
  // Ajoutez d'autres emails admin ici
];

export async function POST(request: NextRequest) {
  try {
    const { password, email } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérification du mot de passe
    const isValidPassword = password === ADMIN_PASSWORD;
    
    // Vérification email admin (optionnel)
    const isValidEmail = !email || ADMIN_EMAILS.includes(email);

    if (!isValidPassword) {
      console.log('❌ Tentative de connexion admin échouée:', { 
        passwordLength: password.length,
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    if (!isValidEmail) {
      return NextResponse.json(
        { error: 'Email non autorisé' },
        { status: 403 }
      );
    }

    // Générer un token JWT
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

    const token = sign(
      { 
        admin: true, 
        email: email || 'admin',
        exp: Math.floor(expiresAt / 1000)
      },
      jwtSecret
    );

    console.log('✅ Connexion admin réussie:', {
      email: email || 'admin',
      timestamp: new Date().toISOString(),
      expires: new Date(expiresAt).toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      token,
      expires: expiresAt,
      admin: true
    });

  } catch (error) {
    console.error('Erreur login admin:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET pour vérifier un token existant
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant', admin: false },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    const { verify } = await import('jsonwebtoken');
    
    try {
      const decoded = verify(token, jwtSecret) as any;
      
      if (decoded.admin) {
        return NextResponse.json({
          admin: true,
          email: decoded.email,
          valid: true
        });
      } else {
        return NextResponse.json(
          { error: 'Token invalide', admin: false },
          { status: 403 }
        );
      }
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token expiré ou invalide', admin: false },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erreur vérification token:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', admin: false },
      { status: 500 }
    );
  }
}