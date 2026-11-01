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

  test('soft navigations release the header listeners of the previous page', async ({ page }) => {
    await page.goto('');
    const client = await page.context().newCDPSession(page);
    const keydownListeners = async () => {
      const { result } = await client.send('Runtime.evaluate', { expression: 'document' });
      const { listeners } = await client.send('DOMDebugger.getEventListeners', {
        objectId: result.objectId ?? '',
      });
      return listeners.filter((listener) => listener.type === 'keydown').length;
    };
    const before = await keydownListeners();
    expect(before).toBeGreaterThan(0);
    await page.evaluate(() => Reflect.set(window, '__sameDocument', true));

    for (const target of ['lab/', 'about/', 'experience/']) {
      await page.locator(`.site-nav a[href$="/${target}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${target}$`));
    }
    // ClientRouter swapped the pages in the same document (no reload) ...
    expect(await page.evaluate(() => Reflect.get(window, '__sameDocument'))).toBe(true);
    // ... and each page's bindings replaced the previous ones instead of piling up.
    await expect.poll(keydownListeners).toBe(before);
  });
});
