import Link from 'next/link';
import { slugifyTag } from '@/lib/tags';
import { formatWritingTag } from '@/lib/writing';

interface TopicIndexProps {
  tagCounts: Record<string, number>;
  className?: string;
}

export function TopicIndex({ tagCounts, className = '' }: TopicIndexProps) {
  const tags = Object.entries(tagCounts).sort(([tagA, countA], [tagB, countB]) => {
    if (countA !== countB) return countB - countA;
    return tagA.localeCompare(tagB);
  });

  if (tags.length === 0) return null;

  return (
    <details className={`border-y border-rule ${className}`}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 text-sm font-semibold text-text marker:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent [&::-webkit-details-marker]:hidden">
        <span>Browse the complete topic index</span>
        <span className="text-xs uppercase tracking-[0.1em] text-muted">{tags.length} topics</span>
      </summary>
      <nav aria-label="All writing topics" className="border-t border-rule py-6">
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tags.map(([tag, count]) => (
            <li key={tag}>
              <Link
                href={`/blog/tags/${slugifyTag(tag)}`}
                className="flex min-h-11 items-center justify-between gap-3 border-b border-rule text-sm text-muted transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <span>{formatWritingTag(tag)}</span>
                <span className="text-xs tabular-nums">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
