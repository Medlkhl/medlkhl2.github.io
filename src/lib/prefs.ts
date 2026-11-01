import type { Locale } from '../i18n/config.ts';

/**
 * Visitor preferences: theme, motion, 3D and language.
 *
 * - Choices persist in localStorage (strictly for the feature the visitor asked for; no cookies).
 * - The effective state honours `prefers-color-scheme`, `prefers-reduced-motion` and `Save-Data`;
 *   `watchSystemPrefs()` announces live OS changes while a preference follows the system.
 * - Every change is applied to <html> as data attributes and announced with a
 *   `prefs:change` CustomEvent on `document`, so later phases (motion layer,
 *   3D stage, command menu) subscribe instead of re-implementing this.
 *
 * Module scope is DOM-free so it can be imported at build time; DOM access
 * happens only inside functions. The inline theme script (theme-script.ts) runs
 * the same rules before first paint.
 */

export type ThemePref = 'graphite' | 'paper' | 'system';
export type MotionPref = 'full' | 'reduced' | 'system';
export type ThreeDPref = 'on' | 'off' | 'auto';

export interface Prefs {
  theme: ThemePref;
  motion: MotionPref;
  threeD: ThreeDPref;
  lang: Locale | null;
}

export type Theme = 'graphite' | 'paper';

export interface EffectivePrefs {
  theme: Theme;
  reducedMotion: boolean;
  saveData: boolean;
  /** Phase 1 has no 3D engine, so this is always false until Phase 3 wires capability detection in. */
  threeD: boolean;
}

export const PREF_KEYS = {
  theme: 'pref:theme',
  motion: 'pref:motion',
  threeD: 'pref:3d',
  lang: 'pref:lang',
} as const satisfies Record<keyof Prefs, string>;

export const PREFS_EVENT = 'prefs:change';

export interface PrefsChangeDetail {
  key: keyof Prefs;
  value: Prefs[keyof Prefs];
  prefs: Prefs;
  effective: EffectivePrefs;
}

export const DEFAULT_PREFS: Prefs = {
  theme: 'system',
  motion: 'system',
  threeD: 'auto',
  lang: null,
};

const VALID: { [K in keyof Prefs]: readonly (Prefs[K] & string)[] } = {
  theme: ['graphite', 'paper', 'system'],
  motion: ['full', 'reduced', 'system'],
  threeD: ['on', 'off', 'auto'],
  lang: ['en', 'de'],
};

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage can be unavailable (private mode, blocked); preferences then last for the page view */
  }
}

function matches(query: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;
}

/** Reads the stored preferences, falling back to defaults for missing or invalid values. */
export function getPrefs(): Prefs {
  const read = <K extends keyof Prefs>(key: K): Prefs[K] => {
    const raw = storageGet(PREF_KEYS[key]);
    return (VALID[key] as readonly string[]).includes(raw ?? '')
      ? (raw as Prefs[K])
      : DEFAULT_PREFS[key];
  };
  return {
    theme: read('theme'),
    motion: read('motion'),
    threeD: read('threeD'),
    lang: read('lang'),
  };
}

export function systemTheme(): Theme {
  return matches('(prefers-color-scheme: light)') ? 'paper' : 'graphite';
}

export function prefersReducedMotion(): boolean {
  return matches('(prefers-reduced-motion: reduce)');
}

export function saveDataEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true || matches('(prefers-reduced-data: reduce)');
}

/** Resolves stored preferences against the environment. */
export function getEffective(prefs: Prefs = getPrefs()): EffectivePrefs {
  const theme = prefs.theme === 'system' ? systemTheme() : prefs.theme;
  const reducedMotion =
    prefs.motion === 'system' ? prefersReducedMotion() : prefs.motion === 'reduced';
  const saveData = saveDataEnabled();
  return { theme, reducedMotion, saveData, threeD: false };
}

/** Writes the effective state to <html> as data attributes. */
export function applyToDocument(effective: EffectivePrefs = getEffective()): void {
  const root = document.documentElement;
  root.dataset.theme = effective.theme;
  root.dataset.motion = effective.reducedMotion ? 'reduced' : 'full';
  root.dataset.saveData = effective.saveData ? 'on' : 'off';
  root.setAttribute('data-3d', effective.threeD ? 'on' : 'off');
}

/** Applies the current state and emits `prefs:change` for one key. */
function announce<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
  const prefs = getPrefs();
  const effective = getEffective(prefs);
  applyToDocument(effective);
  document.dispatchEvent(
    new CustomEvent<PrefsChangeDetail>(PREFS_EVENT, { detail: { key, value, prefs, effective } }),
  );
}

/** Persists one preference, applies it and emits `prefs:change`. */
export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
  const isDefault = value === DEFAULT_PREFS[key];
  storageSet(PREF_KEYS[key], isDefault ? null : String(value));
  announce(key, value);
}

let watchingSystem = false;

/**
 * Applies and announces live OS changes (colour scheme, reduced motion) as
 * `prefs:change` with the value 'system', while that preference follows the
 * system. Listens for the lifetime of the document, so call it once at module
 * level (repeat calls do nothing), not on `astro:page-load`.
 */
export function watchSystemPrefs(): void {
  if (watchingSystem || typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return;
  watchingSystem = true;
  const watch = (query: string, key: 'theme' | 'motion') =>
    window.matchMedia(query).addEventListener('change', () => {
      if (getPrefs()[key] === 'system') announce(key, 'system');
    });
  watch('(prefers-color-scheme: light)', 'theme');
  watch('(prefers-reduced-motion: reduce)', 'motion');
}

/** Subscribes to preference changes; returns an unsubscribe function. */
export function onPrefsChange(callback: (detail: PrefsChangeDetail) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<PrefsChangeDetail>).detail);
  document.addEventListener(PREFS_EVENT, listener);
  return () => document.removeEventListener(PREFS_EVENT, listener);
}

/** Flips between the two themes and returns the new one. */
export function toggleTheme(): Theme {
  const next: Theme = getEffective().theme === 'graphite' ? 'paper' : 'graphite';
  setPref('theme', next);
  return next;
}
