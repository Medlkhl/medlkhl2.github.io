#!/usr/bin/env node
/**
 * Lists every remaining content placeholder ([METRIC: …], [CONFIRM: …], …).
 * Always exits 0: placeholders are a warning, not a failure. Writes
 * reports/placeholders.{json,md} and, in GitHub Actions, a job summary.
 * Comment lines (JSDoc examples), the placeholder legend and the samples on
 * the internal /tokens/ page are not missing content and are not counted.
 * Run it after a build to also list the pages that show placeholders.
 */
import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PLACEHOLDER_PATTERN } from '../src/lib/placeholders.ts';
import { DIST, listFiles } from './lib/dist.mjs';

const SOURCE_DIRS = ['src'];
/** The placeholder module itself and the internal /tokens/ page, whose placeholders are samples. */
const SKIP = new Set(['src/lib/placeholders.ts', 'src/views/tokens/TokensView.astro']);
const SKIP_PAGES = new Set(['tokens/index.html']);
/** Placeholders that explain placeholders: the legend under every case study. */
const ALLOW = new Set(['[METRIC: …]']);
const pattern = () => new RegExp(PLACEHOLDER_PATTERN, 'g');
/** JSDoc and line comments: '*', '//', '/*' or '/**' at the start of the trimmed line. */
const isComment = (line) => /^(\*|\/\/|\/\*)/.test(line.trim());
const missing = (text) => [...text.matchAll(pattern())].filter((match) => !ALLOW.has(match[0]));

const items = [];
for (const dir of SOURCE_DIRS) {
  const files = await listFiles(dir, (file) => /\.(ts|astro|mdx|md)$/.test(file));
  for (const rel of files) {
    const file = `${dir}/${rel}`;
    if (SKIP.has(file)) continue;
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, index) => {
      if (isComment(line)) return;
      for (const match of missing(line)) {
        items.push({ file, line: index + 1, kind: match[1], label: match[2], raw: match[0] });
      }
    });
  }
}

// Rendered occurrences in the built site (if it exists).
const rendered = new Map();
if (existsSync(DIST)) {
  for (const rel of await listFiles(DIST, (file) => file.endsWith('.html'))) {
    if (SKIP_PAGES.has(rel)) continue;
    const html = await readFile(join(DIST, rel), 'utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    const count = missing(text).length;
    if (count) rendered.set(rel, count);
  }
}

const byKind = new Map();
for (const item of items) byKind.set(item.kind, [...(byKind.get(item.kind) ?? []), item]);

const unique = new Set(items.map((item) => item.raw)).size;
const summary = `${items.length} placeholder(s) in source (${unique} unique) across ${new Set(items.map((i) => i.file)).size} file(s); rendered on ${rendered.size} page(s).`;

const md = [`# Remaining placeholders`, '', summary, ''];
for (const [kind, list] of [...byKind.entries()].sort((a, b) => b[1].length - a[1].length)) {
  md.push(`## ${kind} (${list.length})`, '');
  for (const item of list) md.push(`- \`${item.file}:${item.line}\` — ${item.raw}`);
  md.push('');
}
if (rendered.size) {
  md.push('## Pages showing placeholders', '');
  for (const [page, count] of [...rendered.entries()].sort()) md.push(`- ${page}: ${count}`);
}

await mkdir('reports', { recursive: true });
await writeFile(
  'reports/placeholders.json',
  JSON.stringify({ summary, items, rendered: Object.fromEntries(rendered) }, null, 2),
);
await writeFile('reports/placeholders.md', `${md.join('\n')}\n`);

console.log(md.join('\n'));
if (process.env.GITHUB_ACTIONS) {
  console.log(`::warning title=Content placeholders::${summary}`);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${md.join('\n')}\n`);
}
