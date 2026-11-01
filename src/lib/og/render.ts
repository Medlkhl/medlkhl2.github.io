import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { colors } from '../../styles/tokens.ts';
import { OG_HEIGHT, OG_WIDTH } from '../og.ts';

/**
 * Build-time social images: Satori lays out an element tree into SVG and resvg
 * rasterises it to PNG. Satori cannot read WOFF2, so it gets the Geist TTFs
 * from the official `geist` package (SIL OFL 1.1).
 */

type Child = SatoriNode | string;
interface SatoriNode {
  type: string;
  props: { style?: Record<string, unknown>; children?: Child | Child[] };
}

function h(type: string, style: Record<string, unknown>, children?: Child | Child[]): SatoriNode {
  return { type, props: { style, children } };
}

const FONT_DIR = join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts');
let fontsPromise:
  Promise<Array<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }>> | undefined;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(FONT_DIR, 'geist-sans', 'Geist-Regular.ttf')),
    readFile(join(FONT_DIR, 'geist-sans', 'Geist-SemiBold.ttf')),
    readFile(join(FONT_DIR, 'geist-mono', 'GeistMono-Regular.ttf')),
  ]).then(([regular, semibold, mono]) => [
    { name: 'Geist', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: semibold, weight: 600 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: mono, weight: 400 as const, style: 'normal' as const },
  ]);
  return fontsPromise;
}

export interface OgContent {
  /** Small monospace kicker, e.g. "02 — Experience". */
  kicker: string;
  title: string;
  description: string;
  /** Footer line on the left, e.g. the site URL. */
  footer: string;
  /** Name and role on the right of the footer. */
  byline: string;
}

const C = colors.graphite;
const CELL = 30;

function blueprint(): SatoriNode[] {
  const lines: SatoriNode[] = [];
  for (let x = CELL; x < OG_WIDTH; x += CELL) {
    const major = (x / CELL) % 4 === 0;
    lines.push(
      h('div', {
        position: 'absolute',
        left: x,
        top: 0,
        width: 1,
        height: OG_HEIGHT,
        backgroundColor: major ? 'rgba(236,237,239,0.07)' : 'rgba(236,237,239,0.035)',
      }),
    );
  }
  for (let y = CELL; y < OG_HEIGHT; y += CELL) {
    const major = (y / CELL) % 4 === 0;
    lines.push(
      h('div', {
        position: 'absolute',
        top: y,
        left: 0,
        height: 1,
        width: OG_WIDTH,
        backgroundColor: major ? 'rgba(236,237,239,0.07)' : 'rgba(236,237,239,0.035)',
      }),
    );
  }
  return lines;
}

/** Seven stacked slabs, the classic-mode motif; the fifth (identity) carries the accent. */
function stack(): SatoriNode {
  const slabs = Array.from({ length: 7 }, (_, index) =>
    h('div', {
      width: 220,
      height: 14,
      marginTop: index === 0 ? 0 : 12,
      border: `1.5px solid ${index === 4 ? C.accent : 'rgba(236,237,239,0.5)'}`,
      backgroundColor: index === 4 ? 'rgba(107,149,255,0.18)' : 'rgba(236,237,239,0.03)',
      borderRadius: 3,
    }),
  );
  return h('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }, slabs);
}

export async function renderOgImage(content: OgContent): Promise<Buffer> {
  const tree = h(
    'div',
    {
      position: 'relative',
      display: 'flex',
      width: OG_WIDTH,
      height: OG_HEIGHT,
      backgroundColor: C.bg,
      color: C.text,
      fontFamily: 'Geist',
    },
    [
      ...blueprint(),
      h(
        'div',
        {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
        },
        [
          h(
            'div',
            {
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontSize: 22,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: C['text-subtle'],
            },
            content.kicker,
          ),
          h('div', { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }, [
            h('div', { display: 'flex', flexDirection: 'column', maxWidth: 820 }, [
              h(
                'div',
                { fontSize: 72, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 },
                content.title,
              ),
              h(
                'div',
                { marginTop: 24, fontSize: 28, lineHeight: 1.4, color: C['text-muted'] },
                content.description,
              ),
            ]),
            stack(),
          ]),
          h(
            'div',
            {
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 24,
              borderTop: `1px solid ${C.line}`,
              fontFamily: 'Geist Mono',
              fontSize: 20,
              color: C['text-subtle'],
            },
            [h('div', {}, content.footer), h('div', { color: C.text }, content.byline)],
          ),
        ],
      ),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
