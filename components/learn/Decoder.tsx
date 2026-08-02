import Link from 'next/link';
import {
  GLOSSARY_CLUSTERS,
  GLOSSARY_TERMS,
  getGlossaryByCluster,
  type DeeperLink,
} from '@/lib/onramp-types';
import { slugify } from '@/lib/utils';

/**
 * The Decoder — the on-ramp's plain-English glossary.
 *
 * Terms are grouped thematically (not alphabetically) so they build concepts
 * rather than read like a dictionary. The static field-lexicon treatment keeps
 * all twelve terms visible without shipping an interaction island for a small
 * reference set. Colours are amber/chapter-5 design tokens only (DESIGN.md §6.1).
 */

const TERM_NUMBERS = new Map(
  GLOSSARY_TERMS.map((term, index) => [term.term, String(index + 1).padStart(2, '0')])
);

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
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
      {children}
    </span>
  );
}

export function Decoder() {
  return (
    <div className="pb-4">
      <nav aria-label="Glossary term index" className="border-y border-text/20 py-6">
        <div className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-chapter-5">
              Term index
            </p>
            <p className="mt-2 max-w-40 text-sm leading-relaxed text-muted">
              Twelve terms. Three connected ideas.
            </p>
          </div>

          <ol className="grid border-t border-text/15 sm:grid-cols-3 sm:border-t-0">
            {GLOSSARY_CLUSTERS.map((cluster, clusterIndex) => {
              const terms = getGlossaryByCluster(cluster.id);

              return (
                <li
                  key={cluster.id}
                  className="border-b border-text/15 py-5 sm:border-b-0 sm:border-l sm:px-5 sm:py-0"
                >
                  <Link
                    href={`#${cluster.id}`}
                    className="group inline-flex min-h-11 items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                  >
                    <span className="font-mono text-xs text-chapter-5" aria-hidden="true">
                      {String(clusterIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
                      {cluster.name}
                    </span>
                  </Link>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 sm:block">
                    {terms.map((term) => (
                      <li key={term.term} className="sm:mt-1">
                        <Link
                          href={`#term-${slugify(term.term)}`}
                          className="text-xs leading-relaxed text-muted underline-offset-2 hover:text-text hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {term.term}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <div className="space-y-20 py-16 md:py-20">
        {GLOSSARY_CLUSTERS.map((cluster, clusterIndex) => {
          const terms = getGlossaryByCluster(cluster.id);
          const headingId = `${cluster.id}-heading`;

          return (
            <section
              key={cluster.id}
              id={cluster.id}
              aria-labelledby={headingId}
              className="scroll-mt-28"
            >
              <header className="grid gap-4 border-b border-text/20 pb-6 md:grid-cols-[4rem_minmax(13rem,0.8fr)_minmax(0,1.3fr)] md:items-end md:gap-7">
                <p className="font-display text-3xl leading-none text-chapter-5" aria-hidden="true">
                  {String(clusterIndex + 1).padStart(2, '0')}
                </p>
                <h2 id={headingId} className="font-display text-4xl tracking-tight md:text-5xl">
                  {cluster.name}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted">{cluster.blurb}</p>
              </header>

              <ol>
                {terms.map((term) => {
                  const termId = `term-${slugify(term.term)}`;

                  return (
                    <li key={term.term} className="border-b border-text/20">
                      <article
                        id={termId}
                        aria-labelledby={`${termId}-heading`}
                        className="grid scroll-mt-28 gap-6 py-8 lg:grid-cols-[4rem_14rem_minmax(0,1fr)] lg:gap-7 lg:py-10"
                      >
                        <p className="font-mono text-xs text-muted" aria-hidden="true">
                          {TERM_NUMBERS.get(term.term)}
                        </p>

                        <div>
                          <h3
                            id={`${termId}-heading`}
                            className="font-display text-3xl leading-none tracking-tight text-chapter-5 md:text-4xl"
                          >
                            {term.term}
                          </h3>
                          {term.deeper ? (
                            <div className="mt-4">
                              <DeeperLinkView deeper={term.deeper} />
                            </div>
                          ) : null}
                        </div>

                        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                          <div>
                            <FieldLabel>Analogy</FieldLabel>
                            <p className="text-base leading-7 text-muted">{term.analogy}</p>
                          </div>
                          <div className="border-l border-chapter-5/35 pl-4">
                            <FieldLabel>Definition</FieldLabel>
                            <p className="text-base leading-7 text-text">{term.definition}</p>
                          </div>
                          <div className="md:col-span-2 xl:col-span-1">
                            <FieldLabel>In practice</FieldLabel>
                            <p className="text-base leading-7 text-muted">{term.example}</p>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
