import { defineConfig, devices } from '@playwright/test';
import { BASE_PATH } from './site.config.ts';

/**
 * E2E tests run against the built site (dist/) served under the real base
 * path by scripts/serve-dist.mjs. Use relative URLs in tests (no leading
 * slash) so they resolve against baseURL, or the helpers in tests/e2e/utils.ts.
 */
const PORT = Number(process.env.E2E_PORT ?? 4322);
const BASE = `/${BASE_PATH.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const ORIGIN = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright' }],
    ['json', { outputFile: 'reports/playwright/results.json' }],
  ],
  use: {
    baseURL: `${ORIGIN}${BASE}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `node scripts/serve-dist.mjs --port ${PORT}`,
    url: `${ORIGIN}${BASE}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
