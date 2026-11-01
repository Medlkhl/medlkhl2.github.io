import { expect, test } from '@playwright/test';
import { allPages, rel } from './utils.ts';

/**
 * Runtime privacy (brief §11): zero third-party requests, no cookies, no
 * embeds, no phone numbers. Every request must stay on the local server.
 */
test.describe('zero third-party requests, no cookies, no embeds', () => {
  for (const { path, id } of allPages()) {
    test(`${id} ${path}`, async ({ page, context, baseURL }) => {
      const origin = new URL(baseURL ?? 'http://127.0.0.1').origin;
      const foreign: string[] = [];
      page.on('request', (request) => {
        const url = request.url();
        if (url.startsWith('data:') || url.startsWith('blob:')) return;
        if (new URL(url).origin !== origin) foreign.push(url);
      });
      await page.goto(rel(path), { waitUntil: 'networkidle' });
      // Scroll to the bottom so lazy resources (if any) are requested too.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');

      expect(foreign, 'third-party requests').toEqual([]);
      expect(await context.cookies(), 'cookies').toEqual([]);
      await expect(page.locator('iframe, embed, object')).toHaveCount(0);
      await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
      const text = await page.locator('body').innerText();
      expect(text, 'phone number in page text').not.toMatch(
        /(?:\+|\b00)\d{2}[\s/-]?\d{3,}[\s/-]?\d{3,}/,
      );
    });
  }
});
