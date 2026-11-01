#!/usr/bin/env node
/**
 * Prints /cv/ and /de/cv/ to A4 PDFs with Playwright's Chromium after the
 * Astro build, so the PDF CV can never drift from the site:
 *   dist/Mohamed-Lakhel-CV-EN.pdf, dist/Mohamed-Lakhel-Lebenslauf-DE.pdf
 * The pages carry their own print stylesheet (@page A4); this script only
 * serves dist/ under the base path, waits for fonts and prints.
 */
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { CV_PDF, CV_SOURCE_PATH } from '../src/lib/cv.ts';
import { startServer } from './serve-dist.mjs';
import { BASE, DIST, kb } from './lib/dist.mjs';

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `astro build` first.');
  process.exit(1);
}

const { server, origin } = await startServer({ port: 0, quiet: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
  for (const locale of /** @type {const} */ (['en', 'de'])) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const url = `${origin}${BASE}${CV_SOURCE_PATH[locale].replace(/^\//, '')}`;
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${url} answered ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
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
    console.log(`PDF ${CV_PDF[locale]}: ${pages} page(s), ${kb((await stat(out)).size)}`);
    if (errors.length) throw new Error(`Page errors on ${url}: ${errors.join('; ')}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
