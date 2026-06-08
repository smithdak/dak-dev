import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionCard } from '@/components/learn/SectionCard';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import {
  ONRAMP_BOUNDARY,
  GLOSSARY_TERMS,
  DEMO_WALKTHROUGHS,
  EXPLAINERS,
  getDemo,
  getExplainer,
} from '@/lib/onramp';

import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Start Here',
  description:
    'Agentic engineering in plain English. A no-code on-ramp for people who saw the demo and want to understand the words and the ideas — what an agent is, why a context window runs out, what a harness does.',
  keywords: [
    'agentic engineering explained',
    'AI agents for non-technical',
    'AI glossary plain english',
    'understand AI agents',
    'what is an AI agent',
  ],
  openGraph: {
    title: 'Start Here — Agentic Engineering in Plain English',
    description:
      'A no-code on-ramp that decodes the jargon and the mental models behind agentic engineering, then points you at the deep pillars.',
    url: `${siteUrl}/learn/start`,
  },
  alternates: { canonical: '/learn/start' },
};

// Single-path 24x24 stroke icons (site convention).
const DECODER_ICON =
  'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129';

// The suggested path — a scaffold, not rails (equifinality: people skip ahead).
const PATH = [
  {
    n: '01',
    title: 'Decode the words',
    body: 'The exact terms from the demo — agent, context window, MCP, harness — in plain English, each paired with the precise meaning.',
    href: '/learn/start/decoder',
    cta: 'Open the Decoder',
  },
  {
    n: '02',
    title: 'See it in action',
    body: 'Watch a real agent do a real task, with every move decoded as it happens. The words, but moving.',
    href: `/learn/start/demo/${DEMO_WALKTHROUGHS[0].slug}`,
    cta: 'Watch a demo, decoded',
  },
  {
    n: '03',
    title: 'Understand the ideas',
    body: 'Six short reads, one mental model each — why it forgets, why it makes things up, why the same model differs across tools.',
    href: '#ideas',
    cta: 'See the mental models',
  },
];

// Cross-links INTO the pillars — the on-ramp is a front door, not a silo.
const CONNECTS = [
  { label: 'Harness Engineering', href: '/learn/harness', kind: 'Pillar' },
  { label: 'The Agent Loop', href: '/learn/harness/agent-loop', kind: 'Harness' },
  { label: 'Security: The Real Risks', href: '/learn/security/the-real-risks', kind: 'Security' },
  { label: 'MCP', href: '/learn/toolkit/mcp', kind: 'Toolkit' },
  { label: 'Patterns', href: '/learn/patterns', kind: 'Pillar' },
  { label: 'Claude Code Toolkit', href: '/learn/toolkit', kind: 'Pillar' },
];

export default function StartHerePage() {
  const cards = [
    {
      href: '/learn/start/decoder',
      number: '01',
      name: 'The Decoder',
      description: `${GLOSSARY_TERMS.length} plain-English definitions of the words that fly past in a demo — each one an analogy, the precise term, and a real example.`,
      icon: DECODER_ICON,
      available: true,
      cta: 'Decode the jargon',
    },
    ...DEMO_WALKTHROUGHS.map((d, i) => ({
      href: `/learn/start/demo/${d.slug}`,
      number: String(i + 2).padStart(2, '0'),
      name: d.title,
      description: d.scenario,
      icon: d.icon,
      available: getDemo(d.slug) !== null,
      cta: 'Watch it decoded',
    })),
  ];

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnSectionHero
        section="Start Here"
        color="amber"
        eyebrow="On-ramp · Plain English"
        title="Start Here"
        description={ONRAMP_BOUNDARY}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <section aria-labelledby="who-heading" className="mb-16 max-w-3xl">
          <h2 id="who-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Saw the demo. Want to understand it.
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            If you have watched an agent write code, fix a bug, or wire up a tool and thought{' '}
            <span className="text-text font-semibold">
              &ldquo;I have no idea what half those words mean&rdquo;
            </span>{' '}
            — this is for you. No coding required. The goal is understanding, not building.
          </p>
          <p className="text-muted leading-relaxed">
            You will leave able to follow the conversation: what an agent is doing, why a context
            window runs out, and what someone means by a harness. When a word clicks, a link takes
            you to the deep version.
          </p>
        </section>

        <section aria-labelledby="path-heading" className="mb-16">
          <div className="border-l-8 border-l-chapter-5 border-b-2 border-text/30 pl-5 pb-4 mb-8">
            <h2 id="path-heading" className="text-2xl md:text-3xl font-bold tracking-tight">
              The path
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Three steps, about 20 minutes. Not rails — skip ahead whenever a word already makes
              sense.
            </p>
          </div>

          <ScrollReveal stagger>
            <div className="grid gap-5 md:grid-cols-3">
              {PATH.map((s) => (
                <ScrollRevealItem key={s.n}>
                  <div className="h-full flex flex-col border-2 border-text/60 border-t-4 border-t-chapter-5 bg-surface/40 p-6">
                    <span
                      className="font-mono font-bold text-4xl text-chapter-5 opacity-20 leading-none tabular-nums mb-4"
                      aria-hidden="true"
                    >
                      {s.n}
                    </span>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">{s.title}</h3>
                    <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{s.body}</p>
                    <Link
                      href={s.href}
                      className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-chapter-5 hover:underline decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    >
                      {s.cta}
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </ScrollRevealItem>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section aria-labelledby="ways-heading" className="mb-4">
          <div className="border-l-8 border-l-chapter-5 border-b-2 border-text/30 pl-5 pb-4 mb-8">
            <h2 id="ways-heading" className="text-2xl md:text-3xl font-bold tracking-tight">
              Two ways in
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Decode the words, or watch them in action. Most people bounce between both.
            </p>
          </div>

          <ScrollReveal stagger>
            <div className="grid gap-6 md:grid-cols-2">
              {cards.map((c) => (
                <ScrollRevealItem key={c.href}>
                  <SectionCard
                    href={c.href}
                    number={c.number}
                    name={c.name}
                    description={c.description}
                    icon={c.icon}
                    color="amber"
                    available={c.available}
                    cta={c.cta}
                  />
                </ScrollRevealItem>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section aria-labelledby="ideas-heading" id="ideas" className="scroll-mt-20 mt-16 mb-4">
          <div className="border-l-8 border-l-chapter-5 border-b-2 border-text/30 pl-5 pb-4 mb-8">
            <h2 id="ideas-heading" className="text-2xl md:text-3xl font-bold tracking-tight">
              Understand the ideas
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Six short reads, one mental model each. Analogy first, paired with the precise term —
              so it sticks without dumbing it down.
            </p>
          </div>

          <ScrollReveal stagger>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {EXPLAINERS.map((e) => (
                <ScrollRevealItem key={e.slug}>
                  <SectionCard
                    href={`/learn/start/explain/${e.slug}`}
                    number={String(e.order).padStart(2, '0')}
                    name={e.title}
                    description={e.mentalModel}
                    icon={e.icon}
                    color="amber"
                    available={getExplainer(e.slug) !== null}
                    cta="Read"
                  />
                </ScrollRevealItem>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <SectionConnects
          id="deeper"
          color="amber"
          heading="Ready to go deeper?"
          intro="The on-ramp gets you fluent. These are the expert pillars where each idea gets the full treatment — the same concepts, no training wheels."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
