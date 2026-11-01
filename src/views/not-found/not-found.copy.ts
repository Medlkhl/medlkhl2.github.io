import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the bilingual 404 page. GitHub Pages serves one 404.html for every
 * missing URL, so the page shows both languages at once: English first (the h1),
 * German second (an h2 with lang="de"). Titles come from meta.copy.ts.
 */
export const notFoundCopy = defineCopy({
  en: {
    language: 'English',
    status: 'Not found',
    text: 'The address may be mistyped, or the page has moved. You can continue here:',
    linksLabel: 'Pages in English',
    links: {
      home: 'Home page',
      work: 'Case studies',
      cv: 'CV',
      contact: 'Contact',
    },
  },
  de: {
    language: 'Deutsch',
    status: 'Nicht gefunden',
    text: 'Vielleicht ist die Adresse falsch geschrieben, oder die Seite ist umgezogen. Hier geht es weiter:',
    linksLabel: 'Seiten auf Deutsch',
    links: {
      home: 'Startseite',
      work: 'Fallstudien',
      cv: 'Lebenslauf',
      contact: 'Kontakt',
    },
  },
});
