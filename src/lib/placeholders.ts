/**
 * Placeholders mark genuinely missing content. They are written inline as
 * `[KIND: what is missing]`, e.g. `[METRIC: release cadence]`, render as a
 * visible hatched mark (see `.ph` in global.css) and are listed by
 * `pnpm content:check`. Never replace a placeholder with an invented value.
 */
export const PLACEHOLDER_KINDS = [
  'METRIC',
  'CONFIRM',
  'ASSET',
  'RECOMMENDATION',
  'NAME',
  'ADDRESS',
  'DETAIL',
  'LINK',
  'CODE',
  'DATE',
  'TODO',
] as const;
export type PlaceholderKind = (typeof PLACEHOLDER_KINDS)[number];

/** Source of the placeholder regular expression (one capture group for the kind, one for the label). */
export const PLACEHOLDER_PATTERN = String.raw`\[(${PLACEHOLDER_KINDS.join('|')}): ([^\]\n]+)\]`;

/** A fresh global regex (global regexes are stateful, so never share one). */
export function placeholderRegex(): RegExp {
  return new RegExp(PLACEHOLDER_PATTERN, 'g');
}

export type Segment =
  | { type: 'text'; value: string }
  | { type: 'placeholder'; kind: PlaceholderKind; label: string; raw: string };

/** Splits text into plain text and placeholder segments. */
export function splitPlaceholders(text: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(placeholderRegex())) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ type: 'text', value: text.slice(last, index) });
    segments.push({
      type: 'placeholder',
      kind: match[1] as PlaceholderKind,
      label: match[2] ?? '',
      raw: match[0],
    });
    last = index + match[0].length;
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) });
  return segments;
}

export function hasPlaceholder(text: string): boolean {
  return placeholderRegex().test(text);
}

/** Builds a placeholder string in the canonical format. */
export function placeholder(kind: PlaceholderKind, label: string): string {
  return `[${kind}: ${label}]`;
}
