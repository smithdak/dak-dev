'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { staggerContainerVariants, slideUpVariants, drawLineVariants } from '@/lib/animations';
import { TextDecode } from '@/components/ui/TextDecode';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';

interface LearnHeroProps {
  patternCount: number;
  chapterCount: number;
  toolkitTopicCount: number;
  harnessChapterCount: number;
  securityChapterCount: number;
}

interface Pillar {
  key: string;
  title: string;
  href: string;
  description: string;
  stat: string;
  cta: string;
  /** Static literal so Tailwind's class extraction keeps it. */
  topBorder: string;
  iconColor: string;
  /** Single-path 24x24 stroke icon, matches the site's SVG convention. */
  icon: string;
}

export function LearnHero({
  patternCount,
  chapterCount,
  toolkitTopicCount,
  harnessChapterCount,
  securityChapterCount,
}: LearnHeroProps) {
  const totalGuides =
    patternCount + toolkitTopicCount + harnessChapterCount + securityChapterCount;

  const pillars: Pillar[] = [
    {
      key: 'patterns',
      title: 'Patterns',
      href: '/learn/patterns',
      description:
        'Named, portable patterns for AI-assisted engineering. A structured reference of repeatable techniques.',
      stat: `${patternCount} patterns · ${chapterCount} chapters`,
      cta: 'Browse patterns',
      topBorder: 'border-t-chapter-1',
      iconColor: 'text-chapter-1',
      icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
    },
    {
      key: 'toolkit',
      title: 'Claude Code Toolkit',
      href: '/learn/toolkit',
      description:
        "Expert's guide to the Claude Code features. Mental models, production architectures, and real-world pitfalls.",
      stat: `${toolkitTopicCount} deep-dives`,
      cta: 'Explore toolkit',
      topBorder: 'border-t-chapter-2',
      iconColor: 'text-chapter-2',
      icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.121 2.121 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
    },
    {
      key: 'harness',
      title: 'Harness Engineering',
      href: '/learn/harness',
      description:
        'The runtime layer beneath the model — the agent loop, context economics, compaction, and the system prompt.',
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
        'AI privacy and security for builders — prompt injection, PII in the context window, secrets, permissions, and exfiltration.',
      stat: `${securityChapterCount} chapters · the trust surface`,
      cta: 'Lock it down',
      topBorder: 'border-t-chapter-6',
      iconColor: 'text-chapter-6',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
  ];

  return (
    <>
      <header className="relative border-b-4 border-text overflow-hidden">
        {/* Corner marks + coordinate labels — decorative, mirror the section */}
        <div
          className="absolute z-[2] top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent/40"
          aria-hidden="true"
        />
        <span className="hero-coord z-[2] top-4 left-14" aria-hidden="true">
          LEARN
        </span>
        <div
          className="absolute z-[2] top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent/40"
          aria-hidden="true"
        />
        <span className="hero-coord z-[2] top-4 right-16" aria-hidden="true">
          4 PILLARS
        </span>
        <div
          className="absolute z-[2] bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent/40"
          aria-hidden="true"
        />
        <span className="hero-coord z-[2] bottom-4 left-14" aria-hidden="true">
          {totalGuides} GUIDES
        </span>
        <div
          className="absolute z-[2] bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-accent/40"
          aria-hidden="true"
        />
        <span className="hero-coord z-[2] bottom-4 right-16" aria-hidden="true">
          AGENTIC
        </span>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
            <motion.div
              variants={slideUpVariants}
              className="mb-6 inline-block border-4 border-accent bg-surface px-6 py-2"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-accent">
                Learn &middot; Expert Guides
              </p>
            </motion.div>

            <motion.h1
              variants={slideUpVariants}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              <TextDecode text="Agentic Engineering" delay={400} />
            </motion.h1>

            <motion.div
              className="h-1 bg-accent mb-8 origin-left"
              style={{ maxWidth: '200px' }}
              aria-hidden="true"
              variants={drawLineVariants}
            />

            <motion.p
              variants={slideUpVariants}
              className="mb-10 max-w-3xl text-muted text-lg leading-relaxed"
            >
              Four pillars, one stack. <span className="text-text font-semibold">Patterns</span> are
              the portable techniques. The{' '}
              <span className="text-text font-semibold">Toolkit</span> is the Claude Code features.{' '}
              <span className="text-text font-semibold">Harness Engineering</span> is the runtime
              floor the other two stand on.{' '}
              <span className="text-text font-semibold">Security</span> is the trust surface that
              cuts across all three.
            </motion.p>

            {/* Stats bar — clones the proven LearnShowcase idiom (tabular-nums) */}
            <motion.div variants={slideUpVariants} className="flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-accent tabular-nums">
                  {patternCount}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-muted">
                  Patterns
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-text tabular-nums">
                  {toolkitTopicCount}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-muted">
                  Toolkit Topics
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-text tabular-nums">
                  {harnessChapterCount}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-muted">
                  Harness Chapters
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-text tabular-nums">
                  {securityChapterCount}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-muted">
                  Security Chapters
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <section
        aria-labelledby="learn-pillars-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      >
        <h2 id="learn-pillars-heading" className="sr-only">
          The four pillars
        </h2>
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
                  <p className="text-muted leading-relaxed mb-6 flex-1">{pillar.description}</p>
                  <p className="text-sm font-mono text-muted mb-4 tabular-nums">{pillar.stat}</p>
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
      </section>
    </>
  );
}
