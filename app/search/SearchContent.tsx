'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { searchPosts, type SearchIndexItem } from '@/lib/search';
import { formatCalendarDate } from '@/lib/utils';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/search');
        const index = (await response.json()) as SearchIndexItem[];
        setResults(query.trim() ? searchPosts(index, query) : []);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    void performSearch();
  }, [query]);

  return (
    <div className="min-h-screen py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-text/20 pb-10">
          <Link
            href="/"
            className="mb-10 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] text-muted underline-offset-4 hover:text-text hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Home
          </Link>

          <p className="editorial-kicker mb-5">Publication index</p>
          <h1 className="font-display text-5xl leading-tight tracking-[-0.04em] md:text-7xl">
            {query ? `Results for “${query}”` : 'Search'}
          </h1>

          {query && !isLoading ? (
            <p className="mt-5 text-sm text-muted">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
          ) : null}
        </header>

        {isLoading ? (
          <p className="border-y border-text/20 py-10 text-sm text-muted" role="status">
            Searching the publication index…
          </p>
        ) : null}

        {!isLoading && !query ? (
          <EmptyState
            title="No search query"
            body="Use the search control in the header to search writing, patterns, and field guides."
          />
        ) : null}

        {!isLoading && query && results.length === 0 ? (
          <EmptyState
            title="No results found"
            body={`Nothing in the current index matches “${query}”. Try a broader term or a product name.`}
          />
        ) : null}

        {!isLoading && results.length > 0 ? (
          <div className="divide-y divide-text/20 border-y border-text/20">
            {results.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                className="group grid gap-4 py-7 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <p className="text-accent">{result.label}</p>
                  {result.section ? <p className="mt-1">{result.section}</p> : null}
                  {result.date ? (
                    <time dateTime={result.date} className="mt-1 block">
                      {formatCalendarDate(result.date, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  ) : null}
                </div>
                <div>
                  <h2 className="font-display text-2xl leading-tight text-text group-hover:underline group-hover:underline-offset-4 md:text-3xl">
                    {result.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {result.excerpt}
                  </p>
                  {result.tags.length > 0 ? (
                    <p className="mt-3 text-xs font-semibold text-muted">
                      {result.tags
                        .slice(0, 3)
                        .map((tag) => `#${tag}`)
                        .join(' · ')}
                    </p>
                  ) : null}
                </div>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-accent md:block">
                  Open
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-y border-text/20 py-12">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">{body}</p>
      <Link
        href="/learn"
        className="mt-7 inline-flex min-h-11 items-center border-b border-text text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Explore Learn
      </Link>
    </section>
  );
}

export function SearchContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20">
          <p className="mx-auto max-w-5xl px-4 text-sm text-muted" role="status">
            Loading search…
          </p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
