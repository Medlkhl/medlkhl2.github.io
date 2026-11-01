import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

export const WORK_DIR = 'src/content/work';

/** Frontmatter and body of an MDX file. */
export function readMdx(path: string): { data: Record<string, unknown>; body: string } {
  const source = readFileSync(path, 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${path} has no frontmatter`);
  return { data: parseYaml(match[1] ?? '') as Record<string, unknown>, body: match[2] ?? '' };
}

export function workFiles(locale: 'en' | 'de'): string[] {
  return readdirSync(join(WORK_DIR, locale))
    .filter((file) => file.endsWith('.mdx'))
    .sort();
}
