'use client';

import { useClientOnly } from '@/hooks/useClientOnly';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant qui ne rend ses enfants qu'après l'hydratation côté client
 * Évite les erreurs d'hydratation pour les composants avec du contenu dynamique
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}