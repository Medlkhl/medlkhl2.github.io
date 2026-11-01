import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy for the case-study template and the /work/ index. Case-study content
 * itself lives in src/content/work/<locale>/<slug>.mdx; shared strings (Home,
 * Work, status chips, "All work", external-link text) come from ui.copy.ts.
 * Strings with {title} are filled in by the view.
 */
export const workCopy = defineCopy({
  en: {
    index: {
      label: 'Case studies',
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
      caption:
        'Architecture of {title}, drawn with generic names. The numbered markers match the steps.',
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
        'Architektur von {title}, mit neutralen Bezeichnungen. Die nummerierten Markierungen entsprechen den Schritten.',
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
