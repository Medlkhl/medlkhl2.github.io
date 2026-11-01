/**
 * Typed mirror of src/styles/tokens.css for code that needs token values
 * (contrast checks, the /tokens page, Satori social images, the Phase 2 motion
 * layer and the Phase 3 scene). tests/unit/tokens.test.ts fails if the two drift.
 */

export const THEMES = ['graphite', 'paper'] as const;
export type ThemeName = (typeof THEMES)[number];

export const COLOR_ROLES = [
  'bg',
  'surface',
  'surface-2',
  'text',
  'text-muted',
  'text-subtle',
  'line',
  'line-strong',
  'accent',
  'accent-hover',
  'accent-ink',
] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];

export const colors: Record<ThemeName, Record<ColorRole, string>> = {
  graphite: {
    bg: '#101113',
    surface: '#16181b',
    'surface-2': '#1c1f23',
    text: '#ecedef',
    'text-muted': '#a8aeb7',
    'text-subtle': '#8b929c',
    line: '#2a2e34',
    'line-strong': '#6b727c',
    accent: '#6b95ff',
    'accent-hover': '#8fb0ff',
    'accent-ink': '#0a1230',
  },
  paper: {
    bg: '#f6f6f3',
    surface: '#ffffff',
    'surface-2': '#eeeeea',
    text: '#141619',
    'text-muted': '#454a52',
    'text-subtle': '#5c616a',
    line: '#dcdcd6',
    'line-strong': '#7b8089',
    accent: '#1f4bd8',
    'accent-hover': '#1738a6',
    'accent-ink': '#ffffff',
  },
};

/** Required contrast per pair (WCAG 2.2 AA): 4.5 for text, 3 for UI boundaries and large text. */
export interface ContrastPair {
  fg: ColorRole;
  bg: ColorRole;
  min: 3 | 4.5;
  use: string;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: 'text', bg: 'bg', min: 4.5, use: 'Body text' },
  { fg: 'text', bg: 'surface', min: 4.5, use: 'Text on cards' },
  { fg: 'text', bg: 'surface-2', min: 4.5, use: 'Text on raised surfaces' },
  { fg: 'text-muted', bg: 'bg', min: 4.5, use: 'Secondary text' },
  { fg: 'text-muted', bg: 'surface', min: 4.5, use: 'Secondary text on cards' },
  { fg: 'text-muted', bg: 'surface-2', min: 4.5, use: 'Secondary text on raised surfaces' },
  { fg: 'text-subtle', bg: 'bg', min: 4.5, use: 'Labels and metadata' },
  { fg: 'text-subtle', bg: 'surface', min: 4.5, use: 'Labels on cards' },
  { fg: 'text-subtle', bg: 'surface-2', min: 4.5, use: 'Labels on raised surfaces' },
  { fg: 'accent', bg: 'bg', min: 4.5, use: 'Links and active states' },
  { fg: 'accent', bg: 'surface', min: 4.5, use: 'Links on cards' },
  { fg: 'accent', bg: 'surface-2', min: 4.5, use: 'Links on raised surfaces' },
  { fg: 'accent-hover', bg: 'bg', min: 4.5, use: 'Hovered links' },
  { fg: 'accent-ink', bg: 'accent', min: 4.5, use: 'Text on the primary button' },
  { fg: 'line-strong', bg: 'bg', min: 3, use: 'Control borders' },
  { fg: 'line-strong', bg: 'surface', min: 3, use: 'Control borders on cards' },
  { fg: 'line-strong', bg: 'surface-2', min: 3, use: 'Control borders on raised surfaces' },
  { fg: 'accent', bg: 'bg', min: 3, use: 'Focus ring' },
];

/** Type scale (rem at the min and max viewport) for code; CSS uses clamp() from tokens.css. */
export const typeScale = {
  '-2': [0.75, 0.75],
  '-1': [0.8125, 0.875],
  '0': [1, 1.0625],
  '1': [1.2, 1.3281],
  '2': [1.44, 1.6602],
  '3': [1.728, 2.0752],
  '4': [2.0736, 2.594],
  '5': [2.4883, 3.2425],
  '6': [2.986, 4.0531],
} as const;

/** 8px spacing scale in rem. */
export const space = {
  half: 0.25,
  1: 0.5,
  2: 1,
  3: 1.5,
  4: 2,
  5: 2.5,
  6: 3,
  8: 4,
  10: 5,
  12: 6,
  16: 8,
} as const;

export const grid = {
  columns: 12,
  containerMaxRem: 76,
  headerHeightRem: 4,
  blueprintCellPx: 24,
} as const;

export const radii = { 0: 0, 1: 2, 2: 4, 3: 8, pill: 999 } as const;

/** Target sizes in rem (WCAG 2.2 AA): 24px minimum for inline links, 44px for controls. */
export const targets = { minRem: 1.5, controlRem: 2.75 } as const;

/**
 * Print (the A4 CV sheet): the paper palette on a white page (bg) without
 * shadows, a 9.5pt root that every rem token scales with, page margins and
 * the printed portrait size.
 */
export const print = {
  bg: '#ffffff',
  fontSizePt: 9.5,
  leading: 1.42,
  marginMm: { top: 15, side: 17, bottom: 17 },
  photoMm: 26,
} as const;

export const zIndex = {
  stage: 0,
  content: 1,
  header: 50,
  overlay: 80,
  dialog: 100,
  toast: 110,
  skip: 120,
} as const;

export const breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;

/** Motion tokens (brief §7): CSS easing for the DOM, GSAP ease names for Phase 2. */
export const motion = {
  micro: { ms: 150, css: 'cubic-bezier(0.215, 0.61, 0.355, 1)', gsap: 'power2.out' },
  standard: { ms: 300, css: 'cubic-bezier(0.165, 0.84, 0.44, 1)', gsap: 'power3.out' },
  emphasis: { ms: 600, css: 'cubic-bezier(0.19, 1, 0.22, 1)', gsap: 'expo.out' },
  page: { ms: 450, css: 'cubic-bezier(0.77, 0, 0.175, 1)', gsap: 'power3.inOut' },
  camera: {
    ms: 1400,
    minMs: 1200,
    maxMs: 1600,
    css: 'cubic-bezier(0.7, 0, 0.2, 1)',
    /** Registered as a CustomEase named "camera" in Phase 2. */
    gsap: 'camera',
    customEase: 'M0,0 C0.7,0 0.2,1 1,1',
  },
  staggerMs: 40,
} as const;
