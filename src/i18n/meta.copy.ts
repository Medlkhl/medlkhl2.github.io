import { NAME } from '../data/identity.ts';
import { defineCopy } from './copy.ts';

/**
 * Head metadata of every registered route, per locale, plus the text of the
 * social images (src/lib/og/cards.ts) and the templates the SEO component fills in.
 *
 * Rules (checked by tests/unit/seo.test.ts):
 * - Titles are rendered as "<title> — NAME" (a title that already contains
 *   the name is used as is) and stay at 60 characters or fewer. The name
 *   always comes from NAME (src/data/identity.ts), never a literal.
 * - Descriptions of indexable pages are 110–160 characters.
 * - Titles and descriptions are unique across both locales.
 * - Case studies take their title and description from frontmatter; the SEO
 *   component adds "· Case study" / "· Fallstudie" so the twins stay distinct.
 * - Templates use {title}, {name} and {role}; nothing here may state a fact
 *   that is not in src/data/* or the brief.
 */
export interface PageMeta {
  /** Page name for <title>, without the site name. */
  title: string;
  /** Meta description (110–160 characters for indexable pages). */
  description: string;
}

export type MetaKey =
  | 'home'
  | 'work'
  | 'experience'
  | 'lab'
  | 'about'
  | 'cv'
  | 'colophon'
  | 'impressum'
  | 'datenschutz'
  | 'notFound';

export const pageMeta = defineCopy<Record<MetaKey, PageMeta>>({
  en: {
    home: {
      title: `${NAME} — Senior Software Engineer in Germany`,
      description:
        'Senior Software Engineer in Tuttlingen, Germany: cross-platform .NET apps with MAUI, Xamarin and Blazor, ASP.NET Core APIs, Keycloak security and on-device AI.',
    },
    work: {
      title: 'Work',
      description:
        'Case studies: migrating and then leading an internal enterprise app, an on-device AI avatar in .NET MAUI, and a humanoid robot from my graduation project.',
    },
    experience: {
      title: 'Experience',
      description:
        'Software and hardware engineering since 2018, newest first: two roles at Anton-Haering, GoMyCode, a humanoid-robot graduation project and a Kinect internship.',
    },
    lab: {
      title: 'Lab: experiments and earlier work',
      description:
        'A preview of HoloBox, the archive of my humanoid robot with its demo videos on YouTube, and the small experiments that will appear here next.',
    },
    about: {
      title: 'About',
      description:
        'Software that connects people and machines: how a Kinect whiteboard led to robotics, enterprise apps and on-device AI, and how I work as an engineer.',
    },
    cv: {
      title: 'CV',
      description:
        `The CV of ${NAME}, Senior Software Engineer: experience, skills, education and languages, with PDF versions to download in English and German.`,
    },
    colophon: {
      title: 'Colophon',
      description:
        'How this site is built: Astro and static HTML, self-hosted fonts, no cookies and no tracking, and the performance and accessibility budgets it is held to.',
    },
    impressum: {
      title: 'Legal notice (Impressum)',
      description:
        'Legal notice for this website under § 5 DDG: who is responsible for it and how to reach me by email. The German version is the legally binding one.',
    },
    datenschutz: {
      title: 'Privacy policy',
      description:
        'How this website handles personal data: hosting on GitHub Pages and its server logs, contact by email, your rights, and no cookies, analytics or tracking.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you were looking for does not exist or has moved.',
    },
  },
  de: {
    home: {
      title: `${NAME} — Senior-Softwareentwickler in Deutschland`,
      description:
        'Senior-Softwareentwickler in Tuttlingen: plattformübergreifende .NET-Apps (MAUI, Xamarin, Blazor), ASP.NET-Core-APIs, Sicherheit mit Keycloak und lokale KI.',
    },
    work: {
      title: 'Projekte',
      description:
        'Fallstudien: Migration und Entwicklungsleitung einer internen Unternehmens-App, ein KI-Avatar mit lokalem Sprachmodell und ein humanoider Roboter.',
    },
    experience: {
      title: 'Erfahrung',
      description:
        'Software- und Hardwareentwicklung seit 2018: zwei Rollen bei Anton-Haering, GoMyCode, ein Abschlussprojekt mit humanoidem Roboter und ein Kinect-Praktikum.',
    },
    lab: {
      title: 'Lab: Experimente und frühere Arbeiten',
      description:
        'Ein Ausblick auf HoloBox, das Archiv meines humanoiden Roboters mit Demovideos auf YouTube und die kleinen Experimente, die hier als Nächstes erscheinen.',
    },
    about: {
      title: 'Über mich',
      description:
        'Software, die Menschen und Maschinen verbindet: wie aus einem Kinect-Whiteboard Robotik, Unternehmens-Apps und KI auf dem Gerät wurden – und wie ich arbeite.',
    },
    cv: {
      title: 'Lebenslauf',
      description:
        `Der Lebenslauf von ${NAME}, Senior-Softwareentwickler: Erfahrung, Kenntnisse, Ausbildung und Sprachen, als PDF auf Deutsch und Englisch zum Download.`,
    },
    colophon: {
      title: 'Kolophon',
      description:
        'Astro, statisches HTML, selbst gehostete Schriften, keine Cookies, kein Tracking: wie diese Website gebaut ist und an welchen Budgets sie sich messen lässt.',
    },
    impressum: {
      title: 'Impressum',
      description:
        'Impressum dieser Website nach § 5 DDG: wer für die Inhalte verantwortlich ist und wie Sie mich per E-Mail erreichen. Diese deutsche Fassung ist verbindlich.',
    },
    datenschutz: {
      title: 'Datenschutzerklärung',
      description:
        'Wie diese Website mit Ihren Daten umgeht: Hosting bei GitHub Pages und Server-Logs, Kontakt per E-Mail, Ihre Rechte – ohne Cookies, Analyse oder Tracking.',
    },
    notFound: {
      title: 'Seite nicht gefunden',
      description: 'Die gesuchte Seite gibt es nicht, oder sie ist umgezogen.',
    },
  },
});

/** Templates the SEO component fills in ({title}, {name}, {role}). */
export const metaTemplates = defineCopy({
  en: {
    /** Case-study titles, so "HAPP" and its German twin get distinct titles. */
    caseStudyTitle: '{title} · Case study',
    /** Used while a case study's summary still contains a placeholder (none may reach a snippet). */
    caseStudyDescription:
      '{title}: a case study by {name}, {role}, from the context and my role to the architecture and the results.',
    /** Same rule for any other page whose description still contains a placeholder. */
    pageDescription:
      '{title}: part of the portfolio of {name}, {role} in Germany, with case studies, experience, CV and contact.',
    /** og:image:alt and twitter:image:alt; {title} is the full page title. */
    imageAlt: '{title}: title card with a drawing of stacked architecture layers',
  },
  de: {
    caseStudyTitle: '{title} · Fallstudie',
    caseStudyDescription:
      '{title}: eine Fallstudie von {name}, {role} – vom Kontext und meiner Rolle bis zur Architektur und den Ergebnissen.',
    pageDescription:
      '{title}: Teil des Portfolios von {name}, {role} in Deutschland – mit Fallstudien, Werdegang, Lebenslauf und Kontakt.',
    imageAlt: '{title}: Titelkarte mit einer Zeichnung gestapelter Architekturschichten',
  },
});

/** Text on the social image of each page (kicker label, headline, lede). The home card is built from src/data/profile.ts. */
export interface SocialCardCopy {
  /** Mono kicker label; the number in front comes from src/lib/og/cards.ts. */
  label: string;
  headline: string;
  /** One sentence, at most about 110 characters (three lines on the card). */
  lede: string;
}

export type SocialCardKey = Exclude<MetaKey, 'home' | 'notFound'>;

export const socialCopy = defineCopy({
  en: {
    cards: {
      work: {
        label: 'Work',
        headline: 'Case studies',
        lede: 'Migrating and then leading an internal enterprise app, an on-device AI avatar and a humanoid robot.',
      },
      experience: {
        label: 'Experience',
        headline: 'From robotics to enterprise apps',
        lede: 'Software and hardware engineering since 2018, newest first.',
      },
      lab: {
        label: 'Lab',
        headline: 'Experiments and an archive',
        lede: 'A preview of HoloBox and the archive of my humanoid robot, with its demo videos.',
      },
      about: {
        label: 'About',
        headline: 'Software that connects people and machines',
        lede: 'From a Kinect whiteboard to robotics, enterprise apps and on-device AI.',
      },
      cv: {
        label: 'CV',
        headline: 'My CV at a glance',
        lede: 'Experience, skills, education and languages. As a PDF in English and German.',
      },
      colophon: {
        label: 'Colophon',
        headline: 'How this site is built',
        lede: 'Astro, static HTML and self-hosted fonts. No cookies, no tracking, strict budgets.',
      },
      impressum: {
        label: 'Legal',
        headline: 'Legal notice',
        lede: 'Information under § 5 DDG. The German version is legally binding.',
      },
      datenschutz: {
        label: 'Legal',
        headline: 'Privacy policy',
        lede: 'Hosted on GitHub Pages. No cookies, no analytics, no tracking.',
      },
    } satisfies Record<SocialCardKey, SocialCardCopy>,
    caseStudy: 'Case study',
    layer: 'Layer',
  },
  de: {
    cards: {
      work: {
        label: 'Projekte',
        headline: 'Fallstudien',
        lede: 'Migration und Entwicklungsleitung einer Unternehmens-App, ein KI-Avatar mit lokalem Sprachmodell und ein humanoider Roboter.',
      },
      experience: {
        label: 'Erfahrung',
        headline: 'Von der Robotik zu Unternehmens-Apps',
        lede: 'Software- und Hardwareentwicklung seit 2018, die neueste Station zuerst.',
      },
      lab: {
        label: 'Lab',
        headline: 'Experimente und ein Archiv',
        lede: 'Ein Ausblick auf HoloBox und das Archiv meines humanoiden Roboters mit seinen Demovideos.',
      },
      about: {
        label: 'Über mich',
        headline: 'Software, die Menschen und Maschinen verbindet',
        lede: 'Vom Kinect-Whiteboard über die Robotik zu Unternehmens-Apps und KI auf dem Gerät.',
      },
      cv: {
        label: 'Lebenslauf',
        headline: 'Mein Lebenslauf auf einen Blick',
        lede: 'Erfahrung, Kenntnisse, Ausbildung und Sprachen. Als PDF auf Deutsch und Englisch.',
      },
      colophon: {
        label: 'Kolophon',
        headline: 'Wie diese Website gebaut ist',
        lede: 'Astro, statisches HTML und selbst gehostete Schriften. Keine Cookies, kein Tracking, klare Budgets.',
      },
      impressum: {
        label: 'Rechtliches',
        headline: 'Impressum',
        lede: 'Angaben gemäß § 5 DDG und der Weg, mich per E-Mail zu erreichen.',
      },
      datenschutz: {
        label: 'Rechtliches',
        headline: 'Datenschutzerklärung',
        lede: 'Gehostet bei GitHub Pages. Keine Cookies, keine Analyse, kein Tracking.',
      },
    } satisfies Record<SocialCardKey, SocialCardCopy>,
    caseStudy: 'Fallstudie',
    layer: 'Schicht',
  },
});

/** Replaces {key} tokens in a template; unknown tokens are left untouched. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => values[key] ?? token);
}
