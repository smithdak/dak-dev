import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionCard } from '@/components/learn/SectionCard';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { HARNESS_CHAPTERS, HARNESS_BOUNDARY, getHarnessChapter } from '@/lib/harness';

import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Harness Engineering',
  description:
    'Runtime control beneath the model and delivery control above it: agent loops, context, evidence, policy, and accountable authorization.',
  keywords: [
    'harness engineering',
    'delivery harness',
    'agent delivery architecture',
    'context engineering',
    'agent loop',
    'agent runtime',
    'context window management',
  ],
  openGraph: {
    title: 'Harness Engineering — Runtime and Delivery Control',
    description:
      'Seven deep-dives from the agent runtime loop through evidence-bound delivery control above it.',
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
  {
    label: 'Project Instructions',
    href: '/learn/toolkit/project-instructions',
    kind: 'Toolkit',
  },
  {
    label: 'Permission Architecture',
    href: '/learn/security/permission-architecture',
    kind: 'Security',
  },
  {
    label: 'Supply Chain & Audit',
    href: '/learn/security/supply-chain-and-audit',
    kind: 'Security',
  },
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
        eyebrow={`Runtime + Delivery · ${HARNESS_CHAPTERS.length} Chapters`}
        title="Harness Engineering"
        description={HARNESS_BOUNDARY}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <nav
          aria-label="Jump to section"
          className="mb-14 flex flex-wrap gap-x-6 gap-y-2 border-y border-text/20 py-4"
        >
          {[
            { num: '01', label: 'Chapters', href: '#chapters' },
            { num: '02', label: 'Connections', href: '#connects' },
          ].map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted underline-offset-4 hover:text-text hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <span className="text-accent/60 font-mono" aria-hidden="true">
                {j.num}
              </span>
              {j.label}
            </Link>
          ))}
        </nav>

        <section id="chapters" aria-labelledby="chapters-heading" className="scroll-mt-20">
          <div className="mb-8 grid gap-4 border-b border-text/20 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] md:items-end">
            <h2 id="chapters-heading" className="font-display text-4xl tracking-tight md:text-5xl">
              The {HARNESS_CHAPTERS.length} Chapters
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Read top to bottom. The sequence starts inside one runtime and ends at the delivery
              layer above one or more runtimes.
            </p>
          </div>

          <div>
            <ScrollReveal stagger>
              <div>
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
          intro="Harness Engineering spans runtime execution and delivery control. These patterns, toolkit features, and security controls meet it at different authority boundaries."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
