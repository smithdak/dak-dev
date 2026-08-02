import { TableOfContents } from '@/components/blog/TableOfContents';
import type { TocItem } from '@/lib/toc';

interface StickyTableOfContentsProps {
  items: TocItem[];
}

/** Keeps the desktop article index visible below the persistent site header. */
export function StickyTableOfContents({ items }: StickyTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <aside className="hidden max-h-[calc(100dvh-var(--layout-header-height)-2.5rem)] overflow-y-auto overscroll-contain pr-2 lg:sticky lg:top-[calc(var(--layout-header-height)+1.25rem)] lg:block lg:self-start">
      <TableOfContents items={items} />
    </aside>
  );
}
