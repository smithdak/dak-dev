import type { Metadata } from 'next';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS } from '@/lib/toolkit';
import { HARNESS_CHAPTERS } from '@/lib/harness';
import { SECURITY_CHAPTERS } from '@/lib/security';
import { PageTransition } from '@/components/ui/PageTransition';
import Link from 'next/link';
import { LearnHero } from '@/components/learn/LearnHero';
import { ConnectionsMap } from '@/components/learn/ConnectionsMap';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateLearnCollectionSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Expert guides for agentic engineering — patterns for AI-assisted development and deep-dives into Claude Code\'s toolkit.',
  openGraph: {
    title: 'Learn — Patterns & Claude Code Toolkit',
    description: 'Expert guides for agentic engineering with Claude Code.',
    url: `${SITE_URL}/learn`,
  },
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  const allPatterns = getAllPatterns();
  const learnCollectionSchema = generateLearnCollectionSchema();

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={learnCollectionSchema} />

      <LearnHero
        patternCount={allPatterns.length}
        chapterCount={CHAPTERS.length}
        toolkitTopicCount={TOOLKIT_TOPICS.length}
        harnessChapterCount={HARNESS_CHAPTERS.length}
        securityChapterCount={SECURITY_CHAPTERS.length}
      />

      {/* On-ramp entry point — a non-pillar front door for non-technical readers.
          Lives here (not in the four-pillar sidebar) so it stays out of the
          sidebar's active-slug parsing (DESIGN.md §4.1). */}
      <section
        aria-labelledby="onramp-cta-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8"
      >
        <Link
          href="/learn/start"
          className="group block border-4 border-text border-l-8 border-l-chapter-5 bg-surface/40 p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-chapter-5)] focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-chapter-5 mb-2">
                New to all this?
              </p>
              <h2
                id="onramp-cta-heading"
                className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
              >
                Start Here — agentic engineering in plain English
              </h2>
              <p className="text-muted leading-relaxed">
                Saw a demo and want to understand the words? A no-code on-ramp that decodes the
                jargon and the mental models, then points you back at the pillars.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-chapter-5 shrink-0">
              Start here
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </section>

      <ConnectionsMap />
    </PageTransition>
  );
}
