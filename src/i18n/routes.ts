import { ensureTrailingSlash, withBase } from '../lib/url.ts';
import { DEFAULT_LOCALE, LOCALES, type Locale, isLocale } from './config.ts';

/**
 * Route registry. Every page exists in both locales with the same slug:
 * English at the root, German under /de/. Paths here never include the base path.
 */
export const ROUTES = {
  home: '/',
  work: '/work/',
  experience: '/experience/',
  lab: '/lab/',
  about: '/about/',
  cv: '/cv/',
  colophon: '/colophon/',
  impressum: '/impressum/',
  datenschutz: '/datenschutz/',
} as const;

export type RouteKey = keyof typeof ROUTES;
export const ROUTE_KEYS = Object.keys(ROUTES) as RouteKey[];

/** Internal, English-only pages that are excluded from the sitemap and from locale parity. */
export const INTERNAL_ROUTES = { tokens: '/tokens/' } as const;

function normalizePath(path: string): string {
  return ensureTrailingSlash(path.startsWith('/') ? path : `/${path}`);
}

/** Path without base for a locale: localePath('de', '/about/') → '/de/about/'. */
export function localePath(locale: Locale, path: string): string {
  const normalized = normalizePath(path);
  if (locale === DEFAULT_LOCALE) return normalized;
  return `/${locale}${normalized}`;
}

/** Removes a locale prefix: '/de/about/' → '/about/', '/de/' → '/'. */
export function unlocalizePath(path: string): string {
  const normalized = normalizePath(path);
  const [, first = ''] = normalized.split('/');
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = normalized.slice(first.length + 1);
    return rest === '' ? '/' : rest;
  }
  return normalized;
}

/** Locale of a path without base: '/de/lab/' → 'de', '/lab/' → 'en'. */
export function localeFromPath(path: string): Locale {
  const [, first = ''] = normalizePath(path).split('/');
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** The equivalent page in another locale (paths without base). */
export function switchLocalePath(path: string, target: Locale): string {
  return localePath(target, unlocalizePath(path));
}

/** Full href (with base) for a path in a locale, optionally with a hash. */
export function href(locale: Locale, path: string, hash?: string): string {
  const url = withBase(localePath(locale, path));
  return hash ? `${url}#${hash.replace(/^#/, '')}` : url;
}

/** Full href (with base) for a registered route. */
export function routeHref(locale: Locale, key: RouteKey, hash?: string): string {
  return href(locale, ROUTES[key], hash);
}

/** Full href (with base) for a case study. */
export function workHref(locale: Locale, slug: string): string {
  return href(locale, `/work/${slug}/`);
}

/** Paths of every registered route in every locale (without base), e.g. for tests and audits. */
export function allLocalizedRoutePaths(): Array<{ locale: Locale; key: RouteKey; path: string }> {
  return LOCALES.flatMap((locale) =>
    ROUTE_KEYS.map((key) => ({ locale, key, path: localePath(locale, ROUTES[key]) })),
  );
}
