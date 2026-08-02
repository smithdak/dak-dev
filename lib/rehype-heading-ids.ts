import { createHeadingSlugger, getHeadingText } from './heading-ids';

interface HastElement {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
}

/** Assign stable, GitHub-style deduplicated IDs to every rendered heading. */
export default function rehypeHeadingIds() {
  return (tree: unknown) => {
    const slugger = createHeadingSlugger();

    function visit(node: unknown): void {
      if (!node || typeof node !== 'object') return;
      const element = node as HastElement;

      if (element.type === 'element' && /^h[1-6]$/.test(element.tagName ?? '')) {
        element.properties ??= {};
        element.properties.id = slugger.slug(getHeadingText(element));
      }

      if (Array.isArray(element.children)) {
        element.children.forEach(visit);
      }
    }

    visit(tree);
  };
}
