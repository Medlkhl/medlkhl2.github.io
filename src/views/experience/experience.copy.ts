import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the Experience page (/experience/ and /de/experience/). The facts
 * (roles, organisations, dates, highlights, stack, education) come from
 * src/data/experience.ts; this module only holds the page's own words.
 * Placeholders in braces ({year}, {title}) are filled in by the view.
 * The German is written for German readers, not translated line by line.
 */
export const experienceCopy = defineCopy({
  en: {
    header: {
      label: 'Experience',
      title: 'Building software and hardware since {year}',
      intro:
        'Every role, newest first: what I was responsible for, what I delivered, the stack and the case study behind it. My CV is generated from the same data.',
      cvOnline: 'Read the CV online',
    },
    timeline: {
      label: 'Timeline',
      listLabel: 'Roles, newest first',
      duration: 'Duration',
      stack: 'Stack',
      caseStudy: 'Case study: {title}',
    },
    education: {
      label: 'Education',
    },
    cv: {
      label: 'CV',
      text: 'The same timeline as a PDF, generated from this data in English and German.',
      otherLanguage: 'German version (PDF)',
    },
  },
  de: {
    header: {
      label: 'Erfahrung',
      title: 'Seit {year} entwickle ich Software und Hardware',
      intro:
        'Alle Stationen, die neueste zuerst: wofür ich verantwortlich war, was ich umgesetzt habe, der Tech-Stack und die passende Fallstudie. Mein Lebenslauf entsteht aus denselben Daten.',
      cvOnline: 'Lebenslauf online lesen',
    },
    timeline: {
      label: 'Werdegang',
      listLabel: 'Stationen, die neueste zuerst',
      duration: 'Dauer',
      stack: 'Tech-Stack',
      caseStudy: 'Fallstudie: {title}',
    },
    education: {
      label: 'Ausbildung',
    },
    cv: {
      label: 'Lebenslauf',
      text: 'Derselbe Werdegang als PDF, aus diesen Daten erzeugt – auf Deutsch und auf Englisch.',
      otherLanguage: 'Englische Version (PDF)',
    },
  },
});

export type ExperienceCopy = (typeof experienceCopy)['en'];
