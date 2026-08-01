import type { PatternFrontmatter } from '@/lib/patterns';
import { DifficultyBadge } from './DifficultyBadge';
import Link from 'next/link';

const CHAPTER_BORDER_COLORS: Record<number, string> = {
  1: 'border-l-chapter-1',
  2: 'border-l-chapter-2',
  3: 'border-l-chapter-3',
  4: 'border-l-chapter-4',
  5: 'border-l-chapter-5',
  6: 'border-l-chapter-6',
};

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
  const isStandalone = variant === 'standalone';

  const Wrapper = isStandalone ? Link : 'div';
  const wrapperProps = isStandalone ? { href: `/learn/patterns/${frontmatter.slug}` } : {};
  const TitleTag = isHero ? 'h1' : 'h3';

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={`relative block border-l-4 ${CHAPTER_BORDER_COLORS[frontmatter.chapter]} overflow-hidden ${
        isStandalone
          ? 'border-2 border-text/60 bg-surface/60 p-5 transition-all duration-150 hover:border-text hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background group'
          : ''
      } ${isHero ? 'border-2 border-text/40 bg-surface/20 p-6 md:p-8' : ''} ${className}`}
    >
      {/* Ghost pattern number */}
      <span
        className={`absolute top-2 right-3 font-mono font-bold leading-none pointer-events-none select-none ${CHAPTER_TEXT_COLORS[frontmatter.chapter]} ${
          isHero ? 'text-7xl md:text-8xl opacity-[0.08]' : 'text-5xl opacity-[0.12]'
        }`}
        aria-hidden="true"
      >
        {frontmatter.number}
      </span>

      {/* Header row */}
      <div className={`flex items-center gap-3 relative ${isHero ? 'mb-3' : 'mb-2'}`}>
        {!isHero && (
          <span
            className={`font-mono font-bold text-xs ${CHAPTER_TEXT_COLORS[frontmatter.chapter]} tabular-nums`}
          >
            {frontmatter.number}
          </span>
        )}
        <DifficultyBadge difficulty={frontmatter.difficulty} />
        {readingTime && <span className="text-xs text-muted font-mono">{readingTime}</span>}
      </div>

      {/* Name */}
      <TitleTag
        className={`font-bold tracking-tight relative ${
          isHero
            ? 'text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight'
            : isStandalone
              ? 'text-lg mb-2 group-hover:underline decoration-2 underline-offset-4'
              : 'text-base mb-2'
        }`}
      >
        {frontmatter.name}
      </TitleTag>

      {/* Intent */}
      <p
        className={`text-muted leading-relaxed relative ${
          isHero ? 'text-base md:text-lg mb-5' : 'text-sm mb-3 line-clamp-2'
        }`}
      >
        {frontmatter.intent}
      </p>

      {/* Signals */}
      {signals.length > 0 && (
        <div className="relative">
          <p
            className={`font-mono font-bold uppercase tracking-wider text-muted ${
              isHero ? 'text-[11px] mb-2' : 'text-[10px] mb-1.5'
            }`}
          >
            Signals
          </p>
          <ul className={isHero ? 'space-y-1.5' : 'space-y-1'}>
            {signals.map((signal, i) => (
              <li
                key={i}
                className={`text-muted leading-snug pl-3 relative before:content-['›'] before:absolute before:left-0 before:text-muted before:font-mono ${
                  isHero ? 'text-sm' : 'text-xs'
                }`}
              >
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {frontmatter.keywords && frontmatter.keywords.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 relative ${isHero ? 'mt-5' : 'mt-3'}`}>
          {frontmatter.keywords.slice(0, isHero ? 5 : 4).map((kw) => (
            <span
              key={kw}
              className={`font-mono text-muted border border-text/20 px-1.5 py-0.5 ${
                isHero ? 'text-[11px]' : 'text-[10px]'
              }`}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
