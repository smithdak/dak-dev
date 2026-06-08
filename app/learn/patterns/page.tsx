import type { Metadata } from 'next';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { PageTransition } from '@/components/ui/PageTransition';
import { ChapterHeader } from '@/components/patterns/ChapterHeader';
import { PatternCard } from '@/components/patterns/PatternCard';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { DifficultyLegend } from '@/components/patterns/DifficultyLegend';
import { ProblemIndex } from '@/components/patterns/ProblemIndex';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePatternCollectionSchema } from '@/lib/schema';
import Link from 'next/link';

import { SITE_URL as siteUrl } from '@/lib/site';

export function generateMetadata(): Metadata {
  const allPatterns = getAllPatterns();
  const description = `A searchable reference of ${allPatterns.length} named patterns across ${CHAPTERS.length} chapters for working effectively with AI coding agents.`;
  const ogImage = `${siteUrl}/api/og?type=pattern&title=${encodeURIComponent('Agent Patterns')}`;

  return {
    title: 'Agent Patterns',
    description,
    keywords: [
      'AI coding patterns',
      'agent patterns',
      'Claude Code',
      'AI engineering',
      'coding agents',
    ],
    openGraph: {
      title: 'Agent Patterns — AI Coding Agent Reference',
      description,
      url: `${siteUrl}/learn/patterns`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Agent Patterns catalog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agent Patterns — AI Coding Agent Reference',
      description,
      images: [ogImage],
    },
    alternates: { canonical: '/learn/patterns' },
  };
}

export default function PatternsPage() {
  const allPatterns = getAllPatterns();
  const collectionSchema = generatePatternCollectionSchema(
    allPatterns.length,
    CHAPTERS.length
  );

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={collectionSchema} />

      <LearnSectionHero
        section="Patterns"
        color="green"
        eyebrow={`Reference · ${allPatterns.length} Patterns · ${CHAPTERS.length} Chapters`}
        title="Agent Patterns"
        description="Repeatable techniques for engineering with AI coding agents. A structured reference — not tips, not tricks, not a beginner's guide."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        {/* Quick-jump links — relocated from the hero so the section banner stays consistent across Learn sections */}
        <nav aria-label="Jump to section" className="flex flex-wrap gap-4 mb-12">
          <Link
            href="#chapters"
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-text/30 bg-transparent text-muted font-bold text-sm uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface hover:shadow-[4px_4px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            <span className="text-accent/60 font-mono" aria-hidden="true">
              01
            </span>
            Chapters
          </Link>
          <Link
            href="#problems"
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-text/30 bg-transparent text-muted font-bold text-sm uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface hover:shadow-[4px_4px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            <span className="text-accent/60 font-mono" aria-hidden="true">
              02
            </span>
            Problems
          </Link>
          <Link
            href="/learn/patterns/graph"
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-text/30 bg-transparent text-muted font-bold text-sm uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface hover:shadow-[4px_4px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            <span className="text-accent/60 font-mono" aria-hidden="true">
              03
            </span>
            Language Map
          </Link>
          <Link
            href="/learn/patterns/cards"
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-text/30 bg-transparent text-muted font-bold text-sm uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface hover:shadow-[4px_4px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            <span className="text-accent/60 font-mono" aria-hidden="true">
              04
            </span>
            Cards
          </Link>
        </nav>

        {/* Difficulty Legend */}
        <DifficultyLegend className="mb-12" />

        {/* Chapters */}
        <div id="chapters" className="space-y-12 scroll-mt-20">
          {CHAPTERS.map((chapter) => {
            const chapterPatterns = allPatterns.filter(
              (p) => p.frontmatter.chapter === chapter.number
            );

            return (
              <section key={chapter.number}>
                <Link
                  href={`/learn/patterns/chapter/${chapter.slug}`}
                  className="group block mb-5"
                >
                  <ChapterHeader
                    chapter={chapter}
                    patternCount={chapterPatterns.length}
                    className="group-hover:[&_h2]:underline group-hover:[&_h2]:decoration-2 group-hover:[&_h2]:underline-offset-4"
                  />
                </Link>

                {chapterPatterns.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {chapterPatterns.map((pattern) => (
                      <PatternCard
                        key={pattern.frontmatter.slug}
                        pattern={pattern}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-muted/30 p-6 text-center">
                    <p className="text-xs font-mono text-muted uppercase tracking-wider">Patterns coming soon</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Problem Index */}
        <ProblemIndex
          className="mt-16"
          publishedSlugs={new Set(allPatterns.map((p) => p.frontmatter.slug))}
        />
      </div>
    </PageTransition>
  );
}
