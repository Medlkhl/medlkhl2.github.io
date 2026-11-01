# Handoff

Status of the Phase 0 + Phase 1 build session, written so the next session (or a resumed one) can continue without guesswork. Delete this file once Phase 1 is approved.

## Where things are

- Branches: `main` holds only the verbatim brief (initial commit). All work is on `claude/confident-hopper-hf0b4d`. Origin has it up to `70c22ef` (the merged workstreams); the code pass and the docs pass after it are local commits until the next push. Open a PR into `main` at the Phase 1 gate.
- Phase 0 (foundation) is complete: toolchain, tokens and `/tokens`, base layout, i18n, schemas, typed CV data, scripts (serve-dist, build-pdf, check-links, content-check, js-size-report, lhci), unit and e2e tests, CI with deploy, docs.
- Phase 1 pages were built in five parallel workstreams (home, work, pages, cv, seo), each in a git worktree under `/home/user/wt/<name>` on a local `ws/<name>` branch. All five are merged; the worktrees and branches are kept for reference only.
- A code pass on top of the merges applied the workstreams' shared-file requests: bilingual skill and stack terms, shared UI components in `src/components/ui/`, print and touch-target tokens, the sitemap alternates, 160-character case-study summaries, the legal shell in `src/views/legal/`, CV end-to-end tests and a skip link over the home parts list; the foundation stub page is gone (DECISIONS D-022 to D-034).
- The repo docs describe the integrated site: ASSETS (sizes from the latest build), DECISIONS (D-022 to D-034), ARCHITECTURE, OPEN_QUESTIONS (all owner questions from the five workstreams, 27 items) and README.

## Next steps

1. Done: merged each `ws/*` branch (`1a2752e` to `8b2f9ca`), applied the reasonable `sharedFileRequests` (`4860ef8` to `1e3590a`) and deleted `src/components/layout/StubPage.astro`.
2. Done: verified at `1e3590a`. Lint and Prettier clean; `astro check` 0 errors; 134 unit tests pass; the build gives 26 pages and two 2-page PDFs (213.9 KB and 217.7 KB); no broken internal links; at most 7.8 KB JS gzip per page; 182 e2e tests pass (the 4 gate-screenshot tests skip without `SCREENSHOTS=1`). Lighthouse ran in CI only (step 3).
3. Done: pushed up to `70c22ef` and checked CI. Quality, build and e2e passed; Lighthouse failed on SEO (91) for the three German case studies, on mobile and desktop (see step 5).
4. Review: run the independent review workflow (script draft: `/tmp/claude-0/-home-user/66132e40-4bd9-5c75-860b-d54996e807e6/scratchpad/review-workflow.js`): gate audit, content fact-check, accessibility/visual review, each adversarially verified.
5. Fixes: fix the confirmed findings, then push and check CI again. Known before the review:
   - Lighthouse SEO 91 on `/de/work/<slug>/`: the breadcrumb's first link reads "Start" (`de.nav.home` in `src/i18n/ui.copy.ts`), which the "Links do not have descriptive text" audit rejects. Still failing at `1e3590a` (local Lighthouse run on `/de/work/happ/`); a label such as "Startseite" avoids it.
   - The Datenschutz pages render the postal-address block, while brief §11 and CLAUDE.md keep the postal address on `/impressum/` only. Point the controller section to the Impressum, or settle it with the owner (OPEN_QUESTIONS Q8).
6. PR and gate report: open the PR into `main` and write the Phase 1 gate report (owner message, section 7) with the screenshots (`SCREENSHOTS=1 pnpm test:e2e`, or CI's `screenshots` artifact) and the Lighthouse summary. Then stop and wait for approval.

## Environment notes (cloud sandbox)

- `export PATH=/opt/node24/bin:$PATH` before every command (the sandbox default is Node 22).
- Chromium for Playwright 1.63 is preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); never run `playwright install`.
- Never kill processes with `pkill -f`/`pgrep -f` patterns (they match the calling shell); kill by PID.
- Never commit personal data from the Lebenslauf (phone number, street address, birth date), not even in tests.
