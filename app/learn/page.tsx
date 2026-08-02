import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { HARNESS_BOUNDARY, HARNESS_CHAPTERS } from '@/lib/harness-types';
import { CHAPTERS, getAllPatterns } from '@/lib/patterns';
import { generateLearnCollectionSchema } from '@/lib/schema';
import { SECURITY_BOUNDARY, SECURITY_CHAPTERS } from '@/lib/security-types';
import { SITE_URL } from '@/lib/site';
import { TOOLKIT_BOUNDARY, TOOLKIT_LENSES, TOOLKIT_TOPICS } from '@/lib/toolkit-types';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'A field guide to accountable agentic systems: patterns, portable capabilities, runtime and delivery harnesses, and security.',
  openGraph: {
    title: 'Learn — Agentic Engineering Field Guide',
    description:
      'Choose the right entry point across patterns, portable capabilities, harness engineering, and security.',
    url: `${SITE_URL}/learn`,
  },
  alternates: { canonical: '/learn' },
};

interface EntryLink {
  label: string;
  href: string;
}

interface PillarEntry {
  number: string;
  title: string;
  href: string;
  responsibility: string;
  question: string;
  inventory: string;
  description: string;
  boundary: string;
  links: EntryLink[];
}

const PATTERNS_BOUNDARY =
  'Portable techniques for shaping work with coding agents. Not vendor features, runtime machinery, or generic productivity advice.';

const CROSSWALK = [
  {
    question: 'How do I keep a long-running task coherent?',
    steps: [
      { kind: 'Pattern', label: 'Context Priming', href: '/learn/patterns/context-priming' },
      { kind: 'Capability', label: 'Persistent Memory', href: '/learn/toolkit/memory' },
      {
        kind: 'Harness',
        label: 'Compaction & Continuity',
        href: '/learn/harness/compaction-continuity',
      },
      {
        kind: 'Security',
        label: 'Data & PII in Context',
        href: '/learn/security/data-and-pii',
      },
    ],
  },
  {
    question: 'How do I delegate work without surrendering authority?',
    steps: [
      { kind: 'Pattern', label: 'Parallel Fan-Out', href: '/learn/patterns/parallel-fan-out' },
      {
        kind: 'Capability',
        label: 'Multi-Agent Coordination',
        href: '/learn/toolkit/agent-teams',
      },
      {
        kind: 'Harness',
        label: 'Delivery Control',
        href: '/learn/harness/delivery-control-above-agent-loop',
      },
      {
        kind: 'Security',
        label: 'Permission Architecture',
        href: '/learn/security/permission-architecture',
      },
    ],
  },
  {
    question: 'How do I connect tools without widening trust by accident?',
    steps: [
      { kind: 'Pattern', label: 'Scope Fence', href: '/learn/patterns/scope-fence' },
      { kind: 'Capability', label: 'MCP Integration', href: '/learn/toolkit/mcp' },
      {
        kind: 'Harness',
        label: 'Tool Result Curation',
        href: '/learn/harness/tool-result-curation',
      },
      {
        kind: 'Security',
        label: 'Supply Chain & Audit',
        href: '/learn/security/supply-chain-and-audit',
      },
    ],
  },
] as const;

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center border-b border-text text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {children}
    </Link>
  );
}

export default function LearnPage() {
  const patternCount = getAllPatterns().length;
  const toolkitLensCount = TOOLKIT_TOPICS.length * TOOLKIT_LENSES.length;
  const combinedChapterCount = HARNESS_CHAPTERS.length + SECURITY_CHAPTERS.length;
  const corePageCount =
    patternCount + TOOLKIT_TOPICS.length + toolkitLensCount + combinedChapterCount;

  const pillars: PillarEntry[] = [
    {
      number: '01',
      title: 'Patterns',
      href: '/learn/patterns',
      responsibility: 'Structure the work.',
      question: 'What repeatable move solves this class of problem?',
      inventory: `${patternCount} patterns across ${CHAPTERS.length} chapters`,
      description:
        'Use the pattern language when the problem is how to frame, decompose, steer, verify, or recover the work.',
      boundary: PATTERNS_BOUNDARY,
      links: [
        { label: 'Browse the pattern index', href: '/learn/patterns' },
        { label: 'Start from a problem', href: '/learn/patterns#problems' },
        { label: 'Trace the language map', href: '/learn/patterns/graph' },
      ],
    },
    {
      number: '02',
      title: 'Toolkit',
      href: '/learn/toolkit',
      responsibility: 'Choose portable capabilities.',
      question: 'Which durable capability do I need, and how do products implement it?',
      inventory: `${TOOLKIT_TOPICS.length} capabilities with ${toolkitLensCount} implementation lenses`,
      description:
        'Start with the engineering capability, then inspect documented behavior and product-specific implementation details.',
      boundary: TOOLKIT_BOUNDARY,
      links: [
        { label: 'Open the capability index', href: '/learn/toolkit' },
        { label: 'Design project instructions', href: '/learn/toolkit/project-instructions' },
        { label: 'Coordinate multiple agents', href: '/learn/toolkit/agent-teams' },
      ],
    },
    {
      number: '03',
      title: 'Harness',
      href: '/learn/harness',
      responsibility: 'Control execution and delivery.',
      question: 'What machinery keeps the work durable, verifiable, and bounded?',
      inventory: `${HARNESS_CHAPTERS.length} chapters across runtime and delivery control`,
      description:
        'Follow the machinery from the agent loop and context window to evidence, policy, and authorization above the runtime.',
      boundary: HARNESS_BOUNDARY,
      links: [
        { label: 'Read the harness sequence', href: '/learn/harness' },
        { label: 'Understand the agent loop', href: '/learn/harness/agent-loop' },
        {
          label: 'Move above the runtime',
          href: '/learn/harness/delivery-control-above-agent-loop',
        },
      ],
    },
    {
      number: '04',
      title: 'Security',
      href: '/learn/security',
      responsibility: 'Bound trust and authority.',
      question: 'What can leave, act, or be exploited?',
      inventory: `${SECURITY_CHAPTERS.length} chapters across the agent trust surface`,
      description:
        'Trace data, credentials, permissions, tool calls, model output, and supply-chain exposure through the system.',
      boundary: SECURITY_BOUNDARY,
      links: [
        { label: 'Map the trust surface', href: '/learn/security' },
        { label: 'Build the threat model', href: '/learn/security/threat-model' },
        {
          label: 'Design permission boundaries',
          href: '/learn/security/permission-architecture',
        },
      ],
    },
  ];

  return (
    <div className="pb-20">
      <JsonLd data={generateLearnCollectionSchema()} />

      <header className="border-b border-rule">
        <div className="site-stage py-14 sm:py-18 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)] lg:gap-24">
            <div>
              <h1 className="max-w-[12ch] text-balance font-serif text-[clamp(3.25rem,6vw,5.75rem)] font-medium leading-[0.96] tracking-[-0.04em] text-text">
                A field guide for AI systems that can answer for their work.
              </h1>
              <p className="mt-7 max-w-[63ch] text-lg leading-8 text-text/80 sm:text-xl">
                Start with the responsibility you own now. Move across the guide as the system
                crosses from technique to capability, execution, and trust.
              </p>
              <div className="mt-8">
                <TextLink href="#entry-points">Choose an entry point</TextLink>
              </div>
            </div>

            <section aria-labelledby="system-compass-heading" className="self-end">
              <h2 id="system-compass-heading" className="text-lg font-semibold text-text">
                Four responsibilities, one delivery system.
              </h2>
              <ol className="mt-5 border-t border-rule">
                {pillars.map((pillar) => (
                  <li key={pillar.href} className="border-b border-rule">
                    <Link
                      href={pillar.href}
                      className="group grid min-h-20 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 py-4 text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:grid-cols-[2.25rem_minmax(8rem,0.65fr)_minmax(0,1.35fr)]"
                    >
                      <span className="text-xs tabular-nums text-muted" aria-hidden="true">
                        {pillar.number}
                      </span>
                      <span className="font-semibold">{pillar.title}</span>
                      <span className="col-start-2 text-sm leading-6 text-muted group-hover:text-text/75 sm:col-start-auto">
                        {pillar.responsibility}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <p className="mt-14 border-t border-rule pt-5 text-sm leading-6 text-muted">
            <strong className="font-semibold text-text">{corePageCount} core content pages</strong>,
            excluding product projections: {patternCount} patterns; {TOOLKIT_TOPICS.length}{' '}
            capability overviews plus {toolkitLensCount} implementation lenses; and{' '}
            {combinedChapterCount} Harness and Security chapters.
          </p>
        </div>
      </header>

      <section aria-labelledby="start-heading" className="border-b border-rule bg-surface/35">
        <div className="site-stage grid gap-8 py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:py-14">
          <h2
            id="start-heading"
            className="max-w-[18ch] text-balance font-serif text-3xl leading-tight tracking-[-0.025em] sm:text-4xl"
          >
            If the vocabulary is the blocker, begin here.
          </h2>
          <div>
            <p className="max-w-[65ch] text-base leading-7 text-text/80">
              Start is a plain-English on-ramp, not a fifth pillar. It decodes the terms and core
              mental models, then hands you into the deeper guide when you are ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
              <TextLink href="/learn/start">Start with the on-ramp</TextLink>
              <TextLink href="/learn/start/decoder">Open the decoder</TextLink>
            </div>
          </div>
        </div>
      </section>

      <section id="entry-points" aria-labelledby="entry-points-heading" className="scroll-mt-8">
        <div className="site-stage py-16 sm:py-20">
          <div className="grid gap-6 pb-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
            <h2
              id="entry-points-heading"
              className="max-w-[18ch] text-balance font-serif text-4xl leading-[1.04] tracking-[-0.03em] sm:text-5xl"
            >
              Enter through the decision in front of you.
            </h2>
            <p className="max-w-[65ch] text-base leading-7 text-muted">
              The pillars are peers, but they do different jobs. Each row names the question it
              answers, its boundary, and the shortest useful starting paths.
            </p>
          </div>

          <ol className="border-t border-rule">
            {pillars.map((pillar) => (
              <li
                key={pillar.href}
                className="grid gap-7 border-b border-rule py-10 md:grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.3fr)] md:gap-12 lg:py-12"
              >
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs tabular-nums text-muted" aria-hidden="true">
                      {pillar.number}
                    </span>
                    <h3 className="font-serif text-3xl tracking-[-0.025em] sm:text-4xl">
                      <Link
                        href={pillar.href}
                        className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {pillar.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="mt-3 pl-9 text-sm leading-6 text-muted">{pillar.inventory}</p>
                </div>

                <div>
                  <p className="max-w-[58ch] text-balance text-xl font-semibold leading-7 text-text sm:text-2xl sm:leading-8">
                    {pillar.question}
                  </p>
                  <p className="mt-4 max-w-[68ch] text-base leading-7 text-text/80">
                    {pillar.description}
                  </p>
                  <p className="mt-5 max-w-[72ch] border-t border-rule pt-4 text-sm leading-6 text-muted">
                    {pillar.boundary}
                  </p>
                  <nav aria-label={`${pillar.title} starting points`} className="mt-5">
                    <ul className="flex flex-wrap gap-x-7 gap-y-2">
                      {pillar.links.map((link) => (
                        <li key={link.href}>
                          <TextLink href={link.href}>{link.label}</TextLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="crosswalk-heading" className="border-y border-rule bg-surface/35">
        <div className="site-stage py-16 sm:py-20">
          <div className="grid gap-6 pb-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
            <h2
              id="crosswalk-heading"
              className="max-w-[18ch] text-balance font-serif text-4xl leading-[1.04] tracking-[-0.03em] sm:text-5xl"
            >
              A short crosswalk across the system.
            </h2>
            <p className="max-w-[65ch] text-base leading-7 text-muted">
              Real decisions do not stay inside one pillar. These curated paths show where one
              responsibility hands off to the next; they are reading routes, not dependency graphs.
            </p>
          </div>

          <ol className="border-t border-rule">
            {CROSSWALK.map((route) => (
              <li key={route.question} className="border-b border-rule py-8">
                <h3 className="max-w-[52ch] text-lg font-semibold leading-7 text-text">
                  {route.question}
                </h3>
                <ol className="mt-5 grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
                  {route.steps.map((step, index) => (
                    <li
                      key={step.href}
                      className={`py-4 lg:py-5 ${index > 0 ? 'border-t border-rule' : ''} ${
                        index % 2 === 1 ? 'sm:border-l sm:px-5' : 'sm:pr-5'
                      } ${index === 1 ? 'sm:border-t-0' : ''} ${
                        index > 0 ? 'lg:border-l lg:border-t-0 lg:px-5' : ''
                      }`}
                    >
                      <span className="block text-xs font-semibold text-muted">{step.kind}</span>
                      <Link
                        href={step.href}
                        className="mt-1 inline-block text-sm font-semibold leading-6 text-text underline decoration-rule underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {step.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="applied-public-heading" className="border-b border-rule">
        <div className="site-stage grid gap-10 py-14 md:py-18 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-5">
            <h2
              id="applied-public-heading"
              className="max-w-[14ch] text-balance font-serif text-[clamp(2.75rem,4vw,4.5rem)] font-medium leading-[1] tracking-[-0.035em] text-text"
            >
              Applied in public.
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-8 text-muted">
              The field guide names the machinery. These records show one position and one public
              implementation, with the evidence boundary left intact.
            </p>
          </div>

          <div className="border-t border-rule lg:col-span-7 lg:pl-12 xl:pl-20">
            <article className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[minmax(10rem,0.7fr)_minmax(0,1.3fr)] sm:gap-10">
              <h3 className="text-lg font-semibold leading-snug text-text">Position paper</h3>
              <div>
                <Link
                  href="/blog/agent-delivery-harness"
                  className="font-serif text-2xl leading-tight tracking-[-0.02em] text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  The Agent Delivery Harness
                </Link>
                <p className="mt-3 max-w-[58ch] leading-7 text-muted">
                  A seven-invariant conformance profile for accountable delivery above one or more
                  model runtimes.
                </p>
              </div>
            </article>
            <article className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[minmax(10rem,0.7fr)_minmax(0,1.3fr)] sm:gap-10">
              <h3 className="text-lg font-semibold leading-snug text-text">Public system</h3>
              <div>
                <Link
                  href="/work#delivery-harness"
                  className="font-serif text-2xl leading-tight tracking-[-0.02em] text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  delivery-harness
                </Link>
                <p className="mt-3 max-w-[58ch] leading-7 text-muted">
                  Process-tested locally and published for inspection. Live authenticated
                  multi-provider delivery and external acceptance remain unproven.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
