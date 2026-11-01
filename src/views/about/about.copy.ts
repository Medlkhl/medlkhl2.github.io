import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the About page (/about/ and /de/about/). The summary, languages,
 * interests, education and every date come from src/data/*; the words here
 * retell facts from the CV data and the brief (section 4) without adding any.
 * Placeholders in braces ({name}, {year}, {title}, {org}) are filled in by the view.
 * The German is written for German readers, not translated line by line.
 */
export const aboutCopy = defineCopy({
  en: {
    header: {
      label: 'About',
      title: 'Software that connects people and machines',
      portraitAlt: 'Portrait of {name}',
    },
    thread: {
      label: 'The thread',
      title: 'Five steps, newest first',
      intro:
        'It started with a Kinect-driven whiteboard in {year} and runs through robotics, a hardware product and an enterprise app to on-device AI today.',
      experience: '{org} on the experience page',
      steps: {
        holobox: {
          title: 'On-device conversational AI',
          text: 'HoloBox makes a talking 3D avatar appear to stand inside a flat screen. Head-tracked off-axis projection creates the depth; speech in, a local language model running in-process in a .NET MAUI app and speech out with lip-sync carry the conversation, offline and with low latency.',
        },
        happ: {
          title: 'An enterprise app, migrated and then led',
          text: 'At Anton-Haering I moved HAPP, the internal company app, from React Native to Xamarin and connected it to internal enterprise services. As a senior engineer I then led its development: ASP.NET REST APIs, cross-platform .NET MAUI and Xamarin clients, Keycloak security and the review practice.',
        },
        gomycode: {
          title: 'A product from design to production',
          text: 'At GoMyCode I took a hardware-and-software product from design through prototyping to production: 3D design in SolidWorks, Python image processing for sign recognition and lane tracking, Blockly-based visual coding and Node.js.',
        },
        robot: {
          title: 'A humanoid robot that follows and imitates people',
          text: 'For my graduation project at Dot it I built the modules that let a humanoid robot track a person’s head with OpenCV and mirror an operator’s hand movements through Kinect skeletal tracking and inverse kinematics.',
        },
        whiteboard: {
          title: 'A projected image that responds to touch',
          text: 'During an engineering internship at Envast I built a Windows app that bridges a Kinect and a video projector, so people can use the projected image like a touchscreen.',
        },
      },
    },
    principles: {
      label: 'How I work',
      title: 'Four principles, each on the record',
      intro: 'Each one comes from my work as a senior engineer on HAPP at Anton-Haering.',
      items: [
        {
          title: 'Let audit findings drive security',
          text: 'I treat a security audit as a work list, not a formality. On HAPP I closed the vulnerabilities the audits found and implemented authentication and authorisation with Keycloak over OIDC and OAuth2.',
        },
        {
          title: 'Build for the next developer',
          text: 'Maintainability is something you design for. I refactored the HAPP codebase to MVVM and Clean Architecture, so screens stay thin, business rules stay testable and the app stays stable over the long term.',
        },
        {
          title: 'Raise the level of the team',
          text: 'Structured code reviews and one-to-one coaching are how a team gets better. I coached the development team through both and established a code-review governance framework.',
        },
        {
          title: 'Stay close to the people who use it',
          text: 'Support and fault analysis show how software behaves in real use. I supported HAPP’s users with fault analysis and problem resolution.',
        },
      ],
    },
    languages: { label: 'Languages' },
    interests: { label: 'Interests' },
    education: { label: 'Education' },
  },
  de: {
    header: {
      label: 'Über mich',
      title: 'Software, die Menschen und Maschinen verbindet',
      portraitAlt: 'Porträt von {name}',
    },
    thread: {
      label: 'Der rote Faden',
      title: 'Fünf Stationen, die neueste zuerst',
      intro:
        'Es begann {year} mit einem Kinect-gesteuerten Whiteboard und führte über Robotik, ein Hardwareprodukt und eine Unternehmens-App bis zur KI direkt auf dem Gerät.',
      experience: '{org} im Werdegang',
      steps: {
        holobox: {
          title: 'Konversations-KI direkt auf dem Gerät',
          text: 'Bei HoloBox steht ein sprechender 3D-Avatar scheinbar im Inneren eines flachen Bildschirms. Die Tiefe entsteht durch eine kopfgekoppelte Off-Axis-Projektion; das Gespräch tragen Spracheingabe, ein lokales Sprachmodell direkt im Prozess einer .NET-MAUI-App und Sprachausgabe mit Lippensynchronisation – offline und mit geringer Latenz.',
        },
        happ: {
          title: 'Eine Unternehmens-App, migriert und dann geleitet',
          text: 'Bei Anton-Haering habe ich HAPP, die interne Unternehmens-App, von React Native auf Xamarin migriert und an interne Unternehmensdienste angebunden. Als Senior-Entwickler habe ich anschließend ihre Entwicklung geleitet: ASP.NET-REST-APIs, plattformübergreifende Clients mit .NET MAUI und Xamarin, Sicherheit mit Keycloak und die Review-Praxis.',
        },
        gomycode: {
          title: 'Ein Produkt vom Entwurf bis zur Produktion',
          text: 'Bei GoMyCode habe ich ein Hardware- und Softwareprodukt vom Entwurf über das Prototyping bis zur Produktion verantwortet: 3D-Konstruktion in SolidWorks, Bildverarbeitung in Python für Schilderkennung und Spurverfolgung, visuelle Programmierung mit Blockly und Node.js.',
        },
        robot: {
          title: 'Ein humanoider Roboter, der Menschen folgt und nachahmt',
          text: 'In meinem Abschlussprojekt bei Dot it habe ich die Module entwickelt, mit denen ein humanoider Roboter den Kopf einer Person per OpenCV verfolgt und die Handbewegungen eines Bedieners über Kinect-Skeletttracking und inverse Kinematik nachahmt.',
        },
        whiteboard: {
          title: 'Eine Projektion, die auf Berührung reagiert',
          text: 'Während eines Ingenieurpraktikums bei Envast habe ich eine Windows-Anwendung als Brücke zwischen Kinect und Videoprojektor entwickelt, sodass sich die Projektion wie ein Touchscreen bedienen lässt.',
        },
      },
    },
    principles: {
      label: 'Wie ich arbeite',
      title: 'Vier Grundsätze, jeder belegt',
      intro: 'Alle vier stammen aus meiner Arbeit als Senior-Entwickler an HAPP bei Anton-Haering.',
      items: [
        {
          title: 'Sicherheit folgt den Auditbefunden',
          text: 'Ein Sicherheitsaudit ist für mich eine Arbeitsliste, keine Formalität. Bei HAPP habe ich die festgestellten Schwachstellen behoben und Authentifizierung und Autorisierung mit Keycloak über OIDC und OAuth2 umgesetzt.',
        },
        {
          title: 'Wartbarkeit von Anfang an',
          text: 'Wartbarkeit entsteht im Entwurf. Ich habe die Codebasis von HAPP in MVVM und Clean Architecture überführt, damit Oberflächen schlank, Geschäftsregeln testbar und die App langfristig stabil bleiben.',
        },
        {
          title: 'Das Team gemeinsam weiterbringen',
          text: 'Strukturierte Code-Reviews und Einzel-Coachings bringen ein Team voran. Ich habe das Entwicklungsteam mit beidem begleitet und verbindliche Regeln und Abläufe für Code-Reviews etabliert.',
        },
        {
          title: 'Nah an den Menschen, die die Software nutzen',
          text: 'Support und Fehleranalyse zeigen, wie sich Software im echten Einsatz verhält. Ich habe die Anwender von HAPP mit Fehleranalyse und Problemlösung betreut.',
        },
      ],
    },
    languages: { label: 'Sprachen' },
    interests: { label: 'Interessen' },
    education: { label: 'Ausbildung' },
  },
});

export type AboutCopy = (typeof aboutCopy)['en'];
