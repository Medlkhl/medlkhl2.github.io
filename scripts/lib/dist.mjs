/** Shared helpers for the scripts that inspect dist/. */
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { normalizeBase } from '../serve-dist.mjs';
import { BASE_PATH, SITE_URL } from '../../site.config.ts';

export const BASE = normalizeBase(BASE_PATH);
export const ORIGIN = SITE_URL.replace(/\/+$/, '');
export const DIST = 'dist';

/** Recursively lists files under a directory (relative paths with forward slashes). */
export async function listFiles(dir, filter = () => true) {
  const out = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (filter(full)) out.push(relative(dir, full).split(sep).join('/'));
    }
  }
  await walk(dir);
  return out.sort();
}

/** 'about/index.html' → '/medlkhl2.github.io/about/'; '404.html' → '/medlkhl2.github.io/404.html'. */
export function fileToUrlPath(file) {
  if (file === 'index.html') return BASE;
  if (file.endsWith('/index.html')) return `${BASE}${file.slice(0, -'index.html'.length)}`;
  return `${BASE}${file}`;
}

/** '/medlkhl2.github.io/about/' → 'about/index.html'; returns null outside the base path. */
export function urlPathToFile(pathname) {
  if (!pathname.startsWith(BASE)) return null;
  const rel = pathname.slice(BASE.length);
  if (rel === '' || rel.endsWith('/')) return `${rel}index.html`;
  return rel;
}

export function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
