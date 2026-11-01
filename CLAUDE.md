# CLAUDE.md

Context for every build session on this repo. Read this, then the brief.

## What this is

The portfolio of **Mohamed Lakhel**, Senior Software Engineer (Germany): a precise, calm, editorial site for business hiring. Concept: **"Systems, shipped"** (brief §4). English at `/`, German at `/de/`. Static HTML first; a persistent 3D canvas arrives in Phase 3 as a progressive enhancement.

- Binding spec: [`PORTFOLIO_BRIEF.md`](./PORTFOLIO_BRIEF.md). Phase plan and gates: brief §12. Budgets: brief §10. Legal: brief §11.
- Structure and data flow: [`ARCHITECTURE.md`](./ARCHITECTURE.md). Why things are the way they are: [`DECISIONS.md`](./DECISIONS.md).
- Assets and their status: [`ASSETS.md`](./ASSETS.md). Owner questions and source conflicts: [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md).

## Commands

```bash
export PATH=/opt/node24/bin:$PATH   # only in the cloud sandbox, where Node 22 is the default
pnpm install
pnpm dev                 # dev server (base path included)
pnpm build               # astro build + PDF CVs
pnpm preview             # serve dist/ under the base path
pnpm lint && pnpm check && pnpm test
pnpm linkcheck           # after a build
pnpm test:e2e            # after a build
pnpm size                # JS per page (gzip) vs 90 KB
pnpm lhci                # Lighthouse, mobile + desktop
pnpm content:check       # remaining placeholders (warning only)
```

In the sandbox, Playwright 1.63 uses the preinstalled Chromium through `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; never run `playwright install` there. Lighthouse uses `CHROME_PATH`.

## Structure (short)

- `site.config.ts`: `SITE_URL`, `BASE_PATH`. The only place they are defined.
- `src/pages/` (thin routes, `de/` twins) → `src/views/<page>/` (page bodies + `<page>.copy.ts`).
- `src/layouts/BaseLayout.astro`: theme script, fonts, SEO, `<ClientRouter />`, `#stage`, header, footer.
- `src/data/` typed CV data · `src/schemas/` Zod schemas · `src/content/work/<locale>/<slug>.mdx` case studies.
- `src/i18n/`: locales, routes (`href`, `routeHref`, `workHref`, `localePath`), Intl formatting, UI copy, page meta.
- `src/lib/`: `url.ts` (base path), `prefs.ts` (preferences), `placeholders.ts`, `cv.ts`, `og.ts`, `contrast.ts`.
- `src/styles/tokens.css` (source of truth) + `tokens.ts` (mirror) + `global.css`.
- `src/engine/`: Phase 3 module skeleton. `scripts/`: serve-dist, build-pdf, check-links, content-check, js-size-report, lhci.

## Conventions

- **URLs.** Never hard-code the base path. Build every internal URL with `withBase()`, `href()`, `routeHref()` or `workHref()`. Page URLs end with `/`; endpoints with a file extension never do. Use relative URLs (no leading slash) in Playwright tests.
- **i18n.** Every page exists in both locales with the same slug. Copy goes in `*.copy.ts` via `defineCopy()`, never inline in markup. Dates are ISO `YYYY-MM` and are formatted with `src/i18n/format.ts`. British English. German copy is natural, not literal, and is listed for owner review.
- **Content.** Never invent facts, numbers, employers, dates, quotes or recommendations. Missing data is a placeholder `[KIND: label]` (kinds in `src/lib/placeholders.ts`), rendered with `<Rich text={…} />` or by the MDX rehype plugin. A default awaiting confirmation renders normally and goes in OPEN_QUESTIONS.md.
- **Privacy.** Never publish birth date, phone number or street address, the Facebook link or the dead Blog link. The postal address appears only on `/impressum/`. Employer (HAPP) material is confidential: generic names, no screenshots, metrics as placeholders. No Kawaii Nekko products.
- **Design.** Neutrals plus one cobalt accent, only for interaction and highlights. Geist Sans for text, Geist Mono for labels and metadata, `tabular-nums` for figures. 12-column grid, 8 px spacing, hairline rules, monospace section labels ("02 — Experience"). Use tokens; no raw colours or sizes in components.
- **JavaScript.** Zero by default. Client scripts are bundled `<script>` tags that bind on `astro:page-load` (and clean up on `astro:before-swap`) because `<ClientRouter />` keeps the document alive. Elements that need JS get `.js-only`. Budget: 90 KB gzip per content page.
- **Accessibility.** WCAG 2.2 AA: visible focus, skip link, landmarks, one `h1`, contrast ≥ 4.5:1 for text and ≥ 3:1 for UI, 44 px targets for controls, the accessible name contains the visible label.
- **Runtime.** Zero third-party requests. No iframes or embeds (link out), no forms, no analytics, no cookies.
- **Commits.** Small and frequent, clear messages. Keep README, ARCHITECTURE, DECISIONS, ASSETS and OPEN_QUESTIONS current.

## How to work (brief §13)

- One phase at a time (brief §12). End each phase with: what changed; screenshots at 1440×900 and 390×844 in both themes; a short screen recording for motion work; Lighthouse scores; bundle sizes; 3D payload; fps and draw calls; a checklist against that phase's gate. Then stop and wait for approval.
- Never block on assets. Build with stand-in shapes and keep ASSETS.md current (file name, budget, naming convention, source, licence, status).
- Content lives in semantic HTML. The canvas is decorative and can be switched off without losing anything.
- One typed content source generates the pages, the PDF CVs (English and German) and the structured data.
- Never invent facts, numbers, employers or quotes. Use clearly marked placeholders such as [METRIC] until the owner supplies real data.
- Treat employer material as confidential: use only screenshots and figures the owner marks as cleared.
- Respect the budgets in brief §10. If a feature would break one, propose a cheaper variant or move it to a higher quality tier.
- Every visual feature needs a WebGL 2 path (test with `forceWebGL: true`), a reduced-motion behaviour and a classic-mode behaviour.
- Write all shaders in TSL with node materials. No ShaderMaterial, RawShaderMaterial or onBeforeCompile.
- Self-host everything at runtime: fonts, three.js, MediaPipe WASM and models, media. No third-party requests without approval.
- Small commits with clear messages, one branch per phase. Keep README.md, ARCHITECTURE.md and DECISIONS.md current.
- When two approaches are close, pick the simpler one, record the alternative in DECISIONS.md and keep going.
- Verify in a real browser before you report: open the pages, read the console, take the screenshots yourself.

## Phase status

- Phase 0 (foundations) and Phase 1 (classic site): see the latest gate report in the PR.
- Phase 2 (motion layer) consumes the motion tokens in `tokens.css` / `tokens.ts` and the `prefs:change` event; no rewrites of client scripts should be needed.
- Phase 3 (3D stage) mounts into `#stage`, reads `body[data-scene-shot]` / `body[data-active-layer]` and `src/data/layers.ts`, and implements the modules in `src/engine/`.
