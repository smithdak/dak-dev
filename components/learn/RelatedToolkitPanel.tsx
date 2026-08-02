import Link from 'next/link';
import { getToolkitTopicBySlug } from '@/lib/toolkit-types';

interface RelatedToolkitPanelProps {
  topicSlugs: string[];
}

export function RelatedToolkitPanel({ topicSlugs }: RelatedToolkitPanelProps) {
  const topics = topicSlugs.map((slug) => getToolkitTopicBySlug(slug)).filter(Boolean);

  if (topics.length === 0) return null;

  return (
    <aside className="mt-8 border-y border-text/20 py-5" aria-labelledby="related-toolkit-heading">
      <h3
        id="related-toolkit-heading"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-muted"
      >
        Related agent tooling
      </h3>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {topics.map((topic) => (
          <li key={topic!.slug}>
            <Link
              href={`/learn/toolkit/${topic!.slug}`}
              className="text-sm font-semibold underline decoration-text/30 underline-offset-4 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {topic!.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
