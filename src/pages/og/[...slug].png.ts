import type { APIRoute, GetStaticPaths } from 'astro';
import { profile } from '../../data/profile.ts';
import { LOCALES, type Locale } from '../../i18n/config.ts';
import { pageMeta } from '../../i18n/meta.copy.ts';
import { ROUTE_KEYS } from '../../i18n/routes.ts';
import { ogImagePath } from '../../lib/og.ts';
import { renderOgImage, type OgContent } from '../../lib/og/render.ts';
import { absoluteUrl, stripBase } from '../../lib/url.ts';
import { getWork, workSlug } from '../../lib/work.ts';

/** One social image per page and locale, generated at build time (paths from src/lib/og.ts). */

function siteLabel(): string {
  return absoluteUrl('/')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function content(locale: Locale, kicker: string, title: string, description: string): OgContent {
  return {
    kicker,
    title,
    description,
    footer: siteLabel(),
    byline: `${profile.name} · ${profile.role[locale]}`,
  };
}

export const getStaticPaths = (async () => {
  const paths: Array<{ params: { slug: string }; props: { content: OgContent } }> = [];
  const toSlug = (path: string) =>
    stripBase(path)
      .replace(/^\/og\//, '')
      .replace(/\.png$/, '');

  for (const locale of LOCALES) {
    for (const key of ROUTE_KEYS) {
      const meta = pageMeta[locale][key];
      const title = key === 'home' ? profile.name : meta.title;
      const description = key === 'home' ? profile.positioning[locale] : meta.description;
      paths.push({
        params: { slug: toSlug(ogImagePath(locale, key)) },
        props: {
          content: content(
            locale,
            key === 'home' ? profile.role[locale] : meta.title,
            title,
            description,
          ),
        },
      });
    }
    for (const entry of await getWork(locale)) {
      const slug = workSlug(entry);
      paths.push({
        params: { slug: toSlug(ogImagePath(locale, `work-${slug}`)) },
        props: {
          content: content(
            locale,
            locale === 'de' ? 'Fallstudie' : 'Case study',
            entry.data.title,
            entry.data.summary,
          ),
        },
      });
    }
  }
  const nf = pageMeta;
  paths.push({
    params: { slug: toSlug(ogImagePath('en', 'not-found')) },
    props: {
      content: content(
        'en',
        '404',
        `${nf.en.notFound.title} · ${nf.de.notFound.title}`,
        nf.en.notFound.description,
      ),
    },
  });
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { content: OgContent }).content);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
