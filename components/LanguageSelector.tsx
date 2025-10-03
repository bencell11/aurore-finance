'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

type Locale = 'fr' | 'de' | 'it' | 'en';

interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export function LanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');

  useEffect(() => {
    // Récupérer la langue depuis localStorage ou le navigateur
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.split('-')[0] as Locale;
    const validLocale = languages.find(l => l.code === savedLocale || l.code === browserLocale);
    
    if (validLocale) {
      setCurrentLocale(validLocale.code);
    }
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    
    // Rediriger vers la nouvelle URL avec le locale
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Vérifier si le premier segment est un locale
    const currentIsLocale = languages.some(l => l.code === pathSegments[0]);
    
    let newPath = '/';
    if (currentIsLocale) {
      // Remplacer le locale existant
      pathSegments[0] = locale;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Ajouter le locale
      if (locale !== 'fr') { // fr est la langue par défaut, pas besoin de préfixe
        newPath = '/' + locale + currentPath;
      } else {
        newPath = currentPath;
      }
    }
    
    // Si on passe de/vers français, gérer le préfixe
    if (locale === 'fr' && currentIsLocale) {
      newPath = '/' + pathSegments.slice(1).join('/');
      if (newPath === '/') newPath = '/';
    }
    
    window.location.href = newPath;
  };

  const currentLanguage = languages.find(l => l.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {language.code === currentLocale && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}