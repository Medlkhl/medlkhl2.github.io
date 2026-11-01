import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config.ts';

/** Helpers for the `work` collection (ids look like "en/happ"). */
export type WorkEntry = CollectionEntry<'work'>;

export function workLocale(entry: WorkEntry): Locale {
  const [locale] = entry.id.split('/');
  if (locale !== 'en' && locale !== 'de')
    throw new Error(`Case study "${entry.id}" is not under en/ or de/`);
  return locale;
}

export function workSlug(entry: WorkEntry): string {
  const [, ...rest] = entry.id.split('/');
  return rest.join('/');
}

/** Published case studies of one locale, ordered by `order`. */
export async function getWork(locale: Locale): Promise<WorkEntry[]> {
  const entries = await getCollection(
    'work',
    (entry) => workLocale(entry) === locale && !entry.data.draft,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedWork(locale: Locale): Promise<WorkEntry[]> {
  return (await getWork(locale)).filter((entry) => entry.data.featured);
}
