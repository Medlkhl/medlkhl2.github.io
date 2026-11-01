import { defineCopy } from '../../i18n/copy.ts';

/**
 * Copy of the Colophon page (/colophon/ and /de/colophon/): the stack, the
 * principles, the budgets of brief section 10 and the credits. Every claim
 * describes how the repo actually works; tools of later phases are labelled
 * as planned. Measured values stay placeholders until they are recorded at launch.
 * The German is written for German readers, not translated line by line.
 */
export const colophonCopy = defineCopy({
  en: {
    header: {
      label: 'Colophon',
      title: 'How this site is built',
      intro:
        'Static HTML first, everything self-hosted, no cookies and no tracking, held to budgets that are measured rather than eyeballed. One typed source produces these pages, the PDF CVs and the structured data.',
      built: 'Last built',
    },
    stack: {
      label: 'Stack',
      title: 'What it is built with',
      intro:
        'A small toolset, chosen so that every page works as plain HTML and every quality gate runs in continuous integration.',
      inUse: 'In use',
      later: 'Later phases',
      items: [
        {
          role: 'Framework',
          tool: 'Astro 6, static output',
          note: 'Plain HTML for every page, with zero JavaScript by default.',
        },
        {
          role: 'Language',
          tool: 'TypeScript, strict',
          note: 'Data, copy and components are type-checked; a missing translation is a type error.',
        },
        {
          role: 'Content',
          tool: 'MDX and typed data',
          note: 'Case studies in MDX, CV data validated with Zod at build time.',
        },
        {
          role: 'Typefaces',
          tool: 'Geist Sans and Geist Mono',
          note: 'Self-hosted through the Astro Fonts API; only the Latin subsets are preloaded.',
        },
        {
          role: 'Social images',
          tool: 'Satori and resvg',
          note: 'Rendered at build time for every page and language, in the site’s own drawing style.',
        },
        {
          role: 'Tests and PDF CVs',
          tool: 'Playwright',
          note: 'End-to-end tests on every route, and the PDF CVs printed from the CV page.',
        },
        {
          role: 'Unit tests',
          tool: 'Vitest',
          note: 'Schemas, formatting, URLs, design tokens and the parity of both languages.',
        },
        {
          role: 'Accessibility',
          tool: 'axe',
          note: 'WCAG 2.2 AA checks on every page, in both themes.',
        },
        {
          role: 'Performance',
          tool: 'Lighthouse CI',
          note: 'Mobile and desktop runs on every public page.',
        },
        {
          role: 'Hosting',
          tool: 'GitHub Pages',
          note: 'Deployed by GitHub Actions from the default branch.',
        },
      ],
      laterItems: [
        {
          role: '3D',
          tool: 'three.js on WebGPU with TSL',
          note: 'One persistent canvas as a progressive enhancement, with a WebGL 2 fallback.',
        },
        {
          role: 'Motion',
          tool: 'GSAP and Lenis',
          note: 'Scroll and text motion, with a reduced-motion path for every animation.',
        },
      ],
    },
    principles: {
      label: 'Principles',
      title: 'Seven rules it keeps',
      items: [
        {
          title: 'Static HTML first',
          text: 'Every page is complete, readable HTML before any script runs. 3D and motion arrive later, and only as enhancements.',
        },
        {
          title: 'Zero third-party requests',
          text: 'Fonts, scripts and images are served from this site. Videos are linked, never embedded.',
        },
        {
          title: 'No cookies, no analytics',
          text: 'Nothing is tracked. Your choice of theme and language stays in your browser’s local storage.',
        },
        {
          title: 'Progressive enhancement',
          text: 'JavaScript only adds conveniences, such as the theme switch and copying the email address. Everything else works without it.',
        },
        {
          title: 'WCAG 2.2 AA',
          text: 'Keyboard access, visible focus, sufficient contrast in both themes, and axe checks on every page.',
        },
        {
          title: 'One typed source',
          text: 'The same validated data generates the pages, the PDF CVs and the structured data, so they never drift apart.',
        },
        {
          title: 'Bilingual',
          text: 'Every page exists in English and German; the German version lives under /de/ with the same path.',
        },
      ],
    },
    budgets: {
      label: 'Budgets',
      title: 'Numbers decide when work is done',
      intro:
        'The targets come from the project brief and are checked at every phase gate. The measured values are recorded at launch.',
      caption: 'Performance budget',
      columns: {
        metric: 'Metric',
        target: 'Target',
        measuredWith: 'Measured with',
        measured: 'Measured',
      },
      measuredPlaceholder: '[METRIC: recorded at launch]',
      groups: [
        {
          title: 'Every page',
          rows: [
            {
              metric: 'Largest Contentful Paint',
              target: '≤ 2.5 s on mobile',
              measuredWith: 'Lighthouse CI, PageSpeed Insights',
            },
            {
              metric: 'Interaction to Next Paint',
              target: '≤ 200 ms',
              measuredWith: 'web-vitals library, DevTools',
            },
            {
              metric: 'Cumulative Layout Shift',
              target: '≤ 0.1',
              measuredWith: 'Lighthouse CI',
            },
            {
              metric: 'JavaScript before 3D (gzip)',
              target: '≤ 90 KB per content page',
              measuredWith: 'Bundle report',
            },
            {
              metric: 'Lighthouse on classic pages',
              target: '≥ 95 in all four categories',
              measuredWith: 'Lighthouse CI',
            },
          ],
        },
        {
          title: 'Accessibility (WCAG 2.2 AA)',
          rows: [
            {
              metric: 'Serious axe issues',
              target: '0, in both themes',
              measuredWith: 'axe in Playwright',
            },
            {
              metric: 'Text contrast',
              target: '≥\u00a04.5:1; ≥\u00a03:1 for large text and controls',
              measuredWith: 'Token unit tests, axe',
            },
            {
              metric: 'Touch targets',
              target: '≥\u00a024\u00a0×\u00a024\u00a0CSS\u00a0px; 44\u00a0px for controls',
              measuredWith: 'axe (target size)',
            },
          ],
        },
        {
          title: '3D stage (planned)',
          rows: [
            {
              metric: '3D engine chunk',
              target: 'Loaded only after first paint, or on demand',
              measuredWith: 'Network panel',
            },
            {
              metric: '3D assets on first load',
              target: '≤ 5 MB transferred',
              measuredWith: 'Network panel',
            },
            {
              metric: 'Hero stack model',
              target: '≤ 30k triangles, ≤ 1 MB',
              measuredWith: 'gltf-transform inspect',
            },
            {
              metric: 'Scene in view',
              target: '≤ 300k triangles on desktop, ≤ 150k on mobile',
              measuredWith: 'renderer.info',
            },
            {
              metric: 'Draw calls',
              target: '≤ 100 on desktop, ≤ 60 on mobile',
              measuredWith: 'renderer.info',
            },
            {
              metric: 'Frame rate',
              target: '60 fps on a mid-range laptop, ≥ 30 fps on a mid-range Android phone',
              measuredWith: 'In-app frame-time meter',
            },
          ],
        },
      ],
      footnote:
        'The first three rows are Google’s “good” Core Web Vitals limits at the 75th percentile of visits; the rest are this project’s own targets.',
    },
    credits: {
      label: 'Credits',
      fonts:
        'Geist Sans and Geist Mono by Vercel and basement.studio, released under the SIL Open Font License 1.1.',
      geist: 'Geist on GitHub',
      licence: 'SIL Open Font License 1.1',
      drawn: 'Icons, diagrams and social images are drawn in code for this site.',
    },
  },
  de: {
    header: {
      label: 'Kolophon',
      title: 'Wie diese Website gebaut ist',
      intro:
        'Zuerst statisches HTML, alles selbst gehostet, keine Cookies und kein Tracking – gemessen an Budgets, die geprüft statt geschätzt werden. Eine einzige typisierte Quelle erzeugt diese Seiten, die PDF-Lebensläufe und die strukturierten Daten.',
      built: 'Zuletzt gebaut am',
    },
    stack: {
      label: 'Stack',
      title: 'Womit sie gebaut ist',
      intro:
        'Ein kleiner Werkzeugkasten, so gewählt, dass jede Seite als reines HTML funktioniert und jede Qualitätsprüfung in der Continuous Integration läuft.',
      inUse: 'Im Einsatz',
      later: 'Spätere Phasen',
      items: [
        {
          role: 'Framework',
          tool: 'Astro 6, statische Ausgabe',
          note: 'Reines HTML für jede Seite, standardmäßig ohne JavaScript.',
        },
        {
          role: 'Sprache',
          tool: 'TypeScript, strikt',
          note: 'Daten, Texte und Komponenten sind typgeprüft; eine fehlende Übersetzung ist ein Typfehler.',
        },
        {
          role: 'Inhalte',
          tool: 'MDX und typisierte Daten',
          note: 'Fallstudien in MDX, Lebenslaufdaten beim Build mit Zod validiert.',
        },
        {
          role: 'Schriften',
          tool: 'Geist Sans und Geist Mono',
          note: 'Selbst gehostet über die Astro Fonts API; vorab geladen werden nur die lateinischen Teilmengen.',
        },
        {
          role: 'Social Images',
          tool: 'Satori und resvg',
          note: 'Beim Build für jede Seite und Sprache im Zeichenstil der Website erzeugt.',
        },
        {
          role: 'Tests und PDF-Lebensläufe',
          tool: 'Playwright',
          note: 'End-to-End-Tests auf jeder Route; die PDF-Lebensläufe werden aus der Lebenslauf-Seite gedruckt.',
        },
        {
          role: 'Unit-Tests',
          tool: 'Vitest',
          note: 'Schemas, Formatierung, URLs, Design-Tokens und die Parität beider Sprachen.',
        },
        {
          role: 'Barrierefreiheit',
          tool: 'axe',
          note: 'Prüfungen nach WCAG 2.2 AA auf jeder Seite, in beiden Farbschemata.',
        },
        {
          role: 'Performance',
          tool: 'Lighthouse CI',
          note: 'Messläufe für Mobil und Desktop auf jeder öffentlichen Seite.',
        },
        {
          role: 'Hosting',
          tool: 'GitHub Pages',
          note: 'Ausgeliefert per GitHub Actions aus dem Hauptbranch.',
        },
      ],
      laterItems: [
        {
          role: '3D',
          tool: 'three.js auf WebGPU mit TSL',
          note: 'Ein dauerhaftes Canvas als progressive Erweiterung, mit WebGL 2 als Rückfallebene.',
        },
        {
          role: 'Bewegung',
          tool: 'GSAP und Lenis',
          note: 'Scroll- und Textanimationen, jede mit einer Variante für reduzierte Bewegung.',
        },
      ],
    },
    principles: {
      label: 'Grundsätze',
      title: 'Sieben Regeln, an die sie sich hält',
      items: [
        {
          title: 'Zuerst statisches HTML',
          text: 'Jede Seite ist vollständiges, lesbares HTML, bevor ein Skript läuft. 3D und Animationen kommen später hinzu, und nur als Ergänzung.',
        },
        {
          title: 'Keine Anfragen an Dritte',
          text: 'Schriften, Skripte und Bilder kommen von dieser Website. Videos werden verlinkt, nie eingebettet.',
        },
        {
          title: 'Keine Cookies, keine Analyse',
          text: 'Nichts wird getrackt. Ihre Wahl von Farbschema und Sprache bleibt im lokalen Speicher Ihres Browsers.',
        },
        {
          title: 'Progressive Enhancement',
          text: 'JavaScript ergänzt nur Komfortfunktionen wie den Wechsel des Farbschemas oder das Kopieren der E-Mail-Adresse. Alles andere funktioniert auch ohne.',
        },
        {
          title: 'WCAG 2.2 AA',
          text: 'Bedienbar per Tastatur, sichtbarer Fokus, ausreichender Kontrast in beiden Farbschemata und axe-Prüfungen auf jeder Seite.',
        },
        {
          title: 'Eine typisierte Quelle',
          text: 'Dieselben validierten Daten erzeugen die Seiten, die PDF-Lebensläufe und die strukturierten Daten, damit nichts auseinanderläuft.',
        },
        {
          title: 'Zweisprachig',
          text: 'Jede Seite gibt es auf Englisch und auf Deutsch; die deutsche Fassung liegt unter /de/ mit demselben Pfad.',
        },
      ],
    },
    budgets: {
      label: 'Budgets',
      title: 'Zahlen entscheiden, wann etwas fertig ist',
      intro:
        'Die Zielwerte stammen aus dem Projektbriefing und werden bei jedem Phasenabschluss geprüft. Die Messwerte werden zum Launch erfasst.',
      caption: 'Performance-Budget',
      columns: {
        metric: 'Kennzahl',
        target: 'Zielwert',
        measuredWith: 'Gemessen mit',
        measured: 'Gemessen',
      },
      measuredPlaceholder: '[METRIC: Messung zum Launch]',
      groups: [
        {
          title: 'Jede Seite',
          rows: [
            {
              metric: 'Largest Contentful Paint',
              target: '≤ 2,5 s auf Mobilgeräten',
              measuredWith: 'Lighthouse CI, PageSpeed Insights',
            },
            {
              metric: 'Interaction to Next Paint',
              target: '≤ 200 ms',
              measuredWith: 'web-vitals-Bibliothek, DevTools',
            },
            {
              metric: 'Cumulative Layout Shift',
              target: '≤ 0,1',
              measuredWith: 'Lighthouse CI',
            },
            {
              metric: 'JavaScript vor 3D (gzip)',
              target: '≤ 90 KB pro Inhaltsseite',
              measuredWith: 'Bundle-Report',
            },
            {
              metric: 'Lighthouse auf klassischen Seiten',
              target: '≥ 95 in allen vier Kategorien',
              measuredWith: 'Lighthouse CI',
            },
          ],
        },
        {
          title: 'Barrierefreiheit (WCAG 2.2 AA)',
          rows: [
            {
              metric: 'Schwerwiegende axe-Befunde',
              target: '0, in beiden Farbschemata',
              measuredWith: 'axe in Playwright',
            },
            {
              metric: 'Textkontrast',
              target: '≥\u00a04,5:1; ≥\u00a03:1 für große Schrift und Bedienelemente',
              measuredWith: 'Unit-Tests der Tokens, axe',
            },
            {
              metric: 'Zielgrößen',
              target: '≥\u00a024\u00a0×\u00a024\u00a0CSS-px; 44\u00a0px für Bedienelemente',
              measuredWith: 'axe (Zielgröße)',
            },
          ],
        },
        {
          title: '3D-Bühne (geplant)',
          rows: [
            {
              metric: '3D-Engine-Chunk',
              target: 'Erst nach dem ersten Rendern oder bei Bedarf geladen',
              measuredWith: 'Netzwerk-Panel',
            },
            {
              metric: '3D-Assets beim ersten Laden',
              target: '≤ 5 MB übertragen',
              measuredWith: 'Netzwerk-Panel',
            },
            {
              metric: 'Modell des Hero-Stacks',
              target: '≤ 30.000 Dreiecke, ≤ 1 MB',
              measuredWith: 'gltf-transform inspect',
            },
            {
              metric: 'Szene im Bild',
              target: '≤ 300.000 Dreiecke auf dem Desktop, ≤ 150.000 auf Mobilgeräten',
              measuredWith: 'renderer.info',
            },
            {
              metric: 'Draw Calls',
              target: '≤ 100 auf dem Desktop, ≤ 60 auf Mobilgeräten',
              measuredWith: 'renderer.info',
            },
            {
              metric: 'Bildrate',
              target:
                '60 fps auf einem Mittelklasse-Laptop, ≥ 30 fps auf einem Android-Smartphone der Mittelklasse',
              measuredWith: 'Frame-Time-Messung in der App',
            },
          ],
        },
      ],
      footnote:
        'Die ersten drei Zeilen sind Googles Grenzwerte für „gute“ Core Web Vitals beim 75. Perzentil der Seitenaufrufe; die übrigen sind eigene Zielwerte dieses Projekts.',
    },
    credits: {
      label: 'Nachweise',
      fonts:
        'Geist Sans und Geist Mono von Vercel und basement.studio, veröffentlicht unter der SIL Open Font License 1.1.',
      geist: 'Geist auf GitHub',
      licence: 'SIL Open Font License 1.1',
      drawn: 'Icons, Diagramme und Social Images sind für diese Website im Code gezeichnet.',
    },
  },
});

export type ColophonCopy = (typeof colophonCopy)['en'];
