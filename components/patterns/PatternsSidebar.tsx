'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { ChapterMeta } from '@/lib/patterns';

const BORDER_COLORS: Record<number, string> = {
  1: 'border-chapter-1',
  2: 'border-chapter-2',
  3: 'border-chapter-3',
  4: 'border-chapter-4',
  5: 'border-chapter-5',
  6: 'border-chapter-6',
};

const TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

const BG_COLORS: Record<number, string> = {
  1: 'bg-chapter-1/10',
  2: 'bg-chapter-2/10',
  3: 'bg-chapter-3/10',
  4: 'bg-chapter-4/10',
  5: 'bg-chapter-5/10',
  6: 'bg-chapter-6/10',
};

interface SidebarPattern {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  difficulty: string;
}

interface PatternsSidebarProps {
  chapters: ChapterMeta[];
  patterns: SidebarPattern[];
}

function NavButton({
  href,
  isActive,
  label,
  icon,
}: {
  href: string;
  isActive: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-3.5 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background ${
        isActive
          ? 'bg-accent text-background border-2 border-accent shadow-[2px_2px_0_0_var(--color-text)]'
          : 'border-2 border-text/30 text-muted hover:border-text hover:text-text hover:bg-surface/50 hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_0_var(--color-text)]'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export function PatternsSidebar({ chapters, patterns }: PatternsSidebarProps) {
  const pathname = usePathname();

  const isChapterPage = pathname.startsWith('/learn/patterns/chapter/');
  const activeChapterSlug = isChapterPage
    ? pathname.split('/learn/patterns/chapter/')[1]?.split('/')[0]
    : null;
  const activePatternSlug =
    !isChapterPage && pathname.startsWith('/learn/patterns/')
      ? pathname.split('/learn/patterns/')[1]?.split('/')[0]
      : null;
  const activePattern = patterns.find((p) => p.slug === activePatternSlug);
  const activeChapterNum = activePattern?.chapter ?? null;
  const activeChapterFromPage = activeChapterSlug
    ? (chapters.find((c) => c.slug === activeChapterSlug)?.number ?? null)
    : null;

  const [expanded, setExpanded] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (activeChapterNum) initial.add(activeChapterNum);
    if (activeChapterFromPage) initial.add(activeChapterFromPage);
    return initial;
  });

  useEffect(() => {
    if (activeChapterNum) {
      setExpanded((prev) => new Set(prev).add(activeChapterNum));
    }
    if (activeChapterFromPage) {
      setExpanded((prev) => new Set(prev).add(activeChapterFromPage));
    }
  }, [activeChapterNum, activeChapterFromPage]);

  const toggleChapter = (num: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const isOnPatternsIndex = pathname === '/learn/patterns';
  const isOnGraphPage = pathname === '/learn/patterns/graph';
  const isOnCardsPage = pathname === '/learn/patterns/cards';

  return (
    <nav
      className="sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] patterns-sidebar-scroll"
      aria-label="Patterns navigation"
    >
      {/* Top navigation buttons */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        <NavButton
          href="/learn/patterns"
          isActive={isOnPatternsIndex}
          label="All Patterns"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          }
        />
        <NavButton
          href="/learn/patterns/graph"
          isActive={isOnGraphPage}
          label="Language Map"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
          }
        />
        <NavButton
          href="/learn/patterns/cards"
          isActive={isOnCardsPage}
          label="Quick-Ref Cards"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />
      </div>

      {/* Divider */}
      <div className="border-t-2 border-text/20 mb-5" />

      {/* Chapter blocks */}
      <div className="space-y-1.5">
        {chapters.map((chapter) => {
          const chapterPatterns = patterns.filter((p) => p.chapter === chapter.number);
          const isExpanded = expanded.has(chapter.number);
          const isActiveChapter =
            activeChapterNum === chapter.number || activeChapterFromPage === chapter.number;
          const hasPatterns = chapterPatterns.length > 0;

          return (
            <div key={chapter.number}>
              {/* Chapter header */}
              <div
                className={`flex items-center border-l transition-colors ${
                  isActiveChapter
                    ? `${BORDER_COLORS[chapter.number]} ${BG_COLORS[chapter.number]}`
                    : 'border-transparent hover:border-text/20'
                }`}
              >
                <Link
                  href={`/learn/patterns/chapter/${chapter.slug}`}
                  className={`flex-1 flex items-center gap-2.5 pl-3 pr-1 py-3 min-w-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors ${
                    isActiveChapter ? 'text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  <span
                    className={`font-mono font-bold text-lg leading-none ${TEXT_COLORS[chapter.number]}`}
                  >
                    {chapter.number}
                  </span>
                  <span className="text-sm font-semibold truncate">{chapter.name}</span>
                </Link>

                {hasPatterns && (
                  <button
                    onClick={(e) => toggleChapter(chapter.number, e)}
                    className="flex min-h-11 min-w-11 items-center justify-center gap-1 mr-1 px-1.5 py-1 text-muted hover:text-text transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-expanded={isExpanded}
                    aria-controls={`chapter-${chapter.number}-patterns`}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${chapter.name} patterns`}
                  >
                    <span className="text-[11px] font-mono tabular-nums">
                      {chapterPatterns.length}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Pattern list */}
              {isExpanded && hasPatterns && (
                <ul id={`chapter-${chapter.number}-patterns`} className="pb-1">
                  {chapterPatterns.map((pattern) => {
                    const isActive = activePatternSlug === pattern.slug;

                    return (
                      <li key={pattern.slug}>
                        <Link
                          href={`/learn/patterns/${pattern.slug}`}
                          className={`group flex min-h-11 items-center gap-2.5 pl-8 pr-3 py-2 text-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent ${
                            isActive
                              ? `font-bold text-text border-l ${BORDER_COLORS[pattern.chapter]} ${BG_COLORS[pattern.chapter]} -ml-px`
                              : 'text-muted border-l border-text/10 hover:text-text hover:border-l-2 hover:border-text/30 hover:bg-surface/20'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span
                            className={`font-mono text-xs tabular-nums shrink-0 ${TEXT_COLORS[pattern.chapter]}`}
                          >
                            {pattern.number}
                          </span>
                          <span className="truncate">{pattern.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer accent */}
      <div className="mt-5 pt-3 border-t border-text/10">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
          {patterns.length} patterns &middot; {chapters.length} chapters
        </p>
      </div>
    </nav>
  );
}
