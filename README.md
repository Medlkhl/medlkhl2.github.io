# Mohamed Lakhel — portfolio

**Systems, shipped.** The bilingual (English and German) engineering portfolio of Mohamed Lakhel, Senior Software Engineer: an editorial, static site built with Astro 6, with a 3D architecture stage planned as a progressive enhancement.

- Live (once GitHub Pages is enabled): <https://medlkhl.github.io/medlkhl2.github.io/>
- Spec: [`PORTFOLIO_BRIEF.md`](./PORTFOLIO_BRIEF.md) (binding) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DECISIONS.md`](./DECISIONS.md) · [`ASSETS.md`](./ASSETS.md) · [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) · [`CLAUDE.md`](./CLAUDE.md)

## Requirements

- Node 24 LTS (`.nvmrc`), pnpm 10 (`packageManager` in `package.json`; `corepack enable` picks it up).
- Chromium for the PDF CVs and the end-to-end tests: `pnpm exec playwright install chromium`.

## Run

```bash
pnpm install
pnpm dev            # http://localhost:4321/medlkhl2.github.io/
```

## Build and check

```bash
pnpm build          # astro build + print the PDF CVs into dist/
pnpm preview        # serve dist/ under the base path, like GitHub Pages
pnpm lint           # ESLint + Prettier
pnpm check          # astro check (TypeScript strict)
pnpm test           # Vitest: schemas and terms, EN/DE parity, date formatting, URLs, tokens, SEO
pnpm linkcheck      # crawl dist/ and fail on any broken internal link
pnpm test:e2e       # Playwright: every route in both locales, keyboard, theme, language, axe,
                    #   privacy, no-JS, mobile, SEO and CV; SCREENSHOTS=1 adds the gate screenshots
pnpm size           # JavaScript per page (gzip) against the 90 KB budget
pnpm lhci           # Lighthouse CI, mobile and desktop, reports in reports/lighthouse/
pnpm content:check  # list remaining [PLACEHOLDER: …] content (never fails)
pnpm verify         # lint, check, test, build, linkcheck, e2e
```

Run `pnpm test:e2e` after a build (it serves `dist/` under the base path; `E2E_PORT` picks the port). Every suite and what it checks: [`ARCHITECTURE.md`](./ARCHITECTURE.md#quality-pipeline).

## Deploy

CI (`.github/workflows/ci.yml`) runs on every push and pull request. On a push to the **default branch** (whatever it is called), it deploys `dist/` to GitHub Pages after every check passes.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Every run uploads artifacts: `site` (the built site), `screenshots`, `playwright-report`, `lighthouse`, `build-reports`, `placeholders`. GitHub Pages has no per-branch previews; download `site` and run `pnpm preview` against it, or see DECISIONS D-002 for the Cloudflare upgrade.

### Custom domain later

Change `SITE_URL` and `BASE_PATH` in [`site.config.ts`](./site.config.ts) (for example `https://example.dev` and `/`). Every URL, canonical, sitemap entry, social image and PDF link follows.

## Edit content

| What                                                     | Where                                                                                                                                                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, email, LinkedIn, GitHub                            | `src/data/identity.ts`                                                                                                                                                                    |
| Role, positioning line, summaries, location, quick facts | `src/data/profile.ts`                                                                                                                                                                     |
| Experience and education                                 | `src/data/experience.ts` (ISO `YYYY-MM` dates; every highlight records its source; stack items are terms)                                                                                 |
| Capabilities (skills) and languages                      | `src/data/skills.ts` (skills are terms)                                                                                                                                                   |
| Architecture-stack layers                                | `src/data/layers.ts` (also the home page's Fig. 1 and the 3D scene's naming contract)                                                                                                     |
| Recommendations                                          | `src/data/recommendations.ts` (verbatim quotes only)                                                                                                                                      |
| Robot archive and student projects                       | `src/data/lab.ts`                                                                                                                                                                         |
| Case studies                                             | `src/content/work/en/<slug>.mdx` and `src/content/work/de/<slug>.mdx` (same slug, schema in `src/schemas/work.ts`; the `summary` doubles as the meta description, at most 160 characters) |
| Case-study diagrams                                      | `src/components/work/diagrams/<slug>.astro`, labels in `diagrams.copy.ts` (step ids must match the frontmatter's `architecture.steps`)                                                    |
| Page copy                                                | `src/views/<page>/<page>.copy.ts` (English and German side by side)                                                                                                                       |
| Legal pages                                              | `src/views/impressum/impressum.copy.ts`, `src/views/datenschutz/datenschutz.copy.ts`; name and address in `src/views/legal/legal.copy.ts`, feature flags in `legal.ts`                    |
| Header, footer, buttons, shared labels                   | `src/i18n/ui.copy.ts`                                                                                                                                                                     |
| Page titles and descriptions, social-image text          | `src/i18n/meta.copy.ts`                                                                                                                                                                   |
| Design tokens                                            | `src/styles/tokens.css` (and the mirror `src/styles/tokens.ts`, print tokens included); see `/tokens/`                                                                                    |

Rules: never invent facts, numbers or quotes. Write missing content as a placeholder, `[METRIC: release cadence]`; it renders as a visible mark and `pnpm content:check` lists it. Both languages must stay in step: the parity tests fail otherwise. Skills and stack items are terms: a product name is a plain string (`'Keycloak'`), a descriptive phrase carries both languages (`{ en: 'Image processing', de: 'Bildverarbeitung' }`).

Never commit CVs or other personal source documents (`*.pdf` is ignored), and never publish a phone number, birth date or street address (the postal address belongs on `/impressum/` only).
