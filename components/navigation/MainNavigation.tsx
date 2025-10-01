'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Calculator,
  Target,
  PieChart,
  MessageCircle,
  TrendingUp,
  Menu,
  X,
  FileText
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Accueil',
    href: '/',
    icon: Home,
    public: true
  },
  {
    name: 'Simulateurs',
    href: '/simulateurs',
    icon: Calculator,
    public: true
  },
  {
    name: 'Assistant Fiscal',
    href: '/assistant-fiscal',
    icon: FileText,
    public: false,
    badge: 'AI'
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: PieChart,
    public: false
  },
  {
    name: 'Objectifs',
    href: '/objectifs',
    icon: Target,
    public: false
  },
  {
    name: 'Chatbot IA',
    href: '/demo',
    icon: MessageCircle,
    public: false
  }
];

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Gestion sécurisée de l'authentification
  let user = null;
  let isAuthenticated = false;
  
  try {
    const authData = useAuth();
    user = authData.user;
    isAuthenticated = authData.isAuthenticated;
  } catch (error) {
    // Si les hooks d'auth échouent, on continue sans authentification
    console.warn('Auth hooks not available, continuing without authentication');
  }

  // Ne pas afficher la navigation sur la page de connexion
  if (pathname === '/auth') {
    return null;
  }

  const visibleItems = navigationItems.filter(item => 
    item.public || isAuthenticated
  );

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Aurore Finances</span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-600 text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Commencer</Link>
                </Button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Actions mobile */}
            <div className="mt-4 pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <div className="px-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Connecté en tant que <span className="font-medium">{user?.email}</span>
                  </p>
                  <UserMenu />
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth">Connexion</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth">Commencer</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}