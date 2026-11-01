import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOCALES } from '../../src/i18n/config.ts';
import { ROUTES } from '../../src/i18n/routes.ts';
import { WORK_SLUGS } from '../../src/schemas/data.ts';
import type { WorkFrontmatter } from '../../src/schemas/work.ts';
import { WORK_DIR, readMdx, workFiles } from './helpers.ts';
import { existsSync, readdirSync } from 'node:fs';

/** Every *.copy.ts module (UI strings, page copy, page meta). */
const copyModules = import.meta.glob<Record<string, unknown>>('../../src/**/*.copy.ts', {
  eager: true,
});

type Shape = string | number | boolean | null | Shape[] | { [key: string]: Shape };

/** Collects structural differences between the English and German copy trees. */
function diff(en: unknown, de: unknown, path: string, out: string[]): void {
  if (typeof en === 'string') {
    if (typeof de !== 'string') out.push(`${path}: type differs`);
    else {
      if (!en.trim()) out.push(`${path}: empty English string`);
      if (!de.trim()) out.push(`${path}: empty German string`);
    }
    return;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(de)) return void out.push(`${path}: German is not an array`);
    if (en.length !== de.length)
      out.push(`${path}: ${en.length} English vs ${de.length} German items`);
    en.forEach((item, index) => diff(item, de[index], `${path}[${index}]`, out));
    return;
  }
  if (en && typeof en === 'object') {
    if (!de || typeof de !== 'object') return void out.push(`${path}: German is not an object`);
    const keys = new Set([...Object.keys(en), ...Object.keys(de as object)]);
    for (const key of keys) {
      if (!(key in en)) out.push(`${path}.${key}: only in German`);
      else if (!(key in (de as object))) out.push(`${path}.${key}: missing in German`);
      else
        diff(
          (en as Record<string, Shape>)[key],
          (de as Record<string, Shape>)[key],
          `${path}.${key}`,
          out,
        );
    }
    return;
  }
  if (typeof en !== typeof de) out.push(`${path}: type differs`);
}

describe('EN/DE parity of every copy module', () => {
  const entries = Object.entries(copyModules);
  it('finds the copy modules', () => expect(entries.length).toBeGreaterThan(1));
  for (const [file, mod] of entries) {
    for (const [name, value] of Object.entries(mod)) {
      if (!value || typeof value !== 'object' || !('en' in value) || !('de' in value)) continue;
      it(`${file.replace('../../', '')} → ${name}`, () => {
        const problems: string[] = [];
        const copy = value as Record<string, unknown>;
        diff(copy.en, copy.de, name, problems);
        expect(problems).toEqual([]);
      });
    }
  }
});

describe('EN/DE parity of pages', () => {
  it('every English route file has a German twin under src/pages/de/', () => {
    for (const path of Object.values(ROUTES)) {
      const name = path === '/' ? 'index' : path.replace(/^\/|\/$/g, '');
      const en = [`src/pages/${name}.astro`, `src/pages/${name}/index.astro`].some((f) =>
        existsSync(f),
      );
      const de = [`src/pages/de/${name}.astro`, `src/pages/de/${name}/index.astro`].some((f) =>
        existsSync(f),
      );
      expect({ path, en, de }).toEqual({ path, en: true, de: true });
    }
  });

  it('every page file under src/pages/ (except root-only files) exists in both locales', () => {
    const rootOnly = new Set(['404.astro', 'tokens.astro', 'robots.txt.ts', 'og', 'de']);
    const en = readdirSync('src/pages').filter((f) => !rootOnly.has(f));
    const de = readdirSync('src/pages/de');
    expect(de.sort()).toEqual(en.sort());
  });
});

describe('EN/DE parity of case studies', () => {
  it('the same slugs exist in both locales and match WORK_SLUGS', () => {
    const [en, de] = LOCALES.map((locale) => workFiles(locale).map((f) => f.replace(/\.mdx$/, '')));
    expect(en).toEqual(de);
    expect(en?.slice().sort()).toEqual([...WORK_SLUGS].sort());
  });

  for (const file of workFiles('en')) {
    it(`${file}: structure matches between locales`, () => {
      const en = readMdx(join(WORK_DIR, 'en', file)).data as unknown as WorkFrontmatter;
      const de = readMdx(join(WORK_DIR, 'de', file)).data as unknown as WorkFrontmatter;
      const structure = (d: WorkFrontmatter) => ({
        status: d.status,
        order: d.order,
        featured: d.featured,
        layers: d.layers,
        timeframe: d.timeframe,
        platforms: d.platforms?.length,
        stack: d.stack,
        constraints: d.constraints?.length,
        responsibilities: d.responsibilities?.length,
        diagram: d.architecture?.diagram,
        steps: d.architecture?.steps?.map((step) => step.id),
        decisions: d.architecture?.decisions?.length,
        problems: d.problems?.map((problem) => problem.evidence.type),
        metrics: d.results?.metrics?.length,
        outcomes: d.results?.outcomes?.length,
        recommendation: d.proof?.recommendation ?? null,
        links: d.proof?.links?.map((link) => link.href) ?? [],
        confidentiality: Boolean(d.confidentiality),
        scene: d.scene,
      });
      expect(structure(de)).toEqual(structure(en));
    });
  }
});
