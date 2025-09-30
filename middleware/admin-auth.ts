import { NextRequest, NextResponse } from 'next/server';

// Liste des emails admins autorisés
const ADMIN_EMAILS = [
  'admin@aurorefinances.ch',
  'benjamin@aurorefinances.ch',
  'benjamin@test.com',
  // Ajoutez d'autres emails admins ici
];

// Clé secrète pour l'accès admin temporaire
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'aurore-admin-2025';

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function checkAdminAccess(request: NextRequest): boolean {
  // Vérifier le cookie d'admin
  const adminCookie = request.cookies.get('admin-access');
  if (adminCookie?.value === ADMIN_ACCESS_KEY) {
    return true;
  }

  // Vérifier le header d'autorisation
  const authHeader = request.headers.get('x-admin-key');
  if (authHeader === ADMIN_ACCESS_KEY) {
    return true;
  }

  // Vérifier le paramètre URL (pour un accès temporaire)
  const url = new URL(request.url);
  const adminKey = url.searchParams.get('admin-key');
  if (adminKey === ADMIN_ACCESS_KEY) {
    return true;
  }

  return false;
}

export function createAdminSession(response: NextResponse): NextResponse {
  response.cookies.set('admin-access', ADMIN_ACCESS_KEY, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
  return response;
}