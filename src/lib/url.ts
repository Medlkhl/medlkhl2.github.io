import { BASE_PATH, SITE_URL } from '../../site.config.ts';

/**
 * URL helpers. Every internal link, asset reference, canonical URL and PDF link
 * goes through these so the base path and the trailing-slash policy ("always")
 * are applied in exactly one place.
 */

/** '/medlkhl2.github.io' → '/medlkhl2.github.io/'; '' or '/' → '/'. */
export function normalizeBase(base: string): string {
  const trimmed = base.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

/** Base path with leading and trailing slash, e.g. '/medlkhl2.github.io/'. */
export const BASE = normalizeBase(BASE_PATH);
/** Public origin without a trailing slash, e.g. 'https://medlkhl.github.io'. */
export const ORIGIN = SITE_URL.replace(/\/+$/, '');

const FILE_EXTENSION = /\.[a-z0-9]{1,8}$/i;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function splitSuffix(path: string): [string, string] {
  const index = path.search(/[?#]/);
  return index === -1 ? [path, ''] : [path.slice(0, index), path.slice(index)];
}

/** True for absolute URLs (https:, mailto:, …) and protocol-relative URLs. */
export function isExternal(href: string): boolean {
  return EXTERNAL.test(href);
}

/** Applies the trailing-slash policy to page paths: '/about' → '/about/'. Files keep their extension. */
export function ensureTrailingSlash(path: string): string {
  const [pathname, suffix] = splitSuffix(path);
  if (pathname === '' || pathname.endsWith('/') || FILE_EXTENSION.test(pathname)) return path;
  return `${pathname}/${suffix}`;
}

/** Prefixes a site-relative path ('/about/', 'cv/', '/#contact', '/og/en/home.png') with the base path. */
export function withBase(path = '/'): string {
  if (isExternal(path) || path.startsWith('#')) return path;
  const clean = path.replace(/^\/+/, '');
  return ensureTrailingSlash(`${BASE}${clean}`);
}

/** Absolute URL for a site-relative path, e.g. for canonical links, Open Graph and JSON-LD. */
export function absoluteUrl(path = '/'): string {
  return `${ORIGIN}${withBase(path)}`;
}

/** Removes the base path: '/medlkhl2.github.io/de/about/' → '/de/about/'. */
export function stripBase(pathname: string): string {
  if (BASE === '/') return pathname || '/';
  const baseWithoutSlash = BASE.slice(0, -1);
  if (pathname === baseWithoutSlash || pathname === BASE) return '/';
  if (pathname.startsWith(BASE)) return `/${pathname.slice(BASE.length)}`;
  return pathname;
}
