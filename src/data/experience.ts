import { z } from 'astro/zod';
import { educationSchema, experienceSchema } from '../schemas/data.ts';

/**
 * Experience, newest first. Dates are ISO year-months.
 * Each highlight records its source (never rendered) so the copy can be audited:
 *   lebenslauf  = current German CV (primary source)
 *   english-cv  = older English CV / old site (secondary)
 *   owner-brief = facts supplied by the owner for this build
 * Team-lead title and team size are deliberately absent until confirmed (OPEN_QUESTIONS.md).
 * Stack items: product names are plain strings, descriptive items carry both languages.
 */
export const experience = z.array(experienceSchema).parse([
  {
    id: 'anton-haering-senior',
    org: 'Anton-Haering GmbH',
    location: { en: 'Bubsheim, Germany', de: 'Bubsheim, Deutschland' },
    role: { en: 'Senior Software Engineer', de: 'Senior-Softwareentwickler' },
    kind: 'employment',
    start: '2024-07',
    end: '2025-12',
    summary: {
      en: 'Led development of HAPP, the internal company app: APIs, cross-platform clients, security and the review practice.',
      de: 'Leitung der Entwicklung von HAPP, der internen Unternehmens-App: APIs, plattformübergreifende Clients, Sicherheit und Review-Praxis.',
    },
    highlights: [
      {
        en: 'Led development of HAPP, the internal company app, and secured its long-term stability and maintainability.',
        de: 'Leitete die Entwicklung des HAPP-Projekts, der internen Unternehmens-App, und sicherte ihre langfristige Stabilität und Wartbarkeit.',
        source: 'lebenslauf',
      },
      {
        en: 'Built and maintained scalable ASP.NET REST APIs for the cross-platform .NET MAUI and Xamarin apps, with smooth delivery to iOS and Android.',
        de: 'Entwickelte und pflegte skalierbare ASP.NET-REST-APIs für die plattformübergreifenden MAUI- und Xamarin-Apps – mit reibungsloser Auslieferung für iOS und Android.',
        source: 'lebenslauf',
      },
      {
        en: 'Closed the vulnerabilities found in security audits and implemented secure authentication and authorisation with Keycloak.',
        de: 'Behob die in Sicherheitsaudits festgestellten Schwachstellen und implementierte eine sichere Authentifizierung und Autorisierung mit Keycloak.',
        source: 'lebenslauf',
      },
      {
        en: 'Refactored the codebase to MVVM and Clean Architecture.',
        de: 'Überführte die Codebasis in MVVM und Clean Architecture.',
        source: 'english-cv',
      },
      {
        en: 'Coached the development team through structured code reviews and 1:1 coaching sessions.',
        de: 'Unterstützte und coachte das Entwicklungsteam durch strukturierte Code-Reviews und Einzel-Coachings.',
        source: 'lebenslauf',
      },
      {
        en: 'Established a code-review governance framework for the team.',
        de: 'Etablierte verbindliche Regeln und Abläufe für Code-Reviews im Team.',
        source: 'english-cv',
      },
      {
        en: 'Administered and maintained the deployment environments.',
        de: 'Administrierte und wartete die Bereitstellungsumgebungen.',
        source: 'lebenslauf',
      },
      {
        en: 'Supported HAPP users with fault analysis and problem resolution.',
        de: 'Betreute die Anwender des HAPP-Systems mit Support, Fehleranalyse und Problemlösung.',
        source: 'lebenslauf',
      },
    ],
    stack: [
      'C#',
      '.NET MAUI',
      'Xamarin',
      { en: 'ASP.NET REST APIs', de: 'ASP.NET-REST-APIs' },
      'Keycloak',
      'OIDC',
      'OAuth2',
      'MVVM',
      'Clean Architecture',
    ],
    work: ['happ'],
  },
  {
    id: 'anton-haering',
    org: 'Anton-Haering GmbH',
    location: { en: 'Bubsheim, Germany', de: 'Bubsheim, Deutschland' },
    role: { en: 'Software Engineer', de: 'Softwareentwickler' },
    kind: 'employment',
    start: '2021-08',
    end: '2024-06',
    summary: {
      en: 'Moved HAPP from React Native to Xamarin and connected it to internal enterprise services.',
      de: 'Migration von HAPP von React Native auf Xamarin und Anbindung an interne Unternehmensdienste.',
    },
    highlights: [
      {
        en: 'Led the strategic platform migration of HAPP from React Native to Xamarin and realigned its architecture with the company’s technology standards.',
        de: 'Führte die strategische Plattformmigration von HAPP (React Native zu Xamarin) durch und richtete die Architektur an den Technologiestandards des Unternehmens aus.',
        source: 'lebenslauf',
      },
      {
        en: 'Designed and implemented integrations with internal enterprise services, extending the app’s functionality and keeping communication between systems reliable.',
        de: 'Entwarf und implementierte Integrationen mit internen Unternehmensdiensten, die den Funktionsumfang erweiterten und die systemübergreifende Kommunikation sicherstellten.',
        source: 'lebenslauf',
      },
    ],
    stack: [
      'C#',
      'Xamarin',
      { en: 'REST APIs', de: 'REST-APIs' },
      { en: 'Enterprise integration', de: 'Anbindung von Unternehmenssystemen' },
    ],
    work: ['happ'],
  },
  {
    id: 'gomycode',
    org: 'GoMyCode',
    location: { en: 'Tunisia', de: 'Tunesien' },
    role: { en: 'Hardware & Software Engineer', de: 'Hardware- und Softwareentwickler' },
    kind: 'employment',
    start: '2020-09',
    end: '2021-08',
    summary: {
      en: 'Took a product from design through hardware, software and prototyping to production.',
      de: 'Entwicklung eines Produkts vom Entwurf über Hard- und Software und Prototyping bis zur Produktion.',
    },
    highlights: [
      {
        en: 'Took a complete product from design through hardware and software implementation, prototyping and production management.',
        de: 'Verantwortete ein komplettes Produkt – vom Design über die Hard- und Softwareumsetzung und das Prototyping bis zum Produktionsmanagement.',
        source: 'english-cv',
      },
      {
        en: 'Worked across 3D design in SolidWorks, Python image processing for sign recognition and lane tracking, Blockly-based visual coding and Node.js.',
        de: 'Arbeitete mit SolidWorks (3D-Konstruktion), Python (Bildverarbeitung für Schilderkennung und Spurverfolgung), Blockly (visuelle Programmierung) und Node.js.',
        source: 'owner-brief',
      },
    ],
    stack: [
      'SolidWorks',
      'Python',
      { en: 'Image processing', de: 'Bildverarbeitung' },
      { en: 'Sign recognition', de: 'Schilderkennung' },
      { en: 'Lane tracking', de: 'Spurverfolgung' },
      'Blockly',
      'Node.js',
    ],
    work: [],
  },
  {
    id: 'dot-it',
    org: 'Dot it',
    location: { en: 'Tunisia', de: 'Tunesien' },
    role: {
      en: 'Graduation project: Smart Humanoid Robot',
      de: 'Abschlussprojekt: Smart Humanoid Robot',
    },
    kind: 'graduation-project',
    start: '2019-02',
    end: '2020-01',
    summary: {
      en: 'Built the modules that let a humanoid robot sense its environment and act on its own.',
      de: 'Entwicklung von Modulen, mit denen ein humanoider Roboter seine Umgebung wahrnimmt und selbstständig handelt.',
    },
    highlights: [
      {
        en: 'Built the modules that let a humanoid robot interact with its environment and act autonomously.',
        de: 'Entwickelte die Module, mit denen ein humanoider Roboter mit seiner Umgebung interagiert und autonom handelt.',
        source: 'english-cv',
      },
      {
        en: 'Combined Kinect skeletal tracking, IMU data, inverse kinematics and motion capture, with a C#/WPF and Firebase control application.',
        de: 'Kombinierte Kinect-Skeletttracking, IMU-Daten, inverse Kinematik und Motion Capture mit einer Steuerungsanwendung in C#/WPF und Firebase.',
        source: 'owner-brief',
      },
    ],
    stack: [
      'Raspberry Pi',
      'Python',
      'C#',
      'WPF',
      'Firebase',
      { en: 'Kinect skeletal tracking', de: 'Kinect-Skeletttracking' },
      { en: 'IMU data', de: 'IMU-Daten' },
      { en: 'Inverse kinematics', de: 'Inverse Kinematik' },
      { en: 'Motion capture', de: 'Motion Capture' },
    ],
    work: ['humanoid-robot'],
  },
  {
    id: 'envast',
    org: 'Envast',
    location: { en: 'Tunisia', de: 'Tunesien' },
    role: {
      en: 'Engineering internship: Interactive whiteboard',
      de: 'Ingenieurpraktikum: Interaktives Whiteboard',
    },
    kind: 'internship',
    start: '2018-08',
    end: '2018-09',
    summary: {
      en: 'Turned a projected video into a touch interface with a Kinect.',
      de: 'Entwicklung einer Kinect-Anwendung, die eine projizierte Fläche in eine Touch-Oberfläche verwandelt.',
    },
    highlights: [
      {
        en: 'Built a Windows app that bridges a Kinect and a video projector, so users can interact with the projected video by touch.',
        de: 'Entwickelte eine Windows-Anwendung als Brücke zwischen Kinect und Videoprojektor, sodass Nutzer die Projektion wie einen Touchscreen bedienen können.',
        source: 'english-cv',
      },
    ],
    stack: [
      'C#',
      'WPF',
      'Kinect',
      { en: 'Image processing', de: 'Bildverarbeitung' },
      { en: 'Gesture guidance', de: 'Gestenführung' },
    ],
    work: [],
  },
]);

export const education = z.array(educationSchema).parse([
  {
    id: 'eniso',
    degree: {
      en: 'Engineering Diploma in Computer Science',
      de: 'Ingenieurdiplom – Informatik',
    },
    field: { en: 'Applied computer science', de: 'Angewandte Informatik' },
    institution: {
      en: 'National School of Engineering of Sousse (ENISo)',
      de: 'Nationale Ingenieurschule Sousse (ENISo)',
    },
    location: { en: 'Sousse, Tunisia', de: 'Sousse, Tunesien' },
    start: '2015',
    end: '2019',
  },
]);
