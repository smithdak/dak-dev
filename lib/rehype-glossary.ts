import { GLOSSARY_TERMS } from './onramp-types';

// A deliberately minimal hast shape so this plugin pulls in no new dependency
// (the repo's supply chain is locked down — DESIGN.md §10 / .npmrc).
interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

// Never wrap text inside these: code, links, headings, SVGs, existing
// toggletips. Wrapping here would either mangle markup or nest interactives.
const SKIP_TAGS = new Set([
  'a',
  'code',
  'pre',
  'script',
  'style',
  'svg',
  'button',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'glossaryterm',
]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Longest term first so a multi-word term (e.g. "Tool use") wins over any
// shorter overlap. Word-boundary, case-insensitive; non-global so the regex is
// reusable across nodes (lastIndex stays 0).
const MATCHERS = [...GLOSSARY_TERMS]
  .map((t) => t.term)
  .sort((a, b) => b.length - a.length)
  .map((term) => ({ term, re: new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i') }));

function makeNode(term: string, matched: string): HastNode {
  return {
    type: 'element',
    tagName: 'glossaryterm',
    properties: { term },
    children: [{ type: 'text', value: matched }],
  };
}

/**
 * rehype-glossary — wraps the FIRST textual occurrence of each on-ramp glossary
 * term in a <glossaryterm> element, rendered site-wide as an accessible
 * toggletip (components/learn/GlossaryTerm) that links into the Decoder.
 *
 * "Define on first use": each term is wrapped at most once per document. It
 * skips code, links, headings, and existing toggletips, so it never mangles
 * markup or nests interactives. Pure transform on the hast tree.
 */
export default function rehypeGlossary() {
  return (tree: HastNode) => {
    const used = new Set<string>(); // canonical terms already wrapped in this document

    const wrapText = (value: string): HastNode[] | null => {
      const out: HastNode[] = [];
      let cursor = 0;
      for (;;) {
        let next: { index: number; length: number; term: string; matched: string } | null = null;
        for (const { term, re } of MATCHERS) {
          if (used.has(term)) continue;
          const m = re.exec(value.slice(cursor));
          if (m) {
            const absolute = cursor + m.index;
            if (next === null || absolute < next.index) {
              next = { index: absolute, length: m[0].length, term, matched: m[0] };
            }
          }
        }
        if (!next) break;
        if (next.index > cursor) out.push({ type: 'text', value: value.slice(cursor, next.index) });
        out.push(makeNode(next.term, next.matched));
        used.add(next.term);
        cursor = next.index + next.length;
      }
      if (cursor === 0) return null; // nothing matched — leave the node untouched
      if (cursor < value.length) out.push({ type: 'text', value: value.slice(cursor) });
      return out;
    };

    const walk = (node: HastNode, skip: boolean) => {
      const children = node.children;
      if (!children) return;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type === 'element') {
          walk(child, skip || (child.tagName ? SKIP_TAGS.has(child.tagName) : false));
        } else if (child.type === 'text' && !skip && typeof child.value === 'string') {
          const replaced = wrapText(child.value);
          if (replaced) {
            children.splice(i, 1, ...replaced);
            i += replaced.length - 1;
          }
        }
      }
    };

    walk(tree, false);
  };
}
