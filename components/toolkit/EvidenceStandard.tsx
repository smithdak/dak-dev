import {
  COVERAGE_STATUS_META,
  TOOLKIT_BOUNDARY,
  TOOLKIT_REVIEWED_AT,
  type CoverageStatus,
} from '@/lib/toolkit-types';

const DISPLAYED_STATUSES: CoverageStatus[] = [
  'native',
  'partial',
  'external',
  'no-documented-equivalent',
  'unknown',
];

export function EvidenceStandard() {
  return (
    <section
      id="evidence-standard"
      aria-labelledby="evidence-standard-heading"
      className="border-y border-text/20 py-8 md:py-10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Evidence standard · reviewed {TOOLKIT_REVIEWED_AT}
          </p>
          <h2
            id="evidence-standard-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            Compare documented capability, not feature names.
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{TOOLKIT_BOUNDARY}</p>
        </div>

        <dl className="max-w-xl divide-y divide-text/15 border-t border-text/20 lg:w-[34rem]">
          {DISPLAYED_STATUSES.map((status) => (
            <div key={status} className="flex gap-4 py-3">
              <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-text">
                {COVERAGE_STATUS_META[status].label}
              </dt>
              <dd className="text-sm leading-relaxed text-muted">
                {COVERAGE_STATUS_META[status].description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
