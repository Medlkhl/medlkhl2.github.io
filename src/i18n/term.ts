import type { Term } from '../schemas/common.ts';
import type { Locale } from './config.ts';

/**
 * The text of a skill or stack item in one locale: a product name passes
 * through unchanged, a descriptive phrase picks its translation.
 * term('Keycloak', 'de') → 'Keycloak'; term({ en: 'Robotics', de: 'Robotik' }, 'de') → 'Robotik'.
 */
export function term(value: Term, locale: Locale): string {
  return typeof value === 'string' ? value : value[locale];
}
