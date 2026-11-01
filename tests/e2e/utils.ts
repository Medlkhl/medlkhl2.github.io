import type { Page } from '@playwright/test';
import { LOCALES, type Locale } from '../../src/i18n/config.ts';
import { ROUTES, localePath } from '../../src/i18n/routes.ts';
import { WORK_SLUGS } from '../../src/schemas/data.ts';

/** Every public page in both locales (paths without base). */
export function allPages(): Array<{ locale: Locale; path: string; id: string }> {
  const pages: Array<{ locale: Locale; path: string; id: string }> = [];
  for (const locale of LOCALES) {
    for (const [key, path] of Object.entries(ROUTES)) {
      pages.push({ locale, path: localePath(locale, path), id: `${locale}-${key}` });
    }
    for (const slug of WORK_SLUGS) {
      pages.push({
        locale,
        path: localePath(locale, `/work/${slug}/`),
        id: `${locale}-work-${slug}`,
      });
    }
  }
  return pages;
}

/** Relative URL for page.goto (resolves against the baseURL that includes the base path). */
export function rel(path: string): string {
  return path.replace(/^\//, '');
}

/** Collects console errors and uncaught exceptions for a page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}
