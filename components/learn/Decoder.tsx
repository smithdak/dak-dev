'use client';

import Link from 'next/link';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
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

function DeeperLinkView({ deeper }: { deeper: DeeperLink }) {
  const className =
    'inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] text-chapter-5 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';

  if (deeper.external) {
    return (
      <a href={deeper.href} target="_blank" rel="noopener noreferrer" className={className}>
        {deeper.label}
      </a>
    );
  }

  return (
    <Link href={deeper.href} className={className}>
      {deeper.label}
    </Link>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">
      {children}
    </span>
  );
}

export function Decoder() {
  return (
    <div>
      <nav
        aria-label="Jump to a group"
        className="mb-12 flex flex-wrap gap-x-5 gap-y-2 border-y border-text/20 py-4"
      >
        {GLOSSARY_CLUSTERS.map((c) => (
          <Link
            key={c.id}
            href={`#${c.id}`}
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] text-muted underline-offset-4 hover:text-text hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
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
            <div className="mb-8 grid gap-4 border-b border-text/20 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] md:items-end">
              <h2 id={headingId} className="font-display text-4xl tracking-tight md:text-5xl">
                {cluster.name}
              </h2>
              <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">{cluster.blurb}</p>
            </div>

            <ScrollReveal stagger>
              <div className="border-y border-text/20">
                {terms.map((t) => (
                  <ScrollRevealItem key={t.term}>
                    <article
                      id={`term-${slugify(t.term)}`}
                      className="grid scroll-mt-24 gap-5 border-b border-text/20 py-7 last:border-b-0 md:grid-cols-[minmax(10rem,0.6fr)_minmax(0,1.4fr)]"
                    >
                      <h3 className="font-display text-3xl leading-tight text-chapter-5">
                        {t.term}
                      </h3>
                      <div>
                        <p className="mb-4 text-sm leading-relaxed text-muted">
                          <FieldLabel>Like…</FieldLabel>
                          {t.analogy}
                        </p>
                        <p className="mb-4 text-sm leading-relaxed text-text">
                          <FieldLabel>What it is</FieldLabel>
                          {t.definition}
                        </p>
                        <p className="text-sm leading-relaxed text-muted">
                          <FieldLabel>For example</FieldLabel>
                          {t.example}
                        </p>
                        {t.deeper && (
                          <div className="mt-4">
                            <DeeperLinkView deeper={t.deeper} />
                          </div>
                        )}
                      </div>
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
