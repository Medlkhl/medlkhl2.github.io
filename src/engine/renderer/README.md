# Renderer

Phase 3+ module (README stub; no code yet).

WebGPURenderer from three/webgpu with automatic WebGL 2 fallback (test with forceWebGL: true). Owns the canvas inside #stage, resizes with the viewport, recovers from a lost GPU context without a reload and disposes geometries, textures and render targets when 3D is switched off.

See `src/engine/README.md` for the contracts already in place.
