import { education } from '../data/experience.ts';
import { profile } from '../data/profile.ts';
import { capabilities, languages } from '../data/skills.ts';
import type { Locale } from '../i18n/config.ts';
import { LOCALE_META } from '../i18n/config.ts';
import { localePath } from '../i18n/routes.ts';
import { absoluteUrl } from './url.ts';

/**
 * JSON-LD builders (schema.org). Views pass the result to
 * <BaseLayout jsonLd={[…]}>:
 *   home  → websiteJsonLd + personJsonLd
 *   about, cv → personJsonLd
 *   case studies → breadcrumbJsonLd
 * Signatures are stable; the SEO workstream may refine the contents.
 */

const PERSON_ID = `${absoluteUrl('/')}#person`;
const WEBSITE_ID = `${absoluteUrl('/')}#website`;

export function personJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    jobTitle: profile.role[locale],
    description: profile.positioning[locale],
    url: absoluteUrl(localePath(locale, '/')),
    email: `mailto:${profile.email}`,
    sameAs: [profile.links.linkedin, profile.links.github],
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.countryCode,
    },
    knowsLanguage: languages.map((language) => language.id),
    knowsAbout: capabilities.flatMap((capability) => capability.skills),
    alumniOf: education.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.institution[locale],
    })),
  };
}

export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: profile.name,
    url: absoluteUrl('/'),
    inLanguage: LOCALE_META[locale].htmlLang,
    author: { '@id': PERSON_ID },
  };
}

export interface Crumb {
  name: string;
  /** Path without base, e.g. '/work/'. */
  path: string;
}

/** Breadcrumbs as unlocalized paths; they are localized and made absolute here. */
export function breadcrumbJsonLd(locale: Locale, crumbs: Crumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localePath(locale, crumb.path)),
    })),
  };
}
