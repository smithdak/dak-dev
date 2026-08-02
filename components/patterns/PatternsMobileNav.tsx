'use client';

import { useState } from 'react';
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

interface SidebarPattern {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  difficulty: string;
}

interface PatternsMobileNavProps {
  chapters: ChapterMeta[];
  patterns: SidebarPattern[];
  className?: string;
}

export function PatternsMobileNav({
  chapters,
  patterns,
  className = '',
}: PatternsMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const activeSlug = pathname.startsWith('/learn/patterns/')
    ? pathname.split('/learn/patterns/')[1]?.split('/')[0]
    : null;
  const activePattern = patterns.find((p) => p.slug === activeSlug);
  const activeChapter = activePattern
    ? chapters.find((c) => c.number === activePattern.chapter)
    : null;

  return (
    <div className={`lg:hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-4 border-text bg-surface font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        aria-expanded={isOpen}
        aria-controls="patterns-mobile-menu"
      >
        <span>
          {activePattern ? (
            <>
              <span className={TEXT_COLORS[activePattern.chapter]}>
                {activePattern.number}
              </span>{' '}
              {activePattern.name}
            </>
          ) : activeChapter ? (
            <>Ch. {activeChapter.number}: {activeChapter.name}</>
          ) : (
            'Navigate Patterns'
          )}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <nav
          id="patterns-mobile-menu"
          className="border-4 border-t-0 border-text bg-surface max-h-[60vh] overflow-y-auto"
          aria-label="Pattern navigation"
        >
          <Link
            href="/learn/patterns"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b border-muted/20 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
          >
            All Patterns
          </Link>
          <Link
            href="/learn/patterns/graph"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b border-muted/20 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
          >
            Language Map
          </Link>
          <Link
            href="/learn/patterns/cards"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 border-muted/20 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
          >
            Cards
          </Link>

          {chapters.map((chapter) => {
            const chapterPatterns = patterns.filter(
              (p) => p.chapter === chapter.number
            );

            return (
              <div key={chapter.number} className="border-b border-muted/20 last:border-b-0">
                <Link
                  href={`/learn/patterns/chapter/${chapter.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-l ${BORDER_COLORS[chapter.number]} hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent`}
                >
                  <span className={`font-mono font-bold text-xs ${TEXT_COLORS[chapter.number]}`}>
                    {chapter.number}
                  </span>
                  <span className="text-sm font-semibold">{chapter.name}</span>
                </Link>

                {chapterPatterns.length > 0 && (
                  <ul>
                    {chapterPatterns.map((pattern) => {
                      const isActive = activeSlug === pattern.slug;
                      return (
                        <li key={pattern.slug}>
                          <Link
                            href={`/learn/patterns/${pattern.slug}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 px-4 pl-10 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent ${
                              isActive
                                ? 'font-semibold text-text bg-background'
                                : 'text-muted hover:text-text hover:bg-background'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <span className={`font-mono text-xs ${TEXT_COLORS[pattern.chapter]}`}>
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
        </nav>
      )}
    </div>
  );
}
