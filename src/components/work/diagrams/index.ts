import type { WorkFrontmatter } from '../../../schemas/work.ts';
import Happ from './happ.astro';
import Holobox from './holobox.astro';
import HumanoidRobot from './humanoid-robot.astro';

/** Diagram component per `architecture.diagram` key of the case-study frontmatter. */
export const DIAGRAMS: Record<WorkFrontmatter['architecture']['diagram'], typeof Happ> = {
  happ: Happ,
  holobox: Holobox,
  'humanoid-robot': HumanoidRobot,
};
