/** A step as the case-study frontmatter defines it; only the id matters to a diagram. */
export interface DiagramStep {
  id: string;
}

/**
 * Numbers a diagram's steps in frontmatter order and checks that the diagram
 * draws exactly the steps its case study lists, so the numbered markers in the
 * SVG can never disagree with the HTML step list. A mismatch fails the build.
 */
export function stepNumbers(
  diagram: string,
  steps: readonly DiagramStep[],
  drawn: readonly string[],
): (id: string) => number {
  const ids = steps.map((step) => step.id);
  const notDrawn = ids.filter((id) => !drawn.includes(id));
  const notListed = drawn.filter((id) => !ids.includes(id));
  if (notDrawn.length || notListed.length) {
    throw new Error(
      `Diagram "${diagram}" does not match its case study: ` +
        `listed but not drawn [${notDrawn.join(', ')}], drawn but not listed [${notListed.join(', ')}]`,
    );
  }
  return (id) => {
    const index = ids.indexOf(id);
    if (index === -1) throw new Error(`Diagram "${diagram}" has no step "${id}"`);
    return index + 1;
  };
}

/** The id of the arrowhead marker defined by a diagram's frame. */
export function arrowId(diagram: string): string {
  return `${diagram}-arrow`;
}

/** `marker-end` value that points an edge at the diagram's arrowhead. */
export function arrow(diagram: string): string {
  return `url(#${arrowId(diagram)})`;
}
