import { expect, test } from '@playwright/test';

test.describe('keyboard path', () => {
  test('the first Tab reaches a visible skip link that moves focus to main', async ({ page }) => {
    await page.goto('');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('#main')).toBeFocused();
  });

  test('a skip link before the parts list jumps to 01 Selected work', async ({ page }) => {
    for (const path of ['', 'de/']) {
      await page.goto(path);
      const skip = page.locator('.hero__skip');
      await skip.focus();
      await expect(skip).toBeInViewport();
      expect((await skip.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#work$/);
      await page.keyboard.press('Tab');
      await expect(page.locator('#work a:focus')).toHaveCount(1);
    }
  });

  test('focused links show a visible focus ring', async ({ page }) => {
    await page.goto('');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).not.toBe('none');
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });
});
