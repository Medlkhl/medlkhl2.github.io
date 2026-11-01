#!/usr/bin/env node
/**
 * Crawls every HTML file in dist/ and fails on any broken internal reference:
 * links, assets, srcset candidates, canonical/hreflang URLs, Open Graph images,
 * in-page and cross-page #fragments, and every URL in the sitemap.
 * It also enforces the URL policy: internal URLs must carry the base path,
 * page URLs must end with "/", and there must be no tel: links or iframes.
 * External links are listed but not fetched (CI has no reason to hit LinkedIn).
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { parse } from 'node-html-parser';
import { BASE, DIST, ORIGIN, fileToUrlPath, listFiles, urlPathToFile } from './lib/dist.mjs';

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `pnpm build` first.');
  process.exit(1);
}

const htmlFiles = await listFiles(DIST, (file) => file.endsWith('.html'));
const errors = [];
const external = new Map();
const idCache = new Map();
let checked = 0;

async function idsOf(file) {
  if (!idCache.has(file)) {
    const root = parse(await readFile(join(DIST, file), 'utf8'));
    const ids = new Set(root.querySelectorAll('[id]').map((el) => el.getAttribute('id')));
    root.querySelectorAll('a[name]').forEach((el) => ids.add(el.getAttribute('name')));
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

function srcsetUrls(value) {
  return value
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

async function checkRef(page, pageUrl, raw, where) {
  const ref = raw.trim();
  if (!ref) return;
  if (/^(mailto|data):/i.test(ref)) return;
  if (/^tel:/i.test(ref)) {
    errors.push({
      page,
      ref,
      where,
      problem: 'tel: links are not allowed (no phone number on the site)',
    });
    return;
  }
  if (/^javascript:/i.test(ref)) {
    errors.push({ page, ref, where, problem: 'javascript: URLs are not allowed' });
    return;
  }

  let url;
  try {
    url = new URL(ref, `${ORIGIN}${pageUrl}`);
  } catch {
    errors.push({ page, ref, where, problem: 'unparseable URL' });
    return;
  }

  const internalOrigin = url.origin === ORIGIN || url.origin === 'http://localhost';
  if (!internalOrigin) {
    if (!/^https?:$/.test(url.protocol)) return;
    external.set(url.href, (external.get(url.href) ?? 0) + 1);
    return;
  }

  checked += 1;
  const pathname = decodeURI(url.pathname);
  if (!pathname.startsWith(BASE)) {
    errors.push({ page, ref, where, problem: `internal URL is missing the base path ${BASE}` });
    return;
  }
  const hasExtension = extname(pathname) !== '';
  if (!hasExtension && !pathname.endsWith('/')) {
    errors.push({
      page,
      ref,
      where,
      problem: 'page URL must end with "/" (trailing-slash policy)',
    });
    return;
  }
  const file = urlPathToFile(pathname);
  if (!file || !existsSync(join(DIST, file))) {
    errors.push({ page, ref, where, problem: `target does not exist (${file ?? pathname})` });
    return;
  }
  const fragment = decodeURIComponent(url.hash.replace(/^#/, ''));
  if (fragment && file.endsWith('.html')) {
    const ids = await idsOf(file);
    if (!ids.has(fragment)) {
      errors.push({ page, ref, where, problem: `fragment #${fragment} not found in ${file}` });
    }
  }
}

for (const file of htmlFiles) {
  const pageUrl = fileToUrlPath(file);
  const root = parse(await readFile(join(DIST, file), 'utf8'));

  for (const el of root.querySelectorAll('iframe')) {
    errors.push({
      page: file,
      ref: el.getAttribute('src') ?? '',
      where: 'iframe',
      problem: 'iframes are not allowed (no third-party embeds)',
    });
  }

  const refs = [];
  for (const el of root.querySelectorAll('a[href]'))
    refs.push([el.getAttribute('href'), 'a[href]']);
  for (const el of root.querySelectorAll('link[href]'))
    refs.push([el.getAttribute('href'), `link[rel=${el.getAttribute('rel')}]`]);
  for (const el of root.querySelectorAll(
    'script[src], img[src], source[src], video[src], audio[src], track[src]',
  ))
    refs.push([el.getAttribute('src'), `${el.tagName.toLowerCase()}[src]`]);
  for (const el of root.querySelectorAll('video[poster]'))
    refs.push([el.getAttribute('poster'), 'video[poster]']);
  for (const el of root.querySelectorAll('img[srcset], source[srcset]'))
    for (const candidate of srcsetUrls(el.getAttribute('srcset') ?? ''))
      refs.push([candidate, `${el.tagName.toLowerCase()}[srcset]`]);
  for (const el of root.querySelectorAll(
    'meta[property="og:image"], meta[property="og:url"], meta[name="twitter:image"]',
  ))
    refs.push([
      el.getAttribute('content'),
      `meta[${el.getAttribute('property') ?? el.getAttribute('name')}]`,
    ]);

  for (const [ref, where] of refs) await checkRef(file, pageUrl, ref ?? '', where);
}

// Sitemap: every <loc> and hreflang alternate must exist.
const sitemaps = (await listFiles(DIST, (file) => /sitemap-\d+\.xml$/.test(file))).map((file) =>
  join(DIST, file),
);
let sitemapUrls = 0;
for (const sitemap of sitemaps) {
  const xml = await readFile(sitemap, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>|href="([^"]+)"/g)].map((m) => m[1] ?? m[2]);
  sitemapUrls += urls.length;
  for (const url of urls) await checkRef('sitemap', '/', url, 'sitemap');
}

await mkdir('reports', { recursive: true });
await writeFile(
  'reports/link-check.json',
  JSON.stringify(
    {
      pages: htmlFiles.length,
      internalChecked: checked,
      sitemapUrls,
      errors,
      external: Object.fromEntries(external),
    },
    null,
    2,
  ),
);

console.log(
  `Link check: ${htmlFiles.length} pages, ${checked} internal references, ${sitemapUrls} sitemap URLs.`,
);
console.log(`External links (listed, not fetched): ${external.size}`);
for (const href of [...external.keys()].sort()) console.log(`  ${href}`);
if (errors.length) {
  console.error(`\n${errors.length} broken or invalid internal reference(s):`);
  for (const error of errors)
    console.error(`  ${error.page}  ${error.where}  ${error.ref}\n    → ${error.problem}`);
  process.exit(1);
}
console.log('No broken internal links.');
