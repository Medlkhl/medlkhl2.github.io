import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy for the case-study template and the /work/ index. Case-study content
 * itself lives in src/content/work/<locale>/<slug>.mdx; shared strings (Home,
 * Work, status chips, "All work", external-link text) come from ui.copy.ts.
 * Strings with {title} or {generic} are filled in by the view.
 */
export const workCopy = defineCopy({
  en: {
    index: {
      label: 'Case studies',
      /** The page's statement h1 (the page title stays "Work"). */
      title: 'Projects, from outcome to architecture',
      intro:
        'Three projects, each told the same way: the result, my role and the team first, then the architecture, the hard problems and the evidence.',
      listLabel: 'Case studies',
    },
    breadcrumb: 'Breadcrumb',
    header: {
      label: 'Case study',
      facts: {
        role: 'Role',
        team: 'Team',
        timeframe: 'Timeframe',
        platforms: 'Platforms',
        stack: 'Stack',
      },
    },
    sections: {
      context: { label: 'Context and constraints', title: 'The problem and what made it hard' },
      role: { label: 'My role', title: 'What I owned, decided and led' },
      architecture: { label: 'Architecture', title: 'How the system fits together' },
      problems: { label: 'Hard problems solved', title: 'The difficult parts' },
      results: { label: 'Results', title: 'Outcomes and next steps' },
      proof: { label: 'Proof', title: 'References and evidence' },
      confidentiality: { label: 'Confidentiality' },
    },
    context: {
      constraints: 'What made it hard',
    },
    role: {
      responsibilities: 'Responsibilities',
    },
    architecture: {
      figure: 'Fig. 1',
      /** {generic} is genericNames for a confidential case study, otherwise empty. */
      caption: 'Architecture of {title}{generic}. The numbered markers match the steps.',
      genericNames: ', drawn with generic names',
      steps: 'Step by step',
      decisions: 'Key decisions and trade-offs',
      choice: 'Decision',
      tradeoff: 'Trade-off',
    },
    problems: {
      challenge: 'Challenge',
      approach: 'Approach',
      evidence: 'Evidence',
      video: 'Video',
    },
    results: {
      metrics: 'Key figures',
      outcomes: 'Outcomes',
      next: 'What I would do next',
      nextInDevelopment: 'What comes next',
      /** Heading of the "next" text on a completed project. */
      lookingBack: 'What I would do differently today',
    },
    proof: {
      wantedRecommendation: 'A recommendation from someone who worked with me on this project',
      wantedEvidence: 'Public evidence for this project',
      links: 'Links',
    },
    pager: {
      label: 'More case studies',
      previous: 'Previous case study',
      next: 'Next case study',
    },
  },
  de: {
    index: {
      label: 'Fallstudien',
      title: 'Projekte, vom Ergebnis bis zur Architektur',
      intro:
        'Drei Projekte, alle nach demselben Muster erzählt: zuerst Ergebnis, meine Rolle und das Team, dann die Architektur, die schwierigen Stellen und die Belege.',
      listLabel: 'Fallstudien',
    },
    breadcrumb: 'Pfadnavigation',
    header: {
      label: 'Fallstudie',
      facts: {
        role: 'Rolle',
        team: 'Team',
        timeframe: 'Zeitraum',
        platforms: 'Plattformen',
        stack: 'Technologien',
      },
    },
    sections: {
      context: {
        label: 'Kontext und Rahmenbedingungen',
        title: 'Die Ausgangslage und was sie schwierig machte',
      },
      role: { label: 'Meine Rolle', title: 'Was ich verantwortet, entschieden und geleitet habe' },
      architecture: { label: 'Architektur', title: 'Wie das System zusammenspielt' },
      problems: { label: 'Gelöste Herausforderungen', title: 'Die schwierigen Stellen' },
      results: { label: 'Ergebnisse', title: 'Was erreicht wurde und was folgt' },
      proof: { label: 'Belege', title: 'Referenzen und Nachweise' },
      confidentiality: { label: 'Vertraulichkeit' },
    },
    context: {
      constraints: 'Was es schwierig machte',
    },
    role: {
      responsibilities: 'Aufgaben und Verantwortung',
    },
    architecture: {
      figure: 'Abb. 1',
      caption:
        'Architektur von {title}{generic}. Die nummerierten Markierungen entsprechen den Schritten.',
      genericNames: ', mit neutralen Bezeichnungen',
      steps: 'Schritt für Schritt',
      decisions: 'Zentrale Entscheidungen und Abwägungen',
      choice: 'Entscheidung',
      tradeoff: 'Abwägung',
    },
    problems: {
      challenge: 'Herausforderung',
      approach: 'Vorgehen',
      evidence: 'Beleg',
      video: 'Video',
    },
    results: {
      metrics: 'Kennzahlen',
      outcomes: 'Ergebnisse',
      next: 'Was ich als Nächstes angehen würde',
      nextInDevelopment: 'Wie es weitergeht',
      lookingBack: 'Was ich heute anders machen würde',
    },
    proof: {
      wantedRecommendation:
        'Eine Empfehlung von jemandem, der mit mir an diesem Projekt gearbeitet hat',
      wantedEvidence: 'Öffentliche Belege zu diesem Projekt',
      links: 'Links',
    },
    pager: {
      label: 'Weitere Fallstudien',
      previous: 'Vorherige Fallstudie',
      next: 'Nächste Fallstudie',
    },
  },
});
