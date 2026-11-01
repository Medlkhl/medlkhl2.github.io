import { expect, test } from '@playwright/test';

test.describe('theme', () => {
  test('first visit follows prefers-color-scheme', async ({ browser }) => {
    for (const [scheme, theme] of [
      ['dark', 'graphite'],
      ['light', 'paper'],
    ] as const) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      await page.goto('');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await context.close();
    }
  });

  test('the choice persists across reloads and client-side navigation', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'graphite');
    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
    await page.locator('.site-nav a[href$="/lab/"]').first().click();
    await expect(page).toHaveURL(/\/lab\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
  });

  test('color-scheme matches the theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('');
    const scheme = await page.evaluate(
      () => getComputedStyle(document.documentElement).colorScheme,
    );
    expect(scheme).toBe('light');
  });

  test('data-save-data is set on load and kept across client-side navigation', async ({ page }) => {
    await page.goto('');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-save-data', /^(on|off)$/);
    await page.locator('.site-nav a[href$="/lab/"]').first().click();
    await expect(page).toHaveURL(/\/lab\/$/);
    await expect(html).toHaveAttribute('data-save-data', /^(on|off)$/);
  });
});
