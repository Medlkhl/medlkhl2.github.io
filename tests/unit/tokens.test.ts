import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast.ts';
import {
  COLOR_ROLES,
  CONTRAST_PAIRS,
  THEMES,
  colors,
  motion,
  space,
  targets,
} from '../../src/styles/tokens.ts';

const css = readFileSync('src/styles/tokens.css', 'utf8');

/** Collapses formatter whitespace: 'cubic-bezier(\n 0.7,\n 0 )' → 'cubic-bezier(0.7, 0)'. */
function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\(\s/g, '(').replace(/\s\)/g, ')').trim();
}

/** Custom properties declared inside the first block that starts with `selector {`. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No block for ${selector}`);
  const end = css.indexOf('}', start);
  const body = css.slice(start, end);
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], normalize(m[2] ?? '')]),
  );
}

describe('tokens.css and tokens.ts stay in sync', () => {
  const graphite = block("[data-theme='graphite']");
  const paper = block("[data-theme='paper']");
  const noJs = block(':root:not([data-theme])');

  it('colours match for both themes and the no-JS fallback', () => {
    for (const role of COLOR_ROLES) {
      expect(graphite[`--color-${role}`], `graphite ${role}`).toBe(colors.graphite[role]);
      expect(paper[`--color-${role}`], `paper ${role}`).toBe(colors.paper[role]);
      expect(noJs[`--color-${role}`], `no-JS ${role}`).toBe(colors.paper[role]);
    }
  });

  it('the no-JS fallback duplicates the whole paper block', () => {
    expect(noJs).toEqual(paper);
  });

  it('spacing, targets and motion match', () => {
    const root = block(':root');
    for (const [name, rem] of Object.entries(space))
      expect(root[`--space-${name}`]).toBe(`${rem}rem`);
    expect(root['--target-min']).toBe(`${targets.minRem}rem`);
    expect(root['--target']).toBe(`${targets.controlRem}rem`);
    expect(root['--dur-micro']).toBe(`${motion.micro.ms}ms`);
    expect(root['--dur-standard']).toBe(`${motion.standard.ms}ms`);
    expect(root['--dur-emphasis']).toBe(`${motion.emphasis.ms}ms`);
    expect(root['--dur-page']).toBe(`${motion.page.ms}ms`);
    expect(root['--dur-camera']).toBe(`${motion.camera.ms}ms`);
    expect(root['--stagger']).toBe(`${motion.staggerMs}ms`);
    expect(root['--ease-micro']).toBe(motion.micro.css);
    expect(root['--ease-camera']).toBe(motion.camera.css);
  });
});

describe('contrast (WCAG 2.2 AA)', () => {
  for (const theme of THEMES) {
    for (const pair of CONTRAST_PAIRS) {
      it(`${theme}: ${pair.fg} on ${pair.bg} ≥ ${pair.min}:1`, () => {
        expect(
          contrastRatio(colors[theme][pair.fg], colors[theme][pair.bg]),
        ).toBeGreaterThanOrEqual(pair.min);
      });
    }
  }
});
