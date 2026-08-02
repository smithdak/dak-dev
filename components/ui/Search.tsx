'use client';

import { forwardRef } from 'react';

interface SearchProps {
  className?: string;
  expanded: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
}

/** Presentational search trigger. Header owns the single search state machine. */
export const Search = forwardRef<HTMLButtonElement, SearchProps>(function Search(
  { className = '', expanded, onOpen },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={(event) => onOpen(event.currentTarget)}
      className={`group inline-flex min-h-11 items-center justify-center gap-3 border-b border-transparent px-2 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${className}`}
      aria-label="Search the site"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      data-site-search-trigger
    >
      <span>Search</span>
      <kbd className="hidden border border-text/20 px-2 py-0.5 font-mono text-[10px] tracking-normal text-muted xl:inline-flex">
        Ctrl K
      </kbd>
    </button>
  );
});
