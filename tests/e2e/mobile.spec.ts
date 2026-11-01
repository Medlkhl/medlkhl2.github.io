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

  test('Tab after opening the menu walks its links, then the language and theme controls', async ({
    page,
  }) => {
    await page.goto('about/');
    const toggle = page.locator('[data-menu-toggle]');
    const links = page.locator('#site-nav a');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await page.keyboard.press('Tab');
      await expect(links.nth(index)).toBeFocused();
    }
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-lang-switch]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-theme-toggle]')).toBeFocused();

    // The toggle still sits visually last in the row, right of the theme toggle.
    const toggleBox = await toggle.boundingBox();
    const themeBox = await page.locator('[data-theme-toggle]').boundingBox();
    expect(toggleBox?.x ?? 0).toBeGreaterThan(themeBox?.x ?? Infinity);
    expect(Math.abs((toggleBox?.y ?? 0) - (themeBox?.y ?? Infinity))).toBeLessThanOrEqual(1);
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
