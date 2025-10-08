'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/contexts/SupabaseAuthContext';
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
  PiggyBank,
  X,
  Home
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
      { name: 'Recherche Immobilière', href: '/recherche-immobiliere', icon: Home },
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
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const { user, isAuthenticated } = useSupabaseAuth();
  const t = useTranslation();

  const handleMouseEnter = (itemKey: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenSubmenu(itemKey);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null);
    }, 150); // Délai de 150ms avant de fermer
    setCloseTimeout(timeout);
  };

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
                  <div
                    key={item.nameKey}
                    className="relative"
                    onMouseEnter={() => hasSubmenu && handleMouseEnter(item.nameKey)}
                    onMouseLeave={() => hasSubmenu && handleMouseLeave()}
                  >
                    {hasSubmenu ? (
                      <button
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
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-2">
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

            if (hasSubmenu) {
              return (
                <button
                  key={item.nameKey}
                  onClick={() => setMobileSubmenu(mobileSubmenu === item.nameKey ? null : item.nameKey)}
                  className={`flex flex-col items-center justify-center space-y-0.5 transition-colors relative ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-tight">{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full" />
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-colors relative ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.5 text-[8px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight">{item.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Submenu Sheet */}
      {mobileSubmenu && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileSubmenu(null)}
          />

          {/* Sheet */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Outils</h3>
                <button
                  onClick={() => setMobileSubmenu(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                {navigationItems
                  .find(item => item.nameKey === mobileSubmenu)
                  ?.submenu?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setMobileSubmenu(null)}
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <SubIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{subItem.name}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer pour éviter que le contenu soit caché sous la navigation mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
