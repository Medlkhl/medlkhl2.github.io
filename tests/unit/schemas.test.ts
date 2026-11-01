import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { education, experience } from '../../src/data/experience.ts';
import { ROBOT_DEMO_VIDEO, robotModules, studentArchive } from '../../src/data/lab.ts';
import { layers } from '../../src/data/layers.ts';
import { profile } from '../../src/data/profile.ts';
import { recommendations } from '../../src/data/recommendations.ts';
import { capabilities, languages } from '../../src/data/skills.ts';
import { LAYER_IDS, WORK_SLUGS } from '../../src/schemas/data.ts';
import { workSchema } from '../../src/schemas/work.ts';
import { WORK_DIR, readMdx, workFiles } from './helpers.ts';

describe('structured data validates against its schemas', () => {
  it('profile', () => {
    expect(profile.name).toBe('Mohamed Lakhel');
    expect(profile.email).toBe('mohamedlakhal.ing@gmail.com');
  });

  it('experience is ordered newest first and dated as ISO year-months', () => {
    expect(experience.length).toBe(5);
    const starts = experience.map((entry) => entry.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    for (const entry of experience) expect(entry.start).toMatch(/^\d{4}-\d{2}$/);
  });

  it('education, capabilities, languages, layers, recommendations, lab', () => {
    expect(education.length).toBeGreaterThan(0);
    expect(capabilities.map((c) => c.id)).toEqual([
      'cross-platform',
      'backend',
      'security',
      'delivery',
      'data',
    ]);
    expect(languages.map((l) => l.id)).toEqual(['ar', 'en', 'de', 'fr']);
    expect(layers.map((l) => l.id)).toEqual([...LAYER_IDS]);
    expect(layers.map((l) => l.index)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(recommendations.some((r) => r.kind === 'quote')).toBe(true);
    expect(robotModules.length).toBeGreaterThan(0);
    expect(studentArchive.length).toBeGreaterThan(0);
    expect(ROBOT_DEMO_VIDEO).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
  });

  it('layers link only to known case studies and use the Blender naming scheme', () => {
    for (const layer of layers) {
      expect(layer.scene.mesh).toBe(`layer_${layer.id}`);
      expect(layer.scene.anchor).toBe(`lbl_${layer.id}`);
      for (const slug of layer.work) expect(WORK_SLUGS).toContain(slug);
    }
  });

  it('never publishes a phone number, birth date or street address', () => {
    // Generic patterns only: personal values must never appear in the repo, not even in tests.
    const blob = JSON.stringify({
      profile,
      experience,
      education,
      recommendations,
      robotModules,
      studentArchive,
    });
    expect(blob, 'international or German phone number').not.toMatch(
      /(?:\+|\b00)\d{2}[\s/-]?\d{2,}|\b0\d{3,4}[\s/-]?\d{5,}/,
    );
    expect(blob, 'street and house number').not.toMatch(
      /\p{L}+(?:straße|strasse|str\.|weg|gasse|platz)\s*\d+/iu,
    );
    expect(blob, 'birth date').not.toMatch(/\b(?:born|birth|geboren|geburt)/i);
    expect(blob, 'Facebook link').not.toMatch(/facebook\.com/i);
    expect(blob, 'tel: link').not.toMatch(/tel:/i);
  });
});

describe('case-study frontmatter validates against the work schema', () => {
  for (const locale of ['en', 'de'] as const) {
    for (const file of workFiles(locale)) {
      it(`${locale}/${file}`, () => {
        const { data } = readMdx(join(WORK_DIR, locale, file));
        const result = workSchema.safeParse(data);
        if (!result.success) throw new Error(JSON.stringify(result.error.issues, null, 2));
        expect(result.success).toBe(true);
      });
    }
  }
});
