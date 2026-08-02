import Link from 'next/link';
import type { Pattern } from '@/lib/patterns';

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

interface PatternNavigationProps {
  previous: Pattern | null;
  next: Pattern | null;
}

export function PatternNavigation({ previous, next }: PatternNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav className="grid border-y border-text/20 sm:grid-cols-2" aria-label="Pattern navigation">
      {previous ? (
        <PatternLink
          pattern={previous}
          direction="Previous"
          className="sm:border-r sm:border-text/20"
        />
      ) : (
        <span aria-hidden="true" className="hidden sm:block sm:border-r sm:border-text/20" />
      )}
      {next ? <PatternLink pattern={next} direction="Next" className="text-right" /> : null}
    </nav>
  );
}

function PatternLink({
  pattern,
  direction,
  className = '',
}: {
  pattern: Pattern;
  direction: 'Previous' | 'Next';
  className?: string;
}) {
  return (
    <Link
      href={`/learn/patterns/${pattern.frontmatter.slug}`}
      className={`group min-h-28 px-1 py-6 transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {direction}
      </span>
      <span className="mt-2 block font-display text-xl leading-tight group-hover:underline group-hover:underline-offset-4">
        <span className={`mr-2 text-sm ${CHAPTER_TEXT_COLORS[pattern.frontmatter.chapter]}`}>
          {pattern.frontmatter.number}
        </span>
        {pattern.frontmatter.name}
      </span>
    </Link>
  );
}
