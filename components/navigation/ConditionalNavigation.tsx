'use client';

import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Ne pas afficher la navigation sur la landing page
  if (pathname === '/') {
    return null;
  }
  
  return <MainNavigation />;
}