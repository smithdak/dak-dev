'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { ChapterMeta } from '@/lib/patterns';
import type { ToolkitTopicMeta } from '@/lib/toolkit-types';
import { SUB_PAGE_META, type ToolkitSubPage } from '@/lib/toolkit-types';
import type { HarnessChapterMeta } from '@/lib/harness-types';
import type { SecurityChapterMeta } from '@/lib/security-types';

const CHAPTER_BORDER_COLORS: Record<number, string> = {
  1: 'border-chapter-1', 2: 'border-chapter-2', 3: 'border-chapter-3',
  4: 'border-chapter-4', 5: 'border-chapter-5', 6: 'border-chapter-6',
};
const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1', 2: 'text-chapter-2', 3: 'text-chapter-3',
  4: 'text-chapter-4', 5: 'text-chapter-5', 6: 'text-chapter-6',
};
const CHAPTER_BG_COLORS: Record<number, string> = {
  1: 'bg-chapter-1/10', 2: 'bg-chapter-2/10', 3: 'bg-chapter-3/10',
  4: 'bg-chapter-4/10', 5: 'bg-chapter-5/10', 6: 'bg-chapter-6/10',
};

interface SidebarPattern {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  difficulty: string;
}

interface LearnSidebarProps {
  chapters: ChapterMeta[];
  patterns: SidebarPattern[];
  toolkitTopics: ToolkitTopicMeta[];
  topicSubPages: Record<string, ToolkitSubPage[]>;
  harnessChapters: HarnessChapterMeta[];
  securityChapters: SecurityChapterMeta[];
}

export function LearnSidebar({
  chapters,
  patterns,
  toolkitTopics,
  topicSubPages,
  harnessChapters,
  securityChapters,
}: LearnSidebarProps) {
  const pathname = usePathname();
  const isInPatterns = pathname.startsWith('/learn/patterns');
  const isInToolkit = pathname.startsWith('/learn/toolkit');
  const isInHarness = pathname.startsWith('/learn/harness');
  const isInSecurity = pathname.startsWith('/learn/security');

  const [patternsOpen, setPatternsOpen] = useState(false);
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const [harnessOpen, setHarnessOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  const activeHarnessSlug = isInHarness
    ? pathname.replace('/learn/harness/', '').split('/')[0] || null
    : null;

  const activeSecuritySlug = isInSecurity
    ? pathname.replace('/learn/security/', '').split('/')[0] || null
    : null;

  const activePatternSlug = isInPatterns && !pathname.startsWith('/learn/patterns/chapter/')
    ? pathname.replace('/learn/patterns/', '').split('/')[0]
    : null;
  const activePattern = patterns.find((p) => p.slug === activePatternSlug);

  const activeChapterSlug = pathname.startsWith('/learn/patterns/chapter/')
    ? pathname.replace('/learn/patterns/chapter/', '').split('/')[0]
    : null;
  const activeChapterFromSlug = activeChapterSlug
    ? chapters.find((c) => c.slug === activeChapterSlug)
    : null;

  const activeChapterNum = activePattern?.chapter ?? activeChapterFromSlug?.number ?? null;

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(() => {
    const s = new Set<number>();
    if (activeChapterNum) s.add(activeChapterNum);
    return s;
  });

  const activeTopicSlug = isInToolkit
    ? pathname.replace('/learn/toolkit/', '').split('/')[0]
    : null;

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (activeTopicSlug) s.add(activeTopicSlug);
    return s;
  });

  // Sync section open state and topic/chapter expansion on navigation
  useEffect(() => {
    if (isInToolkit) {
      setToolkitOpen(true);
      if (activeTopicSlug) {
        setExpandedTopics(new Set([activeTopicSlug]));
      }
    }
    if (isInPatterns) {
      setPatternsOpen(true);
      if (activeChapterNum) {
        setExpandedChapters(new Set([activeChapterNum]));
      }
    }
    if (isInHarness) {
      setHarnessOpen(true);
    }
    if (isInSecurity) {
      setSecurityOpen(true);
    }
  }, [pathname, isInToolkit, isInPatterns, isInHarness, isInSecurity, activeTopicSlug, activeChapterNum]);

  const toggleChapter = (num: number) => {
    setExpandedChapters((prev) => {
      if (prev.has(num)) return new Set<number>();
      return new Set<number>([num]);
    });
  };

  const toggleTopic = (slug: string) => {
    setExpandedTopics((prev) => {
      if (prev.has(slug)) return new Set<string>();
      return new Set<string>([slug]);
    });
  };

  return (
    <nav
      className="sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] patterns-sidebar-scroll"
      aria-label="Learn navigation"
    >
      {/* PATTERNS SECTION */}
      <SectionHeader
        title="Patterns"
        isOpen={patternsOpen}
        onToggle={() => setPatternsOpen(!patternsOpen)}
        count={patterns.length}
        isActive={isInPatterns}
      />

      {patternsOpen && (
        <div className="mb-4">
          <div className="flex gap-1.5 mb-3 px-1">
            <SidebarPill href="/learn/patterns" isActive={pathname === '/learn/patterns'}>All</SidebarPill>
            <SidebarPill href="/learn/patterns/graph" isActive={pathname === '/learn/patterns/graph'}>Map</SidebarPill>
            <SidebarPill href="/learn/patterns/cards" isActive={pathname === '/learn/patterns/cards'}>Cards</SidebarPill>
          </div>

          <div className="space-y-0.5">
            {chapters.map((chapter) => {
              const chapterPatterns = patterns.filter((p) => p.chapter === chapter.number);
              const isExpanded = expandedChapters.has(chapter.number);
              const isActiveChapter = activeChapterNum === chapter.number;

              return (
                <div key={chapter.number}>
                  <div
                    className={`flex items-center border-l-4 transition-colors ${
                      isActiveChapter
                        ? `${CHAPTER_BORDER_COLORS[chapter.number]} ${CHAPTER_BG_COLORS[chapter.number]}`
                        : 'border-transparent hover:border-text/20'
                    }`}
                  >
                    <Link
                      href={`/learn/patterns/chapter/${chapter.slug}`}
                      className={`flex-1 flex items-center gap-2 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                        isActiveChapter ? 'text-text font-semibold' : 'text-muted hover:text-text'
                      }`}
                    >
                      <span className={`font-mono font-bold text-sm leading-none ${CHAPTER_TEXT_COLORS[chapter.number]} ${isActiveChapter ? 'opacity-100' : 'opacity-50'}`}>
                        {chapter.number}
                      </span>
                      <span className="truncate">{chapter.name}</span>
                    </Link>
                    {chapterPatterns.length > 0 && (
                      <button
                        onClick={() => toggleChapter(chapter.number)}
                        className="mr-2 px-1 py-1 text-muted hover:text-text"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${chapter.name}`}
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                  </div>

                  {isExpanded && chapterPatterns.length > 0 && (
                    <ul className="pb-0.5">
                      {chapterPatterns.map((pattern) => {
                        const isActive = activePatternSlug === pattern.slug;
                        return (
                          <li key={pattern.slug}>
                            <Link
                              href={`/learn/patterns/${pattern.slug}`}
                              className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm transition-all ${
                                isActive
                                  ? `font-bold text-text border-l-4 ${CHAPTER_BORDER_COLORS[pattern.chapter]} ${CHAPTER_BG_COLORS[pattern.chapter]} -ml-px`
                                  : 'text-muted/70 border-l border-text/10 hover:text-text hover:border-l-2 hover:border-text/30'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className={`font-mono text-xs ${CHAPTER_TEXT_COLORS[pattern.chapter]} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
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
        </div>
      )}

      {/* DIVIDER */}
      <div className="border-t-2 border-text/20 my-4" />

      {/* TOOLKIT SECTION */}
      <SectionHeader
        title="Toolkit"
        isOpen={toolkitOpen}
        onToggle={() => setToolkitOpen(!toolkitOpen)}
        count={toolkitTopics.length}
        isActive={isInToolkit}
      />

      {toolkitOpen && (
        <div className="mb-4">
          <div className="space-y-0.5">
            {toolkitTopics.map((topic) => {
              const isActiveTopic = activeTopicSlug === topic.slug;
              const isExpanded = expandedTopics.has(topic.slug);
              const subPages = topicSubPages[topic.slug] || [];

              return (
                <div key={topic.slug}>
                  <div
                    className={`flex items-center border-l-4 transition-colors ${
                      isActiveTopic
                        ? 'border-accent bg-accent/10'
                        : 'border-transparent hover:border-text/20'
                    }`}
                  >
                    <Link
                      href={`/learn/toolkit/${topic.slug}`}
                      className={`flex-1 flex items-center gap-2.5 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                        isActiveTopic ? 'text-text font-semibold' : 'text-muted hover:text-text'
                      }`}
                    >
                      <svg className={`w-4 h-4 shrink-0 ${isActiveTopic ? 'text-accent' : 'text-muted/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic.icon} />
                      </svg>
                      <span className="truncate">{topic.name}</span>
                    </Link>
                    {subPages.length > 0 && (
                      <button
                        onClick={() => toggleTopic(topic.slug)}
                        className="mr-2 px-1 py-1 text-muted hover:text-text"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${topic.name}`}
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                  </div>

                  {isExpanded && subPages.length > 0 && (
                    <ul className="pb-0.5">
                      {subPages.map((sub) => {
                        const subMeta = SUB_PAGE_META[sub];
                        const subHref = `/learn/toolkit/${topic.slug}/${sub}`;
                        const isActive = pathname === subHref;
                        return (
                          <li key={sub}>
                            <Link
                              href={subHref}
                              className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm transition-all ${
                                isActive
                                  ? 'font-bold text-text border-l-4 border-accent bg-accent/10 -ml-px'
                                  : 'text-muted/70 border-l border-text/10 hover:text-text hover:border-l-2 hover:border-text/30'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className="truncate">{subMeta.label}</span>
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
        </div>
      )}

      {/* DIVIDER */}
      <div className="border-t-2 border-text/20 my-4" />

      {/* HARNESS SECTION */}
      <SectionHeader
        title="Harness"
        isOpen={harnessOpen}
        onToggle={() => setHarnessOpen(!harnessOpen)}
        count={harnessChapters.length}
        isActive={isInHarness}
      />

      {harnessOpen && (
        <div className="mb-4">
          <div className="space-y-0.5">
            <Link
              href="/learn/harness"
              className={`flex items-center border-l-4 pl-3 pr-1 py-2.5 text-sm transition-colors ${
                isInHarness && !activeHarnessSlug
                  ? 'border-accent bg-accent/10 text-text font-semibold'
                  : 'border-transparent text-muted hover:text-text hover:border-text/20'
              }`}
            >
              Overview
            </Link>
            {harnessChapters.map((chapter) => {
              const isActive = activeHarnessSlug === chapter.slug;
              return (
                <Link
                  key={chapter.slug}
                  href={`/learn/harness/${chapter.slug}`}
                  className={`flex items-center gap-2.5 border-l-4 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                    isActive
                      ? 'border-accent bg-accent/10 text-text font-semibold'
                      : 'border-transparent text-muted hover:text-text hover:border-text/20'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`font-mono font-bold text-xs leading-none shrink-0 ${
                      isActive ? 'text-accent' : 'text-muted/50'
                    }`}
                  >
                    {chapter.number}
                  </span>
                  <span className="truncate">{chapter.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* DIVIDER */}
      <div className="border-t-2 border-text/20 my-4" />

      {/* SECURITY SECTION */}
      <SectionHeader
        title="Security"
        isOpen={securityOpen}
        onToggle={() => setSecurityOpen(!securityOpen)}
        count={securityChapters.length}
        isActive={isInSecurity}
      />

      {securityOpen && (
        <div className="mb-4">
          <div className="space-y-0.5">
            <Link
              href="/learn/security"
              className={`flex items-center border-l-4 pl-3 pr-1 py-2.5 text-sm transition-colors ${
                isInSecurity && !activeSecuritySlug
                  ? 'border-accent bg-accent/10 text-text font-semibold'
                  : 'border-transparent text-muted hover:text-text hover:border-text/20'
              }`}
            >
              Overview
            </Link>
            {securityChapters.map((chapter) => {
              const isActive = activeSecuritySlug === chapter.slug;
              return (
                <Link
                  key={chapter.slug}
                  href={`/learn/security/${chapter.slug}`}
                  className={`flex items-center gap-2.5 border-l-4 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                    isActive
                      ? 'border-accent bg-accent/10 text-text font-semibold'
                      : 'border-transparent text-muted hover:text-text hover:border-text/20'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`font-mono font-bold text-xs leading-none shrink-0 ${
                      isActive ? 'text-accent' : 'text-muted/50'
                    }`}
                  >
                    {chapter.number}
                  </span>
                  <span className="truncate">{chapter.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-text/10">
        <p className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">
          {patterns.length} patterns &middot; {toolkitTopics.length} deep-dives &middot;{' '}
          {harnessChapters.length} chapters &middot; {securityChapters.length} security
        </p>
      </div>
    </nav>
  );
}

function SectionHeader({
  title,
  isOpen,
  onToggle,
  count,
  isActive,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
        isActive ? 'text-accent' : 'text-muted hover:text-text'
      }`}
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      <span className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono tabular-nums opacity-60">{count}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}

function SidebarPill({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
        isActive
          ? 'bg-accent text-background border border-accent'
          : 'border border-text/30 text-muted hover:border-text hover:text-text'
      }`}
    >
      {children}
    </Link>
  );
}
