import Link from 'next/link';
import {
  COVERAGE_STATUS_META,
  type ToolkitCoverage,
  type ToolkitTopicMeta,
} from '@/lib/toolkit-types';

interface ProductCapabilityIndexProps {
  topics: ToolkitTopicMeta[];
  claims: ToolkitCoverage[];
}

const SURFACE_LABELS = {
  cli: 'CLI',
  ide: 'IDE',
  web: 'Web',
  cloud: 'Cloud',
} as const;

export function ProductCapabilityIndex({ topics, claims }: ProductCapabilityIndexProps) {
  return (
    <div className="border-t border-text/25">
      {topics.map((topic) => {
        const topicClaims = claims.filter((claim) => claim.topic === topic.slug);
        return (
          <section key={topic.slug} className="border-b border-text/20 py-7 md:flex md:gap-10">
            <div className="mb-5 md:mb-0 md:w-64 md:shrink-0">
              <p className="font-mono text-[10px] text-muted">
                {String(topic.order).padStart(2, '0')}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                <Link
                  href={`/learn/toolkit/${topic.slug}`}
                  className="underline decoration-text/20 underline-offset-4 hover:decoration-text"
                >
                  {topic.name}
                </Link>
              </h2>
            </div>
            <div className="min-w-0 flex-1 space-y-5">
              {topicClaims.map((claim) => (
                <div key={`${claim.topic}-${claim.surfaces.join('-')}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      {COVERAGE_STATUS_META[claim.status].label}
                    </span>
                    <span aria-hidden="true" className="text-muted/50">
                      /
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {claim.surfaces.map((surface) => SURFACE_LABELS[surface]).join(' · ')}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
                    {claim.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
