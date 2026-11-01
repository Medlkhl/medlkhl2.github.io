import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { workSchema } from './schemas/work.ts';

/**
 * Content collections (Astro 6 Content Layer API).
 * Case studies: src/content/work/<locale>/<slug>.mdx → entry id "<locale>/<slug>".
 * Structured CV data (profile, experience, skills, layers, …) lives in typed,
 * Zod-validated modules under src/data/ so the 3D engine can import it later.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: workSchema,
});

export const collections = { work };
