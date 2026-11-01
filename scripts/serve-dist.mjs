#!/usr/bin/env node
/**
 * Serves dist/ under BASE_PATH the way GitHub Pages does:
 *   - /medlkhl2.github.io        → 301 to /medlkhl2.github.io/
 *   - /…/about                   → 301 to /…/about/ when about/index.html exists
 *   - missing files              → dist/404.html with status 404
 * Used by Playwright, the PDF printer and Lighthouse CI, so every check runs
 * against the real base path.
 *
 * Usage: node scripts/serve-dist.mjs [--port 4321] [--host 127.0.0.1] [--dir dist]
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE_PATH } from '../site.config.ts';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

export function normalizeBase(base) {
  const trimmed = String(base)
    .trim()
    .replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export const BASE = normalizeBase(BASE_PATH);

function send(res, status, filePath, headers = {}) {
  res.writeHead(status, {
    'Content-Type': MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
    ...headers,
  });
  createReadStream(filePath).pipe(res);
}

function notFound(res, root) {
  const page = join(root, '404.html');
  if (existsSync(page)) return send(res, 404, page);
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

/** Starts the server; resolves with { server, origin, url } where url includes the base path. */
export function startServer({ port = 4321, host = '127.0.0.1', dir = 'dist', quiet = false } = {}) {
  const root = resolve(dir);
  if (!existsSync(root))
    throw new Error(`Nothing to serve: ${root} does not exist. Run the build first.`);

  const server = createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end('Bad request');
      return;
    }

    if (BASE !== '/' && pathname === BASE.slice(0, -1)) {
      res.writeHead(301, { Location: BASE }).end();
      return;
    }
    if (!pathname.startsWith(BASE)) return notFound(res, root);

    const filePath = resolve(root, `.${sep}${pathname.slice(BASE.length)}`);
    if (filePath !== root && !filePath.startsWith(root + sep)) return notFound(res, root);

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${pathname}/` }).end();
        return;
      }
      const index = join(filePath, 'index.html');
      return existsSync(index) ? send(res, 200, index) : notFound(res, root);
    }
    if (existsSync(filePath)) return send(res, 200, filePath);
    return notFound(res, root);
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      const origin = `http://${host}:${actualPort}`;
      if (!quiet) console.log(`Serving ${root} at ${origin}${BASE}`);
      resolvePromise({ server, origin, url: `${origin}${BASE}` });
    });
  });
}

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await startServer({
    port: Number(arg('--port') ?? process.env.PORT ?? 4321),
    host: arg('--host') ?? '127.0.0.1',
    dir: arg('--dir') ?? 'dist',
  });
}
