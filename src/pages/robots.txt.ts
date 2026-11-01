import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/url.ts';

/**
 * robots.txt with an absolute sitemap URL. Note: crawlers only read robots.txt
 * at the host root, so on the GitHub Pages project URL this file is
 * informational; it takes effect once a custom domain serves the site at "/".
 */
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
