import { mkdirSync } from 'node:fs';
import { test } from '@playwright/test';
import { allPages, rel } from './utils.ts';

/**
 * Gate screenshots: every route, both locales, both themes, 1440×900 and
 * 390×844, full page, into reports/screenshots/ (uploaded by CI).
 * Runs only with SCREENSHOTS=1 so everyday e2e runs stay fast.
 */
const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];
const THEMES = ['graphite', 'paper'] as const;
const OUT = 'reports/screenshots';

test.describe('gate screenshots', () => {
  test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1 to capture gate screenshots');

  for (const theme of THEMES) {
    for (const size of SIZES) {
      test(`${theme} ${size.width}x${size.height}`, async ({ browser }) => {
        test.setTimeout(240_000);
        const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
        await context.addInitScript((value) => localStorage.setItem('pref:theme', value), theme);
        const page = await context.newPage();
        for (const { locale, path, id } of [
          ...allPages(),
          { locale: 'en', path: '/tokens/', id: 'en-tokens' },
        ]) {
          await page.goto(rel(path), { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          const dir = `${OUT}/${locale}`;
          mkdirSync(dir, { recursive: true });
          const name = id.replace(/^(en|de)-/, '');
          await page.screenshot({
            path: `${dir}/${name}-${theme}-${size.width}.png`,
            fullPage: true,
          });
        }
        await context.close();
      });
    }
  }
});
