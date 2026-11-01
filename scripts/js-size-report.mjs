#!/usr/bin/env node
/**
 * JavaScript per page (gzip, level 9): every script a page loads up front,
 * following static imports (dynamic import() chunks are on-demand and excluded),
 * plus inline scripts. Fails if any content page exceeds the budget
 * (brief §10: ≤ 90 KB gzip before 3D). Also reports CSS and preloaded fonts.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parse } from 'node-html-parser';
import { BASE, DIST, fileToUrlPath, kb, listFiles, urlPathToFile } from './lib/dist.mjs';

const BUDGET = 90 * 1024;
const gz = (buffer) => gzipSync(buffer, { level: 9 }).length;
const fileCache = new Map();

async function gzOf(file) {
  if (!fileCache.has(file)) fileCache.set(file, gz(await readFile(join(DIST, file))));
  return fileCache.get(file);
}

const STATIC_IMPORT = /(?:import|export)\s*(?:[\w*{}\s,$]*?\s*from\s*)?["']([^"']+\.m?js)["']/g;

async function closure(entry, seen = new Set()) {
  if (seen.has(entry) || !existsSync(join(DIST, entry))) return seen;
  seen.add(entry);
  const code = await readFile(join(DIST, entry), 'utf8');
  for (const match of code.matchAll(STATIC_IMPORT)) {
    const spec = match[1];
    let target;
    if (spec.startsWith('/')) target = urlPathToFile(spec);
    else if (spec.startsWith('.')) target = posix.normalize(posix.join(posix.dirname(entry), spec));
    if (target) await closure(target, seen);
  }
  return seen;
}

function toFile(ref, pageUrl) {
  const url = new URL(ref, `http://x${pageUrl}`);
  return urlPathToFile(url.pathname);
}

const pages = (await listFiles(DIST, (file) => file.endsWith('.html'))).filter(
  (file) => !file.startsWith('_astro'),
);
const rows = [];
for (const page of pages) {
  const pageUrl = fileToUrlPath(page);
  const root = parse(await readFile(join(DIST, page), 'utf8'));
  const jsFiles = new Set();
  let inline = 0;
  for (const script of root.querySelectorAll('script')) {
    const type = script.getAttribute('type') ?? '';
    if (type === 'application/ld+json') continue;
    const src = script.getAttribute('src');
    if (src) {
      const file = toFile(src, pageUrl);
      if (file) for (const dep of await closure(file)) jsFiles.add(dep);
    } else {
      inline += gz(Buffer.from(script.text));
    }
  }
  for (const link of root.querySelectorAll('link[rel="modulepreload"]')) {
    const file = toFile(link.getAttribute('href'), pageUrl);
    if (file) for (const dep of await closure(file)) jsFiles.add(dep);
  }
  let js = inline;
  for (const file of jsFiles) js += await gzOf(file);

  let css = 0;
  for (const link of root.querySelectorAll('link[rel="stylesheet"]')) {
    const file = toFile(link.getAttribute('href'), pageUrl);
    if (file) css += await gzOf(file);
  }
  for (const style of root.querySelectorAll('style')) css += gz(Buffer.from(style.text));

  let fonts = 0;
  for (const link of root.querySelectorAll('link[rel="preload"][as="font"]')) {
    const file = toFile(link.getAttribute('href'), pageUrl);
    if (file) fonts += (await stat(join(DIST, file))).size;
  }
  rows.push({ page: pageUrl.replace(BASE, '/'), js, inline, files: jsFiles.size, css, fonts });
}

await mkdir('reports', { recursive: true });
await writeFile('reports/js-size.json', JSON.stringify({ budget: BUDGET, rows }, null, 2));

const width = Math.max(...rows.map((row) => row.page.length), 4);
console.log(`${'Page'.padEnd(width)}  JS gzip   files  inline   CSS gzip  fonts preloaded`);
for (const row of rows) {
  console.log(
    `${row.page.padEnd(width)}  ${kb(row.js).padStart(8)}  ${String(row.files).padStart(5)}  ${kb(row.inline).padStart(7)}  ${kb(row.css).padStart(8)}  ${kb(row.fonts).padStart(8)}`,
  );
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  const table = [
    '# JavaScript per page (gzip)',
    '',
    '| Page | JS | Files | CSS | Fonts preloaded |',
    '| --- | --: | --: | --: | --: |',
    ...rows.map(
      (row) => `| ${row.page} | ${kb(row.js)} | ${row.files} | ${kb(row.css)} | ${kb(row.fonts)} |`,
    ),
    '',
  ];
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `${table.join('\n')}\n`);
}
const max = Math.max(...rows.map((row) => row.js));
console.log(`\nLargest JS per page: ${kb(max)} gzip (budget ${kb(BUDGET)}).`);
const over = rows.filter((row) => row.js > BUDGET);
if (over.length) {
  console.error(`Over budget: ${over.map((row) => row.page).join(', ')}`);
  process.exit(1);
}
