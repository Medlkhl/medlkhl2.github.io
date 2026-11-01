#!/usr/bin/env node
/**
 * Prints /cv/ and /de/cv/ to A4 PDFs with Playwright's Chromium after the
 * Astro build, so the PDF CV can never drift from the site:
 *   dist/Mohamed-Lakhel-CV-EN.pdf, dist/Mohamed-Lakhel-Lebenslauf-DE.pdf
 * The pages carry their own print sheet (src/styles/print.css: @page A4,
 * margins, running footer, paper palette); this script only serves dist/ under
 * the base path, waits for fonts and images, and prints. The document <title>
 * becomes the PDF title; headings become the PDF outline; the PDF is tagged.
 */
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { CV_PDF, CV_SOURCE_PATH } from '../src/lib/cv.ts';
import { startServer } from './serve-dist.mjs';
import { BASE, DIST, kb } from './lib/dist.mjs';

/** Brief §10 / ASSETS.md: one to two A4 pages and at most 300 KB per PDF. */
const MAX_PAGES = 2;
const MAX_BYTES = 300 * 1024;

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `astro build` first.');
  process.exit(1);
}

const { server, origin } = await startServer({ port: 0, quiet: true });
const browser = await chromium.launch();
const warnings = [];
try {
  const context = await browser.newContext({
    colorScheme: 'light',
    reducedMotion: 'reduce',
    // At a 1.5× pixel ratio the portrait comes from its 240 px rendition
    // (about 230 dpi at its printed size) instead of the 160 px one.
    deviceScaleFactor: 1.5,
  });
  for (const locale of /** @type {const} */ (['en', 'de'])) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    const url = `${origin}${BASE}${CV_SOURCE_PATH[locale].replace(/^\//, '')}`;
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${url} answered ${response?.status()}`);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
    });
    const out = join(DIST, CV_PDF[locale]);
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    const pdf = await readFile(out);
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
    const { size } = await stat(out);
    console.log(`PDF ${CV_PDF[locale]}: ${pages} page(s), ${kb(size)}`);
    if (pages > MAX_PAGES)
      warnings.push(`${CV_PDF[locale]} has ${pages} pages (target ≤ ${MAX_PAGES})`);
    if (size > MAX_BYTES)
      warnings.push(`${CV_PDF[locale]} is ${kb(size)} (budget ${kb(MAX_BYTES)})`);
    if (errors.length) throw new Error(`Errors on ${url}: ${errors.join('; ')}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
for (const warning of warnings) console.warn(`Warning: ${warning}`);
