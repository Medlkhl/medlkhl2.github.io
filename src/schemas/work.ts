import { z } from 'astro/zod';
import {
  httpsUrl,
  nonEmpty,
  placeholderString,
  yearMonth,
  yearMonthOrPlaceholder,
} from './common.ts';
import { LAYER_IDS } from './data.ts';

/**
 * Case-study frontmatter: the nine parts of brief §5.
 *   1 header · 2 context and constraints · 3 role (+ MDX body: the story/chapters)
 *   4 architecture · 5 hard problems · 6 results · 7 proof · 8 confidentiality · 9 scene hook
 * One MDX file per locale: src/content/work/<locale>/<slug>.mdx, same slug in both.
 * Strings may contain placeholders like "[METRIC: release cadence]".
 */
/** Brief §5 lists Live, Internal and In development; 'completed' covers finished earlier work (DECISIONS.md). */
export const WORK_STATUSES = ['live', 'internal', 'in-development', 'completed'] as const;
export type WorkStatus = (typeof WORK_STATUSES)[number];

const step = z.strictObject({
  /** Matches a data-step="…" group in the architecture diagram SVG. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: nonEmpty,
  detail: nonEmpty,
});

const decision = z.strictObject({ title: nonEmpty, choice: nonEmpty, tradeoff: nonEmpty });

const evidence = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('code'), lang: nonEmpty, caption: nonEmpty, code: nonEmpty }),
  z.strictObject({ type: z.literal('placeholder'), text: placeholderString }),
  z.strictObject({ type: z.literal('link'), label: nonEmpty, href: httpsUrl }),
]);

export const workSchema = z.strictObject({
  // 1 · Header
  title: nonEmpty,
  /** Card text and meta description: at most 160 characters, where search results cut. */
  summary: z.string().trim().min(20).max(160),
  /** One-line outcome under the title. */
  outcome: nonEmpty,
  status: z.enum(WORK_STATUSES),
  role: nonEmpty,
  team: nonEmpty,
  timeframe: z.strictObject({ start: yearMonthOrPlaceholder, end: yearMonth.nullable() }),
  platforms: z.array(nonEmpty).min(1),
  stack: z.array(nonEmpty).min(1),
  /** Display order on the home page and the work index (1 = first). */
  order: z.number().int().min(1),
  featured: z.boolean(),
  /** Layers of the architecture stack this project touches. */
  layers: z.array(z.enum(LAYER_IDS)).min(1),

  // 2 · Context and constraints
  context: nonEmpty,
  constraints: z.array(nonEmpty).min(2).max(5),

  // 3 · Role (what was owned, decided, led). The MDX body adds the story or chapters.
  responsibilities: z.array(nonEmpty).min(2),

  // 4 · Architecture
  architecture: z.strictObject({
    /** Key of the diagram component in src/components/work/diagrams/. */
    diagram: z.enum(['happ', 'holobox', 'humanoid-robot']),
    summary: nonEmpty,
    steps: z.array(step).min(3).max(8),
    decisions: z.array(decision).min(2).max(3),
  }),

  // 5 · Hard problems solved
  problems: z
    .array(
      z.strictObject({
        title: nonEmpty,
        challenge: nonEmpty,
        approach: nonEmpty,
        evidence: evidence,
      }),
    )
    .min(2)
    .max(3),

  // 6 · Results
  results: z.strictObject({
    metrics: z.array(z.strictObject({ label: nonEmpty, value: nonEmpty })).min(1),
    outcomes: z.array(nonEmpty).min(1),
    next: nonEmpty,
  }),

  // 7 · Proof
  proof: z.strictObject({
    /** Id of an entry in src/data/recommendations.ts. */
    recommendation: nonEmpty.optional(),
    /** Shown when no recommendation is available yet. */
    placeholder: placeholderString.optional(),
    links: z.array(z.strictObject({ label: nonEmpty, href: httpsUrl })).default([]),
  }),

  // 8 · Confidentiality
  confidentiality: nonEmpty.optional(),

  // 9 · Scene hook (data only; consumed by the Phase 3 camera director)
  scene: z.strictObject({
    shot: z.string().regex(/^cam_[a-z0-9_]+$/),
    layer: z.string().regex(new RegExp(`^layer_(${LAYER_IDS.join('|')})$`)),
  }),

  draft: z.boolean().default(false),
});

export type WorkFrontmatter = z.infer<typeof workSchema>;
