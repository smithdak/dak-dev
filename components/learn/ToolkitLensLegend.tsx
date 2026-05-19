import { SUB_PAGE_META, type ToolkitSubPage } from '@/lib/toolkit-types';

const LENSES: { sub: ToolkitSubPage; blurb: string }[] = [
  {
    sub: 'mental-model',
    blurb: 'The one idea to internalize before you touch the feature.',
  },
  {
    sub: 'playbook',
    blurb: 'Concrete, copy-ready setups for real workflows.',
  },
  {
    sub: 'compositions',
    blurb: 'How it combines with other features into architectures.',
  },
  {
    sub: 'pitfalls',
    blurb: "The failure modes the docs don't warn you about.",
  },
];

interface ToolkitLensLegendProps {
  className?: string;
}

/**
 * The toolkit's "how to read this" device — the structural analog of the
 * Patterns DifficultyLegend. Every topic is examined through the same four
 * lenses; this names them once so the topic cards stay scannable.
 */
export function ToolkitLensLegend({ className = '' }: ToolkitLensLegendProps) {
  return (
    <section
      id="how-to-read"
      aria-labelledby="how-to-read-heading"
      className={`scroll-mt-20 ${className}`}
    >
      <div className="border-l-8 border-l-chapter-2 border-b-2 border-text/30 pl-5 pb-4 mb-6">
        <h2
          id="how-to-read-heading"
          className="text-2xl md:text-3xl font-bold tracking-tight"
        >
          How to Read a Topic
        </h2>
        <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
          Every topic is worked through the same four lenses. Start with the
          mental model; reach for the others when the work demands it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LENSES.map(({ sub, blurb }) => {
          const meta = SUB_PAGE_META[sub];
          return (
            <div
              key={sub}
              className="border-2 border-text/20 bg-surface/30 p-5 border-t-4 border-t-chapter-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-chapter-2 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={meta.icon}
                  />
                </svg>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {meta.label}
                </h3>
              </div>
              <p className="text-sm text-muted leading-snug">{blurb}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
