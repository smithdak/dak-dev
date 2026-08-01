import Link from 'next/link';
import type { PatternRelationship } from '@/lib/patterns';

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

interface RelatedPatternLinkProps {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  relationship: PatternRelationship;
}

export function RelatedPatternLink({
  slug,
  name,
  number,
  chapter,
  relationship,
}: RelatedPatternLinkProps) {
  return (
    <Link
      href={`/learn/patterns/${slug}`}
      className="group block min-h-11 py-2 border-l border-text/10 pl-3 hover:border-l-2 hover:border-text/30 transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <div className="flex items-center gap-2">
        <span className={`font-mono text-xs font-bold ${CHAPTER_TEXT_COLORS[chapter]}`}>
          {number}
        </span>
        <span className="text-[13px] font-semibold text-muted group-hover:text-text transition-colors">
          {name}
        </span>
      </div>
      {relationship.note && (
        <p className="text-[11px] text-muted group-hover:text-text mt-0.5 line-clamp-2 transition-colors">
          {relationship.note}
        </p>
      )}
    </Link>
  );
}
