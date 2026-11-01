# Handoff

Status of the Phase 0 + Phase 1 build session, written so the next session (or a resumed one) can continue without guesswork. Delete this file once Phase 1 is approved.

## Where things are

- Branches: `main` holds only the verbatim brief (initial commit). All work is on `claude/confident-hopper-hf0b4d`, pushed to origin. Open a PR into `main` at the Phase 1 gate.
- Phase 0 (foundation) is complete and pushed: toolchain, tokens and `/tokens`, base layout, i18n, schemas, typed CV data, stubs for every route, scripts (serve-dist, build-pdf, check-links, content-check, js-size-report, lhci), unit and e2e tests, CI with deploy, docs.
- Phase 1 pages are built in parallel workstreams, each in its own git worktree and local branch (not pushed):

| Workstream | Worktree              | Branch     | Owns                                                                                        |
| ---------- | --------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| home       | `/home/user/wt/home`  | `ws/home`  | `src/views/home/**`, `src/components/home/**`                                               |
| work       | `/home/user/wt/work`  | `ws/work`  | `src/content/work/**`, `src/views/work/**`, `src/components/work/**`, `src/schemas/work.ts` |
| pages      | `/home/user/wt/pages` | `ws/pages` | experience, about, lab, colophon views and components                                       |
| cv         | `/home/user/wt/cv`    | `ws/cv`    | `src/views/cv/**`, `src/components/cv/**`, `src/styles/print.css`, `scripts/build-pdf.mjs`  |
| seo        | `/home/user/wt/seo`   | `ws/seo`   | SEO head, structured data, social images, `meta.copy.ts`, legal views, 404, `tests/*/seo.*` |

- Local, unpushed commit on the session branch: QA suites (language mapping, privacy, no-JS first screen, mobile menu, gate screenshots, Lighthouse LCP/CLS summary). The four "no-JS first screen" tests only pass once the real home page is merged.

## Next steps

1. Merge each `ws/*` branch into `claude/confident-hopper-hf0b4d` (`git merge --no-ff ws/<name>`), resolve conflicts, apply the reasonable `sharedFileRequests` from the workstream reports, delete `src/components/layout/StubPage.astro` once nothing imports it.
2. Verify: `pnpm lint && pnpm check && pnpm test && pnpm build && pnpm linkcheck && pnpm size && E2E_PORT=4399 SCREENSHOTS=1 pnpm test:e2e && pnpm lhci`. Look at the screenshots in `reports/screenshots/`.
3. Push; check CI.
4. Run the independent review workflow (script draft: `/tmp/claude-0/-home-user/66132e40-4bd9-5c75-860b-d54996e807e6/scratchpad/review-workflow.js`): gate audit, content fact-check, accessibility/visual review, each adversarially verified. Fix the confirmed findings.
5. Update OPEN_QUESTIONS.md (merge the workstreams' owner questions), DECISIONS.md, ASSETS.md, README.md.
6. Open the PR into `main` and write the Phase 1 gate report (owner message, section 7). Then stop and wait for approval.

## Environment notes (cloud sandbox)

- `export PATH=/opt/node24/bin:$PATH` before every command (the sandbox default is Node 22).
- Chromium for Playwright 1.63 is preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); never run `playwright install`.
- Never kill processes with `pkill -f`/`pgrep -f` patterns (they match the calling shell); kill by PID.
- Never commit personal data from the Lebenslauf (phone number, street address, birth date), not even in tests.
