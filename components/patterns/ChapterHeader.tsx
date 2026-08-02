import type { ChapterMeta } from '@/lib/patterns';

const TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

interface ChapterHeaderProps {
  chapter: ChapterMeta;
  patternCount: number;
  className?: string;
}

export function ChapterHeader({ chapter, patternCount, className = '' }: ChapterHeaderProps) {
  return (
    <div
      className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-text/20 pb-5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-6 ${className}`}
    >
      <span className={`font-display text-3xl leading-none ${TEXT_COLORS[chapter.number]}`}>
        {chapter.number}
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">{chapter.name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chapter.description}</p>
      </div>
      {patternCount > 0 && (
        <p className="col-start-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:col-start-3 sm:row-start-1 sm:text-right">
          {patternCount} pattern{patternCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
