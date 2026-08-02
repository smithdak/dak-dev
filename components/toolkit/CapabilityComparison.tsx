import {
  COVERAGE_STATUS_META,
  TOOLKIT_REVIEWED_AT,
  type AgentToolMeta,
  type EvidenceSource,
  type ToolkitCoverage,
} from '@/lib/toolkit-types';

interface CapabilityComparisonProps {
  topicName: string;
  products: AgentToolMeta[];
  claims: ToolkitCoverage[];
  sources: EvidenceSource[];
}

const SURFACE_LABELS = {
  cli: 'CLI',
  ide: 'IDE',
  web: 'Web',
  cloud: 'Cloud',
} as const;

export function CapabilityComparison({
  topicName,
  products,
  claims,
  sources,
}: CapabilityComparisonProps) {
  const sourceNumber = new Map(sources.map((source, index) => [source.id, index + 1]));

  return (
    <section
      aria-labelledby="capability-comparison-heading"
      className="not-prose my-10 border-y border-text/20 py-8"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Documented coverage · {TOOLKIT_REVIEWED_AT}
          </p>
          <h2
            id="capability-comparison-heading"
            className="mt-2 text-2xl font-semibold tracking-tight"
          >
            {topicName} by product
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          These classifications are documentation findings, not empirical runtime tests. Surface
          names are explicit because product-family claims are too coarse.
        </p>
      </div>

      <div className="divide-y divide-text/20 border-t border-text/20">
        {products.map((product) => {
          const productClaims = claims.filter((claim) => claim.tool === product.id);
          return (
            <div key={product.id} className="py-6 md:flex md:gap-10">
              <div className="mb-4 md:mb-0 md:w-48 md:shrink-0">
                <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                  {product.vendor}
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-5">
                {productClaims.map((claim) => (
                  <div key={`${claim.tool}-${claim.surfaces.join('-')}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                        {COVERAGE_STATUS_META[claim.status].label}
                      </span>
                      <span className="text-muted/50" aria-hidden="true">
                        /
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {claim.surfaces.map((surface) => SURFACE_LABELS[surface]).join(' · ')}
                      </span>
                    </div>
                    <p className="max-w-3xl text-sm leading-relaxed text-muted">{claim.summary}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      Basis: {claim.basis}
                      <span aria-hidden="true"> · </span>
                      Sources:{' '}
                      {claim.sourceIds.map((sourceId, index) => (
                        <span key={sourceId}>
                          {index > 0 && ', '}
                          <a
                            href={`#source-${sourceId}`}
                            className="underline decoration-text/30 underline-offset-2 hover:decoration-text"
                          >
                            {sourceNumber.get(sourceId) ?? sourceId}
                          </a>
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
