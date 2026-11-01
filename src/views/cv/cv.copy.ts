import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the HTML CV (/cv/, /de/cv/) and of the PDFs printed from it.
 * The facts themselves come from src/data/*; this module only holds labels.
 * `{name}` is replaced with NAME from src/data/identity.ts.
 */
export const cvCopy = defineCopy({
  en: {
    /** Document name: "<name> — CV" becomes the page title and the PDF title. */
    documentName: 'CV',
    /** Small label above the name. */
    kicker: 'Curriculum vitae',
    portraitAlt: 'Portrait of {name}',
    /** Shown after the city in the contact line. */
    country: 'Germany',
    contact: {
      label: 'Contact details',
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      website: 'Website',
      location: 'Location',
    },
    actions: {
      label: 'PDF versions',
      download: 'Download PDF',
      otherLanguage: 'German version (PDF)',
      note: 'A4, printed from this page.',
    },
    sections: {
      profile: 'Profile',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      interests: 'Interests',
    },
    stack: 'Stack',
    fieldOfStudy: 'Field of study',
  },
  de: {
    documentName: 'Lebenslauf',
    kicker: 'Lebenslauf',
    portraitAlt: 'Porträt von {name}',
    country: 'Deutschland',
    contact: {
      label: 'Kontaktdaten',
      email: 'E-Mail',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      website: 'Website',
      location: 'Wohnort',
    },
    actions: {
      label: 'PDF-Fassungen',
      download: 'PDF herunterladen',
      otherLanguage: 'Englische Fassung (PDF)',
      note: 'A4, aus dieser Seite erzeugt.',
    },
    sections: {
      profile: 'Profil',
      experience: 'Berufserfahrung',
      education: 'Ausbildung',
      skills: 'Kenntnisse',
      languages: 'Sprachen',
      interests: 'Interessen',
    },
    stack: 'Technologien',
    fieldOfStudy: 'Fachrichtung',
  },
});

export type CvCopy = (typeof cvCopy)['en'];
