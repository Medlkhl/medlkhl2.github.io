import { layers } from '../../data/layers.ts';
import { profile } from '../../data/profile.ts';
import type { Locale } from '../../i18n/config.ts';
import { pageMeta, socialCopy, type SocialCardKey } from '../../i18n/meta.copy.ts';
import type { RouteKey } from '../../i18n/routes.ts';
import { ui } from '../../i18n/ui.copy.ts';
import type { WorkFrontmatter } from '../../schemas/work.ts';
import { hasPlaceholder } from '../placeholders.ts';
import { absoluteUrl } from '../url.ts';

/**
 * What each social image says. Pure functions over the typed data and the copy
 * in src/i18n/meta.copy.ts, so they are unit-testable; render.ts lays them out.
 */
export interface OgCard {
  /** Language of the card text (the 404 card is English with a German line). */
  lang: Locale;
  /** Mono kicker in the "02 — Experience" style; the number is optional. */
  kicker: { index?: string; label: string };
  headline: string;
  lede?: string;
  /** Case studies: the slab of the stack that carries the accent, with its legend. */
  layer?: { position: number; number: string; legend: string };
  /** Bottom line: name and role on the left (home: the location), site address on the right. */
  footer: { name?: string; detail: string; site: string };
}

/** Kicker numbers follow the order of the main navigation; legal pages have none. */
const CARD_INDEX: Record<SocialCardKey, number | null> = {
  work: 1,
  experience: 2,
  lab: 3,
  about: 4,
  cv: 5,
  colophon: 6,
  impressum: null,
  datenschutz: null,
};

const pad = (value: number) => String(value).padStart(2, '0');

/** "medlkhl.github.io/medlkhl2.github.io" */
export function siteLabel(): string {
  return absoluteUrl('/')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function footer(locale: Locale) {
  return { name: profile.name, detail: profile.role[locale], site: siteLabel() };
}

/** Card of a registered page. */
export function pageCard(locale: Locale, key: RouteKey): OgCard {
  if (key === 'home') {
    return {
      lang: locale,
      kicker: { label: profile.role[locale] },
      headline: profile.name,
      lede: profile.positioning[locale],
      footer: { detail: profile.location.label[locale], site: siteLabel() },
    };
  }
  const copy = socialCopy[locale].cards[key];
  const index = CARD_INDEX[key];
  return {
    lang: locale,
    kicker: index === null ? { label: copy.label } : { index: pad(index), label: copy.label },
    headline: copy.headline,
    lede: copy.lede,
    footer: footer(locale),
  };
}

export type CaseStudyCardData = Pick<
  WorkFrontmatter,
  'title' | 'summary' | 'outcome' | 'status' | 'scene'
>;

/** Card of a case study: its title, its one-line outcome and the layer it is about. */
export function caseStudyCard(locale: Locale, data: CaseStudyCardData): OgCard {
  const copy = socialCopy[locale];
  const layerId = data.scene.layer.replace(/^layer_/, '');
  const layer = layers.find((entry) => entry.id === layerId);
  // Never print a placeholder on a social image: fall back to the summary, then to nothing.
  const lede = [data.outcome, data.summary].find((text) => !hasPlaceholder(text));
  return {
    lang: locale,
    kicker: { label: `${copy.caseStudy} · ${ui[locale].status[data.status]}` },
    headline: data.title,
    lede,
    layer: layer && {
      position: layer.index - 1,
      number: pad(layer.index),
      legend: `${copy.layer} ${pad(layer.index)} — ${layer.label[locale]}`,
    },
    footer: footer(locale),
  };
}

/** Card of the bilingual 404 page. */
export function notFoundCard(): OgCard {
  return {
    lang: 'en',
    kicker: { index: '404', label: 'Error · Fehler' },
    headline: pageMeta.en.notFound.title,
    lede: `${pageMeta.de.notFound.title}.`,
    footer: footer('en'),
  };
}
