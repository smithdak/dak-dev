'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import * as m from 'framer-motion/m';
import { searchPosts, type SearchIndexItem } from '@/lib/search';
import { formatCalendarDate } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
}

const CURATED_ROUTES = [
  { label: 'Structure the work', destination: 'Patterns', href: '/learn/patterns' },
  { label: 'Choose a capability', destination: 'Toolkit', href: '/learn/toolkit' },
  { label: 'Control delivery', destination: 'Harness', href: '/learn/harness' },
  { label: 'Bound trust', destination: 'Security', href: '/learn/security' },
  { label: 'Inspect public systems', destination: 'Work', href: '/work' },
] as const;

let cachedIndex: SearchIndexItem[] | null = null;
let indexPromise: Promise<SearchIndexItem[]> | null = null;

function fetchSearchIndex(): Promise<SearchIndexItem[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (!indexPromise) {
    indexPromise = fetch('/api/search')
      .then((response) => response.json())
      .then((data: SearchIndexItem[]) => {
        cachedIndex = data;
        return data;
      })
      .catch(() => {
        indexPromise = null;
        return [] as SearchIndexItem[];
      });
  }
  return indexPromise;
}

/** Full search experience, loaded only after the first search activation. */
export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>(cachedIndex || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const closeSearch = useCallback(
    (restoreFocus = true) => {
      onClose(restoreFocus);
    },
    [onClose]
  );

  const resetSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    if (!open || cachedIndex) return;

    let active = true;
    fetchSearchIndex().then((index) => {
      if (active) setSearchIndex(index);
    });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
      );

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements.at(-1);

      if (!firstFocusable || !lastFocusable) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const focusIsOutsideModal = !modalRef.current.contains(document.activeElement);
      if (focusIsOutsideModal || (!event.shiftKey && document.activeElement === lastFocusable)) {
        event.preventDefault();
        firstFocusable.focus();
      } else if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    };

    // Header owns shortcut and Escape; the dialog owns only its focus trap.
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        setResults(searchPosts(searchIndex, query));
        setSelectedIndex(0);
      } else {
        setResults([]);
        setSelectedIndex(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchIndex]);

  const navigateToResult = useCallback(
    (result: SearchIndexItem) => {
      closeSearch(false);

      if (/^https?:\/\//.test(result.href)) {
        window.location.assign(result.href);
        return;
      }

      router.push(result.href);
    },
    [closeSearch, router]
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((previous) => (previous + 1) % results.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((previous) => (previous - 1 + results.length) % results.length);
          break;
        case 'Enter':
          event.preventDefault();
          if (results[selectedIndex]) navigateToResult(results[selectedIndex]);
          break;
      }
    },
    [navigateToResult, results, selectedIndex]
  );

  useEffect(() => {
    const selectedElement = resultsRef.current?.querySelector<HTMLElement>(
      `#search-result-${selectedIndex}`
    );
    selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  const dialog = (
    <AnimatePresence onExitComplete={resetSearch}>
      {open && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-text/20 backdrop-blur-sm"
            onClick={() => closeSearch()}
            aria-hidden="true"
          />

          <m.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-2 top-20 z-50 mx-auto max-w-2xl sm:inset-x-4"
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            tabIndex={-1}
            data-site-search-dialog
          >
            <div className="border border-text/25 bg-background shadow-2xl">
              <div className="flex items-center gap-3 border-b border-text/20 px-5 py-5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Find
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search articles, patterns, guides, and work..."
                  className="flex-1 bg-transparent font-display text-xl text-text placeholder:text-muted focus:outline-none"
                  role="combobox"
                  aria-label="Search query"
                  aria-expanded={query.trim().length > 0}
                  aria-autocomplete="list"
                  aria-controls={query.trim().length > 0 ? 'search-results' : undefined}
                  aria-activedescendant={
                    results[selectedIndex] ? `search-result-${selectedIndex}` : undefined
                  }
                />
                <button
                  onClick={() => closeSearch()}
                  className="flex min-h-11 flex-shrink-0 items-center justify-center border-b border-text/30 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-text hover:text-text focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Close search"
                >
                  ESC
                </button>
              </div>

              <div
                ref={resultsRef}
                id="search-results"
                className="max-h-[60vh] overflow-y-auto"
                role={query.trim().length > 0 ? 'listbox' : undefined}
              >
                {query.trim().length === 0 ? (
                  <div className="px-5 py-7 sm:px-6">
                    <p className="text-lg font-semibold text-text">
                      Start with the decision in front of you.
                    </p>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                      Search the full publication, or choose a direct route into the field guide and
                      public work.
                    </p>
                    <nav aria-label="Suggested destinations" className="mt-6">
                      <ul className="border-t border-rule">
                        {CURATED_ROUTES.map((route) => (
                          <li key={route.href} className="border-b border-rule">
                            <Link
                              href={route.href}
                              onClick={() => closeSearch(false)}
                              className="group flex min-h-14 items-center justify-between gap-6 py-3 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                            >
                              <span className="font-semibold text-text transition-colors group-hover:text-accent">
                                {route.label}
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                                {route.destination}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => {
                      const formattedDate = result.date
                        ? formatCalendarDate(result.date, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : null;

                      return (
                        <button
                          key={result.href}
                          id={`search-result-${index}`}
                          onClick={() => navigateToResult(result)}
                          className={`w-full border-l px-6 py-4 text-left transition-colors focus:outline-none ${
                            index === selectedIndex
                              ? 'border-accent bg-background'
                              : 'border-transparent hover:border-accent hover:bg-background'
                          }`}
                          role="option"
                          aria-selected={index === selectedIndex}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                              {result.label}
                            </span>
                            <h3 className="text-lg font-bold text-text">{result.title}</h3>
                          </div>
                          <p className="mb-3 line-clamp-2 text-sm text-muted">{result.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {result.section && (
                              <span className="font-semibold text-muted">{result.section}</span>
                            )}
                            {formattedDate && result.date && (
                              <time dateTime={result.date} className="font-semibold text-muted">
                                {formattedDate}
                              </time>
                            )}
                            {result.tags.length > 0 && (
                              <>
                                <span className="text-muted" aria-hidden="true">
                                  •
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.map((tag) => (
                                    <span key={tag} className="font-semibold text-text">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-muted">
                    <p className="mb-2 text-lg font-semibold">No results found</p>
                    <p className="text-sm">Try different keywords or check your spelling</p>
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <div className="border-t border-text/20 bg-surface px-6 py-3">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <p>
                      <kbd className="mr-1 border border-text/20 px-2 py-1">Up / Down</kbd>
                      navigate
                    </p>
                    <p>
                      <kbd className="mr-1 border border-text/20 px-2 py-1">Enter</kbd>
                      select
                    </p>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof document === 'undefined' ? null : createPortal(dialog, document.body);
}
