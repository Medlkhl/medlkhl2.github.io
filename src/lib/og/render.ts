import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';
import { layers } from '../../data/layers.ts';
import { colors, grid } from '../../styles/tokens.ts';
import { OG_HEIGHT, OG_WIDTH } from '../og.ts';
import type { OgCard } from './cards.ts';
import { stackShape } from './stack.ts';

/**
 * Build-time social images (1200 × 630 PNG, ≤ 120 KB, about 30 KB in practice):
 * Satori lays out an element tree into SVG, resvg rasterises it and sharp
 * stores it as a palette PNG. The look is the site's own:
 * graphite, a faint blueprint grid, Geist and Geist Mono, a mono kicker, hairline
 * rules and the exploded architecture stack drawn as an isometric figure. The
 * only colour is the cobalt accent on the slab a case study is about.
 *
 * Every colour comes from src/styles/tokens.ts (the graphite theme); the
 * translucent grid and tint are the same token colours with the alpha values
 * tokens.css uses. Satori cannot read WOFF2, so it gets the Geist TTFs from the
 * official `geist` package (SIL OFL 1.1).
 */

type Child = SatoriNode | string | null | undefined | false;
interface SatoriNode {
  type: string;
  props: Record<string, unknown> & { children?: Child | Child[] };
}

function h(
  type: string,
  props: Record<string, unknown> & { style?: Record<string, unknown> },
  children?: Child | Child[],
): SatoriNode {
  const list = Array.isArray(children) ? children.filter(Boolean) : children;
  return { type, props: { ...props, children: list } };
}

const FONT_DIR = join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts');
type FontWeight = 400 | 500 | 600;
interface FontSpec {
  name: string;
  data: Buffer;
  weight: FontWeight;
  style: 'normal';
}
let fontsPromise: Promise<FontSpec[]> | undefined;

function loadFonts(): Promise<FontSpec[]> {
  const files: Array<[string, string, FontWeight]> = [
    ['Geist', 'geist-sans/Geist-Regular.ttf', 400],
    ['Geist', 'geist-sans/Geist-SemiBold.ttf', 600],
    ['Geist Mono', 'geist-mono/GeistMono-Regular.ttf', 400],
    ['Geist Mono', 'geist-mono/GeistMono-Medium.ttf', 500],
  ];
  fontsPromise ??= Promise.all(
    files.map(async ([name, file, weight]) => ({
      name,
      data: await readFile(join(FONT_DIR, file)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fontsPromise;
}

const C = colors.graphite;

/** A token colour with an alpha channel (tokens.css uses the same alphas). */
function alpha(hex: string, value: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${value})`;
}

const GRID = alpha(C.text, 0.05);
const GRID_MAJOR = alpha(C.text, 0.085);
const ACCENT_SOFT = alpha(C.accent, 0.14);

/* Layout (pixels). Twelve columns between 72 px margins; the text uses seven. */
const MARGIN_X = 72;
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 52;
const TEXT_WIDTH = 630;
const CELL = grid.blueprintCellPx * 1.25; // 30 px: the site's grid, scaled for a card seen at ~40 %
/** Screen x of the top slab's back corner, and the band the drawing is centred in. */
const STACK_X = 958;
const STACK_REGION = { top: 104, bottom: 508 };

/** The blueprint grid as four repeating gradients, exactly like `.blueprint` in global.css. */
function blueprintStyle(): Record<string, unknown> {
  const major = CELL * 4;
  return {
    backgroundImage: [
      `linear-gradient(${GRID_MAJOR} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${GRID_MAJOR} 1px, transparent 1px)`,
      `linear-gradient(${GRID} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
    ].join(', '),
    backgroundSize: `${major}px ${major}px, ${major}px ${major}px, ${CELL}px ${CELL}px, ${CELL}px ${CELL}px`,
    backgroundPosition: `${MARGIN_X - CELL * 3}px ${MARGIN_TOP - CELL * 2}px`,
  };
}

/** Frame marks in the four corners, as on an engineering drawing sheet. */
function cornerMarks(): SatoriNode {
  const inset = 28;
  const size = 14;
  const right = OG_WIDTH - inset;
  const bottom = OG_HEIGHT - inset;
  const d = [
    `M${inset} ${inset + size} L${inset} ${inset} L${inset + size} ${inset}`,
    `M${right - size} ${inset} L${right} ${inset} L${right} ${inset + size}`,
    `M${inset} ${bottom - size} L${inset} ${bottom} L${inset + size} ${bottom}`,
    `M${right - size} ${bottom} L${right} ${bottom} L${right} ${bottom - size}`,
  ].join(' ');
  return h(
    'svg',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      viewBox: `0 0 ${OG_WIDTH} ${OG_HEIGHT}`,
      style: { position: 'absolute', left: 0, top: 0 },
    },
    [h('path', { d, fill: 'none', stroke: C['line-strong'], strokeWidth: 1 })],
  );
}

/** The exploded stack; the highlighted slab (if any) carries the accent. */
function stackFigure(card: OgCard): SatoriNode[] {
  const highlight = card.layer?.position ?? null;
  // Centre the drawing vertically between the kicker and the footer rule.
  const probe = stackShape({ count: layers.length, highlight, origin: { x: STACK_X, y: 0 } });
  const height = probe.box.bottom - probe.box.top;
  const top = Math.round(STACK_REGION.top + (STACK_REGION.bottom - STACK_REGION.top - height) / 2);
  const shape = stackShape({ count: layers.length, highlight, origin: { x: STACK_X, y: top } });
  const painted = [...shape.slabs].reverse(); // bottom first, so upper slabs hide what lies behind them
  const line = C['line-strong'];
  const svg = h(
    'svg',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      viewBox: `0 0 ${OG_WIDTH} ${OG_HEIGHT}`,
      style: { position: 'absolute', left: 0, top: 0 },
    },
    [
      h('path', {
        d: shape.axis,
        fill: 'none',
        stroke: C.line,
        strokeWidth: 1,
        strokeDasharray: '14 4 2 4',
      }),
      h('path', { d: shape.dimension.line, fill: 'none', stroke: C.line, strokeWidth: 1 }),
      ...shape.dimension.ticks.map((d) =>
        h('path', { d, fill: 'none', stroke: line, strokeWidth: 1 }),
      ),
      ...painted.flatMap((slab) => {
        const stroke = slab.highlighted ? C.accent : line;
        return [
          h('path', { d: slab.silhouette, fill: C.bg, stroke, strokeWidth: 1.25 }),
          h('path', { d: slab.top, fill: C.surface, stroke, strokeWidth: 1.25 }),
          slab.highlighted ? h('path', { d: slab.top, fill: ACCENT_SOFT }) : null,
          h('path', {
            d: slab.inset,
            fill: 'none',
            stroke: slab.highlighted ? alpha(C.accent, 0.55) : C.line,
            strokeWidth: 1,
          }),
        ];
      }),
    ],
  );

  const highlighted = shape.slabs.find((slab) => slab.highlighted);
  if (!highlighted || !card.layer) return [svg];

  // Callout: a leader from the slab's right corner to a numbered balloon.
  const radius = 17;
  const leader = 34;
  const cx = highlighted.anchor.x + leader + radius;
  const cy = highlighted.anchor.y;
  const callout = h(
    'svg',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      viewBox: `0 0 ${OG_WIDTH} ${OG_HEIGHT}`,
      style: { position: 'absolute', left: 0, top: 0 },
    },
    [
      h('path', {
        d: `M${highlighted.anchor.x} ${cy} H${cx - radius}`,
        fill: 'none',
        stroke: C.accent,
        strokeWidth: 1.25,
      }),
      h('circle', { cx: highlighted.anchor.x, cy, r: 2.5, fill: C.accent }),
      h('circle', { cx, cy, r: radius, fill: C.bg, stroke: C.accent, strokeWidth: 1.25 }),
    ],
  );
  const number = h(
    'div',
    {
      style: {
        position: 'absolute',
        left: cx - radius,
        top: cy - radius,
        width: radius * 2,
        height: radius * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Geist Mono',
        fontWeight: 500,
        fontSize: 15,
        color: C.accent,
      },
    },
    card.layer.number,
  );
  return [svg, callout, number];
}

/**
 * Large for a name or a short title, smaller for a sentence. The longest word
 * must fit the text column on one line: Geist SemiBold averages about 0.5 em
 * per character, so 0.53 em leaves a margin.
 */
function headlineSize(text: string): number {
  const bySentence = text.length <= 8 ? 96 : text.length <= 15 ? 76 : text.length <= 26 ? 68 : 58;
  const longestWord = Math.max(...text.split(/\s+/).map((word) => word.length));
  return Math.min(bySentence, Math.floor(TEXT_WIDTH / (longestWord * 0.53)));
}

/** Three lines at 26 px; a long case-study outcome gets four lines at 23 px instead of an ellipsis. */
function ledeStyle(text: string): Record<string, unknown> {
  return text.length <= 125 ? { fontSize: 26, lineClamp: 3 } : { fontSize: 23, lineClamp: 4 };
}

function kicker(card: OgCard): SatoriNode {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'Geist Mono',
        fontWeight: 500,
        fontSize: 19,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        color: C['text-subtle'],
      },
    },
    [
      card.kicker.index
        ? h('span', { style: { color: C['text-muted'] } }, card.kicker.index)
        : null,
      card.kicker.index ? h('span', {}, '—') : null,
      h('span', {}, card.kicker.label),
    ],
  );
}

function legend(card: OgCard): SatoriNode | null {
  if (!card.layer) return null;
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 28,
        fontFamily: 'Geist Mono',
        fontSize: 18,
        color: C['text-muted'],
      },
    },
    [
      h('div', {
        style: {
          width: 14,
          height: 14,
          borderRadius: 3,
          border: `1.25px solid ${C.accent}`,
          backgroundColor: ACCENT_SOFT,
        },
      }),
      h('span', {}, card.layer.legend),
    ],
  );
}

function footerRow(card: OgCard): SatoriNode {
  const { name, detail, site } = card.footer;
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 22,
        borderTop: `1px solid ${C.line}`,
      },
    },
    [
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 16 } }, [
        name ? h('span', { style: { fontSize: 22, fontWeight: 600, color: C.text } }, name) : null,
        h(
          'span',
          { style: { fontFamily: 'Geist Mono', fontSize: 17, color: C['text-subtle'] } },
          detail,
        ),
      ]),
      h(
        'span',
        { style: { fontFamily: 'Geist Mono', fontSize: 17, color: C['text-subtle'] } },
        site,
      ),
    ],
  );
}

export function cardTree(card: OgCard): SatoriNode {
  const size = headlineSize(card.headline);
  return h(
    'div',
    {
      style: {
        position: 'relative',
        display: 'flex',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: 'Geist',
        ...blueprintStyle(),
      },
    },
    [
      cornerMarks(),
      ...stackFigure(card),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: `${MARGIN_TOP}px ${MARGIN_X}px ${MARGIN_BOTTOM}px`,
          },
        },
        [
          kicker(card),
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                flexGrow: 1,
                width: TEXT_WIDTH,
                paddingBottom: 40,
              },
            },
            [
              h(
                'div',
                {
                  style: {
                    fontSize: size,
                    fontWeight: 600,
                    lineHeight: 1.04,
                    letterSpacing: -0.03 * size,
                    lineClamp: 3,
                  },
                },
                card.headline,
              ),
              card.lede
                ? h(
                    'div',
                    {
                      style: {
                        marginTop: 24,
                        ...ledeStyle(card.lede),
                        lineHeight: 1.42,
                        color: C['text-muted'],
                        textWrap: 'pretty',
                      },
                    },
                    card.lede,
                  )
                : null,
              legend(card),
            ],
          ),
          footerRow(card),
        ],
      ),
    ],
  );
}

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const svg = await satori(cardTree(card) as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
  // A 256-colour palette is visually lossless for this flat graphite artwork
  // and about a third of the size of the RGBA original.
  return sharp(png)
    .removeAlpha()
    .png({ palette: true, quality: 100, effort: 10, compressionLevel: 9 })
    .toBuffer();
}
