import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionCard } from '@/components/learn/SectionCard';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { SECURITY_CHAPTERS, SECURITY_BOUNDARY, getSecurityChapter } from '@/lib/security';

import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'AI security and privacy for people building with agents — prompt injection, PII in the context window, secrets hygiene, permission architecture, exfiltration, and audit.',
  keywords: [
    'AI security',
    'AI data privacy',
    'prompt injection defense',
    'agent permission architecture',
    'LLM PII context window',
    'AI secrets management',
  ],
  openGraph: {
    title: 'Security — AI Privacy & Security for Builders',
    description:
      'Eight chapters on the security and privacy surface of building with AI agents: the real risks, data and PII, threat modeling, prompt injection, secrets, permissions, exfiltration, and supply chain.',
    url: `${siteUrl}/learn/security`,
  },
  alternates: { canonical: '/learn/security' },
};

// Cross-links that integrate Security into the existing pillars (condition: integrate, don't graft).
const CONNECTS = [
  { label: 'Negative Space', href: '/learn/patterns/negative-space', kind: 'Pattern' },
  { label: 'Scope Fence', href: '/learn/patterns/scope-fence', kind: 'Pattern' },
  { label: 'Safety Net', href: '/learn/patterns/safety-net', kind: 'Pattern' },
  { label: 'Hooks', href: '/learn/toolkit/hooks', kind: 'Toolkit' },
  { label: 'Settings & Permissions', href: '/learn/toolkit/settings', kind: 'Toolkit' },
  {
    label: 'System Prompt Architecture',
    href: '/learn/harness/system-prompt-architecture',
    kind: 'Harness',
  },
];

export default function SecurityIndexPage() {
  const chapters = SECURITY_CHAPTERS.map((chapter) => ({
    ...chapter,
    hasContent: getSecurityChapter(chapter.slug) !== null,
  }));

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnSectionHero
        section="Security"
        color="red"
        eyebrow={`Defense · ${SECURITY_CHAPTERS.length} Chapters`}
        title="Security"
        description={SECURITY_BOUNDARY}
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
              The Eight Chapters
            </h2>
            <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
              Front to back: the risks first, then the threat model, then the defenses. It cuts
              across the other three pillars, not beside them.
            </p>
          </div>

          <div>
            <ScrollReveal stagger>
              <div>
                {chapters.map((chapter) => (
                  <ScrollRevealItem key={chapter.slug}>
                    <SectionCard
                      href={`/learn/security/${chapter.slug}`}
                      number={chapter.number}
                      name={chapter.name}
                      description={chapter.description}
                      icon={chapter.icon}
                      color="red"
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
          color="red"
          heading="Where This Connects"
          intro="Security is not a fourth silo — it is the trust surface cutting across the other three. These patterns, toolkit deep-dives, and harness chapters are where it grounds out."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
