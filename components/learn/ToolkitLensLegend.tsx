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
      <div className="mb-7 grid gap-4 border-b border-text/20 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] md:items-end">
        <h2 id="how-to-read-heading" className="font-display text-4xl tracking-tight md:text-5xl">
          How to Read a Topic
        </h2>
        <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
          Every topic is worked through the same four lenses. Start with the mental model; reach for
          the others when the work demands it.
        </p>
      </div>

      <ol className="border-y border-text/20">
        {LENSES.map(({ sub, blurb }, index) => {
          const meta = SUB_PAGE_META[sub];
          return (
            <li
              key={sub}
              className="grid gap-3 border-b border-text/20 py-5 last:border-b-0 sm:grid-cols-[3rem_minmax(10rem,0.7fr)_minmax(0,1fr)] sm:items-start"
            >
              <span className="font-display text-2xl text-chapter-2" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl leading-tight">{meta.label}</h3>
              <p className="text-sm leading-relaxed text-muted">{blurb}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
