import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionCard } from '@/components/learn/SectionCard';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { HARNESS_CHAPTERS, HARNESS_BOUNDARY, getHarnessChapter } from '@/lib/harness';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dak-dev.vercel.app';

export const metadata: Metadata = {
  title: 'Harness Engineering',
  description:
    'The runtime layer beneath the model — the agent loop, context window economics, compaction, tool-result curation, and system-prompt architecture.',
  keywords: [
    'harness engineering',
    'context engineering',
    'agent loop',
    'agent runtime',
    'context window management',
  ],
  openGraph: {
    title: 'Harness Engineering — The Runtime Beneath the Model',
    description:
      'Six deep-dives into the agent runtime layer: the loop, context economics, compaction, tool-result curation, and the system prompt.',
    url: `${siteUrl}/learn/harness`,
  },
  alternates: { canonical: '/learn/harness' },
};

// Cross-links that integrate Harness into the existing pillars (condition: integrate, don't graft).
const CONNECTS = [
  { label: 'Context Priming', href: '/learn/patterns/context-priming', kind: 'Pattern' },
  { label: 'Memory Layer', href: '/learn/patterns/memory-layer', kind: 'Pattern' },
  { label: 'Checkpoint Loop', href: '/learn/patterns/checkpoint-loop', kind: 'Pattern' },
  { label: 'Memory System', href: '/learn/toolkit/memory', kind: 'Toolkit' },
  { label: 'Agents & Subagents', href: '/learn/toolkit/agents', kind: 'Toolkit' },
  { label: 'CLAUDE.md', href: '/learn/toolkit/claude-md', kind: 'Toolkit' },
];

export default function HarnessIndexPage() {
  const chapters = HARNESS_CHAPTERS.map((chapter) => ({
    ...chapter,
    hasContent: getHarnessChapter(chapter.slug) !== null,
  }));

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnSectionHero
        section="Harness"
        color="purple"
        eyebrow={`Runtime · ${HARNESS_CHAPTERS.length} Chapters`}
        title="Harness Engineering"
        description={HARNESS_BOUNDARY}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <nav
          aria-label="Jump to section"
          className="flex flex-wrap gap-4 mb-12"
        >
          {[
            { num: '01', label: 'Chapters', href: '#chapters' },
            { num: '02', label: 'Connections', href: '#connects' },
          ].map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className="inline-flex items-center gap-3 px-6 py-3 border-2 border-text/30 bg-transparent text-muted font-bold text-sm uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface hover:shadow-[4px_4px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              <span className="text-accent/60 font-mono" aria-hidden="true">
                {j.num}
              </span>
              {j.label}
            </Link>
          ))}
        </nav>

        <section
          id="chapters"
          aria-labelledby="chapters-heading"
          className="scroll-mt-20"
        >
          <div className="border-l-8 border-l-chapter-4 border-b-2 border-text/30 pl-5 pb-4 mb-8">
            <h2
              id="chapters-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              The Six Chapters
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Read top to bottom — this is the floor, and each chapter assumes
              the one before it.
            </p>
          </div>

          {/* Sequenced spine — the numbers ride the rail, conveying order */}
          <div className="relative border-l-2 border-chapter-4/25 pl-4 sm:pl-6">
            <ScrollReveal stagger>
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <ScrollRevealItem key={chapter.slug}>
                    <SectionCard
                      href={`/learn/harness/${chapter.slug}`}
                      number={chapter.number}
                      name={chapter.name}
                      description={chapter.description}
                      icon={chapter.icon}
                      color="purple"
                      available={chapter.hasContent}
                      cta="Read"
                    />
                  </ScrollRevealItem>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <SectionConnects
          id="connects"
          color="purple"
          heading="Where This Connects"
          intro="Harness Engineering is the floor under the other two pillars. These patterns and toolkit deep-dives are the same ideas at the layer above."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
