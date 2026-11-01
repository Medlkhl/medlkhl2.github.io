# 3D engine (Phase 3+, skeleton only)

The persistent canvas that survives page navigation (brief §6). Nothing here ships in Phase 1: no three.js, GSAP or Lenis yet. Each folder holds the README of one module from the brief's architecture diagram.

| Module            | Folder             | Responsibility                                                                                                                                  | Phase |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Renderer          | `renderer/`        | `three/webgpu` WebGPURenderer with automatic WebGL 2 fallback; mounts into `#stage`; context-loss recovery; disposal when 3D is switched off    | 3     |
| Quality manager   | `quality/`         | Starting tier from GPU detection, frame-time monitor, DPR clamp, pause when hidden; honours `prefs` (3D off, reduced motion, Save-Data)         | 3     |
| Scene loader      | `scene-loader/`    | Loads GLB (meshopt, KTX2); maps Blender names `layer_<id>`, `lbl_<id>`, `cam_<route>` using `src/data/layers.ts`                                | 3–4   |
| Camera director   | `camera-director/` | On ClientRouter navigation, reads `body[data-scene-shot]` and flies to the named shot with the `camera` motion token (cuts with reduced motion) | 3     |
| Exploded-view rig | `exploded-rig/`    | Scroll scrubs layer separation on the home page (GSAP ScrollTrigger timeline)                                                                   | 3     |
| Interaction       | `interaction/`     | Raycast picks on layers, mirrored by the real HTML buttons of the classic-mode layer list; reads `body[data-active-layer]`                      | 3     |
| Label layer       | `labels/`          | Projects 3D anchors to HTML labels each frame: real, selectable, keyboard-focusable text                                                        | 3     |
| Spatial view      | `spatial-view/`    | Lab only: MediaPipe Face Landmarker in a worker drives an off-axis camera; starts only after a click, video never leaves the device             | 5     |

## Contracts already in place (Phase 1)

- Mount point: `<div id="stage" aria-hidden="true" transition:persist="stage">` in `src/layouts/BaseLayout.astro`.
- Scene hook per page: `document.body.dataset.sceneShot` (`cam_home`, `cam_work_happ`, … or `none`) and `document.body.dataset.activeLayer` (`layer_identity`, … or `none`).
- Preferences: `src/lib/prefs.ts` (`getEffective()`, `onPrefsChange()`, `data-3d` on `<html>`). The 3D toggle stays hidden until Phase 3.
- Layers: `src/data/layers.ts` (ids, labels in EN/DE, linked skills and case studies, mesh and anchor names).
- Motion: `src/styles/tokens.ts` → `motion.camera` (1.2–1.6 s, custom ease), `motion.page`, …
- Lifecycle: listen to `astro:page-load` / `astro:after-swap` / `astro:before-swap`; never assume a full page load.
