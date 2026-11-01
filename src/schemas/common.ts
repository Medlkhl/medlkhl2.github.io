import { z } from 'astro/zod';
import { PLACEHOLDER_PATTERN } from '../lib/placeholders.ts';

/** Shared schema building blocks. Zod 4 via `astro/zod`. */

export const nonEmpty = z.string().trim().min(1);

/** A string in both locales. Parity is enforced by the schema itself. */
export const l10n = z.strictObject({ en: nonEmpty, de: nonEmpty });
export type L10n = z.infer<typeof l10n>;

/** ISO year-month, e.g. "2024-07". Formatted per locale at render time. */
export const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected an ISO year-month (YYYY-MM)');

export const year = z.string().regex(/^\d{4}$/, 'Expected a four-digit year');

/** A canonical placeholder such as "[CONFIRM: start date]". */
export const placeholderString = z
  .string()
  .regex(new RegExp(`^${PLACEHOLDER_PATTERN}$`), 'Expected a placeholder like [KIND: label]');

export const yearMonthOrPlaceholder = z.union([yearMonth, placeholderString]);

export const httpsUrl = z.url({ protocol: /^https$/ });

/** Where a fact comes from, for audits. Never rendered. */
export const SOURCES = ['lebenslauf', 'english-cv', 'old-site', 'owner-brief'] as const;
export const source = z.enum(SOURCES);

/** Compares two ISO year-months. */
export function yearMonthLte(a: string, b: string): boolean {
  return a <= b;
}
