import { defineCopy } from '../../i18n/copy.ts';

/**
 * Strings shared by the Impressum and the Datenschutzerklärung. The German
 * pages are the binding versions; the English pages say so and link to them.
 * Name and postal address stay placeholders until the owner supplies them
 * (OPEN_QUESTIONS.md); they appear only on the legal pages.
 */
export const legalCopy = defineCopy({
  en: {
    label: 'Legal',
    address: [
      '[NAME: full legal name]',
      '[ADDRESS: street and house number]',
      '[ADDRESS: postcode and city]',
      'Germany',
    ],
    email: 'Email',
    addressRef: { term: 'Postal address', link: 'see the legal notice (Impressum)' },
    version: 'Version',
    contents: 'Contents',
    notice: {
      title: 'The German version is binding',
      text: 'This English translation is provided for your convenience. Only the German version is legally binding.',
      link: 'Read the German version',
    },
  },
  de: {
    label: 'Rechtliches',
    address: [
      '[NAME: full legal name]',
      '[ADDRESS: street and house number]',
      '[ADDRESS: postcode and city]',
      'Deutschland',
    ],
    email: 'E-Mail',
    addressRef: { term: 'Anschrift', link: 'siehe Impressum' },
    version: 'Stand',
    contents: 'Inhalt',
    notice: {
      title: 'Verbindliche Fassung',
      text: 'Diese deutsche Fassung ist rechtlich verbindlich. Die englische Übersetzung dient nur der Information.',
      link: 'Englische Übersetzung lesen',
    },
  },
});
