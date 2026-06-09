import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS } from '@/lib/toolkit-types';
import { HARNESS_CHAPTERS } from '@/lib/harness-types';
import { SECURITY_CHAPTERS } from '@/lib/security-types';
import Link from 'next/link';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';

interface ShowcasePillar {
  key: string;
  title: string;
  href: string;
  description: string;
  /** Data-driven stat line — never hardcode a count here. */
  stat: string;
  cta: string;
  /** Static literals so Tailwind v4's class extraction keeps them (mirrors LearnHero). */
  topBorder: string;
  iconColor: string;
  /** Single-path 24x24 stroke icon — identical to the /learn pillar, for cohesion. */
  icon: string;
}

/**
 * Homepage showcase for the Learn platform — the four pillars at parity.
 *
 * Server component; ScrollReveal is the client leaf. Counts are derived from
 * the lib constants at build time (no hardcoded numbers). The pillar-card
 * anatomy, canonical colors (chapter-1/2/4/6), and icons are intentionally
 * identical to components/learn/LearnHero.tsx so the homepage and /learn read
 * as one design language.
 */
export function LearnShowcase() {
  const patternCount = getAllPatterns().length;
  const chapterCount = CHAPTERS.length;
  const toolkitTopicCount = TOOLKIT_TOPICS.length;
  const harnessChapterCount = HARNESS_CHAPTERS.length;
  const securityChapterCount = SECURITY_CHAPTERS.length;

  if (
    patternCount === 0 &&
    toolkitTopicCount === 0 &&
    harnessChapterCount === 0 &&
    securityChapterCount === 0
  ) {
    return null;
  }

  const pillars: ShowcasePillar[] = [
    {
      key: 'patterns',
      title: 'Patterns',
      href: '/learn/patterns',
      description:
        'Named, portable techniques for AI-assisted engineering — a structured reference of repeatable moves.',
      stat: `${patternCount} patterns · ${chapterCount} chapters`,
      cta: 'Browse patterns',
      topBorder: 'border-t-chapter-1',
      iconColor: 'text-chapter-1',
      icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
    },
    {
      key: 'toolkit',
      title: 'Toolkit',
      href: '/learn/toolkit',
      description:
        "An expert's guide to Claude Code's features — mental models, playbooks, and the pitfalls that bite.",
      stat: `${toolkitTopicCount} deep-dives`,
      cta: 'Explore toolkit',
      topBorder: 'border-t-chapter-2',
      iconColor: 'text-chapter-2',
      icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.121 2.121 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
    },
    {
      key: 'harness',
      title: 'Harness',
      href: '/learn/harness',
      description:
        'The runtime beneath the model — the agent loop, context economics, compaction, and the system prompt.',
      stat: `${harnessChapterCount} chapters · the floor`,
      cta: 'Go deeper',
      topBorder: 'border-t-chapter-4',
      iconColor: 'text-chapter-4',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    },
    {
      key: 'security',
      title: 'Security',
      href: '/learn/security',
      description:
        'The trust surface of building with agents — prompt injection, secrets, permissions, and exfiltration.',
      stat: `${securityChapterCount} chapters · the trust surface`,
      cta: 'Lock it down',
      topBorder: 'border-t-chapter-6',
      iconColor: 'text-chapter-6',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
  ];

  return (
    <section
      aria-labelledby="learn-showcase-heading"
      className="py-16 md:py-24 border-t-4 border-text"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tier 1 — Section header (mirrors the Featured Post header idiom) */}
        <ScrollReveal>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-text pb-6 gap-4">
            <div>
              <h2
                id="learn-showcase-heading"
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                Learn
              </h2>
              <p className="text-lg text-muted">
                Four pillars of agentic engineering — patterns, toolkit,
                harness, and security
              </p>
            </div>
            <Link
              href="/learn"
              className="group inline-flex items-center gap-2 text-text font-semibold hover:underline underline-offset-4 decoration-4 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
            >
              Explore All
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Tier 1.5 — Small on-ramp "Start Here" link (non-pillar front door).
            Compact by design — it sits above the four pillars without competing
            with them; chapter-5 amber signals "begin here" (mirrors /learn). */}
        <ScrollReveal>
          <Link
            href="/learn/start"
            className="group mb-8 inline-flex flex-col items-start gap-1 border-2 border-text border-l-4 border-l-chapter-5 bg-surface/40 px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-chapter-5)] focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-chapter-5">
              New here?
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
              Start Here — agentic engineering in plain English
              <svg
                className="w-4 h-4 text-chapter-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </ScrollReveal>

        {/* Tier 2 — The four pillars, at parity (same anatomy as /learn) */}
        <ScrollReveal stagger>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <ScrollRevealItem key={pillar.key}>
                <Link
                  href={pillar.href}
                  className={`group relative flex h-full flex-col border-4 border-text border-t-8 ${pillar.topBorder} bg-surface/30 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[8px_8px_0_0_var(--color-accent)] focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background`}
                >
                  <svg
                    className={`w-8 h-8 mb-4 ${pillar.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={pillar.icon}
                    />
                  </svg>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-muted leading-relaxed mb-6 flex-1">
                    {pillar.description}
                  </p>
                  <p className="text-sm font-mono text-muted mb-4 tabular-nums">
                    {pillar.stat}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                    {pillar.cta}
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                  </span>
                </Link>
              </ScrollRevealItem>
            ))}
          </div>
        </ScrollReveal>

        {/* Tier 3 — One resolution row (replaces the old three-CTA cluster) */}
        <ScrollReveal>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <Link
              href="/learn"
              className="group inline-flex items-center justify-center font-semibold px-6 py-3 text-base gap-2 bg-transparent text-accent border-4 border-accent hover:bg-accent hover:text-background shadow-[4px_4px_0_0_var(--color-accent)] hover:shadow-[6px_6px_0_0_var(--color-accent)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              Explore the Learn Platform
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/learn/patterns/graph"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                <circle cx="4" cy="6" r="2" strokeWidth={2} />
                <circle cx="20" cy="6" r="2" strokeWidth={2} />
                <circle cx="4" cy="18" r="2" strokeWidth={2} />
                <circle cx="20" cy="18" r="2" strokeWidth={2} />
                <path strokeWidth={1.5} d="M6 7l4 3M18 7l-4 3M6 17l4-3M18 17l-4-3" />
              </svg>
              View Language Map
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
