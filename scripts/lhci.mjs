#!/usr/bin/env node
/**
 * Lighthouse CI against dist/ served under the real base path.
 * Runs every public page twice: mobile (Lighthouse default emulation and
 * throttling) and desktop. Asserts ≥ 0.95 in all four categories (brief §10)
 * and writes filesystem reports to reports/lighthouse/<preset>/ plus a summary.
 *
 * Usage: node scripts/lhci.mjs [--preset mobile|desktop] [--runs 1]
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { startServer } from './serve-dist.mjs';
import { BASE, DIST, fileToUrlPath, listFiles } from './lib/dist.mjs';

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `pnpm build` first.');
  process.exit(1);
}

const arg = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
};
const presets = arg('--preset') ? [arg('--preset')] : ['mobile', 'desktop'];
const runs = Number(arg('--runs') ?? 1);

// Public pages only: no internal /tokens/, no noindex 404, no generated assets.
const pages = (await listFiles(DIST, (file) => file.endsWith('index.html')))
  .filter((file) => !file.startsWith('tokens/') && !file.startsWith('_astro/'))
  .map(fileToUrlPath);

const { server, origin } = await startServer({ port: 0, quiet: true });
const urls = pages.map((path) => `${origin}${path}`);
const summary = {};
let failed = false;

try {
  for (const preset of presets) {
    const outputDir = join('reports', 'lighthouse', preset);
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    const config = {
      ci: {
        collect: {
          url: urls,
          numberOfRuns: runs,
          settings: {
            ...(preset === 'desktop' ? { preset: 'desktop' } : {}),
            chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
          },
        },
        assert: {
          assertions: {
            'categories:performance': ['error', { minScore: 0.95 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
        upload: {
          target: 'filesystem',
          outputDir,
          reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
        },
      },
    };
    const configPath = join('reports', 'lighthouse', `lighthouserc.${preset}.json`);
    await writeFile(configPath, JSON.stringify(config, null, 2));
    console.log(`\nLighthouse (${preset}): ${urls.length} pages × ${runs} run(s)`);
    // Async spawn: the static server lives in this process, so the event loop must keep running.
    const status = await new Promise((resolveStatus) => {
      const child = spawn('pnpm', ['exec', 'lhci', 'autorun', `--config=${configPath}`], {
        stdio: 'inherit',
        env: {
          ...process.env,
          LHCI_BUILD_CONTEXT__CURRENT_HASH: process.env.GITHUB_SHA ?? 'local',
        },
      });
      child.on('close', (code) => resolveStatus(code ?? 1));
    });
    if (status !== 0) failed = true;

    const manifestPath = join(outputDir, 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      const rows = [];
      for (const entry of manifest.filter((item) => item.isRepresentativeRun)) {
        const lhr = JSON.parse(await readFile(entry.jsonPath, 'utf8'));
        const metric = (id) => lhr.audits[id]?.numericValue;
        rows.push({
          page: new URL(entry.url).pathname.replace(BASE, '/'),
          ...Object.fromEntries(
            Object.entries(entry.summary).map(([key, value]) => [key, Math.round(value * 100)]),
          ),
          lcpMs: Math.round(metric('largest-contentful-paint') ?? 0),
          cls: Number((metric('cumulative-layout-shift') ?? 0).toFixed(3)),
          tbtMs: Math.round(metric('total-blocking-time') ?? 0),
          fcpMs: Math.round(metric('first-contentful-paint') ?? 0),
        });
      }
      summary[preset] = rows.sort((a, b) => a.page.localeCompare(b.page));
    }
  }
} finally {
  server.close();
}

await writeFile(join('reports', 'lighthouse', 'summary.json'), JSON.stringify(summary, null, 2));
const md = ['# Lighthouse', ''];
for (const [preset, rows] of Object.entries(summary)) {
  md.push(
    `## ${preset}`,
    '',
    '| Page | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT |',
    '| --- | --: | --: | --: | --: | --: | --: | --: |',
  );
  for (const row of rows) {
    md.push(
      `| ${row.page} | ${row.performance} | ${row.accessibility} | ${row['best-practices']} | ${row.seo} | ${(row.lcpMs / 1000).toFixed(2)} s | ${row.cls} | ${row.tbtMs} ms |`,
    );
  }
  const min = (key) => Math.min(...rows.map((row) => row[key]));
  const max = (key) => Math.max(...rows.map((row) => row[key]));
  md.push(
    '',
    `Minimum scores: performance ${min('performance')}, accessibility ${min('accessibility')}, best practices ${min('best-practices')}, SEO ${min('seo')}. Worst LCP ${(max('lcpMs') / 1000).toFixed(2)} s, worst CLS ${max('cls')}.`,
    '',
  );
}
await writeFile(join('reports', 'lighthouse', 'summary.md'), `${md.join('\n')}\n`);
console.log(md.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `${md.join('\n')}\n`);
}
if (failed) {
  console.error('\nLighthouse assertions failed (see above).');
  process.exit(1);
}
