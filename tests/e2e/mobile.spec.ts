import { expect, test } from '@playwright/test';

test.describe('mobile navigation (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the menu button opens and closes the navigation, Escape returns focus', async ({
    page,
  }) => {
    await page.goto('');
    const toggle = page.locator('[data-menu-toggle]');
    const nav = page.locator('#site-nav');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
    await expect(nav.locator('a').first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('choosing a link closes the menu and navigates', async ({ page }) => {
    await page.goto('');
    await page.locator('[data-menu-toggle]').click();
    await page.locator('#site-nav a[href$="/lab/"]').click();
    await expect(page).toHaveURL(/\/lab\/$/);
    await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'false');
  });

  test('controls meet the 44px touch target', async ({ page }) => {
    await page.goto('');
    for (const selector of ['[data-menu-toggle]', '[data-theme-toggle]', '[data-lang-switch]']) {
      const box = await page.locator(selector).boundingBox();
      expect(box?.width, selector).toBeGreaterThanOrEqual(44);
      expect(box?.height, selector).toBeGreaterThanOrEqual(44);
    }
  });

  test('no page scrolls horizontally', async ({ page }) => {
    for (const path of [
      '',
      'de/',
      'work/',
      'experience/',
      'lab/',
      'about/',
      'cv/',
      'colophon/',
      'impressum/',
      'datenschutz/',
    ]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path || 'home').toBeLessThanOrEqual(0);
    }
  });
});
