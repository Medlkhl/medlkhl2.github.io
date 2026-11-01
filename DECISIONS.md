# Decisions

A dated, ADR-style log. Each entry records the decision, the alternatives and why. When two options were close, the simpler one won (brief §13).

---

## 2026-11-01 · D-001 · Hosting on GitHub Pages for now

- **Decision.** Publish as a GitHub Pages project site at `https://medlkhl.github.io/medlkhl2.github.io/` (`SITE_URL = https://medlkhl.github.io`, `BASE_PATH = /medlkhl2.github.io`), deployed by GitHub Actions on pushes to the default branch.
- **Alternatives.** Cloudflare static hosting (the brief's target, §6), waiting until the owner connects an account; Netlify or Vercel.
- **Why.** No account is connected yet, and GitHub Pages needs nothing beyond the repo. Both values live in `site.config.ts`, so a custom domain or Cloudflare later is a one-line change (`BASE_PATH = '/'`).
- **Upgrade path.** Cloudflare Pages with preview deploys per branch and PR, and a custom domain.

## 2026-11-01 · D-002 · Previews are CI artifacts

- **Decision.** GitHub Pages cannot host per-branch previews, so every CI run uploads the built site (`site`), screenshots, the Playwright report and the Lighthouse reports as artifacts per branch and PR.
- **Upgrade.** Cloudflare Pages preview deploys (D-001).

## 2026-11-01 · D-003 · Astro 6.4.8, not Astro 7

- **Decision.** Pin `astro@6.4.8`, the latest stable 6.x, with `@astrojs/mdx@6.0.3` (the last MDX line that supports Astro 6) and `@astrojs/sitemap@3.7.4`.
- **Alternative.** Astro 7.4.4 is available.
- **Why.** The brief fixes Astro 6 and the owner asked for the latest stable 6. Revisit after launch.

## 2026-11-01 · D-004 · Toolchain pins

| Tool           | Pinned                                                                                                                                              | Newer available                         | Why                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Node           | 24.22.2 LTS "Krypton" (`.nvmrc`, `engines`)                                                                                                         | 26 LTS "Lithium" (LTS since 2026-10-28) | A year of ecosystem maturity with Astro 6, sharp, resvg and Playwright; move to 26 in Phase 6. |
| pnpm           | 10.28.0 (`packageManager`)                                                                                                                          | 12.x                                    | The version the build sandbox ships; stable lifecycle-script policy (`onlyBuiltDependencies`). |
| TypeScript     | 5.9.3, `strict` plus `noUncheckedIndexedAccess`                                                                                                     | 6.0, 7.0                                | `@astrojs/check` supports ≤ 6 and `typescript-eslint` < 6.1; 5.9 is the safe overlap.          |
| ESLint         | 9.39 with `eslint-plugin-astro` 1.7 and `eslint-plugin-jsx-a11y` 6.10                                                                               | ESLint 10                               | `jsx-a11y` does not support ESLint 10 yet and `eslint-plugin-astro` ≥ 2 requires it.           |
| Playwright     | `@playwright/test` 1.63.0                                                                                                                           | 1.64.1                                  | Matches the Chromium preinstalled in the build sandbox; CI installs browsers normally.         |
| GitHub Actions | `checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `download-artifact@v8`, `upload-pages-artifact@v5`, `deploy-pages@v5`, `pnpm/action-setup@v5` |                                         | Newest majors that run on the Node 24 actions runtime.                                         |

## 2026-11-01 · D-005 · Fonts through the Astro Fonts API

- **Decision.** The Fonts API is stable in Astro 6, so Geist and Geist Mono use the `local` provider with the Fontsource variable WOFF2 files (latin and latin-ext, each with its `unicode-range`). Astro generates size-adjusted fallback faces from the font metrics. Only the latin file of each family is preloaded (a small `Fonts.astro` reads `fontData` because the preload filter cannot tell subsets of local files apart). Social images use the TTF files from the official `geist` package because Satori cannot read WOFF2.
- **Alternatives.** Fontsource CSS imports; the `geist` package's WOFF2 files (no subsets); the Fontsource provider (downloads at build time).
- **Why.** Zero runtime third-party requests, deterministic offline builds, about 52 KB of preloaded fonts, and CLS near 0.

## 2026-11-01 · D-006 · URL policy: trailing slash always

- **Decision.** `trailingSlash: 'always'` with `build.format: 'directory'`. Every internal URL goes through `withBase()` / `href()` in `src/lib/url.ts` and `src/i18n/routes.ts`. The link checker fails CI on a missing base path, a page URL without a trailing slash, `tel:` links or iframes.
- **Why.** It is what GitHub Pages serves natively (`about/index.html` at `/about/`) and makes relative-path mistakes impossible to miss.

## 2026-11-01 · D-007 · Positioning line

- **Default (one config value in `src/data/profile.ts`).** "I turn complex enterprise requirements into fast, secure mobile and web apps."
- **Alternatives (brief §4).**
  1. "Senior .NET engineer and team lead. I build secure cross-platform apps, and the teams that ship them." This becomes the default if the owner confirms the Team Lead title (OPEN_QUESTIONS Q1).
  2. "Cross-platform apps, clean architecture, on-device AI. Senior Software Engineer in Germany."

## 2026-11-01 · D-008 · Content model

- **Decision.** Structured CV data (profile, experience, education, capabilities, languages, layers, recommendations, lab) lives in typed modules under `src/data/`, validated with Zod 4 schemas from `src/schemas/` at build time and in unit tests. Case studies are an MDX content collection (`src/content/work/<locale>/<slug>.mdx`) whose frontmatter covers all nine parts of brief §5; the MDX body carries the narrative (for HAPP, its two chapters). Page copy lives next to each view in `*.copy.ts` modules declared with `defineCopy()`, so a missing translation is a type error and the parity test checks every module.
- **Alternatives.** YAML data files through the `file()` loader; putting the whole case study in the MDX body.
- **Why.** One typed source feeds the pages, the CV and its PDFs, JSON-LD and social images. TS modules can also be imported by the Phase 3 engine (the `layers` file is the scene's naming contract). Frontmatter makes the nine parts enforceable and the EN/DE structure comparable.

## 2026-11-01 · D-009 · A fourth case-study status: "Completed"

- **Decision.** The brief lists Live, Internal and In development. The 2019 humanoid-robot project is none of them, so a fourth honest status, `completed` ("Completed", "Abgeschlossen"), was added.

## 2026-11-01 · D-010 · Extra route: `/work/`

- **Decision.** Add a `/work/` and `/de/work/` index of all case studies.
- **Why.** It is the target of the "Work" navigation item and of the case studies' `BreadcrumbList`, and it prevents a 404 when someone trims a case-study URL.

## 2026-11-01 · D-011 · Placeholders

- **Decision.** Missing content is written inline as `[KIND: what is missing]` with a fixed set of kinds (METRIC, CONFIRM, ASSET, RECOMMENDATION, NAME, ADDRESS, DETAIL, LINK, CODE, DATE, TODO). It renders as a hatched, dashed, monospace mark (`.ph`) through `<Rich>` for data strings and a rehype plugin for MDX. `pnpm content:check` lists every occurrence and never fails the build.
- **Rule.** A default that still needs confirmation renders normally and is listed in OPEN_QUESTIONS.md instead.

## 2026-11-01 · D-012 · Markdown processor API

- **Decision.** Astro 6.4 deprecates `markdown.rehypePlugins`; the placeholder plugin is registered through `markdown.processor: unified({ rehypePlugins })` from `@astrojs/markdown-remark`, which MDX inherits.

## 2026-11-01 · D-013 · i18n routing

- **Decision.** Astro i18n with English at the root and German under `/de/` (`prefixDefaultLocale: false`). Both locales share slugs, so the language switch maps `/x/` ↔ `/de/x/` and lands on the equivalent page. Each route is a thin file in `src/pages/` and `src/pages/de/` that renders a shared view with a `locale` prop. There is no automatic language redirect; the chosen language is stored as a preference for later phases. British English (`en-GB`) for dates and spelling.
- **Exception.** GitHub Pages serves one `404.html`, so the 404 page is bilingual.

## 2026-11-01 · D-014 · Themes and the no-flash script

- **Decision.** `data-theme="graphite" | "paper"` on `<html>`. An inline script (generated from the same keys as `src/lib/prefs.ts`) sets the theme, motion, Save-Data and 3D attributes before first paint and again on `astro:after-swap`. A first visit follows `prefers-color-scheme`. Without JavaScript, a media query applies the paper palette for light-mode systems.

## 2026-11-01 · D-015 · ClientRouter now, motion later

- **Decision.** `<ClientRouter />` is on from Phase 1 because the persistent canvas of Phase 3 depends on it, but `transition:animate="none"` on `<html>` keeps Phase 1 free of motion. Every client script binds on `astro:page-load` and cleans up on `astro:before-swap`.

## 2026-11-01 · D-016 · robots.txt on a project site

- **Decision.** `robots.txt` is generated with an absolute sitemap URL, but crawlers only read it at the host root, so on the GitHub Pages project URL it is informational. Discovery relies on `<link rel="sitemap">` and the sitemap index until a custom domain serves the site at `/`.

## 2026-11-01 · D-017 · No embeds, no form, no analytics

- **Decision.** Videos are linked out (YouTube), never embedded. Contact is `mailto:` plus a copy-email button (the old site's Google Apps Script form is gone). No analytics in Phase 1. The link checker fails on any iframe.

## 2026-11-01 · D-018 · Conservative claims about HAPP

- **Decision.** The "Team Lead" title and the 7-person team (old site and English CV) are left out until the owner confirms them; the current Lebenslauf says "Senior-Softwareentwickler". The case study's team field shows `[CONFIRM: team size]`. Employer material is described with generic names only; every metric is a placeholder.

## 2026-11-01 · D-019 · Old-site images are not reused

- **Decision.** The old repo's project images are 315 × 242 px thumbnails (the robot video still is 502 × 276) and are below the quality bar. Case studies use SVG architecture diagrams; missing media are listed in ASSETS.md.

## 2026-11-01 · D-020 · Content Security Policy deferred

- **Decision.** Astro 6's stable CSP (`security.csp`) is not enabled in Phase 1; its interaction with ClientRouter and the inline theme script needs testing. Revisit in Phase 6. Note that the home figure's highlight rules (about 2.3 KB of `:has()` CSS) live in a `<style>` element inside its SVG, so a strict `style-src` will need a hash for it.

## 2026-11-01 · D-021 · Lighthouse scope

- **Decision.** Lighthouse CI covers every public page in both locales, on mobile and desktop presets, with filesystem reports. `/tokens/` and the 404 page are `noindex` by design and are excluded, because the SEO category would penalise exactly that.

## 2026-11-01 · D-022 · Bilingual skill and stack terms

- **Decision.** A skill or stack item is a `term` (`src/schemas/common.ts`): a product or tool name is a plain string, the same in both languages (`.NET MAUI`, `Keycloak`, `Python`); a descriptive phrase carries both (`{ en: 'Image processing', de: 'Bildverarbeitung' }`). `term(value, locale)` in `src/i18n/term.ts` renders it. Terms cover the capability and layer skills, the experience stacks and the robot and student archives, so the German home page, Experience, Lab, CV, PDF and the Person `knowsAbout` read in German. Case-study stacks are written per locale in the MDX, so the parity test compares their length, not their items, and counts any placeholder as equal (`[CONFIRM: Startdatum]`).
- **Alternatives.** Keep chips to tool names and move descriptive items into localized prose; localize every item, product names included.
- **Why.** German pages showed English phrases ("Authentication", "Lane tracking"), which breaks the rule that German copy is natural German. Product names do not change between languages, so they stay single strings and cannot drift.

## 2026-11-01 · D-023 · Shared UI components live in `src/components/ui/`

- **Decision.** Generic blocks that several pages share live in `src/components/ui/`; page folders keep the page-specific parts. The parallel build had put PageHeader, Points, CompactSection, DateRange, ArrowLink and PlannedChip in page folders and produced three ExternalLink copies (home, work, lab). They now live in `ui/`, with one ExternalLink: same tab, the arrow-up-right icon, the visually hidden "(external link)" note, an optional hidden `context`, `rel`, and an `inline` variant for prose. The footer's LinkedIn and GitHub links use it too (`rel="me"`). What pages had forced through `:global` overrides became props or helpers: FactList `layout="auto"` (rows that stack once the list is 24rem or narrower, a container query), CopyEmail `size="large"` and `formatRangeParts()` in `src/i18n/format.ts` (one `<time>` per end of a range; `PRESENT` is exported). Shared labels moved to `ui.copy.ts` (`labels.planned`, `cta.caseStudyFor`), and every target size uses the tokens `--target-min` (24 px) and `--target` (44 px).
- **Alternative.** Keep the per-page copies and the `:global` overrides.
- **Why.** File ownership during the parallel build forced duplicates and cross-folder imports. One component per pattern keeps the external-link rule, the target sizes and the wording the same everywhere, and removes the last raw sizes from components.

## 2026-11-01 · D-024 · Subpage headers and compact sections

- **Decision.** Experience, About, Lab and Colophon open with `ui/PageHeader`: the page name as the mono label, a statement `h1` ("Building software and hardware since 2018"), an intro and actions. An optional figure (the About portrait) takes its own grid area, so hiding it leaves a complete header. Reference content (timeline, education, languages, credits) uses `ui/CompactSection`, whose heading is the mono label itself ("01 — Timeline" as an `h2`); narrative sections keep `ui/Section` with a full-size `h2`.
- **Alternatives.** The page name as the `h1`; a full-size heading for every section.
- **Why.** A statement says more than "About", and dense reference lists read better without a large heading per block. Each page keeps one `h1` and an unbroken heading outline.

## 2026-11-01 · D-025 · Portrait architecture diagrams, numbered from frontmatter

- **Decision.** Case-study diagrams are portrait SVGs 360 units wide, readable at 360–390 px without a horizontal scroll container. On screens at least 64rem wide and 52rem tall, the figure stays in view beside the HTML step list, the layout Phase 2 scroll-syncs. Marker numbers follow the frontmatter step order, and the build fails if a diagram's `data-step` ids and the frontmatter ids differ (`src/components/work/diagrams/steps.ts`).
- **Alternative.** A landscape diagram in a horizontally scrolling container with a hint.
- **Why.** Landscape labels get tiny on phones, and the scroll container adds a tab stop that does nothing on desktop. The diagrams are decorative (`aria-hidden`); the numbered step list carries the meaning.

## 2026-11-01 · D-026 · CV print sheet and PDFs

- **Decision.** The PDF CVs are the CV page printed with its own A4 sheet (`src/styles/print.css`, imported only by CvView):
  - the screen design at a 9.5pt print root, so every rem token scales with it, in the paper palette on white whatever the theme (D-027);
  - a running footer ("Mohamed Lakhel — CV" and "page / pages") in `@page` margin boxes, fed by a `:root` custom property that CvView adds through BaseLayout's `head` slot (the `@page` context inherits only from the root element);
  - no `break-after` on section labels, because in a grid it propagates to the whole section and forces breaks inside the next one; entries and short sections use `break-inside: avoid` instead;
  - printed at a 1.5× pixel ratio, so the portrait comes from its 240 px rendition (about 240 ppi);
  - section labels end the number and the dash with a no-break space: Chromium drops plain spaces between the flex items from the PDF outline and text layer ("01—PROFILE").
- **Accepted.** Chromium (Skia) embeds the variable Geist as Type 3 fonts: text extracts cleanly, but some viewers draw it slightly softer; static font instances for print would change the shared font pipeline. The PDF metadata has only the title and language; author and subject would need a post-processing dependency. The running footer needs Chromium; other browsers print without it.
- **Why.** One source for the page and the PDFs (brief §6), and the printed CV keeps the site's proportions.

## 2026-11-01 · D-027 · Print tokens in `tokens.css`

- **Decision.** `tokens.css` ends with a print block that applies the paper palette on a white page, without shadows, to `:root[data-theme]` and `:root:not([data-theme])`, and `:root` declares the print tokens: `--print-font-size` (9.5pt), `--print-leading`, `--print-margin-top`, `--print-margin-side`, `--print-margin-bottom` and `--print-photo-size` (26 mm). `tokens.ts` mirrors them; the sync test checks that the print palette is the paper palette except for the background and the shadow.
- **Alternative.** The palette and sizes inside `print.css`, as the CV workstream first wrote them.
- **Why.** `print.css` repeated raw colours, an exception to the tokens-only rule and a drift risk. It now holds no raw colours or print sizes, and the PDFs render pixel-identical.

## 2026-11-01 · D-028 · Titles and descriptions never show a placeholder

- **Decision.** `Seo.astro` adds a localized qualifier to case-study titles ("HAPP · Case study — Mohamed Lakhel", "HAPP · Fallstudie — Mohamed Lakhel"), so the English and German twins never share a title. A meta description that still contains a placeholder is replaced by a localized template, and the social-image cards skip placeholder text; the page body still shows the placeholder.
- **Why.** Search snippets and link previews must never print "[METRIC: …]", and identical titles in two languages are ambiguous in search results.

## 2026-11-01 · D-029 · Case-study summaries within 160 characters

- **Decision.** A case study's `summary` is also its meta and `og:description`, so the schema caps it at 160 characters (it was 200). The six summaries run 156–160.
- **Alternative.** A separate `description` field for the meta.
- **Why.** Search results cut descriptions at about 155–160 characters, and one field cannot drift from a second one.

## 2026-11-01 · D-030 · Social images: the exploded stack, as palette PNGs

- **Decision.** Each page and locale gets a 1200 × 630 card in the site's look: graphite, the blueprint grid, Geist and Geist Mono, a mono kicker numbered in navigation order ("02 — Experience"; the legal pages have no number), hairline rules, frame marks and the seven-layer stack in isometric view. On a case study, the slab named by `scene.layer` is lifted out and drawn in cobalt with a numbered callout and its legend; other pages carry no accent. sharp quantises each card to a 256-colour palette PNG: 17.7–29.1 KB instead of 60–100 KB, visually lossless for the flat artwork. Text comes from `src/lib/og/cards.ts` (pure functions over `meta.copy.ts` and the data), geometry from `src/lib/og/stack.ts`, layout and rendering from `src/lib/og/render.ts`.
- **Alternative.** resvg's full-colour PNG output.
- **Why.** The stack is the site's motif and still reads at thumbnail size; the palette keeps every image far below the 120 KB budget.
- **Accepted.** Headline sizes are estimated from the character count and nothing detects overflow, so new or longer copy (long German words) needs a look after the build.

## 2026-11-01 · D-031 · Sitemap alternates match the page heads

- **Decision.** The sitemap integration uses the plain locale codes and adds an `x-default` alternate pointing at the English page, so every `<url>` lists hreflang `en`, `de` and `x-default`, the set every page head declares. The unused news, image and video namespaces are off; `/tokens/` and the 404 page stay out. `seo.spec.ts` checks the exact set for every URL.
- **Alternative.** The integration's regional codes (`en-GB`, `de-DE`) without `x-default`, as built before.
- **Why.** Head and sitemap should send the same signal; mismatched alternates leave search engines to guess.

## 2026-11-01 · D-032 · Legal pages as content data

- **Decision.** The Impressum and the Datenschutzerklärung are data: a page is a list of sections, a section a list of blocks (`src/views/legal/legal.ts`), with the copy in `impressum.copy.ts`, `datenschutz.copy.ts` and the shared `legal.copy.ts` (provider name and address, notices). One shell in `src/views/legal/` (`LegalPage`, `LegalBlocks`) renders both: label, `h1`, lede, the binding-version note, a table of contents on the privacy policy, and numbered sections. The German pages are binding; the English pages say so and link to them. Sections for features that are not live yet stay in the copy and are switched on in `LEGAL_FEATURES` (`spatialView: false`).
- **Alternative.** One hand-written page per locale.
- **Why.** Both locales keep the same structure, unit tests can check the cited legal bases and the placeholders, and a feature's privacy text goes live with one flag.
- **Later.** When the motion and 3D switches ship (`pref:motion`, `pref:3d`), the local-storage section must name them; the spatial-view section goes live with its flag.

## 2026-11-01 · D-033 · The colophon publishes the budgets

- **Decision.** The colophon shows the budgets of brief §10 as a real table (metric as row header, target, measured with, measured), grouped into Every page, Accessibility (WCAG 2.2 AA, from brief §10 and CLAUDE.md) and 3D stage (planned). The Measured column holds placeholders (`[METRIC: recorded at launch]`) until launch numbers exist. The header shows the build date and the Astro version ("Last built 1 November 2026 · Astro v6.4.8"), so the colophon HTML differs between builds.
- **Why.** The brief asks for a colophon with real performance numbers (§13); a table with honest gaps beats numbers nobody measured.

## 2026-11-01 · D-034 · QA suites beyond the smoke tests

- **Decision.** Next to smoke, keyboard (now including the home page's "Skip the parts list" link), theme and axe, Playwright checks the Phase 1 promises on every run:
  - `i18n.spec.ts`: the language switch on every page lands on its twin, hreflang alternates point at the twins, the choice is stored, and the 404 page has no switch;
  - `privacy.spec.ts`: on every page, zero third-party requests, no cookies, no embeds, no `tel:` links or phone numbers;
  - `nojs.spec.ts`: without JavaScript, the home page's first screen shows the name, role, positioning line and the three buttons at 1440 × 900 and 390 × 844 in both languages, every page renders, and the theme follows the system;
  - `mobile.spec.ts`: at 390 px the menu opens and closes (Escape returns focus), controls are at least 44 px, and no page scrolls horizontally;
  - `seo.spec.ts`: head metadata, social images, JSON-LD, unique titles and descriptions, the sitemap's hreflang set, robots.txt, the 404 and the legal pages;
  - `cv.spec.ts`: each download button serves its language's PDF (200, `application/pdf`, at most 2 pages), the other-language link carries its hreflang, and print hides the site chrome and prints on white, even in graphite;
  - `screenshots.spec.ts`: gate screenshots of every route in both locales and themes at 1440 × 900 and 390 × 844, only with `SCREENSHOTS=1` (CI sets it and uploads them).
- **Also.** Vitest adds `seo.test.ts` (JSON-LD builders and their privacy guard, meta lengths, social cards, the legal content model) and term tests in `schemas.test.ts`; `pnpm lhci` adds LCP, CLS and TBT to its summary.
- **Why.** These are the gate's promises (brief §10–§12): a recruiter's first screen without JavaScript, zero third-party requests, both languages in step, and a CV that downloads and prints correctly. Each check is cheap enough for every run.
