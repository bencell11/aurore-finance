import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Langues supportées
export const locales = ['fr', 'de', 'it', 'en'] as const;
export type Locale = typeof locales[number];

// Langue par défaut
export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});