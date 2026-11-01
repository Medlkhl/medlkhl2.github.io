import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allPages, rel } from './utils.ts';

const pages = [...allPages(), { locale: 'en' as const, path: '/tokens/', id: 'en-tokens' }];

for (const theme of ['graphite', 'paper'] as const) {
  test.describe(`axe (WCAG 2.2 AA) in the ${theme} theme`, () => {
    for (const { path, id } of pages) {
      test(`${id} ${path}`, async ({ page }) => {
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
      });
    }
  });
}
