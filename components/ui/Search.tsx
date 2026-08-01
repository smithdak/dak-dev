'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { searchPosts, SearchIndexItem } from '@/lib/search';

interface SearchProps {
  className?: string;
}

/**
 * Search component with keyboard shortcut (Cmd/Ctrl+K)
 * Displays live search results with debouncing
 * Neo-brutalist styling with thick borders and hard shadows
 */
// Module-level cache — fetched once per session, shared across mounts
let cachedIndex: SearchIndexItem[] | null = null;
let indexPromise: Promise<SearchIndexItem[]> | null = null;

function fetchSearchIndex(): Promise<SearchIndexItem[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (!indexPromise) {
    indexPromise = fetch('/api/search')
      .then((res) => res.json())
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

export function Search({ className = '' }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>(cachedIndex || []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const closeSearch = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);

    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  // Fetch search index once — uses module-level cache
  useEffect(() => {
    if (cachedIndex) return;

    let active = true;
    fetchSearchIndex().then((index) => {
      if (active) setSearchIndex(index);
    });

    return () => {
      active = false;
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        const searchResults = searchPosts(searchIndex, query);
        setResults(searchResults);
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
      router.push(result.href);
      closeSearch(false);
    },
    [closeSearch, router]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
      }
    },
    [navigateToResult, results, selectedIndex]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Search Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 py-2 bg-surface border-2 border-text text-text font-semibold hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${className}`}
        aria-label="Search the site"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-background border border-text group-hover:text-accent">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm"
              onClick={() => closeSearch()}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-2 sm:inset-x-4 top-20 z-50 mx-auto max-w-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Search the site"
            >
              <div className="bg-surface border-4 border-text shadow-[12px_12px_0_0_var(--color-text)]">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b-4 border-text">
                  <svg
                    className="w-6 h-6 text-muted flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search articles, patterns, and guides..."
                    className="flex-1 bg-transparent text-text text-lg font-semibold placeholder:text-muted focus:outline-none"
                    role="combobox"
                    aria-label="Search query"
                    aria-expanded={results.length > 0}
                    aria-autocomplete="list"
                    aria-controls="search-results"
                    aria-activedescendant={
                      results[selectedIndex] ? `search-result-${selectedIndex}` : undefined
                    }
                  />
                  <button
                    onClick={() => closeSearch()}
                    className="flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center px-3 py-1 text-sm font-semibold text-muted hover:text-text border-2 border-text hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Close search"
                  >
                    ESC
                  </button>
                </div>

                {/* Results */}
                <div
                  ref={resultsRef}
                  id="search-results"
                  className="max-h-[60vh] overflow-y-auto"
                  role="listbox"
                >
                  {query.trim().length === 0 ? (
                    <div className="px-6 py-12 text-center text-muted">
                      <p className="text-lg font-semibold mb-2">Start typing to search</p>
                      <p className="text-sm">Search across titles, content, tags, and keywords</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="py-2">
                      {results.map((result, index) => {
                        const formattedDate = result.date
                          ? new Date(result.date).toLocaleDateString('en-US', {
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
                            className={`w-full text-left px-6 py-4 border-l-4 transition-colors focus:outline-none ${
                              index === selectedIndex
                                ? 'bg-background border-accent'
                                : 'border-transparent hover:bg-background hover:border-accent'
                            }`}
                            role="option"
                            aria-selected={index === selectedIndex}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider border px-1.5 py-0.5 border-accent text-accent">
                                {result.label}
                              </span>
                              <h3 className="text-lg font-bold text-text">{result.title}</h3>
                            </div>
                            <p className="text-sm text-muted mb-3 line-clamp-2">{result.excerpt}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {result.section && (
                                <span className="text-muted font-semibold">{result.section}</span>
                              )}
                              {formattedDate && result.date && (
                                <time dateTime={result.date} className="text-muted font-semibold">
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
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-background border border-text text-text font-semibold"
                                      >
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
                      <p className="text-lg font-semibold mb-2">No results found</p>
                      <p className="text-sm">Try different keywords or check your spelling</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {results.length > 0 && (
                  <div className="px-6 py-3 border-t-4 border-text bg-background">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <p>
                        <kbd className="px-2 py-1 border border-text mr-1">↑</kbd>
                        <kbd className="px-2 py-1 border border-text mr-1">↓</kbd>
                        Navigate
                      </p>
                      <p>
                        <kbd className="px-2 py-1 border border-text mr-1">↵</kbd>
                        Select
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
