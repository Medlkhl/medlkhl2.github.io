# Handoff

Status of the Phase 0 + Phase 1 build, written so the next session can continue without guesswork. Delete this file once Phase 1 is approved.

## Where things are

- **Branches.** `main` holds only the verbatim brief. All work is on `claude/confident-hopper-hf0b4d`, open as draft PR #1 into `main`. Origin has the branch up to `c69e9e0`, where CI is green (quality, build, e2e, Lighthouse). The review fixes after it are local commits until the next push.
- **Built.** Phase 0 (toolchain, tokens and `/tokens/`, base layout, i18n, schemas, typed CV data, scripts, unit and e2e tests, CI with deploy, docs) and Phase 1 (every route in English and German, the PDF CVs, SEO, the legal pages, the bilingual 404).
- **Review: done.** An independent review (gate audit, content fact-check, accessibility and visual QA) confirmed 61 findings, each verified by a separate skeptic: 20 gates, 18 content, 23 design.
- **Fixes: done.** Fix passes worked through the confirmed findings by area: header and navigation, layout and components, content and German copy, then tests, CI and docs. Owner questions they raised are in `OPEN_QUESTIONS.md`. One finding was rejected at triage: gates-08 would have dropped the portrait from the PDFs, and the portrait stays in the HTML and PDF CVs (Q9).
- **Verified at the last fix commit.** Lint and Prettier clean; `astro check` 0 errors; 138 unit tests pass; the build gives 26 pages and two 2-page PDFs (213.9 KB and 217.7 KB); no broken internal links; at most 8.0 KB JS gzip per page; 196 e2e tests pass (the 4 gate-screenshot tests skip without `SCREENSHOTS=1`); `pnpm content:check` lists 76 placeholders in source, shown on 16 pages. Lighthouse runs in CI after the push.
- **Docs.** README, ARCHITECTURE, DECISIONS (D-001 to D-036), ASSETS and OPEN_QUESTIONS describe the integrated, reviewed site.

## Remaining

1. **Push and check CI.** Push the fix commits and confirm that quality, build, e2e and Lighthouse pass.
2. **Gate report.** Replace the PR #1 description with the Phase 1 gate report (owner message): what changed, screenshots (CI's `screenshots` artifact, or `SCREENSHOTS=1 pnpm test:e2e`), the Lighthouse summary, bundle sizes, a checklist against the Phase 0 and Phase 1 gates, and the go-live section below. Then stop and wait for approval.
3. **Owner input.** The answers in `OPEN_QUESTIONS.md`, section 1 before launch: Team Lead title and team size, the employer's legal name, HAPP permission and metrics, HoloBox facts, the Impressum name and postal address (a launch blocker: the Impressum shows placeholders until then), the German copy, the legal statements and the portrait in the PDFs.
4. **PR merge.** The owner merges PR #1 into `main` after approving the gate.
5. **Pages switch.** The owner sets Settings → Pages → Build and deployment → Source: GitHub Actions, once, before or right after the merge. Then check the first deploy run (go-live section, step 3).

## Go live (for the PR description and the gate report)

- **Phase 0 gate, "a preview URL is live": not met yet.** CI deploys to GitHub Pages only on pushes to the default branch (DECISIONS D-001), so the per-branch preview is each CI run's `site` artifact, served locally with `pnpm preview` (D-002). The other Phase 0 items are met: CI is green and `/tokens/` shows colour, type and spacing in both themes.
- **Steps:**
  1. Settings → Pages → Build and deployment → Source: **GitHub Actions** (one time).
  2. Merge PR #1 into `main`. The push to `main` runs CI, and its deploy job publishes <https://medlkhl.github.io/medlkhl2.github.io/>.
  3. Check that first run: it is the first through `upload-pages-artifact`, `deploy-pages` and the `github-pages` environment. If the deploy job fails because step 1 was not done yet, do step 1 and re-run the failed jobs. Then open the URL, both languages and a PDF.
- From then on, every push to `main` deploys after all checks pass. A newer push cancels superseded runs on other branches but never on `main`, so a running deploy always finishes.

## Environment notes (cloud sandbox)

- `export PATH=/opt/node24/bin:$PATH` before every command (the sandbox default is Node 22).
- Chromium for Playwright 1.63 is preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); never run `playwright install`. `E2E_PORT` picks the port that the e2e server uses.
- Never kill processes with `pkill -f`/`pgrep -f` patterns (they match the calling shell); kill by PID.
- Never commit personal data from the Lebenslauf (phone number, street address, birth date), not even in tests.
