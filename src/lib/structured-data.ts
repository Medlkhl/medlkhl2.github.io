import { education } from '../data/experience.ts';
import { profile } from '../data/profile.ts';
import { capabilities, languages } from '../data/skills.ts';
import type { Locale } from '../i18n/config.ts';
import { LOCALE_META, LOCALES } from '../i18n/config.ts';
import { localePath } from '../i18n/routes.ts';
import { absoluteUrl } from './url.ts';

/**
 * JSON-LD builders (schema.org). Views pass the result to
 * <BaseLayout jsonLd={[…]}>:
 *   home  → websiteJsonLd + personJsonLd
 *   about, cv → personJsonLd
 *   case studies, legal pages → breadcrumbJsonLd
 * Every value comes from src/data/*, so the structured data can never say more
 * than the page. Privacy: no birth date, phone number or street address, ever
 * (tests/unit/seo.test.ts checks it). The Person has no image until a stable,
 * public portrait URL exists (astro:assets URLs are content-hashed).
 */

const CONTEXT = 'https://schema.org';

/** Stable node ids, so the WebSite can point at its author across pages. */
export const PERSON_ID = `${absoluteUrl('/')}#person`;
export const WEBSITE_ID = `${absoluteUrl('/')}#website`;

export type JsonLd = Record<string, unknown>;

function unique(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function personJsonLd(locale: Locale): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    jobTitle: profile.role[locale],
    description: profile.positioning[locale],
    // One identity, one URL: the site root (also the x-default alternate).
    url: absoluteUrl('/'),
    email: `mailto:${profile.email}`,
    sameAs: [profile.links.linkedin, profile.links.github],
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.countryCode,
    },
    knowsLanguage: languages.map((language) => ({
      '@type': 'Language',
      name: language.name[locale],
      alternateName: language.id,
    })),
    knowsAbout: unique([
      ...profile.coreStack,
      ...capabilities.flatMap((capability) => capability.skills),
    ]),
    alumniOf: education.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.institution[locale],
      address: entry.location[locale],
    })),
  };
}

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: profile.name,
    description: profile.positioning[locale],
    url: absoluteUrl('/'),
    // One website in two languages: English at the root, German under /de/.
    inLanguage: LOCALES.map((code) => LOCALE_META[code].htmlLang),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

export interface Crumb {
  name: string;
  /** Path without base, e.g. '/work/'. */
  path: string;
}

/** Breadcrumbs as unlocalized paths; they are localized and made absolute here. */
export function breadcrumbJsonLd(locale: Locale, crumbs: Crumb[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localePath(locale, crumb.path)),
    })),
  };
}
