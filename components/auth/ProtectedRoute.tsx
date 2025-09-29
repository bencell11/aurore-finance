'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Rediriger vers la page d'authentification si non connecté
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // Rediriger vers le dashboard si déjà connecté (pour les pages auth)
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo]);

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié et que l'auth est requise, ne rien afficher
  // (la redirection se fera via useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Si l'utilisateur est authentifié et qu'on ne veut pas l'auth, ne rien afficher
  // (redirection vers dashboard)
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}