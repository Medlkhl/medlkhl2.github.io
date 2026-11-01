import type { Locale } from '../i18n/config.ts';
import type { RouteKey } from '../i18n/routes.ts';

/**
 * Social image path scheme (paths without base). The endpoint in
 * src/pages/og/[...slug].png.ts generates exactly these files at build time.
 *   pages:        /og/<locale>/<routeKey>.png
 *   case studies: /og/<locale>/work-<slug>.png
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export type OgPageId = RouteKey | `work-${string}` | 'not-found';

export function ogImagePath(locale: Locale, id: OgPageId): string {
  return `/og/${locale}/${id}.png`;
}
