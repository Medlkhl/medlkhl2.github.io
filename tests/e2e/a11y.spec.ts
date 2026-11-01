import AxeBuilder from '@axe-core/playwright';
import { type Page, expect, test } from '@playwright/test';
import { allPages, rel } from './utils.ts';

const pages = [...allPages(), { locale: 'en' as const, path: '/tokens/', id: 'en-tokens' }];
const THEMES = ['graphite', 'paper'] as const;

async function expectNoViolations(page: Page, theme: (typeof THEMES)[number], path: string) {
  await page.addInitScript((value) => localStorage.setItem('pref:theme', value), theme);
  await page.goto(rel(path));
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  const summary = results.violations.map(
    (v) => `${v.impact} ${v.id}: ${v.nodes.length} node(s) — ${v.help}`,
  );
  expect(serious, summary.join('\n')).toEqual([]);
  expect(results.violations, summary.join('\n')).toEqual([]);
}

for (const theme of THEMES) {
  test.describe(`axe (WCAG 2.2 AA) in the ${theme} theme`, () => {
    for (const { path, id } of pages) {
      test(`${id} ${path}`, async ({ page }) => {
        await expectNoViolations(page, theme, path);
      });
    }
  });
}

// The tokens page's wide tables scroll on phones: their regions must be keyboard-reachable.
test.describe('axe at 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  for (const theme of THEMES) {
    test(`en-tokens /tokens/ in the ${theme} theme`, async ({ page }) => {
      await expectNoViolations(page, theme, '/tokens/');
    });
  }
});
