import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { BASE_PATH, SITE_URL } from '../../site.config.ts';
import { LOCALES } from '../../src/i18n/config.ts';
import { localePath, unlocalizePath } from '../../src/i18n/routes.ts';
import { allPages, rel } from './utils.ts';

/**
 * SEO checks against the built site: head metadata on every public page in
 * both locales, social images, JSON-LD, uniqueness, the sitemap, robots.txt
 * and the 404 page. Production URLs (SITE_URL + BASE_PATH) are mapped onto the
 * local server by stripping the production root.
 */
const BASE = `/${BASE_PATH.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const ROOT = `${SITE_URL.replace(/\/+$/, '')}${BASE}`;
const absolute = (path: string) => `${ROOT}${path.replace(/^\//, '')}`;
const MAX_IMAGE_BYTES = 120 * 1024;

/** A production URL as a URL relative to the test server's baseURL. */
function toLocal(url: string): string {
  if (!url.startsWith(ROOT)) throw new Error(`${url} is not under ${ROOT}`);
  return url.slice(ROOT.length);
}

test.describe('head metadata on every public page', () => {
  for (const { locale, path, id } of allPages()) {
    test(`${id} ${path}`, async ({ page, request }) => {
      await page.goto(rel(path));
      const head = page.locator('head');

      await expect(head.locator('title')).toHaveCount(1);
      await expect(head.locator('meta[name="description"]')).toHaveCount(1);
      await expect(head.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(head.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /^index, follow/,
      );

      const canonical = await head.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(absolute(path));
      expect(canonical).toMatch(/\/$/);
      await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        absolute(path),
      );
      await expect(head.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        locale === 'en' ? 'en_GB' : 'de_DE',
      );

      const twin = unlocalizePath(path);
      await expect(head.locator('link[rel="alternate"][hreflang]')).toHaveCount(LOCALES.length + 1);
      for (const alt of LOCALES) {
        await expect(head.locator(`link[rel="alternate"][hreflang="${alt}"]`)).toHaveAttribute(
          'href',
          absolute(localePath(alt, twin)),
        );
      }
      await expect(head.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        absolute(localePath('en', twin)),
      );

      // The social image exists, is a 1200 × 630 PNG and stays within its budget.
      const image = await head.locator('meta[property="og:image"]').getAttribute('content');
      expect(image).toMatch(/\.png$/);
      await expect(head.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        image ?? '',
      );
      const alt = await head.locator('meta[property="og:image:alt"]').getAttribute('content');
      expect(alt?.length).toBeGreaterThan(20);
      const response = await request.get(toLocal(image ?? ''));
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
      const png = await response.body();
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
      expect(png.length).toBeLessThanOrEqual(MAX_IMAGE_BYTES);

      // Every JSON-LD block parses and is schema.org.
      for (const text of await head
        .locator('script[type="application/ld+json"]')
        .allTextContents()) {
        const data = JSON.parse(text) as Record<string, unknown>;
        expect(data['@context']).toBe('https://schema.org');
        expect(typeof data['@type']).toBe('string');
      }
    });
  }
});

test('titles and descriptions are unique across the site', async ({ request }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const { path } of allPages()) {
    const html = await (await request.get(rel(path))).text();
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1] ?? '';
    const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? '';
    expect(title, path).toContain('Mohamed Lakhel');
    expect(description.length, path).toBeGreaterThan(50);
    expect(description, `${path}: placeholder in the description`).not.toMatch(/\[[A-Z]+: /);
    expect(titles.get(title), `${path} repeats the title of ${titles.get(title)}`).toBeUndefined();
    expect(
      descriptions.get(description),
      `${path} repeats the description of ${descriptions.get(description)}`,
    ).toBeUndefined();
    titles.set(title, path);
    descriptions.set(description, path);
  }
});

test('JSON-LD on the legal pages is a two-step BreadcrumbList', async ({ page }) => {
  for (const path of ['impressum/', 'de/datenschutz/']) {
    await page.goto(path);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const crumbs = blocks
      .map((text) => JSON.parse(text) as { '@type': string; itemListElement?: unknown[] })
      .find((data) => data['@type'] === 'BreadcrumbList');
    expect(crumbs?.itemListElement).toHaveLength(2);
  }
});

test('the sitemap lists every public page with en, de and x-default and nothing internal', async ({
  request,
}) => {
  const index = await (await request.get('sitemap-index.xml')).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
  expect(sitemaps.length).toBeGreaterThan(0);

  const entries = new Map<string, Record<string, string>>();
  for (const sitemap of sitemaps) {
    const xml = await (await request.get(toLocal(sitemap))).text();
    for (const [, block = ''] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1] ?? '';
      const links = block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g);
      entries.set(loc, Object.fromEntries([...links].map((match) => [match[1], match[2]])));
    }
  }

  const pages = allPages();
  for (const { path } of pages) {
    const alternates = entries.get(absolute(path));
    expect(alternates, `${path} is missing from the sitemap`).toBeDefined();
    // The same alternates as every page head; x-default is the English page.
    const twin = unlocalizePath(path);
    expect(alternates).toEqual({
      ...Object.fromEntries(LOCALES.map((alt) => [alt, absolute(localePath(alt, twin))])),
      'x-default': absolute(localePath('en', twin)),
    });
  }
  const locs = [...entries.keys()];
  expect(locs.filter((loc) => loc.includes('/tokens/'))).toEqual([]);
  expect(locs.filter((loc) => loc.includes('404'))).toEqual([]);
  expect(locs).toHaveLength(pages.length);
});

test('robots.txt allows crawling and names the absolute sitemap URL', async ({ request }) => {
  const response = await request.get('robots.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/^User-agent: \*$/m);
  expect(text).toContain(`Sitemap: ${ROOT}sitemap-index.xml`);
});

test('internal pages are noindex and have no canonical', async ({ page }) => {
  await page.goto('tokens/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test.describe('the bilingual 404 page', () => {
  test('is noindex, bilingual and links absolutely', async ({ page }) => {
    const response = await page.goto('some/deep/missing/path/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('section[lang="en"] h1')).toBeVisible();
    await expect(page.locator('section[lang="de"] h2')).toBeVisible();
    const hrefs = await page
      .locator('main a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.length).toBeGreaterThanOrEqual(8);
    for (const href of hrefs) expect(href.startsWith(BASE)).toBe(true);
    // The links work from any depth.
    await page.locator('section[lang="de"] a').first().click();
    await expect(page).toHaveURL(new RegExp(`${BASE.replace(/[.]/g, '\\.')}de/$`));
  });

  for (const theme of ['graphite', 'paper'] as const) {
    test(`passes axe in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('pref:theme', value), theme);
      await page.goto('404.html');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      const summary = results.violations.map((v) => `${v.impact} ${v.id}: ${v.help}`);
      expect(results.violations, summary.join('\n')).toEqual([]);
    });
  }
});

test.describe('legal pages', () => {
  test('the English versions point to the binding German text', async ({ page }) => {
    for (const key of ['impressum', 'datenschutz']) {
      await page.goto(`${key}/`);
      const link = page.locator(`[role="note"] a[hreflang="de"]`);
      await expect(link).toHaveAttribute('href', `${BASE}de/${key}/`);
    }
  });

  test('the spatial-view section stays hidden until the feature ships', async ({ page }) => {
    await page.goto('de/datenschutz/');
    await expect(page.locator('#raeumliche-ansicht')).toHaveCount(0);
    await page.goto('datenschutz/');
    await expect(page.locator('#spatial-view')).toHaveCount(0);
  });

  test('name and address are visible placeholders', async ({ page }) => {
    await page.goto('de/impressum/');
    await expect(page.locator('address .ph')).toHaveCount(3);
  });
});
