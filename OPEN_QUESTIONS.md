# Open questions

What the owner needs to answer or supply, most important first. Items marked **[CONFIRM]** are defaults that already render on the site; items marked **[SUPPLY]** are shown as placeholders until they arrive. `pnpm content:check` lists every placeholder in the code.

## 1. Must confirm before launch

1. **[CONFIRM] Team Lead title and team size at Anton-Haering.** The old site and the older English CV say "Team Lead / Senior Software Engineer" and "leading a 7-member team". The current Lebenslauf says "Senior-Softwareentwickler". The site currently omits the Team Lead title and the team size. If you confirm both, the positioning line switches to "Senior .NET engineer and team lead…" (DECISIONS D-007) and the HAPP case study's team field gets the number.
2. **[CONFIRM] Legal name of the employer.** CV and old site: "Anton-Haering GmbH"; GitHub profile: "Anton Haering KG". The site uses "Anton-Haering GmbH".
3. **[CONFIRM] HAPP permission.** The site names the company and the app (as your CV already does), describes the architecture with generic names and shows no screenshots. May it stay that way? What may be shown later (screenshots, figures)?
4. **[SUPPLY] HAPP metrics** (all placeholders now): users or installs, platforms and versions, release cadence before/after, crash-free sessions, audit findings closed, review turnaround, test coverage, migration scope (screens, modules, duration).
5. **[CONFIRM] HoloBox status and facts.** Shown as "In development". Also needed: start date, team (solo?), whether a repo or demo can be linked, and a demo clip when ready.
6. **[SUPPLY] Impressum details.** Full legal name and a postal address that can receive legal documents (no PO box). Both are placeholders on `/impressum/` and `/datenschutz/`.
7. **[CONFIRM] German copy.** All German text was written for this build and needs your review: hero, summaries, experience highlights, case studies, About, Lab, legal pages.

## 2. Content to supply (by impact)

8. **[SUPPLY] Recommendations.** Two or three recent ones, ideally a manager, a peer and someone you coached (LinkedIn recommendations work). Three empty slots are shown.
9. **[CONFIRM] Availability and work mode.** Your last role ended 12.2025. Both fields exist in `src/data/profile.ts` but stay off the quick-facts card until you confirm them (for example "Available now" and "On-site or hybrid in Baden-Württemberg, remote within the EU").
10. **[CONFIRM] Did HAPP move from Xamarin to .NET MAUI?** Your Lebenslauf names both for 2024–2025 and Microsoft ended Xamarin support in May 2024. If you led that migration, it is a strong third chapter.
11. **[SUPPLY] Humanoid-robot material.** Three clear photos (front, side, back) for the Phase 4 model; your team size on the project; confirmation that the five YouTube videos linked on `/lab/` are still public and may be linked.
12. **[SUPPLY] Code excerpts or clips** for the "Hard problems" sections (anonymised). Placeholders now.
13. **[CONFIRM] "5+ years".** Used in the quick facts and meta descriptions, as stated in your brief. Professional roles run from 09.2020 to 12.2025.
14. **[SUPPLY] GitHub repos worth showing**, if any.
15. **[CONFIRM] Student archive on `/lab/`.** A short list (project-management app, baby-care device, OmniWheel robot, Smart Thief, IShried). Keep or drop?

## 3. Decisions for later phases

16. **Domain.** A personal domain (for example `firstname-lastname.dev`) and the Cloudflare account (DECISIONS D-001).
17. **Positioning line.** Keep the default or pick an alternative (D-007).
18. **Launch date**, plus two or three sites you like and any you dislike (brief §15).
19. **Datenschutz review.** The text describes GitHub Pages (GitHub, Inc.), its server logs and the EU–US Data Privacy Framework. Please have it checked by a lawyer or a reputable generator; this is orientation, not legal advice (brief §11).

## Source conflicts (logged, resolved by source priority)

Priority: current Lebenslauf → older English CV → old site.

| Topic                              | Lebenslauf                                                     | English CV / old site                                                         | Used                                                                     |
| ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Senior role start                  | 07.2024                                                        | "Juin 2024"                                                                   | 07.2024                                                                  |
| Senior role end                    | 12.2025                                                        | "Present" (text says the role concluded)                                      | 12.2025                                                                  |
| Title 2024–2025                    | Senior-Softwareentwickler                                      | Team Lead / Senior Software Engineer                                          | Senior Software Engineer (Q1)                                            |
| Team size                          | not stated                                                     | 7 members                                                                     | omitted (Q1)                                                             |
| Employer                           | Anton-Haering GmbH                                             | GitHub profile: Anton Haering KG                                              | GmbH (Q2)                                                                |
| Location                           | Tuttlingen                                                     | "Currently in: Bubsheim"                                                      | Tuttlingen, Baden-Württemberg                                            |
| Surname                            | Lakhel                                                         | both "Lakhal" and "Lakhel"                                                    | Lakhel (email keeps "lakhal")                                            |
| MVVM / Clean Architecture refactor | not stated                                                     | stated                                                                        | shown, sourced to the English CV                                         |
| Code-review governance framework   | "Code-Reviews und Coaching"                                    | "code review governance framework"                                            | both shown, each with its source                                         |
| Education                          | Ingenieurdiplom – Informatik, Nationale Ingenieurschule Sousse | National School of Engineering of Sousse, Faculty of Applied Computer Science | Engineering Diploma in Computer Science, ENISo, applied computer science |
| Birth date, phone, street address  | on CV                                                          | on old site                                                                   | never published                                                          |
