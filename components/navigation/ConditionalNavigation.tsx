'use client';

import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Liste des pages sans navigation
  const pagesWithoutNav = [
    '/',
    '/admin/login',
    '/admin/login-simple',
    '/auth',
  ];

  // Ne pas afficher la navigation sur certaines pages
  if (pagesWithoutNav.includes(pathname)) {
    return null;
  }

  return <MainNavigation />;
}