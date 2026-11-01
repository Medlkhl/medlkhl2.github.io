import { expect, test } from '@playwright/test';
import { profile } from '../../src/data/profile.ts';
import { CV_PDF } from '../../src/lib/cv.ts';
import { allPages, rel } from './utils.ts';

/** The first screen must answer a recruiter with zero JavaScript (owner brief, Phase 1). */
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [locale, path] of [
    ['en', ''],
    ['de', 'de/'],
  ] as const) {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`${locale} home: first screen at ${viewport.width}px answers a recruiter`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        const main = page.locator('main');
        await expect(page.locator('h1')).toHaveText(profile.name);
        await expect(page.locator('h1')).toBeInViewport();
        await expect(
          main.getByText(profile.role[locale], { exact: true }).first(),
        ).toBeInViewport();
        await expect(main.getByText(profile.positioning[locale]).first()).toBeInViewport();
        await expect(main.locator(`a[href$="${CV_PDF[locale]}"]`).first()).toBeInViewport();
        await expect(main.locator('a[href$="#contact"]').first()).toBeInViewport();
        await expect(main.locator('a[href$="#work"]').first()).toBeInViewport();
      });
    }
  }

  for (const path of ['', 'de/']) {
    for (const width of [320, 390]) {
      test(`${path ? 'de' : 'en'} home at ${width}px: every header link is in view on one line`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        const nav = await page.locator('.site-nav').evaluate((element) => ({
          scroll: element.scrollWidth,
          client: element.clientWidth,
        }));
        expect(nav.scroll).toBeLessThanOrEqual(nav.client);
        const links = await page.locator('.site-nav__link').evaluateAll((elements) =>
          elements.map((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const tops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
            const box = element.getBoundingClientRect();
            return {
              text: element.textContent?.trim(),
              lines: tops.size,
              inView: box.left >= 0 && box.right <= document.documentElement.clientWidth,
            };
          }),
        );
        for (const link of links) {
          expect(link.lines, link.text).toBe(1);
          expect(link.inView, link.text).toBe(true);
        }
      });
    }
  }

  test('every page renders its content and navigation without JavaScript', async ({ page }) => {
    for (const { path } of allPages()) {
      await page.goto(rel(path));
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.site-nav a').first()).toBeVisible();
      await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    }
  });

  test('without JavaScript the theme follows the system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(246, 246, 243)');
    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(dark).toBe('rgb(16, 17, 19)');
  });
});
