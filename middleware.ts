import { NextResponse, NextRequest } from 'next/server';

// Routes protégées (nécessitent un accès admin)
const PROTECTED_ROUTES = [
  '/demo',
  '/assistant-fiscal',
  '/dashboard',
  '/simulateurs',
  '/objectifs',
  '/profil',
];

// Routes admin uniquement
const ADMIN_ROUTES = [
  '/admin',
];

// Routes publiques (pas de vérification)
const PUBLIC_ROUTES = [
  '/',
  '/mentions-legales',
  '/confidentialite',
  '/contact',
  '/admin/login',
  '/admin/login-simple',
  '/api/waitlist',
  '/api/test-email',
  '/api/admin/auth',
];

function checkAdminAccess(request: NextRequest): boolean {
  try {
    // Pour simplifier, on vérifie juste la présence d'un token
    // La vérification JWT complète se fait côté API
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('admin_token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    // Si pas de token, pas d'accès
    if (!token || token === '') {
      return false;
    }

    // Si un token existe, on fait confiance (vérification complète dans l'API)
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorer les routes publiques
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute || isAdminRoute) {
    const hasAdminAccess = checkAdminAccess(request);
    
    if (!hasAdminAccess) {
      // Rediriger vers la page de login admin
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login-simple';
      url.searchParams.set('return', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/waitlist (public API)
     * - api/emails (public API)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/waitlist|api/emails|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};