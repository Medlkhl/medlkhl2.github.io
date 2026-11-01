import { expect, test } from '@playwright/test';
import { otherLocale } from '../../src/i18n/config.ts';
import { switchLocalePath } from '../../src/i18n/routes.ts';
import { allPages, rel, trackErrors } from './utils.ts';

test.describe('language switch lands on the equivalent page', () => {
  for (const { locale, path, id } of allPages()) {
    test(`${id} ${path}`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(rel(path));
      const target = otherLocale(locale);
      const expected = switchLocalePath(path, target);
      const link = page.locator('[data-lang-switch]');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('hreflang', target);
      await expect(link).toHaveAttribute('lang', target);
      await expect(link).toHaveAttribute('href', new RegExp(`${expected.replace(/\//g, '\\/')}$`));

      await link.click();
      await expect(page).toHaveURL(new RegExp(`${expected.replace(/\//g, '\\/')}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', target);
      await expect(page.locator('h1')).toHaveCount(1);
      // The choice is remembered for later phases (no automatic redirect).
      expect(await page.evaluate(() => localStorage.getItem('pref:lang'))).toBe(target);
      expect(errors).toEqual([]);
    });
  }

  test('the bilingual 404 page has no language switch', async ({ page }) => {
    await page.goto('missing-page/');
    await expect(page.locator('[data-lang-switch]')).toHaveCount(0);
  });

  test('hreflang alternates point to the twins', async ({ page }) => {
    for (const { locale, path } of allPages()) {
      await page.goto(rel(path));
      const de = await page.locator('link[rel="alternate"][hreflang="de"]').getAttribute('href');
      const en = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href');
      expect(de?.endsWith(switchLocalePath(path, 'de')), `${locale} ${path} → de`).toBe(true);
      expect(en?.endsWith(switchLocalePath(path, 'en')), `${locale} ${path} → en`).toBe(true);
    }
  });
});
