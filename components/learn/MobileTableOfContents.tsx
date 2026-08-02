import type { TocItem } from '@/lib/toc';
import { TableOfContents } from '@/components/blog/TableOfContents';

interface MobileTableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function MobileTableOfContents({ items, className = '' }: MobileTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <details className={`not-prose mb-9 border-y border-rule lg:hidden ${className}`}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-3 text-sm font-semibold text-text marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
        <span>On this page</span>
        <span className="text-xs uppercase tracking-[0.1em] text-muted">
          {items.length} sections
        </span>
      </summary>
      <TableOfContents
        items={items}
        showTitle={false}
        observeActive={false}
        className="border-t border-rule py-5"
      />
    </details>
  );
}
