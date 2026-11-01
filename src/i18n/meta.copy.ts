import { defineCopy } from './copy.ts';

/**
 * Title and meta description of every registered route, per locale.
 * Titles are rendered as "<title> — Mohamed Lakhel" except on the home page.
 * Case studies take their title and description from frontmatter.
 */
export interface PageMeta {
  title: string;
  description: string;
}

type MetaKey =
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
      title: 'Mohamed Lakhel — Senior Software Engineer',
      description:
        'Senior Software Engineer in Germany: cross-platform .NET (MAUI, Xamarin, ASP.NET Core, Blazor), secure enterprise apps with Keycloak and OIDC, and on-device AI.',
    },
    work: {
      title: 'Work',
      description:
        'Case studies: leading an internal enterprise app, an on-device AI avatar in .NET MAUI, and an earlier humanoid-robot project.',
    },
    experience: {
      title: 'Experience',
      description:
        'Software and hardware engineering since 2018, newest first: Anton-Haering, GoMyCode, a humanoid-robot graduation project and a Kinect internship.',
    },
    lab: {
      title: 'Lab',
      description:
        'Experiments and earlier work: the humanoid-robot archive with demo videos, a HoloBox preview and the experiments still to come.',
    },
    about: {
      title: 'About',
      description:
        'Software that connects people and machines: how a Kinect whiteboard led to robotics, enterprise apps and on-device AI, and how I work.',
    },
    cv: {
      title: 'CV',
      description:
        'The CV of Mohamed Lakhel, Senior Software Engineer: experience, skills, education and languages, also as a PDF.',
    },
    colophon: {
      title: 'Colophon',
      description:
        'How this site is built: Astro, static HTML, self-hosted fonts, no cookies, and the performance and accessibility budgets it is held to.',
    },
    impressum: {
      title: 'Legal notice (Impressum)',
      description: 'Legal notice (Impressum) under § 5 DDG. The German version is binding.',
    },
    datenschutz: {
      title: 'Privacy policy',
      description:
        'How this site handles personal data: GitHub Pages hosting and server logs, contact by email, no cookies and no analytics.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you were looking for does not exist.',
    },
  },
  de: {
    home: {
      title: 'Mohamed Lakhel — Senior-Softwareentwickler',
      description:
        'Senior-Softwareentwickler in Deutschland: plattformübergreifendes .NET (MAUI, Xamarin, ASP.NET Core, Blazor), sichere Unternehmens-Apps mit Keycloak und OIDC sowie KI direkt auf dem Gerät.',
    },
    work: {
      title: 'Projekte',
      description:
        'Fallstudien: die Leitung einer internen Unternehmens-App, ein KI-Avatar mit lokalem Sprachmodell in .NET MAUI und ein früheres Projekt mit einem humanoiden Roboter.',
    },
    experience: {
      title: 'Erfahrung',
      description:
        'Software- und Hardwareentwicklung seit 2018, neueste zuerst: Anton-Haering, GoMyCode, ein Abschlussprojekt mit humanoidem Roboter und ein Kinect-Praktikum.',
    },
    lab: {
      title: 'Lab',
      description:
        'Experimente und frühere Arbeiten: das Archiv des humanoiden Roboters mit Demovideos, ein Ausblick auf HoloBox und kommende Experimente.',
    },
    about: {
      title: 'Über mich',
      description:
        'Software, die Menschen und Maschinen verbindet: wie aus einem Kinect-Whiteboard Robotik, Unternehmens-Apps und KI auf dem Gerät wurden – und wie ich arbeite.',
    },
    cv: {
      title: 'Lebenslauf',
      description:
        'Der Lebenslauf von Mohamed Lakhel, Senior-Softwareentwickler: Erfahrung, Kenntnisse, Ausbildung und Sprachen, auch als PDF.',
    },
    colophon: {
      title: 'Kolophon',
      description:
        'Wie diese Website gebaut ist: Astro, statisches HTML, selbst gehostete Schriften, keine Cookies – und die Performance- und Barrierefreiheitsbudgets, an denen sie sich messen lässt.',
    },
    impressum: {
      title: 'Impressum',
      description: 'Impressum gemäß § 5 DDG.',
    },
    datenschutz: {
      title: 'Datenschutzerklärung',
      description:
        'Wie diese Website mit personenbezogenen Daten umgeht: Hosting bei GitHub Pages und Server-Logs, Kontakt per E-Mail, keine Cookies und keine Analyse.',
    },
    notFound: {
      title: 'Seite nicht gefunden',
      description: 'Die gesuchte Seite existiert nicht.',
    },
  },
});
