interface TextNode {
  type?: string;
  value?: unknown;
  alt?: unknown;
  children?: unknown;
}

/** Extract the visible text represented by a Markdown or HTML syntax node. */
export function getHeadingText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';

  const candidate = node as TextNode;
  if (typeof candidate.value === 'string') return candidate.value;
  if (candidate.type === 'image' && typeof candidate.alt === 'string') return candidate.alt;
  if (!Array.isArray(candidate.children)) return '';

  return candidate.children.map(getHeadingText).join('');
}

export function createHeadingSlugger() {
  const occurrences = new Map<string, number>();

  return {
    slug(text: string): string {
      const base =
        text
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-') || 'section';
      const count = (occurrences.get(base) ?? 0) + 1;
      occurrences.set(base, count);
      return count === 1 ? base : `${base}-${count}`;
    },
  };
}
