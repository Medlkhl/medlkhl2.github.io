import { expect, test } from '@playwright/test';
import { LOCALES, LOCALE_META, otherLocale } from '../../src/i18n/config.ts';
import { localePath } from '../../src/i18n/routes.ts';
import { CV_PDF } from '../../src/lib/cv.ts';
import { rel, trackErrors } from './utils.ts';

/**
 * The CV page's own behaviour: the PDF downloads (file names, the download
 * attribute, a real PDF of at most two pages, hreflang on the other language)
 * and the A4 print sheet (no site chrome, white paper whatever the theme).
 */
for (const locale of LOCALES) {
  const path = localePath(locale, '/cv/');
  const other = otherLocale(locale);

  test.describe(`${locale} CV ${path}`, () => {
    test('the download button serves this language’s PDF', async ({ page, request }) => {
      await page.goto(rel(path));
      const link = page.locator('.cv-header__actions a[download]').first();
      await expect(link).toHaveAttribute('href', new RegExp(`/${CV_PDF[locale]}$`));
      await expect(link).toHaveAttribute('download', CV_PDF[locale]);

      const response = await request.get(
        new URL(String(await link.getAttribute('href')), page.url()).href,
      );
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
      const pdf = (await response.body()).toString('latin1');
      expect(pdf.startsWith('%PDF-')).toBe(true);
      const pages = pdf.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
      expect(pages, 'pages in the PDF').toBeGreaterThan(0);
      expect(pages, 'pages in the PDF').toBeLessThanOrEqual(2);
    });

    test('the other-language PDF is marked with its language', async ({ page, request }) => {
      await page.goto(rel(path));
      const link = page.locator(`.cv-header__actions a[href$="/${CV_PDF[other]}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('hreflang', LOCALE_META[other].htmlLang);
      await expect(link).toHaveAttribute('download', CV_PDF[other]);
      const response = await request.get(
        new URL(String(await link.getAttribute('href')), page.url()).href,
      );
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
    });

    test('print hides the site chrome and prints on white, even in graphite', async ({ page }) => {
      const errors = trackErrors(page);
      await page.addInitScript(() => localStorage.setItem('pref:theme', 'graphite'));
      await page.goto(rel(path));
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'graphite');
      await expect(page.locator('.site-header')).toBeVisible();

      await page.emulateMedia({ media: 'print' });
      for (const selector of ['.site-header', '.site-footer', '.cv-header__actions'])
        await expect(page.locator(selector), selector).toBeHidden();
      const colors = await page.evaluate(() => ({
        token: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim(),
        body: getComputedStyle(document.body).backgroundColor,
        scheme: getComputedStyle(document.documentElement).colorScheme,
      }));
      expect(colors).toEqual({ token: '#ffffff', body: 'rgb(255, 255, 255)', scheme: 'light' });
      await expect(page.locator('h1')).toBeVisible();
      expect(errors).toEqual([]);
    });
  });
}
