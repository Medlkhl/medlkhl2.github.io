import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { BASE_PATH, SITE_URL } from './site.config.ts';
import { rehypePlaceholders } from './src/lib/rehype-placeholders.ts';

/** Unicode ranges of the Fontsource subsets we ship (latin is preloaded, latin-ext loads on demand). */
const LATIN = [
  'U+0000-00FF',
  'U+0131',
  'U+0152-0153',
  'U+02BB-02BC',
  'U+02C6',
  'U+02DA',
  'U+02DC',
  'U+0304',
  'U+0308',
  'U+0329',
  'U+2000-206F',
  'U+20AC',
  'U+2122',
  'U+2191',
  'U+2193',
  'U+2212',
  'U+2215',
  'U+FEFF',
  'U+FFFD',
] as [string, ...string[]];
const LATIN_EXT = [
  'U+0100-02BA',
  'U+02BD-02C5',
  'U+02C7-02CC',
  'U+02CE-02D7',
  'U+02DD-02FF',
  'U+1D00-1DBF',
  'U+1E00-1E9F',
  'U+1EF2-1EFF',
  'U+2020',
  'U+20A0-20AB',
  'U+20AD-20C0',
  'U+2113',
  'U+2C60-2C7F',
  'U+A720-A7FF',
] as [string, ...string[]];

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', de: 'de-DE' } },
      // Internal pages never go into the sitemap.
      filter: (page) => !/\/tokens\/$/.test(page) && !/\/404\/?$/.test(page),
    }),
  ],
  markdown: {
    // MDX inherits the processor's plugins (Astro 6.4 API).
    processor: unified({ rehypePlugins: [rehypePlaceholders] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist-sans',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            unicodeRange: LATIN,
          },
          {
            src: ['@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            unicodeRange: LATIN_EXT,
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            unicodeRange: LATIN,
          },
          {
            src: ['@fontsource-variable/geist-mono/files/geist-mono-latin-ext-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
            unicodeRange: LATIN_EXT,
          },
        ],
      },
    },
  ],
});
