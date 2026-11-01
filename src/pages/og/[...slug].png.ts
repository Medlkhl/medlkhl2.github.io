import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES } from '../../i18n/config.ts';
import { ROUTE_KEYS } from '../../i18n/routes.ts';
import { ogImagePath } from '../../lib/og.ts';
import { caseStudyCard, notFoundCard, pageCard, type OgCard } from '../../lib/og/cards.ts';
import { renderOgImage } from '../../lib/og/render.ts';
import { stripBase } from '../../lib/url.ts';
import { getWork, workSlug } from '../../lib/work.ts';

/**
 * One social image per page and locale, generated at build time. The paths
 * come from src/lib/og.ts (/og/<locale>/<routeKey>.png, /og/<locale>/work-<slug>.png,
 * /og/en/not-found.png); the text from src/lib/og/cards.ts.
 */
function slugOf(path: string): string {
  return stripBase(path)
    .replace(/^\/og\//, '')
    .replace(/\.png$/, '');
}

export const getStaticPaths = (async () => {
  const paths: Array<{ params: { slug: string }; props: { card: OgCard } }> = [];
  for (const locale of LOCALES) {
    for (const key of ROUTE_KEYS) {
      paths.push({
        params: { slug: slugOf(ogImagePath(locale, key)) },
        props: { card: pageCard(locale, key) },
      });
    }
    for (const entry of await getWork(locale)) {
      paths.push({
        params: { slug: slugOf(ogImagePath(locale, `work-${workSlug(entry)}`)) },
        props: { card: caseStudyCard(locale, entry.data) },
      });
    }
  }
  paths.push({
    params: { slug: slugOf(ogImagePath('en', 'not-found')) },
    props: { card: notFoundCard() },
  });
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { card: OgCard }).card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
