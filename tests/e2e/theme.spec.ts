import { expect, test, type Page } from '@playwright/test';
import { ui } from '../../src/i18n/ui.copy.ts';
import { colors } from '../../src/styles/tokens.ts';

/**
 * Follows the Lab link in the header and checks that ClientRouter swapped the
 * page in the same document: a marker set on window before the click survives
 * a soft navigation, but not a full page load.
 */
async function softNavigateToLab(page: Page) {
  await page.evaluate(() => Reflect.set(window, '__soft', 1));
  await page.locator('.site-nav a[href$="/lab/"]').first().click();
  await expect(page).toHaveURL(/\/lab\/$/);
  expect(await page.evaluate(() => Reflect.get(window, '__soft'))).toBe(1);
}

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
    await softNavigateToLab(page);
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
    await softNavigateToLab(page);
    await expect(html).toHaveAttribute('data-save-data', /^(on|off)$/);
  });

  test('a live OS colour-scheme switch relabels the toggle and emits prefs:change', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('');
    const html = page.locator('html');
    const toggle = page.locator('[data-theme-toggle]');
    await expect(html).toHaveAttribute('data-theme', 'graphite');
    await expect(toggle).toHaveAttribute('aria-label', ui.en.theme.toPaper);
    await page.evaluate(() =>
      document.addEventListener('prefs:change', (event) =>
        Reflect.set(window, '__prefsChange', (event as CustomEvent<{ key: string }>).detail.key),
      ),
    );

    await page.emulateMedia({ colorScheme: 'light' });
    await expect(html).toHaveAttribute('data-theme', 'paper');
    await expect(toggle).toHaveAttribute('aria-label', ui.en.theme.toGraphite);
    await expect(toggle).toHaveAttribute('title', ui.en.theme.toGraphite);
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, '__prefsChange')))
      .toBe('theme');

    // The toggle does what its label says.
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'graphite');
    await expect(toggle).toHaveAttribute('aria-label', ui.en.theme.toPaper);
  });

  test('theme-color follows the chosen theme, also after client-side navigation', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('');
    const metas = page.locator('meta[name="theme-color"]');
    const contents = () =>
      metas.evaluateAll((elements) => elements.map((meta) => meta.getAttribute('content')));
    expect(await contents()).toEqual([colors.graphite.bg, colors.graphite.bg]);

    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
    await expect.poll(contents).toEqual([colors.paper.bg, colors.paper.bg]);
    // A chosen theme overrides the OS, so the media pair is gone.
    await expect(page.locator('meta[name="theme-color"][media]')).toHaveCount(0);

    await softNavigateToLab(page);
    await expect.poll(contents).toEqual([colors.paper.bg, colors.paper.bg]);
  });
});
