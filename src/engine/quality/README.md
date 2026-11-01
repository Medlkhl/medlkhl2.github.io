# Quality manager

Phase 3+ module (README stub; no code yet).

Chooses the starting tier from GPU detection, watches frame time, clamps the device pixel ratio and pauses rendering when the tab is hidden. Starts with 3D off for reduced motion, missing WebGL 2, a low GPU tier, Save-Data, or when the visitor turned 3D off (src/lib/prefs.ts).

See `src/engine/README.md` for the contracts already in place.
