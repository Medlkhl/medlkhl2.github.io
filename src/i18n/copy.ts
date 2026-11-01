import type { Locale } from './config.ts';

/**
 * Declares a bilingual copy object. Both locales must satisfy the same shape,
 * so a missing German (or English) string is a type error. Name copy modules
 * `*.copy.ts`; the parity test checks every one of them for matching keys,
 * matching array lengths and non-empty strings.
 */
export function defineCopy<T>(copy: Record<Locale, T>): Record<Locale, T> {
  return copy;
}
