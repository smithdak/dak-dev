'use client';

import Link from 'next/link';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { TextDecode } from '@/components/ui/TextDecode';
import { GLOSSARY_CLUSTERS, getGlossaryByCluster, type DeeperLink } from '@/lib/onramp-types';
import { slugify } from '@/lib/utils';

/**
 * The Decoder — the on-ramp's plain-English glossary.
 *
 * Terms are grouped thematically (not alphabetically) so they build concepts
 * rather than read like a dictionary, and each card runs analogy → precise
 * definition → example → go deeper. The term heading reuses the site's
 * TextDecode scramble-reveal (which already honours prefers-reduced-motion via
 * its own guard) so the literal "decoding" matches the section's intent.
 * Colours are amber/chapter-5 design tokens only (DESIGN.md §6.1).
 */

const arrowIcon = (
  <svg
    className="w-3.5 h-3.5 transition-transform group-hover/deeper:translate-x-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

function DeeperLinkView({ deeper }: { deeper: DeeperLink }) {
  const className =
    'group/deeper inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-chapter-5 hover:underline decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';

  if (deeper.external) {
    return (
      <a href={deeper.href} target="_blank" rel="noopener noreferrer" className={className}>
        {deeper.label}
        {arrowIcon}
      </a>
    );
  }

  return (
    <Link href={deeper.href} className={className}>
      {deeper.label}
      {arrowIcon}
    </Link>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="block text-[10px] font-bold uppercase tracking-widest text-text/60 mb-1">
      {children}
    </span>
  );
}

export function Decoder() {
  return (
    <div>
      <nav aria-label="Jump to a group" className="flex flex-wrap gap-3 mb-12">
        {GLOSSARY_CLUSTERS.map((c) => (
          <Link
            key={c.id}
            href={`#${c.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-text/30 text-muted font-bold text-xs uppercase tracking-wider hover:border-text hover:text-text hover:bg-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {GLOSSARY_CLUSTERS.map((cluster) => {
        const terms = getGlossaryByCluster(cluster.id);
        const headingId = `${cluster.id}-heading`;
        return (
          <section
            key={cluster.id}
            id={cluster.id}
            aria-labelledby={headingId}
            className="scroll-mt-20 mb-16 last:mb-0"
          >
            <div className="border-l-8 border-l-chapter-5 border-b-2 border-text/30 pl-5 pb-4 mb-8">
              <h2 id={headingId} className="text-2xl md:text-3xl font-bold tracking-tight">
                {cluster.name}
              </h2>
              <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">{cluster.blurb}</p>
            </div>

            <ScrollReveal stagger>
              <div className="grid gap-5 md:grid-cols-2">
                {terms.map((t, i) => (
                  <ScrollRevealItem key={t.term}>
                    <article
                      id={`term-${slugify(t.term)}`}
                      className="h-full flex flex-col border-2 border-text/60 border-t-4 border-t-chapter-5 bg-surface/40 p-6 scroll-mt-24"
                    >
                      <h3 className="text-xl font-bold font-mono tracking-tight text-chapter-5 mb-4">
                        <TextDecode text={t.term} delay={i * 110} />
                      </h3>

                      <p className="text-sm text-muted leading-relaxed mb-4">
                        <FieldLabel>Like…</FieldLabel>
                        {t.analogy}
                      </p>

                      <p className="text-sm text-text leading-relaxed mb-4">
                        <FieldLabel>What it is</FieldLabel>
                        {t.definition}
                      </p>

                      <p className="text-sm text-muted leading-relaxed flex-1">
                        <FieldLabel>For example</FieldLabel>
                        {t.example}
                      </p>

                      {t.deeper && (
                        <div className="mt-5 pt-4 border-t border-text/15">
                          <DeeperLinkView deeper={t.deeper} />
                        </div>
                      )}
                    </article>
                  </ScrollRevealItem>
                ))}
              </div>
            </ScrollReveal>
          </section>
        );
      })}
    </div>
  );
}
