import { hasPlaceholder } from '../lib/placeholders.ts';
import { LOCALE_META, type Locale } from './config.ts';
import { ui } from './ui.copy.ts';

/**
 * Locale-aware formatting. Dates are stored as ISO year-month strings (YYYY-MM)
 * and only formatted at render time, with Intl and a fixed UTC time zone so the
 * output never depends on the build machine.
 */

export type DateStyle = 'short' | 'long' | 'numeric';

const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value: string): { year: number; month: number } {
  const match = YEAR_MONTH.exec(value);
  if (!match) throw new Error(`Expected ISO year-month (YYYY-MM), got "${value}"`);
  return { year: Number(match[1]), month: Number(match[2]) };
}

export function isYearMonth(value: string): boolean {
  return YEAR_MONTH.test(value);
}

/** 'short' → "Jul 2024" / "Juli 2024"; 'long' → "July 2024" / "Juli 2024"; 'numeric' → "07/2024" in both. */
export function formatYearMonth(value: string, locale: Locale, style: DateStyle = 'short'): string {
  if (hasPlaceholder(value)) return value;
  const { year, month } = parseYearMonth(value);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const options: Intl.DateTimeFormatOptions =
    style === 'numeric'
      ? { month: '2-digit', year: 'numeric', timeZone: 'UTC' }
      : { month: style, year: 'numeric', timeZone: 'UTC' };
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, options).format(date);
}

/** Machine-readable value for <time datetime>. */
export function toDateTimeAttribute(value: string): string | undefined {
  return isYearMonth(value) ? value : undefined;
}

export interface RangeParts {
  /** Formatted start: "Jul 2024", a year as is, or the placeholder itself. */
  from: string;
  /** Formatted end, or "Present" / "heute" (ui.labels.present) for an open end. */
  to: string;
  /** <time datetime> of the start; undefined for a placeholder. */
  fromDateTime: string | undefined;
  /** <time datetime> of the end; undefined for an open end or a placeholder. */
  toDateTime: string | undefined;
}

const YEAR = /^\d{4}$/;

function rangeEnd(value: string, locale: Locale, style: DateStyle): [string, string | undefined] {
  if (YEAR.test(value)) return [value, value];
  return [formatYearMonth(value, locale, style), toDateTimeAttribute(value)];
}

/**
 * Both ends of a range, for markup that puts each in its own <time> (one
 * <time> cannot hold a range). Year-months are formatted, years ("2015") and
 * placeholders pass through, an open end becomes "Present" / "heute".
 */
export function formatRangeParts(
  start: string,
  end: string | null,
  locale: Locale,
  style: DateStyle = 'short',
): RangeParts {
  const [from, fromDateTime] = rangeEnd(start, locale, style);
  const [to, toDateTime] =
    end === null ? [ui[locale].labels.present, undefined] : rangeEnd(end, locale, style);
  return { from, to, fromDateTime, toDateTime };
}

/** "Jul 2024 – Dec 2025"; an open end renders as "Present" / "heute". */
export function formatRange(
  start: string,
  end: string | null,
  locale: Locale,
  style: DateStyle = 'short',
): string {
  const { from, to } = formatRangeParts(start, end, locale, style);
  return `${from} – ${to}`;
}

/** Whole months between two year-months, both inclusive (Jul–Dec = 6). */
export function monthsBetween(start: string, end: string): number {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  return b.year * 12 + b.month - (a.year * 12 + a.month) + 1;
}

/**
 * "1 year 6 months" / "1 Jahr, 6 Monate" for timeline metadata. Units and
 * the joiner come from Intl, so no unit words live in code.
 */
export function formatDuration(start: string, end: string, locale: Locale): string {
  const total = monthsBetween(start, end);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const intl = LOCALE_META[locale].intl;
  const unit = (value: number, name: 'year' | 'month') =>
    new Intl.NumberFormat(intl, { style: 'unit', unit: name, unitDisplay: 'long' }).format(value);
  const parts = [
    ...(years ? [unit(years, 'year')] : []),
    ...(months ? [unit(months, 'month')] : []),
  ];
  return new Intl.ListFormat(intl, { type: 'unit', style: 'narrow' }).format(parts);
}

/** "1 November 2026" / "1. November 2026" (UTC). */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Locale-aware list: "A, B and C" / "A, B und C". */
export function formatList(items: readonly string[], locale: Locale): string {
  return new Intl.ListFormat(LOCALE_META[locale].intl, {
    style: 'long',
    type: 'conjunction',
  }).format(items);
}
