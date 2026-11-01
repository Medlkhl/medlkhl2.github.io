import { defineCopy } from './copy.ts';

/**
 * Shared interface strings (header, footer, buttons, status chips).
 * Page-specific copy lives next to each view in its own `*.copy.ts` module.
 */
export const ui = defineCopy({
  en: {
    skipToContent: 'Skip to content',
    nav: {
      label: 'Main',
      home: 'Home',
      work: 'Work',
      experience: 'Experience',
      lab: 'Lab',
      about: 'About',
      cv: 'CV',
      contact: 'Contact',
      menu: 'Menu',
      closeMenu: 'Close menu',
    },
    language: {
      label: 'Language',
      /** Shown on English pages: link to the German version. */
      switchText: 'DE',
      switchLabel: 'Deutsch: diese Seite auf Deutsch lesen',
    },
    theme: {
      label: 'Theme',
      toPaper: 'Switch to the paper (light) theme',
      toGraphite: 'Switch to the graphite (dark) theme',
    },
    cta: {
      selectedWork: 'Selected work',
      downloadCv: 'Download CV',
      downloadCvPdf: 'Download CV (PDF)',
      contact: 'Contact',
      copyEmail: 'Copy email',
      emailCopied: 'Email copied',
      copyFailed: 'Copy failed. The address is selected, press Ctrl+C.',
      writeEmail: 'Write an email',
      readCaseStudy: 'Read the case study',
      allWork: 'All work',
      fullTimeline: 'Full timeline',
      watchVideo: 'Watch on YouTube',
      backToTop: 'Back to top',
    },
    status: {
      live: 'Live',
      internal: 'Internal',
      'in-development': 'In development',
      completed: 'Completed',
    },
    footer: {
      sitemap: 'Site',
      contact: 'Contact',
      legal: 'Legal',
      impressum: 'Legal notice (Impressum)',
      datenschutz: 'Privacy policy',
      colophon: 'Colophon',
      rights: 'All rights reserved.',
      builtWith: 'Static HTML, no cookies, no tracking.',
    },
    externalLink: '(external link)',
    placeholderLegend:
      'Bracketed marks like [METRIC: …] are placeholders for content that is still being supplied.',
  },
  de: {
    skipToContent: 'Zum Inhalt springen',
    nav: {
      label: 'Hauptnavigation',
      home: 'Start',
      work: 'Projekte',
      experience: 'Erfahrung',
      lab: 'Lab',
      about: 'Über mich',
      cv: 'Lebenslauf',
      contact: 'Kontakt',
      menu: 'Menü',
      closeMenu: 'Menü schließen',
    },
    language: {
      label: 'Sprache',
      switchText: 'EN',
      switchLabel: 'English: read this page in English',
    },
    theme: {
      label: 'Farbschema',
      toPaper: 'Zum hellen Farbschema (Papier) wechseln',
      toGraphite: 'Zum dunklen Farbschema (Graphit) wechseln',
    },
    cta: {
      selectedWork: 'Ausgewählte Projekte',
      downloadCv: 'Lebenslauf herunterladen',
      downloadCvPdf: 'Lebenslauf herunterladen (PDF)',
      contact: 'Kontakt',
      copyEmail: 'E-Mail kopieren',
      emailCopied: 'E-Mail kopiert',
      copyFailed: 'Kopieren fehlgeschlagen. Die Adresse ist markiert, bitte Strg+C drücken.',
      writeEmail: 'E-Mail schreiben',
      readCaseStudy: 'Zur Fallstudie',
      allWork: 'Alle Projekte',
      fullTimeline: 'Vollständiger Werdegang',
      watchVideo: 'Auf YouTube ansehen',
      backToTop: 'Nach oben',
    },
    status: {
      live: 'Live',
      internal: 'Intern',
      'in-development': 'In Entwicklung',
      completed: 'Abgeschlossen',
    },
    footer: {
      sitemap: 'Seiten',
      contact: 'Kontakt',
      legal: 'Rechtliches',
      impressum: 'Impressum',
      datenschutz: 'Datenschutzerklärung',
      colophon: 'Kolophon',
      rights: 'Alle Rechte vorbehalten.',
      builtWith: 'Statisches HTML, keine Cookies, kein Tracking.',
    },
    externalLink: '(externer Link)',
    placeholderLegend:
      'Markierungen in eckigen Klammern wie [METRIC: …] sind Platzhalter für Inhalte, die noch geliefert werden.',
  },
});

export type UiCopy = (typeof ui)['en'];
