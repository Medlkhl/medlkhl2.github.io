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
      summary[preset] = manifest
        .filter((entry) => entry.isRepresentativeRun)
        .map((entry) => ({
          page: new URL(entry.url).pathname.replace(BASE, '/'),
          ...Object.fromEntries(
            Object.entries(entry.summary).map(([key, value]) => [key, Math.round(value * 100)]),
          ),
        }))
        .sort((a, b) => a.page.localeCompare(b.page));
    }
  }
} finally {
  server.close();
}

await writeFile(join('reports', 'lighthouse', 'summary.json'), JSON.stringify(summary, null, 2));
const lines = [];
for (const [preset, rows] of Object.entries(summary)) {
  lines.push(`\n${preset.toUpperCase()}`, 'page'.padEnd(28) + 'perf  a11y  bp    seo');
  for (const row of rows) {
    lines.push(
      row.page.padEnd(28) +
        [row.performance, row.accessibility, row['best-practices'], row.seo]
          .map((v) => String(v).padEnd(6))
          .join(''),
    );
  }
}
console.log(lines.join('\n'));
if (failed) {
  console.error('\nLighthouse assertions failed (see above).');
  process.exit(1);
}
