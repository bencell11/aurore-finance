import { useEffect, useState } from 'react';

/**
 * Hook pour éviter les erreurs d'hydratation SSR
 * Retourne true seulement après l'hydratation côté client
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}