import Link from 'next/link';
import type { Pattern } from '@/lib/patterns';
import { DifficultyBadge } from './DifficultyBadge';

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

interface PatternCardProps {
  pattern: Pattern;
  className?: string;
}

export function PatternCard({ pattern, className = '' }: PatternCardProps) {
  const { frontmatter, readingTime } = pattern;

  return (
    <Link
      href={`/learn/patterns/${frontmatter.slug}`}
      className={`group grid gap-3 border-t border-text/20 py-5 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-start md:gap-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`font-display text-2xl ${CHAPTER_TEXT_COLORS[frontmatter.chapter]} tabular-nums`}
        >
          {frontmatter.number}
        </span>
      </div>
      <div>
        <h3 className="font-display text-2xl leading-tight tracking-tight text-text group-hover:underline group-hover:underline-offset-4 md:text-3xl">
          {frontmatter.name}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{frontmatter.intent}</p>
      </div>
      <div className="flex items-center gap-3 md:flex-col md:items-end">
        <DifficultyBadge difficulty={frontmatter.difficulty} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          {readingTime}
        </span>
      </div>
    </Link>
  );
}
