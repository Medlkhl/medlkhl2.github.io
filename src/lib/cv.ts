import { NAME } from '../data/identity.ts';
import type { Locale } from '../i18n/config.ts';
import { withBase } from './url.ts';

/** File names of the generated PDF CVs (printed from /cv/ and /de/cv/ after the build). */
const SLUG = NAME.trim().replace(/\s+/g, '-');

export const CV_PDF: Record<Locale, string> = {
  en: `${SLUG}-CV-EN.pdf`,
  de: `${SLUG}-Lebenslauf-DE.pdf`,
};

/** The HTML page each PDF is printed from (path without base). */
export const CV_SOURCE_PATH: Record<Locale, string> = { en: '/cv/', de: '/de/cv/' };

/** Link target for every "Download CV" button. */
export function cvPdfHref(locale: Locale): string {
  return withBase(`/${CV_PDF[locale]}`);
}
