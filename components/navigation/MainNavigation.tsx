'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { SimpleLanguageSelector, useTranslation } from '@/components/SimpleLanguageSelector';
import {
  LayoutDashboard,
  Wrench,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Calculator,
  FileText,
  PiggyBank
} from 'lucide-react';

// Structure simplifiée : 4 onglets principaux
const getNavigationItems = (t: any) => [
  {
    nameKey: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    public: false
  },
  {
    nameKey: 'tools',
    name: 'Outils',
    href: '/simulateurs',
    icon: Wrench,
    public: true,
    submenu: [
      { name: 'Simulateurs', href: '/simulateurs', icon: Calculator },
      { name: 'Objectifs', href: '/objectifs', icon: PiggyBank },
      { name: 'Outils pratiques', href: '/education-fiscale#outils', icon: FileText }
    ]
  },
  {
    nameKey: 'academy',
    name: 'Academy',
    href: '/education-fiscale',
    icon: GraduationCap,
    public: true
  },
  {
    nameKey: 'aurore',
    name: 'Aurore',
    href: '/assistant-fiscal',
    icon: Sparkles,
    public: false,
    badge: 'IA'
  }
];

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const { user, isAuthenticated } = useAuthContext();
  const t = useTranslation();

  // Ne pas afficher la navigation sur la page de connexion
  if (pathname === '/auth') {
    return null;
  }

  const navigationItems = getNavigationItems(t);
  const visibleItems = navigationItems.filter(item =>
    item.public || isAuthenticated
  );

  return (
    <>
      {/* Navigation Desktop - Top */}
      <nav className="hidden md:block bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Aurore Finances</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const hasSubmenu = item.submenu && item.submenu.length > 0;

                return (
                  <div key={item.nameKey} className="relative">
                    {hasSubmenu ? (
                      <button
                        onMouseEnter={() => setOpenSubmenu(item.nameKey)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Submenu Dropdown */}
                    {hasSubmenu && openSubmenu === item.nameKey && (
                      <div
                        onMouseEnter={() => setOpenSubmenu(item.nameKey)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-2"
                      >
                        {item.submenu!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <SimpleLanguageSelector />
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/auth">Commencer</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Mobile - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
        <div className="grid grid-cols-4 h-16">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <Link
                key={item.nameKey}
                href={hasSubmenu ? item.submenu![0].href : item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
                {item.badge && (
                  <span className="absolute top-1 right-1/4 px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer pour éviter que le contenu soit caché sous la navigation mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
