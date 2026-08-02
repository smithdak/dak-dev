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
      className={`grid gap-4 border-b border-text/20 pb-5 md:grid-cols-[4rem_minmax(0,1fr)_auto] ${className}`}
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className={`font-display text-3xl ${TEXT_COLORS[chapter.number]} leading-none`}>
          {chapter.number}
        </span>
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">{chapter.name}</h2>
      </div>
      <p className="text-sm text-muted max-w-2xl leading-relaxed md:col-start-2">
        {chapter.description}
      </p>
      {patternCount > 0 && (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted md:col-start-3 md:row-start-1">
          {patternCount} pattern{patternCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
