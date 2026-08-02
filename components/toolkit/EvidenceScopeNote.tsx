import Link from 'next/link';
import type { ToolkitSubPage } from '@/lib/toolkit-types';

interface EvidenceScopeNoteProps {
  topicHref: string;
  lens: ToolkitSubPage;
  reviewedAt: string;
}

export function EvidenceScopeNote({ topicHref, lens, reviewedAt }: EvidenceScopeNoteProps) {
  return (
    <aside className="not-prose my-8 border-y border-text/20 py-5" aria-label="Evidence scope">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Comparative {lens.replace('-', ' ')} · reviewed {reviewedAt}
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        This lens covers the portable engineering decision. Current product-by-product
        classifications, surface limits, and source links are maintained on the{' '}
        <Link
          href={topicHref}
          className="font-semibold text-text underline decoration-text/30 underline-offset-4 hover:decoration-text"
        >
          capability overview
        </Link>
        . Documentation evidence is not runtime conformance evidence.
      </p>
    </aside>
  );
}
