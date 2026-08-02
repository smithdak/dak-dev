import type { EvidenceSource } from '@/lib/toolkit-types';

interface SourceRegisterProps {
  sources: EvidenceSource[];
  heading?: string;
}

export function SourceRegister({ sources, heading = 'Official sources' }: SourceRegisterProps) {
  if (sources.length === 0) return null;

  return (
    <section
      aria-labelledby="toolkit-sources-heading"
      className="not-prose border-t border-text/20 pt-8"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-xs">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Source register
          </p>
          <h2 id="toolkit-sources-heading" className="mt-2 text-xl font-semibold tracking-tight">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Primary vendor documentation reviewed on the date shown. Links may change after
            publication.
          </p>
        </div>

        <ol className="w-full max-w-3xl divide-y divide-text/15 border-t border-text/20">
          {sources.map((source, index) => (
            <li key={source.id} id={`source-${source.id}`} className="flex gap-4 py-4 text-sm">
              <span className="w-7 shrink-0 font-mono text-xs text-muted" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-text underline decoration-text/30 underline-offset-4 transition-colors hover:decoration-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                >
                  {source.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="mt-1 text-xs text-muted">
                  {source.publisher} · {source.kind.replaceAll('-', ' ')} · accessed{' '}
                  {source.accessedAt}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
