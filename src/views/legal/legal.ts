/**
 * Content model of the two legal pages (Impressum and Datenschutz): a page is a
 * list of sections, a section a list of blocks. The copy lives in
 * impressum.copy.ts, datenschutz.copy.ts and legal.copy.ts; this module holds
 * the types, the feature flags and the version date. LegalPage.astro renders it.
 *
 * The texts are orientation, not legal advice (brief §11): the owner has them
 * checked before launch. Never describe them as reviewed by a lawyer.
 */

export type LegalBlock =
  /** A paragraph; placeholders such as [NAME: …] render as visible marks. */
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  /** The provider's name and postal address (legal.copy.ts → address). */
  | { type: 'address' }
  /** The contact email address from src/data/profile.ts. */
  | { type: 'email' }
  /** An external link on its own line (same tab, arrow icon, visually hidden "external link"). */
  | { type: 'link'; label: string; href: string }
  /** "Version: November 2026" (PRIVACY_VERSION, formatted per locale). */
  | { type: 'version' };

/**
 * Sections that describe features which are not live yet stay in the copy and
 * are switched on here. The spatial view (Lab, Phase 4) uses the camera,
 * processed only in the browser; its section appears once this flag is true.
 */
export const LEGAL_FEATURES = {
  spatialView: false,
} as const satisfies Record<string, boolean>;

export type LegalFeature = keyof typeof LEGAL_FEATURES;

export interface LegalSection {
  /** Fragment id, localized (#hosting, #ihre-rechte). */
  id: string;
  title: string;
  blocks: LegalBlock[];
  /** Rendered only while this feature flag is on. */
  requires?: LegalFeature;
}

export interface LegalPageCopy {
  /** The page's h1. */
  title: string;
  lede: string;
  sections: LegalSection[];
}

/** Date of the current Datenschutzerklärung (ISO year-month, formatted per locale). */
export const PRIVACY_VERSION = '2026-11';

/** The sections a visitor sees: everything except sections whose feature is off. */
export function visibleSections(
  sections: readonly LegalSection[],
  features: Record<LegalFeature, boolean> = LEGAL_FEATURES,
): LegalSection[] {
  return sections.filter((section) => !section.requires || features[section.requires]);
}
