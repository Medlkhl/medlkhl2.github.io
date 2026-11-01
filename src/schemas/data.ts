import { z } from 'astro/zod';
import {
  httpsUrl,
  l10n,
  nonEmpty,
  placeholderString,
  source,
  year,
  yearMonth,
  yearMonthLte,
} from './common.ts';

/** The seven layers of the exploded architecture stack, top to bottom. */
export const LAYER_IDS = ['ui', 'viewmodels', 'domain', 'api', 'identity', 'data', 'cicd'] as const;
export type LayerId = (typeof LAYER_IDS)[number];

/** Capability groups (skills presented as capabilities, not a wall of tool names). */
export const CAPABILITY_IDS = [
  'cross-platform',
  'backend',
  'security',
  'delivery',
  'data',
] as const;
export type CapabilityId = (typeof CAPABILITY_IDS)[number];

/** Case-study slugs. Keep in sync with src/content/work/{en,de}/<slug>.mdx (a unit test checks it). */
export const WORK_SLUGS = ['happ', 'holobox', 'humanoid-robot'] as const;
export type WorkSlug = (typeof WORK_SLUGS)[number];

export const profileSchema = z.strictObject({
  name: nonEmpty,
  role: l10n,
  positioning: l10n,
  /** First-person summary for the site. */
  summary: l10n,
  /** Neutral summary for the CV. */
  cvSummary: l10n,
  location: z.strictObject({
    city: nonEmpty,
    region: nonEmpty,
    countryCode: z.literal('DE'),
    label: l10n,
  }),
  email: z.email(),
  links: z.strictObject({ linkedin: httpsUrl, github: httpsUrl }),
  yearsOfExperience: z.strictObject({ value: nonEmpty, label: l10n }),
  coreStack: z.array(nonEmpty).min(1),
  /** Data fields kept for later; hidden from the quick-facts card until confirmed. */
  availability: z.strictObject({ value: l10n.nullable(), confirmed: z.boolean() }),
  workMode: z.strictObject({ value: l10n.nullable(), confirmed: z.boolean() }),
  interests: z.array(l10n).min(1),
});
export type Profile = z.infer<typeof profileSchema>;

export const experienceSchema = z
  .strictObject({
    id: nonEmpty,
    org: nonEmpty,
    location: l10n,
    role: l10n,
    kind: z.enum(['employment', 'graduation-project', 'internship']),
    start: yearMonth,
    end: yearMonth.nullable(),
    /** One line for the condensed home timeline. */
    summary: l10n,
    highlights: z.array(l10n.extend({ source })).min(1),
    stack: z.array(nonEmpty).default([]),
    /** Related case-study slugs. */
    work: z.array(z.enum(WORK_SLUGS)).default([]),
  })
  .refine((entry) => entry.end === null || yearMonthLte(entry.start, entry.end), {
    message: 'end must not be before start',
  });
export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.strictObject({
  id: nonEmpty,
  degree: l10n,
  field: l10n,
  institution: l10n,
  location: l10n,
  start: year,
  end: year,
});
export type Education = z.infer<typeof educationSchema>;

export const capabilitySchema = z.strictObject({
  id: z.enum(CAPABILITY_IDS),
  title: l10n,
  summary: l10n,
  skills: z.array(nonEmpty).min(1),
  layers: z.array(z.enum(LAYER_IDS)).min(1),
});
export type Capability = z.infer<typeof capabilitySchema>;

export const languageSchema = z.strictObject({
  id: z.enum(['ar', 'en', 'de', 'fr']),
  name: l10n,
  level: l10n,
});
export type Language = z.infer<typeof languageSchema>;

export const layerSchema = z.strictObject({
  id: z.enum(LAYER_IDS),
  /** 1 = top of the stack (UI), 7 = bottom (CI/CD). */
  index: z.number().int().min(1).max(7),
  label: l10n,
  description: l10n,
  skills: z.array(z.strictObject({ name: nonEmpty, capability: z.enum(CAPABILITY_IDS) })).min(1),
  work: z.array(z.enum(WORK_SLUGS)),
  /** Names the Phase 3 scene loader expects from Blender (brief §9). */
  scene: z.strictObject({
    mesh: z.string().regex(/^layer_[a-z]+$/),
    anchor: z.string().regex(/^lbl_[a-z]+$/),
  }),
});
export type Layer = z.infer<typeof layerSchema>;

export const recommendationSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('quote'),
    id: nonEmpty,
    author: nonEmpty,
    role: l10n,
    /** Where the recommender knows the work from. */
    context: l10n,
    /** Verbatim excerpt. Never rephrase. Rendered with lang="en" in both locales. */
    quote: z.strictObject({ lang: z.literal('en'), text: nonEmpty }),
    work: z.array(z.enum(WORK_SLUGS)).default([]),
  }),
  z.strictObject({
    kind: z.literal('slot'),
    id: nonEmpty,
    wanted: l10n,
    placeholder: placeholderString,
  }),
]);
export type Recommendation = z.infer<typeof recommendationSchema>;

export const robotModuleSchema = z.strictObject({
  id: nonEmpty,
  title: l10n,
  description: l10n,
  stack: z.array(nonEmpty).min(1),
  video: httpsUrl.optional(),
});
export type RobotModule = z.infer<typeof robotModuleSchema>;

export const archiveProjectSchema = z.strictObject({
  id: nonEmpty,
  title: l10n,
  description: l10n,
  stack: z.array(nonEmpty).default([]),
  video: httpsUrl.optional(),
});
export type ArchiveProject = z.infer<typeof archiveProjectSchema>;
