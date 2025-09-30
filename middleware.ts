import { NextResponse, NextRequest } from 'next/server';
import { checkAdminAccess } from './middleware/admin-auth';

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
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute || isAdminRoute) {
    const hasAdminAccess = checkAdminAccess(request);
    
    if (!hasAdminAccess) {
      // Rediriger vers la page d'accueil avec un message
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('access', 'restricted');
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