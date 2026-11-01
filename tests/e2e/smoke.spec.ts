import { expect, test } from '@playwright/test';
import { allPages, rel, trackErrors } from './utils.ts';

test.describe('every route renders in both locales', () => {
  for (const { locale, path, id } of allPages()) {
    test(`${id} ${path}`, async ({ page }) => {
      const errors = trackErrors(page);
      const response = await page.goto(rel(path));
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.locator('#stage[aria-hidden="true"]')).toHaveCount(1);
      await expect(page.locator('body')).toHaveAttribute('data-scene-shot', /.+/);
      expect(await page.title()).toContain('Mohamed Lakhel');
      expect(errors).toEqual([]);
    });
  }

  test('unknown URLs get the bilingual 404 page', async ({ page }) => {
    const response = await page.goto('does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('[lang="en"] h1')).toBeVisible();
    await expect(page.locator('[lang="de"] h2')).toBeVisible();
  });
});
