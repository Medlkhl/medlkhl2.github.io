import { splitPlaceholders } from './placeholders.ts';

/**
 * Rehype plugin: wraps `[KIND: …]` placeholders in Markdown/MDX text in
 * `<span class="ph" data-ph="KIND">` so they render as visible marks.
 * Code blocks are left untouched. Minimal local HAST types keep this free of
 * extra dependencies.
 */
interface HastText {
  type: 'text';
  value: string;
}
interface HastElement {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children: HastNode[];
}
interface HastOther {
  type: string;
  children?: HastNode[];
}
type HastNode = HastText | HastElement | HastOther;

const SKIP = new Set(['code', 'pre', 'script', 'style', 'kbd', 'samp']);

function isText(node: HastNode): node is HastText {
  return node.type === 'text';
}
function isElement(node: HastNode): node is HastElement {
  return node.type === 'element';
}

function transform(node: HastNode): void {
  if (!('children' in node) || !node.children) return;
  if (isElement(node) && SKIP.has(node.tagName)) return;
  const next: HastNode[] = [];
  for (const child of node.children) {
    if (isText(child)) {
      const segments = splitPlaceholders(child.value);
      if (segments.length === 1 && segments[0]?.type === 'text') {
        next.push(child);
        continue;
      }
      for (const segment of segments) {
        if (segment.type === 'text') {
          next.push({ type: 'text', value: segment.value });
        } else {
          next.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['ph'], dataPh: segment.kind },
            children: [{ type: 'text', value: segment.raw }],
          });
        }
      }
    } else {
      transform(child);
      next.push(child);
    }
  }
  node.children = next;
}

export function rehypePlaceholders() {
  return (tree: HastNode) => {
    transform(tree);
  };
}
