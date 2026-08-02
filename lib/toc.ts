import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { createHeadingSlugger, getHeadingText } from './heading-ids';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract table of contents from MDX content
 * Parses h2 and h3 headings through the Markdown AST. The same text extraction
 * and slugger used by the rehype renderer keeps inline markup and duplicate
 * headings aligned with their rendered anchor IDs.
 */
export function extractTableOfContents(content: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(content) as unknown;
  const slugger = createHeadingSlugger();
  const toc: TocItem[] = [];

  function visit(node: unknown): void {
    if (!node || typeof node !== 'object') return;
    const candidate = node as { type?: string; depth?: number; children?: unknown[] };

    if (candidate.type === 'heading' && candidate.depth) {
      const text = getHeadingText(candidate).trim();
      const id = slugger.slug(text);
      if (candidate.depth === 2 || candidate.depth === 3) {
        toc.push({ id, text, level: candidate.depth });
      }
    }

    if (Array.isArray(candidate.children)) candidate.children.forEach(visit);
  }

  visit(tree);

  return toc;
}
