import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the home page ("/" and "/de/"). Facts (name, role, stack, dates,
 * layers, skills, quotes) come from src/data/*; this module only holds the
 * page's own words. The German is written for German readers (first person
 * "ich", formal "Sie"), not translated line by line, and awaits owner review.
 */
export const homeCopy = defineCopy({
  en: {
    hero: {
      kicker: 'Portfolio',
    },
    facts: {
      title: 'Quick facts',
      role: 'Role',
      experience: 'Experience',
      coreStack: 'Core stack',
      languages: 'Languages',
      location: 'Location',
    },
    stack: {
      figure: 'Fig. 1',
      label: 'Parts list',
      title: 'Architecture, layer by layer',
      intro:
        'The stack I work across, from the interface down to delivery. Each layer links to the skills behind it and to the case studies where it matters.',
      skills: 'Skills',
      work: 'Case studies',
      drawingTitle: 'Exploded architecture',
      drawingNote: 'Isometric view · not to scale',
    },
    work: {
      label: 'Selected work',
      title: 'Three case studies, outcome first',
      intro:
        'An enterprise app whose development I led, on-device AI with a local language model, and an earlier humanoid robot. Each case study opens with the result.',
    },
    experience: {
      label: 'Experience',
      title: 'From robotics to enterprise apps',
      intro:
        'Newest first: from the enterprise app whose development I led back to a Kinect-driven whiteboard in 2018.',
      present: 'Present',
    },
    capabilities: {
      label: 'Capabilities',
      title: 'Five capabilities across the stack',
      intro: 'Skills grouped by what they deliver, each mapped to its layers in Fig. 1.',
      layers: 'Layers',
    },
    recommendations: {
      label: 'Recommendations',
      title: 'In their words',
      intro: 'What people I have studied and worked with say about my work.',
      verbatim: 'Verbatim excerpt.',
      related: 'Related case study',
    },
    contact: {
      label: 'Contact',
      title: 'Get in touch',
      intro:
        'If you are hiring for a senior engineering role, email is the most direct way to reach me.',
      email: 'Email',
      profiles: 'Profiles',
      cv: 'CV',
      location: 'Location',
    },
  },
  de: {
    hero: {
      kicker: 'Portfolio',
    },
    facts: {
      title: 'Auf einen Blick',
      role: 'Rolle',
      experience: 'Erfahrung',
      coreStack: 'Tech-Stack',
      languages: 'Sprachen',
      location: 'Standort',
    },
    stack: {
      figure: 'Abb. 1',
      label: 'Stückliste',
      title: 'Architektur, Schicht für Schicht',
      intro:
        'Der Stack, in dem ich arbeite – von der Oberfläche bis zur Auslieferung. Jede Schicht verweist auf die Kenntnisse dahinter und auf die Fallstudien, in denen sie eine Rolle spielt.',
      skills: 'Kenntnisse',
      work: 'Fallstudien',
      drawingTitle: 'Explosionszeichnung',
      drawingNote: 'Isometrie · nicht maßstäblich',
    },
    work: {
      label: 'Ausgewählte Projekte',
      title: 'Drei Fallstudien, vom Ergebnis her erzählt',
      intro:
        'Eine Unternehmens-App, deren Entwicklung ich geleitet habe, KI auf dem Gerät mit lokalem Sprachmodell und ein früherer humanoider Roboter. Jede Fallstudie beginnt mit dem Ergebnis.',
    },
    experience: {
      label: 'Erfahrung',
      title: 'Von der Robotik zur Unternehmens-App',
      intro:
        'Neueste Station zuerst: von der Unternehmens-App, deren Entwicklung ich geleitet habe, bis zurück zum Kinect-Whiteboard aus dem Jahr 2018.',
      present: 'heute',
    },
    capabilities: {
      label: 'Kompetenzen',
      title: 'Fünf Kompetenzfelder über den gesamten Stack',
      intro: 'Kenntnisse, gruppiert nach ihrem Beitrag und den Schichten aus Abb. 1 zugeordnet.',
      layers: 'Schichten',
    },
    recommendations: {
      label: 'Empfehlungen',
      title: 'In ihren Worten',
      intro: 'Was Menschen, mit denen ich studiert und gearbeitet habe, über meine Arbeit sagen.',
      verbatim: 'Wörtlicher Auszug aus dem englischen Original.',
      related: 'Zugehörige Fallstudie',
    },
    contact: {
      label: 'Kontakt',
      title: 'Schreiben Sie mir',
      intro:
        'Wenn Sie eine Senior-Position in der Softwareentwicklung besetzen, erreichen Sie mich am direktesten per E-Mail.',
      email: 'E-Mail',
      profiles: 'Profile',
      cv: 'Lebenslauf',
      location: 'Standort',
    },
  },
});

export type HomeCopy = (typeof homeCopy)['en'];
