import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionCard } from '@/components/learn/SectionCard';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { ToolkitLensLegend } from '@/components/learn/ToolkitLensLegend';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import {
  TOOLKIT_TOPICS,
  getToolkitPage,
  getToolkitTopicPages,
  getAllToolkitPages,
  SUB_PAGE_META,
} from '@/lib/toolkit';

import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Claude Code Toolkit',
  description:
    "Expert's guide to agentic engineering with Claude Code — 9 deep-dives into hooks, skills, agents, MCP, and more.",
  openGraph: {
    title: "Claude Code Toolkit — Expert's Guide",
    description:
      '9 deep-dives into Claude Code features for expert agentic engineering.',
    url: `${siteUrl}/learn/toolkit`,
  },
  alternates: { canonical: '/learn/toolkit' },
};

// Every topic is a Claude Code feature that implements a portable pattern.
// Mirrors the Patterns ↔ Toolkit pairs on the Learn connections map so the
// four pillars stay one system (condition: integrate, don't graft).
const CONNECTS = [
  { label: 'Convention File', href: '/learn/patterns/convention-file', kind: 'Pattern' },
  { label: 'Safety Net', href: '/learn/patterns/safety-net', kind: 'Pattern' },
  { label: 'Memory Layer', href: '/learn/patterns/memory-layer', kind: 'Pattern' },
  { label: 'Parallel Fan-Out', href: '/learn/patterns/parallel-fan-out', kind: 'Pattern' },
  { label: 'Progressive Disclosure', href: '/learn/patterns/progressive-disclosure', kind: 'Pattern' },
  { label: 'Agent-Friendly Architecture', href: '/learn/patterns/agent-friendly-architecture', kind: 'Pattern' },
];

export default function ToolkitIndexPage() {
  const topics = TOOLKIT_TOPICS.map((topic) => ({
    ...topic,
    hasContent: getToolkitPage(topic.slug) !== null,
    chips: getToolkitTopicPages(topic.slug)
      .map((p) => p.frontmatter.subPage)
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => SUB_PAGE_META[s].label),
  }));

  const totalPages = getAllToolkitPages().length;

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnSectionHero
        section="Toolkit"
        color="cyan"
        eyebrow={`Reference · ${TOOLKIT_TOPICS.length} Deep-Dives`}
        title="Claude Code Toolkit"
        description="Expert's guide to agentic engineering. Not documentation — mental models, production architectures, and the pitfalls the docs don't warn about."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        {/* Quick-jump — same idiom as the Patterns section, kept consistent */}
        <nav
          aria-label="Jump to section"
          className="flex flex-wrap gap-4 mb-12"
        >
          {[
            { num: '01', label: 'Topics', href: '#topics' },
            { num: '02', label: 'How to Read', href: '#how-to-read' },
            { num: '03', label: 'Connections', href: '#connects' },
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

        <ToolkitLensLegend className="mb-16" />

        <section
          id="topics"
          aria-labelledby="topics-heading"
          className="scroll-mt-20"
        >
          <div className="border-l-8 border-l-chapter-2 border-b-2 border-text/30 pl-5 pb-4 mb-8">
            <h2
              id="topics-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              The Nine Topics
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Each is a self-contained deep-dive. Independent — start anywhere.
            </p>
          </div>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <ScrollRevealItem key={topic.slug} className="h-full">
                  <SectionCard
                    href={`/learn/toolkit/${topic.slug}`}
                    number={String(topic.order).padStart(2, '0')}
                    name={topic.name}
                    description={topic.description}
                    icon={topic.icon}
                    color="cyan"
                    available={topic.hasContent}
                    cta="Explore"
                    chips={topic.chips}
                  />
                </ScrollRevealItem>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <SectionConnects
          id="connects"
          color="cyan"
          heading="Where This Connects"
          intro="Every topic here is a Claude Code feature — and each one implements a portable pattern. This is where the toolkit grounds out in technique."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
