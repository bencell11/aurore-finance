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

// Traductions simples pour la page principale
const translations = {
  fr: {
    admin: 'Admin',
    joinWaitlist: 'Rejoindre la liste d\'attente',
    subtitle: 'Rejoignez la liste d\'attente et soyez parmi les premiers à tester Aurore Finances en version bêta.',
  },
  de: {
    admin: 'Admin',
    joinWaitlist: 'Der Warteliste beitreten',
    subtitle: 'Treten Sie der Warteliste bei und gehören Sie zu den Ersten, die Aurore Finances in der Beta-Version testen.',
  },
  it: {
    admin: 'Admin',
    joinWaitlist: 'Unisciti alla lista d\'attesa',
    subtitle: 'Unisciti alla lista d\'attesa e sii tra i primi a testare Aurore Finances in versione beta.',
  },
  en: {
    admin: 'Admin',
    joinWaitlist: 'Join the Waitlist',
    subtitle: 'Join the waitlist and be among the first to test Aurore Finances in beta.',
  },
};

export function SimpleLanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');

  useEffect(() => {
    // Récupérer la langue depuis localStorage ou le navigateur
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.split('-')[0] as Locale;
    const validLocale = languages.find(l => l.code === savedLocale || l.code === browserLocale);
    
    if (validLocale) {
      setCurrentLocale(validLocale.code);
    }

    // Émettre un événement personnalisé quand la langue change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: validLocale?.code || 'fr' }));
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    
    // Émettre un événement pour que les autres composants puissent se mettre à jour
    window.dispatchEvent(new CustomEvent('languageChange', { detail: locale }));
    
    // Recharger la page pour appliquer les traductions (solution temporaire)
    // Dans une vraie app, on utiliserait un contexte ou un state manager
    window.location.reload();
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

// Hook pour utiliser les traductions dans les composants
export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('fr');
  
  useEffect(() => {
    const savedLocale = (localStorage.getItem('locale') as Locale) || 'fr';
    setLocale(savedLocale);
    
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setLocale(customEvent.detail as Locale);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  return translations[locale] || translations.fr;
}