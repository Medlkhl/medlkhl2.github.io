import type { Locale } from '../i18n/config.ts';

export interface LeadIn {
  /** The label before the colon ("Legacy code"), shown bold; absent when there is none. */
  lead?: string;
  /** The text after the colon, which now starts a sentence. */
  rest: string;
}

/**
 * "Legacy code: a React Native app…" → bold lead-in plus the rest, whose first
 * letter is capitalised because it now starts a sentence. A first word with a
 * capital after its first letter ("iOS", "macOS", "OAuth2") keeps its case.
 */
export function leadIn(text: string, locale: Locale): LeadIn {
  const match = /^([^:[\]]{2,48}):\s+([\s\S]+)$/.exec(text);
  if (!match?.[1] || !match[2]) return { rest: text };
  const rest = match[2];
  const first = rest.split(/\s/, 1)[0] ?? '';
  const keepCase = /\p{Lu}/u.test(first.slice(1));
  return {
    lead: match[1],
    rest: keepCase ? rest : rest.charAt(0).toLocaleUpperCase(locale) + rest.slice(1),
  };
}
