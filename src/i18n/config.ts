/** Locales of the site. English is the default (served at the root), German lives under /de/. */
export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export interface LocaleMeta {
  /** Value for <html lang>. */
  htmlLang: string;
  /** BCP 47 tag used for Intl formatting. */
  intl: string;
  /** Open Graph locale. */
  og: string;
  /** Name of the language in that language. */
  label: string;
  /** Two-letter code shown in the language switch. */
  short: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { htmlLang: 'en', intl: 'en-GB', og: 'en_GB', label: 'English', short: 'EN' },
  de: { htmlLang: 'de', intl: 'de-DE', og: 'de_DE', label: 'Deutsch', short: 'DE' },
};

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'de' : 'en';
}
