import { expect, test, type Page } from '@playwright/test';
import { WORK_SLUGS } from '../../src/schemas/data.ts';

/** Scrolls a part of the home page to the middle of the viewport. */
async function centre(page: Page, selector: string) {
  await page.locator(selector).evaluate((element) => element.scrollIntoView({ block: 'center' }));
}

test.describe('header', () => {
  test('the home page highlights the section in view and clears it elsewhere', async ({ page }) => {
    await page.goto('');
    const active = page.locator('[data-nav-section][data-active]');
    await expect(active).toHaveCount(0);

    for (const [section, key] of [
      ['#work', 'work'],
      ['#experience', 'experience'],
      ['#capabilities', null],
      ['#recommendations', null],
      ['#contact', 'contact'],
    ] as const) {
      await centre(page, section);
      if (key) {
        await expect(active).toHaveCount(1);
        await expect(active).toHaveAttribute('data-nav-section', key);
      } else {
        await expect(active, section).toHaveCount(0);
      }
    }

    // Below the last section (the footer in view) Contact stays highlighted.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(active).toHaveAttribute('data-nav-section', 'contact');

    // Back at the hero nothing is highlighted.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(active).toHaveCount(0);
  });

  test('the Work link is the current page on /work/ and the current section on a case study', async ({
    page,
  }) => {
    const work = page.locator('.site-nav a[href$="/work/"]');
    await page.goto('work/');
    await expect(work).toHaveAttribute('aria-current', 'page');
    await page.goto(`work/${WORK_SLUGS[0]}/`);
    await expect(work).toHaveAttribute('aria-current', 'true');
    // Only the breadcrumb marks the case study itself as the page.
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
  });
});
