import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes protégées (nécessitent une authentification utilisateur)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/simulateurs',
  '/objectifs',
  '/profil',
  '/onboarding',
];

// Routes admin uniquement (nécessitent un token admin)
const ADMIN_ROUTES = [
  '/admin',
];

// Routes publiques (pas de vérification)
const PUBLIC_ROUTES = [
  '/',
  '/mentions-legales',
  '/confidentialite',
  '/contact',
  '/auth',
  '/admin/login',
  '/admin/login-simple',
  '/education-fiscale',
  '/demo',
  '/assistant-fiscal',
];

async function checkUserAuth(request: NextRequest): Promise<boolean> {
  try {
    const response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    return false;
  }
}

function checkAdminAccess(request: NextRequest): boolean {
  try {
    // Pour l'admin, vérifier le token admin
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('admin_token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token || token === '') {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et API routes
  if (pathname.includes('.') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Vérifier si c'est une route publique
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Vérifier les routes admin
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  if (isAdminRoute) {
    const hasAdminAccess = checkAdminAccess(request);

    if (!hasAdminAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login-simple';
      url.searchParams.set('return', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Vérifier les routes protégées utilisateur
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtectedRoute) {
    const hasUserAuth = await checkUserAuth(request);

    if (!hasUserAuth) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
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
     * - api routes
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};