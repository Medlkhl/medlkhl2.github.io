/**
 * Geometry of Fig. 1, the exploded architecture stack: a 2:1 isometric
 * engineering drawing computed from the number of layers. Pure numbers and
 * path strings only; StackFigure.astro renders them.
 *
 * Axes: ground x runs down-right, ground y runs down-left, z runs up.
 * One drawing unit is one CSS pixel when the figure is shown at 1:1.
 */

export interface Point {
  x: number;
  y: number;
}

/** A rounded rectangle on the ground plane: `a` along x, `b` along y, corner radius `r`, offset (x0, y0). */
export interface Footprint {
  a: number;
  b: number;
  r: number;
  x0?: number;
  y0?: number;
}

const SQRT2 = Math.SQRT2;

/** Two decimals keep the markup short and the output deterministic. */
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function fmt(point: Point): string {
  return `${round(point.x)} ${round(point.y)}`;
}

/** 2:1 isometric projection of the ground point (x, y) at height z, relative to a screen origin. */
export function iso(origin: Point, x: number, y: number, z = 0): Point {
  return { x: origin.x + x - y, y: origin.y + (x + y) / 2 - z };
}

/**
 * A projected corner of radius r is an axis-aligned ellipse with radii r·√2 and r/√2.
 * Corners are always drawn clockwise and span less than half the ellipse.
 */
function arcTo(r: number, to: Point): string {
  return `A${round(r * SQRT2)} ${round(r / SQRT2)} 0 0 1 ${fmt(to)}`;
}

/** Closed outline of a rounded footprint at height z (a slab's top face). */
export function footprintPath(origin: Point, f: Footprint, z = 0): string {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const p = (x: number, y: number) => iso(origin, x0 + x, y0 + y, z);
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

/** Leftmost and rightmost points of a footprint's outline at height z. */
export function footprintExtremes(
  origin: Point,
  f: Footprint,
  z = 0,
): { left: Point; right: Point } {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const k = r * SQRT2;
  const left = iso(origin, x0 + r, y0 + b - r, z);
  const right = iso(origin, x0 + a - r, y0 + r, z);
  return { left: { x: left.x - k, y: left.y }, right: { x: right.x + k, y: right.y } };
}

/**
 * Silhouette of a footprint extruded downwards by t: the back half of the top
 * outline, the two vertical sides and the front half of the bottom outline.
 * Filled, it is the slab's side wall; the top face is drawn over it.
 */
export function extrusionPath(origin: Point, f: Footprint, z: number, t: number): string {
  const { a, b, r, x0 = 0, y0 = 0 } = f;
  const top = (x: number, y: number) => iso(origin, x0 + x, y0 + y, z);
  const bottom = (x: number, y: number) => iso(origin, x0 + x, y0 + y, z - t);
  const { left, right } = footprintExtremes(origin, f, z);
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

/** A straight segment as a path ("M x y L x y"). */
export function segment(from: Point, to: Point): string {
  return `M${fmt(from)} L${fmt(to)}`;
}

/* ---- Drawing constants (drawing units) ------------------------------------ */

/** Slab footprint: the phone's screen, lifted off the device. */
const SLAB: Footprint = { a: 96, b: 196, r: 8 };
const SLAB_THICKNESS = 5;
/** Vertical distance between two slabs: the stack is evenly spaced. */
const PITCH = 54;
/** Distance from the lowest slab down to the phone. */
const PHONE_GAP = 118;
const BEZEL = 8;
const PHONE: Footprint = {
  a: SLAB.a + 2 * BEZEL,
  b: SLAB.b + 2 * BEZEL,
  r: 16,
  x0: -BEZEL,
  y0: -BEZEL,
};
const PHONE_THICKNESS = 12;
/** Inset line on every slab's top face (a machined edge). */
const INSET = 7;
/** Screen origin of the top slab's back corner. */
const ORIGIN_X = 259;
const ORIGIN_Y = 44;
const LEADER_LENGTH = 52;
const BALLOON_RADIUS = 11;
const LABEL_GAP = 9;
/** Room for the longest label to the right of its balloon. */
const LABEL_ROOM = 194;
const DIMENSION_OFFSET = 30;
const MARGIN = 8;
const TITLE_BLOCK = { width: 250, height: 44, inset: 6 } as const;

export interface SlabGeometry {
  /** 0 = top of the stack. */
  position: number;
  silhouette: string;
  top: string;
  inset: string;
  /** Leader origin: a dot on the top face near the right corner. */
  anchor: Point;
  balloon: Point;
  label: Point;
  /** Leftmost point of the top face (dimension ticks). */
  left: Point;
  /** Screen wireframe, drawn on the topmost slab only (the surface people see). */
  details: string[];
}

export interface StackGeometry {
  width: number;
  height: number;
  /** Width that keeps the stack and its balloons when the labels are hidden (small screens). */
  compactWidth: number;
  balloonRadius: number;
  slabs: SlabGeometry[];
  phone: {
    silhouette: string;
    top: string;
    screen: string;
    island: string;
    buttons: string[];
  };
  centreLine: string;
  dimension: { line: string; ticks: string[]; extensions: string[] };
  cornerMarks: string[];
  /** Right-hand frame marks for the cropped, compact view. */
  compactMarks: string[];
  titleBlock: { x: number; y: number; width: number; height: number };
}

/** Lays out the drawing for `count` layers, top to bottom. */
export function stackGeometry(count: number): StackGeometry {
  const slabOrigin = (position: number): Point => ({
    x: ORIGIN_X,
    y: ORIGIN_Y + position * PITCH,
  });
  const insetFootprint: Footprint = {
    a: SLAB.a - 2 * INSET,
    b: SLAB.b - 2 * INSET,
    r: Math.max(SLAB.r - INSET / 2, 2),
    x0: INSET,
    y0: INSET,
  };

  // A minimal screen on the top slab: search bar, a card, two tiles and a tab bar.
  // The top of the screen is the far end (y = 0), where the phone's island sits.
  const { a, b } = SLAB;
  const screenParts: Footprint[] = [
    { a: a - 32, b: 10, r: 5, x0: 16, y0: 24 },
    { a: a - 32, b: 46, r: 4, x0: 16, y0: 46 },
    { a: a / 2 - 19, b: 36, r: 4, x0: 16, y0: 104 },
    { a: a / 2 - 19, b: 36, r: 4, x0: a / 2 + 3, y0: 104 },
    ...[0, 1, 2].map((tab) => ({
      a: 7,
      b: 7,
      r: 3.5,
      x0: a / 2 - 3.5 + (tab - 1) * 22,
      y0: b - 23,
    })),
  ];

  const slabRight = footprintExtremes(slabOrigin(0), SLAB).right.x;
  const balloonX = slabRight + LEADER_LENGTH;

  const slabs: SlabGeometry[] = Array.from({ length: count }, (_, position) => {
    const origin = slabOrigin(position);
    const anchor = iso(origin, SLAB.a - 12, 10);
    const { left } = footprintExtremes(origin, SLAB);
    return {
      position,
      silhouette: extrusionPath(origin, SLAB, 0, SLAB_THICKNESS),
      top: footprintPath(origin, SLAB),
      inset: footprintPath(origin, insetFootprint),
      anchor,
      balloon: { x: balloonX, y: anchor.y },
      label: { x: balloonX + BALLOON_RADIUS + LABEL_GAP, y: anchor.y },
      left,
      details: position === 0 ? screenParts.map((part) => footprintPath(origin, part)) : [],
    };
  });

  // The phone lies under the stack; the slabs share its screen's footprint.
  const phoneOrigin: Point = {
    x: ORIGIN_X,
    y: ORIGIN_Y + (count - 1) * PITCH + PHONE_GAP,
  };
  const island: Footprint = { a: 30, b: 7, r: 3.5, x0: SLAB.a / 2 - 15, y0: 10 };
  const wallX = (PHONE.x0 ?? 0) + PHONE.a;
  const midWall = -PHONE_THICKNESS / 2;
  const phone = {
    silhouette: extrusionPath(phoneOrigin, PHONE, 0, PHONE_THICKNESS),
    top: footprintPath(phoneOrigin, PHONE),
    screen: footprintPath(phoneOrigin, SLAB),
    island: footprintPath(phoneOrigin, island),
    buttons: [
      [30, 52],
      [60, 82],
    ].map(([from = 0, to = 0]) =>
      segment(iso(phoneOrigin, wallX, from, midWall), iso(phoneOrigin, wallX, to, midWall)),
    ),
  };
  const phoneBottom = iso(phoneOrigin, PHONE.a + (PHONE.x0 ?? 0), PHONE.b + (PHONE.y0 ?? 0)).y;
  const phoneLeft = footprintExtremes(phoneOrigin, PHONE).left.x;

  const width = Math.ceil(balloonX + BALLOON_RADIUS + LABEL_GAP + LABEL_ROOM + MARGIN);
  // The title block sits right of the phone, so it shares the phone's last rows.
  const height = Math.ceil(phoneBottom + PHONE_THICKNESS + 28);
  const compactWidth = Math.ceil(balloonX + BALLOON_RADIUS * 1.5 + MARGIN);

  // Centre line through the stack's vertical axis (drawn first, so it shows only in the gaps).
  const axisX = iso(slabOrigin(0), SLAB.a / 2, SLAB.b / 2).x;
  const centreLine = segment(
    { x: axisX, y: ORIGIN_Y - 26 },
    { x: axisX, y: phoneBottom + PHONE_THICKNESS + 18 },
  );

  // Dimension line on the left: one tick per slab, so the equal pitch is visible.
  const dimX = phoneLeft - DIMENSION_OFFSET;
  const first = slabs[0]?.left.y ?? ORIGIN_Y;
  const last = slabs[slabs.length - 1]?.left.y ?? ORIGIN_Y;
  const dimension = {
    line: segment({ x: dimX, y: first - 10 }, { x: dimX, y: last + 10 }),
    ticks: slabs.map(({ left }) =>
      segment({ x: dimX - 4, y: left.y + 4 }, { x: dimX + 4, y: left.y - 4 }),
    ),
    extensions: slabs.map(({ left }) =>
      segment({ x: left.x - 6, y: left.y }, { x: dimX - 6, y: left.y }),
    ),
  };

  const mark = 12;
  const bottom = height - MARGIN;
  const leftMarks = [
    `M${MARGIN} ${MARGIN + mark} L${MARGIN} ${MARGIN} L${MARGIN + mark} ${MARGIN}`,
    `M${MARGIN} ${bottom - mark} L${MARGIN} ${bottom} L${MARGIN + mark} ${bottom}`,
  ];
  const rightMarks = (right: number) => [
    `M${right - mark} ${MARGIN} L${right} ${MARGIN} L${right} ${MARGIN + mark}`,
    `M${right - mark} ${bottom} L${right} ${bottom} L${right} ${bottom - mark}`,
  ];
  const cornerMarks = [...leftMarks, ...rightMarks(width - MARGIN)];
  const compactMarks = rightMarks(compactWidth - MARGIN);

  return {
    width,
    height,
    compactWidth,
    balloonRadius: BALLOON_RADIUS,
    slabs,
    phone,
    centreLine,
    dimension,
    cornerMarks,
    compactMarks,
    titleBlock: {
      x: width - MARGIN - TITLE_BLOCK.inset - TITLE_BLOCK.width,
      y: height - MARGIN - TITLE_BLOCK.inset - TITLE_BLOCK.height,
      width: TITLE_BLOCK.width,
      height: TITLE_BLOCK.height,
    },
  };
}
