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

function primaryStatus(claims: ToolkitCoverage[]): ToolkitCoverage['status'] {
  if (claims.some((claim) => claim.status === 'partial')) return 'partial';
  if (claims.some((claim) => claim.status === 'unknown')) return 'unknown';
  if (claims.some((claim) => claim.status === 'no-documented-equivalent')) {
    return 'no-documented-equivalent';
  }
  if (claims.some((claim) => claim.status === 'external')) return 'external';
  return 'native';
}

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
            <span className="flex w-full shrink-0 flex-col gap-2 md:w-[22rem]">
              {products.map((product) => {
                const claims = topic.coverage.filter((claim) => claim.tool === product.id);
                const status = primaryStatus(claims);
                return (
                  <span
                    key={product.id}
                    className="flex items-baseline justify-between gap-3 text-xs"
                  >
                    <span className="text-muted">{product.shortName}</span>
                    <span className="font-semibold uppercase tracking-[0.1em] text-text">
                      {COVERAGE_STATUS_META[status].label}
                    </span>
                  </span>
                );
              })}
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {topic.lensCount} implementation lenses
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
