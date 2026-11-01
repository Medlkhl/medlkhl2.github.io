# Open questions

What the owner needs to answer or supply, most important first. Items marked **[CONFIRM]** are defaults that already render on the site; items marked **[SUPPLY]** are shown as placeholders until they arrive. Placeholders are quoted as the English pages show them; `pnpm content:check` lists every placeholder in the code.

## 1. Must confirm before launch

1. **[CONFIRM] Team Lead title and team size at Anton-Haering.** The old site and the older English CV say "Team Lead / Senior Software Engineer" and "leading a 7-member team". The current Lebenslauf says "Senior-Softwareentwickler". The site currently omits the Team Lead title and the team size; the HAPP case study shows `[CONFIRM: team size]`. If you confirm both, the positioning line switches to "Senior .NET engineer and team lead…" (DECISIONS D-007) and the team field gets the number. Related: the home page's work and experience intros speak of the "enterprise app whose development I led", following the Lebenslauf ("Leitete die Entwicklung"). Please confirm that wording.
2. **[CONFIRM] Legal name of the employer.** CV and old site: "Anton-Haering GmbH"; GitHub profile: "Anton Haering KG". The site uses "Anton-Haering GmbH".
3. **[CONFIRM] HAPP permission and wording.** The site names the company and the app (as your CV already does), describes the architecture with generic names, shows no screenshots and carries a confidentiality note. May it stay that way? What may be shown later (screenshots, figures)? Please also confirm three phrasings inferred from your CVs:
   - "It started out on React Native, outside the company's technology standards" (from "realigned its architecture with the company's technology standards");
   - "app and API share C# and .NET";
   - the generic flow in which the API, not the app, talks to the internal enterprise services.
4. **[SUPPLY] HAPP metrics and details.** The case study's results show `[METRIC: findings closed]` (audit findings closed), `[METRIC: before and after]` (release cadence), `[METRIC: crash-free rate]` (crash-free sessions) and `[METRIC: median time to review]` (review turnaround). Also open: `[DETAIL: how the migration was sequenced]` and `[DETAIL: how the migration was sequenced and what it covered]` (screens, modules, duration), `[DETAIL: which OIDC flow the app uses]` and `[DETAIL: what I would do next]`. Welcome if cleared, though not on the page yet: users or installs, platforms and versions, test coverage.
5. **[CONFIRM] HoloBox status and facts.** Shown as "In development", with the role "Architecture and development" and "Cloud services: None" (from "works offline": please confirm that nothing in the speech or model loop calls a cloud service). Open on the case study:
   - `[CONFIRM: start date]` (also on the home page and `/work/`; About shows only the status chip) and `[CONFIRM: team size]` (solo?);
   - the engines: `[CONFIRM: speech-recognition engine]`, `[CONFIRM: text-to-speech engine and lip-sync technique]`, `[CONFIRM: speech and voice engines]` and `[DETAIL: how speech recognition, the model and text-to-speech are chained]`;
   - the figures: `[METRIC: speech to speech]` (latency), `[METRIC: fps on the target PC]`, `[METRIC: GGUF size and quantisation]` and `[METRIC: peak memory]`;
   - `[DETAIL: current state of the prototype]`, `[DETAIL: next milestones]` and `[LINK: demo clip or repository]` (the demo clip itself is item 15).
6. **[SUPPLY] Impressum details.** Full legal name and a postal address that can receive legal documents (no PO box). `/impressum/` and `/datenschutz/` show `[NAME: full legal name]`, `[ADDRESS: street and house number]` and `[ADDRESS: postcode and city]`, and their German versions `[NAME: vollständiger Name]`, `[ADDRESS: Straße und Hausnummer]` and `[ADDRESS: Postleitzahl und Ort]` (the address block in `src/views/legal/legal.copy.ts`); the Impressum repeats the name where it names you as responsible for the content (`impressum.copy.ts`, item 8).
7. **[CONFIRM] German copy.** All German text was written for this build and needs your review:
   - home (`src/views/home/home.copy.ts`): "Auf einen Blick", "Tech-Stack", "Stückliste", "Explosionszeichnung", "Isometrie · nicht maßstäblich", the section titles and intros, the contact line;
   - the case studies (`src/content/work/de/`), summaries and experience highlights;
   - Experience, About, Lab and Colophon, including the headline "Seit 2018 entwickle ich Software und Hardware", and the `/de/work/` headline "Projekte, vom Ergebnis bis zur Architektur" (`src/views/work/work.copy.ts`);
   - the CV labels: "PDF herunterladen", "Englische Fassung (PDF)", "A4, aus dieser Seite erzeugt.", "Technologien", "Fachrichtung", "Wohnort" (a screen-reader label);
   - the German skill and stack terms (`{ en, de }` pairs in `src/data/skills.ts`, `layers.ts`, `experience.ts` and `lab.ts`), for example "Authentifizierung", "Bereitstellungsumgebungen", "Behebung von Auditbefunden", "Inverse Kinematik";
   - page titles, descriptions and social-image texts (`src/i18n/meta.copy.ts`), for example "Mohamed Lakhel — Senior-Softwareentwickler in Deutschland";
   - the legal pages (the German versions are the binding ones).
8. **[CONFIRM] Statements in the legal texts.** Please have the German Impressum and Datenschutzerklärung checked by a lawyer or a reputable generator before launch; they are orientation, not legal advice (brief §11). Also confirm or correct:
   - that GitHub participates in the EU–US Data Privacy Framework, and that <https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement> is its current privacy statement (neither was checked online);
   - that contact emails are stored and processed by Google (Gmail), as the privacy policy says, or which mail provider applies;
   - the supervisory authority, given as the LfDI Baden-Württemberg because you live in Tuttlingen;
   - the optional Impressum line "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" naming you: keep or drop?
9. **[CONFIRM] Portrait in the PDF CVs.** Your portrait appears on About, on the CV page and in both downloadable PDFs, which get forwarded. Site use is approved (ASSETS.md); may it also go into the PDFs?

## 2. Content to supply (by impact)

10. **[SUPPLY] Recommendations.** Two or three recent ones, ideally a manager, a peer and someone you coached (LinkedIn recommendations work). Only the Khayati quote (from ENISo's director) exists so far; the home section's intro reads "What people who know my work say about it", which stays true as the slots fill. Open slots: `[RECOMMENDATION: manager at Anton-Haering]`, `[RECOMMENDATION: peer engineer]` and `[RECOMMENDATION: developer I coached]` on the home page, `[RECOMMENDATION: manager or peer at Anton-Haering]` on the HAPP case study.
11. **[CONFIRM] Availability and work mode.** Your last role ended 12.2025. Both fields exist in `src/data/profile.ts` but stay off the quick-facts card and the CV until you confirm them (for example "Available now" and "On-site or hybrid in Baden-Württemberg, remote within the EU"). Related: the home contact line reads "If you are hiring for a senior engineering role, email is the most direct way to reach me." It signals openness to roles while availability is unconfirmed; is the tone right?
12. **[CONFIRM] Did HAPP move from Xamarin to .NET MAUI?** Your Lebenslauf names both for 2024–2025 and Microsoft ended Xamarin support in May 2024. If you led that migration, it is a strong third chapter.
13. **[CONFIRM] Decisions and trade-offs in the case studies.** Each architecture section explains its decisions as engineering reasoning from your facts and claims no evaluated alternatives. Please confirm the wording, for example: Keycloak with OIDC means one more critical service in exchange for standard, auditable flows; MVVM and Clean Architecture cost more layers up front in exchange for testable behaviour; a local in-process Gemma model is bounded by the hardware in exchange for working offline; Blazor Hybrid adds a JavaScript/.NET boundary in exchange for mature web 3D libraries; Firebase depends on a hosted service in exchange for having no server to run.
14. **[SUPPLY] Humanoid-robot material and facts.**
    - Three clear photos (front, side, back) for the Phase 4 model (ASSETS.md).
    - Your team size on the project: `[CONFIRM: team size]` on the case study.
    - The role label "Graduation project at Dot it" (or a role title) and the metrics "6 modules, 5 public demo videos, 12 months".
    - The diagram's split: one robot controller on a Raspberry Pi running Python receives every module's commands; camera and microphone sit on the robot; Kinect, VR headset, motion-control interface and the C#/WPF app sit on the operator side. Did the VR head control run over the internet?
    - That the five robot videos on YouTube, linked from `/lab/` and the case study, are still public and may be linked, and that "The featured video of the robot, as shown on my earlier portfolio" describes the main demo correctly.
    - Text for `[DETAIL: what I would do differently today]`.
15. **[SUPPLY] Evidence for the "Hard problems" sections** (anonymised, once cleared). HAPP: `[ASSET: anonymised before-and-after view of the migration, once cleared]`, `[CODE: anonymised excerpt of the token validation in the API]`, `[ASSET: anonymised code-review checklist]`. HoloBox: `[CODE: off-axis projection excerpt]`, `[ASSET: short demo clip of a spoken exchange]`.
16. **[CONFIRM] Two highlights from the older English CV.** "Refactored the codebase to MVVM and Clean Architecture" and "Established a code-review governance framework" are not in the Lebenslauf. They appear among the senior role's eight highlights (Experience, CV and PDFs), in the HAPP case study and in About's "How I work" (source conflicts below). Keep both?
17. **[CONFIRM] CV choices.**
    - Education reads "Field of study: Applied computer science" / "Fachrichtung: Angewandte Informatik" under "Engineering Diploma in Computer Science, National School of Engineering of Sousse (ENISo)". Is that right?
    - Berufserfahrung includes the graduation project (Dot it) and the internship (Envast). Keep it that way, or list them separately as "Projekte und Praktika" on the German CV?
    - The Experience page offers both PDFs (the English CV and the German Lebenslauf) in both languages. Is that what you want?
18. **[CONFIRM] Wording written for this build.** Please approve:
    - the subpage headlines: "Building software and hardware since 2018", "Software that connects people and machines", "Prototypes, experiments and an archive", "How this site is built";
    - About's "How I work": four principles, each a framing sentence ("I treat a security audit as a work list, not a formality") followed by a fact from the senior HAPP role;
    - About's thread: HAPP 2021–2025, GoMyCode 2020–2021, the robot as 2019 (the project ran 02.2019–01.2020), the whiteboard 2018;
    - the home work intro, which describes HoloBox as "on-device AI with a local language model" (the brief's wording) and says each case study "opens with the result";
    - the colophon credit "Geist Sans and Geist Mono by Vercel and basement.studio, released under the SIL Open Font License 1.1."
19. **[CONFIRM] "5+ years".** Shown in the home page's quick facts ("5+ years" / "5+ Jahre"), as stated in your brief. Professional roles run from 09.2020 to 12.2025.
20. **[CONFIRM] Lab plans shown in public.** `/lab/` describes the planned spatial view (opt-in: the camera starts only after a click, the video never leaves the device, mouse or tilt parallax is the fallback) and lists three planned experiments: the spatial view, small WebGPU experiments and a C# module compiled to WebAssembly. Is it fine to announce them?
21. **[SUPPLY] GitHub repos worth showing**, if any, and whether the colophon should link this site's source repository.
22. **[CONFIRM] Student archive on `/lab/`.** A short list (project-management app, baby-care device, OmniWheel robot, Smart Thief, IShried). Keep or drop? If it stays, may the project-management app's YouTube video be linked?

## 3. Decisions for later phases

23. **Domain.** A personal domain (for example `firstname-lastname.dev`) and the Cloudflare account (DECISIONS D-001). Until then the CV's website line reads "medlkhl.github.io/medlkhl2.github.io"; it follows `site.config.ts`.
24. **Positioning line and hero kicker.** Keep the default positioning line or pick an alternative (D-007). The hero kicker reads "00 — Portfolio": keep it, or use the concept line "Systems, shipped" (it would need a natural German equivalent)?
25. **Launch date**, plus two or three sites you like and any you dislike (brief §15).
26. **Analytics.** The colophon says "No cookies, no analytics", and so does the privacy policy. Confirm "no analytics" for now; a cookieless tool in Phase 6 (brief §6) would change both.
27. **Portrait in the structured data.** The Person JSON-LD has no image, because the portrait's astro:assets URLs change with every content hash. A stable public file (for example in `public/`) would allow one. Do you want it?

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
| MVVM / Clean Architecture refactor | not stated                                                     | stated                                                                        | shown, sourced to the English CV (Q16)                                   |
| Code-review governance framework   | "Code-Reviews und Coaching"                                    | "code review governance framework"                                            | both shown, each with its source (Q16)                                   |
| Education                          | Ingenieurdiplom – Informatik, Nationale Ingenieurschule Sousse | National School of Engineering of Sousse, Faculty of Applied Computer Science | Engineering Diploma in Computer Science, ENISo, applied computer science |
| Birth date, phone, street address  | on CV                                                          | on old site                                                                   | never published                                                          |
