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

- **Decision.** `data-theme="graphite" | "paper"` on `<html>`. An inline script (generated from the same keys as `src/lib/prefs.ts`) sets the theme, motion and 3D attributes before first paint and again on `astro:after-swap`. A first visit follows `prefers-color-scheme`. Without JavaScript, a media query applies the paper palette for light-mode systems.

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

- **Decision.** Astro 6's stable CSP (`security.csp`) is not enabled in Phase 1; its interaction with ClientRouter and the inline theme script needs testing. Revisit in Phase 6.

## 2026-11-01 · D-021 · Lighthouse scope

- **Decision.** Lighthouse CI covers every public page in both locales, on mobile and desktop presets, with filesystem reports. `/tokens/` and the 404 page are `noindex` by design and are excluded, because the SEO category would penalise exactly that.
