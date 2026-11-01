import type { RouteKey } from '../i18n/routes.ts';

/**
 * Scene hooks for the Phase 3 camera director (brief §5, "3D camera shot").
 * Every page exposes them on <body data-scene-shot data-active-layer>; nothing
 * reads them in Phase 1. 'none' means the page has no 3D view.
 */
export const NO_SCENE = 'none';

export const SCENE_SHOTS: Record<RouteKey, string> = {
  home: 'cam_home',
  work: 'cam_work',
  experience: 'cam_experience',
  lab: 'cam_lab',
  about: 'cam_about',
  cv: NO_SCENE,
  colophon: 'cam_colophon',
  impressum: NO_SCENE,
  datenschutz: NO_SCENE,
};
