import Link from 'next/link';
import type { PatternFrontmatter } from '@/lib/patterns';
import { DifficultyBadge } from './DifficultyBadge';

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

interface QuickReferenceCardProps {
  frontmatter: PatternFrontmatter;
  signals: string[];
  readingTime?: string;
  variant: 'hero' | 'standalone';
  className?: string;
}

export function QuickReferenceCard({
  frontmatter,
  signals,
  readingTime,
  variant,
  className = '',
}: QuickReferenceCardProps) {
  const isHero = variant === 'hero';

  const content = (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`font-display text-2xl ${CHAPTER_TEXT_COLORS[frontmatter.chapter]}`}>
          {frontmatter.number}
        </span>
        <DifficultyBadge difficulty={frontmatter.difficulty} />
        {readingTime ? (
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {readingTime}
          </span>
        ) : null}
      </div>

      {isHero ? (
        <h1 className="font-display text-4xl leading-tight tracking-[-0.03em] md:text-6xl">
          {frontmatter.name}
        </h1>
      ) : (
        <h3 className="font-display text-2xl leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
          {frontmatter.name}
        </h3>
      )}

      <p
        className={`max-w-3xl leading-relaxed text-muted ${isHero ? 'mt-5 text-lg' : 'mt-2 text-sm'}`}
      >
        {frontmatter.intent}
      </p>

      {signals.length > 0 ? (
        <div className={isHero ? 'mt-7' : 'mt-5'}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Signals
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
            {signals.map((signal) => (
              <li key={signal} className="pl-1">
                {signal}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {frontmatter.keywords && frontmatter.keywords.length > 0 ? (
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          {frontmatter.keywords.slice(0, isHero ? 5 : 4).join(' · ')}
        </p>
      ) : null}
    </>
  );

  if (variant === 'standalone') {
    return (
      <Link
        href={`/learn/patterns/${frontmatter.slug}`}
        className={`group block border-t border-text/20 py-6 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`border-y border-text/20 py-8 ${className}`}>{content}</div>;
}
