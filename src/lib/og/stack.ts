/**
 * Geometry of the social images' motif: the exploded architecture stack as a
 * 2:1 isometric engineering drawing, one slab per layer of src/data/layers.ts,
 * top (UI) to bottom (CI/CD). The highlighted slab is lifted out of the stack
 * (the "exploded" gap above it), so its face reads even at thumbnail size.
 *
 * Pure numbers and SVG path strings; render.ts draws them. Axes: ground x runs
 * down-right, ground y runs down-left, z runs up. One unit is one image pixel.
 */

export interface Point {
  x: number;
  y: number;
}

/** A rounded rectangle on the ground plane: `a` along x, `b` along y, corner radius `r`, offset (x0, y0). */
interface Footprint {
  a: number;
  b: number;
  r: number;
  x0?: number;
  y0?: number;
}

const SQRT2 = Math.SQRT2;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function fmt(point: Point): string {
  return `${round(point.x)} ${round(point.y)}`;
}

/** 2:1 isometric projection of the ground point (x, y) at height z. */
export function iso(origin: Point, x: number, y: number, z = 0): Point {
  return { x: origin.x + x - y, y: origin.y + (x + y) / 2 - z };
}

/** A projected corner of radius r is an axis-aligned ellipse with radii r·√2 and r/√2 (drawn clockwise). */
function arcTo(r: number, to: Point): string {
  return `A${round(r * SQRT2)} ${round(r / SQRT2)} 0 0 1 ${fmt(to)}`;
}

/** Closed outline of a rounded footprint (a slab's top face). */
function outline(origin: Point, f: Footprint): string {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const p = (x: number, y: number) => iso(origin, x0 + x, y0 + y);
  return [
    `M${fmt(p(r, 0))}`,
    `L${fmt(p(a - r, 0))}`,
    arcTo(r, p(a, r)),
    `L${fmt(p(a, b - r))}`,
    arcTo(r, p(a - r, b)),
    `L${fmt(p(r, b))}`,
    arcTo(r, p(0, b - r)),
    `L${fmt(p(0, r))}`,
    arcTo(r, p(r, 0)),
    'Z',
  ].join(' ');
}

/** Leftmost and rightmost points of a footprint's outline. */
function extremes(origin: Point, f: Footprint): { left: Point; right: Point } {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const k = r * SQRT2;
  const left = iso(origin, x0 + r, y0 + b - r);
  const right = iso(origin, x0 + a - r, y0 + r);
  return { left: { x: left.x - k, y: left.y }, right: { x: right.x + k, y: right.y } };
}

/**
 * Silhouette of a footprint extruded downwards by t: the back half of the top
 * outline, the two vertical sides and the front half of the bottom outline.
 * Filled, it is the slab's side wall; the top face is drawn over it.
 */
function silhouette(origin: Point, f: Footprint, t: number): string {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const top = (x: number, y: number) => iso(origin, x0 + x, y0 + y);
  const bottom = (x: number, y: number) => iso(origin, x0 + x, y0 + y, -t);
  const { left, right } = extremes(origin, f);
  return [
    `M${fmt(left)}`,
    arcTo(r, top(0, b - r)),
    `L${fmt(top(0, r))}`,
    arcTo(r, top(r, 0)),
    `L${fmt(top(a - r, 0))}`,
    arcTo(r, right),
    `L${fmt({ x: right.x, y: right.y + t })}`,
    arcTo(r, bottom(a, r)),
    `L${fmt(bottom(a, b - r))}`,
    arcTo(r, bottom(a - r, b)),
    `L${fmt(bottom(r, b))}`,
    arcTo(r, { x: left.x, y: left.y + t }),
    'Z',
  ].join(' ');
}

function segment(from: Point, to: Point): string {
  return `M${fmt(from)} L${fmt(to)}`;
}

export interface StackOptions {
  /** Number of slabs (the layers in src/data/layers.ts). */
  count: number;
  /** Position of the highlighted slab, 0 = top; null for none. */
  highlight: number | null;
  /** Screen position of the top slab's back corner. */
  origin: Point;
}

export interface SlabShape {
  position: number;
  highlighted: boolean;
  silhouette: string;
  top: string;
  inset: string;
  /** Where a leader line leaves the slab (right-hand corner of the top face). */
  anchor: Point;
}

export interface StackShape {
  slabs: SlabShape[];
  /** Dash-dot centre line through the stack's vertical axis. */
  axis: string;
  /** Dimension line on the left with one tick per slab. */
  dimension: { line: string; ticks: string[] };
  /** Bounding box of the drawing (without the dimension line). */
  box: { left: number; right: number; top: number; bottom: number };
}

/* Drawing constants (pixels). The slabs have the proportions of a phone screen. */
const SLAB: Footprint = { a: 96, b: 188, r: 10 };
const THICKNESS = 7;
const PITCH = 30;
/** Extra gap above the highlighted slab: the exploded view. */
const LIFT = 30;
const INSET = 9;
const DIMENSION_OFFSET = 26;

export function stackShape({ count, highlight, origin }: StackOptions): StackShape {
  const offsets: number[] = [];
  let y = 0;
  for (let position = 0; position < count; position += 1) {
    if (highlight !== null && position === highlight && position > 0) y += LIFT;
    offsets.push(y);
    y += PITCH;
    if (highlight !== null && position === highlight && position < count - 1) y += LIFT;
  }
  const insetFootprint: Footprint = {
    a: SLAB.a - 2 * INSET,
    b: SLAB.b - 2 * INSET,
    r: Math.max(SLAB.r - INSET / 2, 2),
    x0: INSET,
    y0: INSET,
  };

  const slabs = offsets.map((offset, position): SlabShape => {
    const slabOrigin = { x: origin.x, y: origin.y + offset };
    return {
      position,
      highlighted: position === highlight,
      silhouette: silhouette(slabOrigin, SLAB, THICKNESS),
      top: outline(slabOrigin, SLAB),
      inset: outline(slabOrigin, insetFootprint),
      anchor: extremes(slabOrigin, SLAB).right,
    };
  });

  const first = extremes(origin, SLAB);
  const lastOrigin = { x: origin.x, y: origin.y + (offsets[offsets.length - 1] ?? 0) };
  const lastBottom = iso(lastOrigin, SLAB.a, SLAB.b).y + THICKNESS;
  const axisX = iso(origin, SLAB.a / 2, SLAB.b / 2).x;
  const dimX = first.left.x - DIMENSION_OFFSET;
  const ticksY = offsets.map((offset) => first.left.y + offset);

  return {
    slabs,
    axis: segment({ x: axisX, y: origin.y - 22 }, { x: axisX, y: lastBottom + 22 }),
    dimension: {
      line: segment(
        { x: dimX, y: (ticksY[0] ?? 0) - 8 },
        { x: dimX, y: (ticksY[ticksY.length - 1] ?? 0) + 8 },
      ),
      ticks: ticksY.map((tickY) =>
        segment({ x: dimX - 4, y: tickY + 4 }, { x: dimX + 4, y: tickY - 4 }),
      ),
    },
    box: { left: first.left.x, right: first.right.x, top: origin.y, bottom: lastBottom },
  };
}
