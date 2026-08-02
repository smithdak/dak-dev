import Link from 'next/link';
import {
  COVERAGE_STATUS_META,
  type AgentToolMeta,
  type ToolkitCoverage,
  type ToolkitTopicMeta,
} from '@/lib/toolkit-types';

interface ToolkitCapabilityIndexProps {
  topics: Array<
    ToolkitTopicMeta & {
      available: boolean;
      lensCount: number;
      coverage: ToolkitCoverage[];
    }
  >;
  products: AgentToolMeta[];
}

const SURFACE_LABELS = {
  cli: 'CLI',
  ide: 'IDE',
  web: 'Web',
  cloud: 'Cloud',
} as const;

export function ToolkitCapabilityIndex({ topics, products }: ToolkitCapabilityIndexProps) {
  return (
    <ol className="border-t border-text/25">
      {topics.map((topic) => (
        <li key={topic.slug} className="border-b border-text/20">
          <Link
            href={`/learn/toolkit/${topic.slug}`}
            aria-disabled={!topic.available}
            className="group flex flex-col gap-5 py-7 transition-colors hover:bg-surface/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:flex-row md:items-start md:gap-8 md:px-2"
          >
            <span className="w-10 shrink-0 font-mono text-xs text-muted">
              {String(topic.order).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xl font-semibold tracking-tight decoration-2 underline-offset-4 group-hover:underline md:text-2xl">
                {topic.name}
              </span>
              <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-muted">
                {topic.description}
              </span>
            </span>
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-[22rem]">
              <dl className="flex flex-col gap-3">
                {products.map((product) => {
                  const claims = topic.coverage.filter((claim) => claim.tool === product.id);
                  return (
                    <div
                      key={product.id}
                      className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-start gap-x-3 text-xs"
                    >
                      <dt className="pt-0.5 text-muted">{product.shortName}</dt>
                      <dd className="flex flex-wrap gap-x-3 gap-y-1 md:justify-end">
                        {claims.map((claim) => (
                          <span
                            key={`${product.id}-${claim.surfaces.join('-')}`}
                            className="whitespace-nowrap"
                          >
                            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                              {claim.surfaces.map((surface) => SURFACE_LABELS[surface]).join(' · ')}
                            </span>
                            <span className="mx-1 text-muted/50">/</span>
                            <span className="font-semibold uppercase tracking-[0.08em] text-text">
                              {COVERAGE_STATUS_META[claim.status].label}
                            </span>
                          </span>
                        ))}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {topic.lensCount} implementation lenses
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
