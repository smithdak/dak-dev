import Link from 'next/link';
import { slugifyTag } from '@/lib/tags';
import { WRITING_LANES } from '@/lib/writing';

interface ResearchLanesProps {
  tagCounts: Record<string, number>;
}

export function ResearchLanes({ tagCounts }: ResearchLanesProps) {
  return (
    <section
      aria-labelledby="research-lanes-heading"
      className="border-b border-rule py-8 xl:border-y xl:border-l xl:px-7"
    >
      <h2
        id="research-lanes-heading"
        className="font-display text-2xl leading-none tracking-[-0.03em]"
      >
        Research lanes
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
        Four editorial entry points organize the archive. The complete topic record remains
        available below.
      </p>

      <ol className="mt-5 border-t border-rule">
        {WRITING_LANES.map((lane) => {
          const count = tagCounts[lane.tag] ?? 0;

          return (
            <li key={lane.tag} className="border-b border-rule">
              <Link
                href={`/blog/tags/${slugifyTag(lane.tag)}`}
                className="group block py-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              >
                <span className="flex items-baseline justify-between gap-5">
                  <span className="font-display text-lg tracking-[-0.02em] text-text transition-colors group-hover:text-accent">
                    {lane.name}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted">{count}</span>
                </span>
                <span className="mt-1.5 line-clamp-2 block text-xs leading-5 text-muted">
                  {lane.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
