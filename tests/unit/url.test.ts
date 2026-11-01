import { describe, expect, it } from 'vitest';
import { BASE_PATH, SITE_URL } from '../../site.config.ts';
import {
  href,
  localeFromPath,
  localePath,
  routeHref,
  switchLocalePath,
  unlocalizePath,
  workHref,
} from '../../src/i18n/routes.ts';
import { cvPdfHref } from '../../src/lib/cv.ts';
import {
  absoluteUrl,
  ensureTrailingSlash,
  normalizeBase,
  stripBase,
  withBase,
} from '../../src/lib/url.ts';

const B = normalizeBase(BASE_PATH);

describe('base path and trailing-slash policy', () => {
  it('normalises the base path', () => {
    expect(normalizeBase('/medlkhl2.github.io')).toBe('/medlkhl2.github.io/');
    expect(normalizeBase('medlkhl2.github.io/')).toBe('/medlkhl2.github.io/');
    expect(normalizeBase('/')).toBe('/');
    expect(normalizeBase('')).toBe('/');
  });

  it('adds the base and a trailing slash to page paths only', () => {
    expect(withBase('/')).toBe(B);
    expect(withBase('/about')).toBe(`${B}about/`);
    expect(withBase('about/')).toBe(`${B}about/`);
    expect(withBase('/#contact')).toBe(`${B}#contact`);
    expect(withBase('/og/en/home.png')).toBe(`${B}og/en/home.png`);
    expect(withBase('https://github.com/Medlkhl')).toBe('https://github.com/Medlkhl');
    expect(withBase('mailto:a@b.c')).toBe('mailto:a@b.c');
    expect(ensureTrailingSlash('/x?y=1')).toBe('/x/?y=1');
  });

  it('builds absolute URLs from SITE_URL and BASE_PATH', () => {
    expect(absoluteUrl('/de/about/')).toBe(`${SITE_URL}${B}de/about/`);
    expect(stripBase(`${B}de/about/`)).toBe('/de/about/');
    expect(stripBase(B.slice(0, -1))).toBe('/');
  });
});

describe('locale routing', () => {
  it('maps paths between locales', () => {
    expect(localePath('en', '/about/')).toBe('/about/');
    expect(localePath('de', '/about/')).toBe('/de/about/');
    expect(localePath('de', '/')).toBe('/de/');
    expect(unlocalizePath('/de/work/happ/')).toBe('/work/happ/');
    expect(unlocalizePath('/de/')).toBe('/');
    expect(localeFromPath('/de/lab/')).toBe('de');
    expect(localeFromPath('/lab/')).toBe('en');
    expect(switchLocalePath('/work/happ/', 'de')).toBe('/de/work/happ/');
    expect(switchLocalePath('/de/impressum/', 'en')).toBe('/impressum/');
  });

  it('builds hrefs with base path', () => {
    expect(routeHref('de', 'cv')).toBe(`${B}de/cv/`);
    expect(routeHref('en', 'home', 'contact')).toBe(`${B}#contact`);
    expect(workHref('de', 'happ')).toBe(`${B}de/work/happ/`);
    expect(href('en', '/lab/')).toBe(`${B}lab/`);
  });

  it('links the PDF CVs', () => {
    expect(cvPdfHref('en')).toBe(`${B}Mohamed-Lakhel-CV-EN.pdf`);
    expect(cvPdfHref('de')).toBe(`${B}Mohamed-Lakhel-Lebenslauf-DE.pdf`);
  });
});
