'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  formatWorkDate,
  isExternalWorkUrl,
  WORK_CATEGORY_LABELS,
  WORK_CATEGORY_ORDER,
  type WorkCategory,
  type WorkRecord,
} from './work-types';

type LedgerFilter = WorkCategory | 'all';

interface SystemsLedgerProps {
  records: WorkRecord[];
}

export function SystemsLedger({ records }: SystemsLedgerProps) {
  const [activeFilter, setActiveFilter] = useState<LedgerFilter>('all');

  const categories = useMemo(() => {
    const available = new Set(records.map((record) => record.category));
    return WORK_CATEGORY_ORDER.filter((category) => available.has(category));
  }, [records]);

  const visibleRecords = useMemo(
    () =>
      activeFilter === 'all'
        ? records
        : records.filter((record) => record.category === activeFilter),
    [activeFilter, records]
  );

  const filters: Array<{ value: LedgerFilter; label: string; count: number }> = [
    { value: 'all', label: 'All systems', count: records.length },
    ...categories.map((category) => ({
      value: category,
      label: WORK_CATEGORY_LABELS[category],
      count: records.filter((record) => record.category === category).length,
    })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-rule py-5 sm:flex-row sm:items-center sm:justify-between">
        <fieldset>
          <legend className="sr-only">Filter systems by type</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="systems-ledger-results"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`min-h-11 border-b py-2 text-left text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background ${
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted hover:border-text hover:text-text'
                  }`}
                >
                  {filter.label} <span className="tabular-nums">{filter.count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <p className="text-sm text-muted" aria-live="polite">
          Showing {visibleRecords.length} of {records.length}
        </p>
      </div>

      <ol id="systems-ledger-results" className="border-b border-rule">
        {visibleRecords.map((record) => {
          const external = isExternalWorkUrl(record.url);

          return (
            <li key={record.id} className="border-b border-rule last:border-b-0">
              <article className="grid gap-3 py-5 lg:grid-cols-[minmax(11rem,0.62fr)_minmax(0,1.38fr)_11rem] lg:gap-10 lg:py-6">
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-text">{record.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {WORK_CATEGORY_LABELS[record.category]} <span aria-hidden="true">·</span>{' '}
                    <time dateTime={record.date}>{formatWorkDate(record.date)}</time>
                  </p>
                </div>

                <p className="max-w-[67ch] text-sm leading-6 text-text/80 md:text-base md:leading-7">
                  {record.description}
                </p>

                <div className="lg:text-right">
                  {record.repositoryUrl ? (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 lg:flex-col lg:items-end">
                      <a
                        href={record.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                      >
                        Open live system
                      </a>
                      <a
                        href={record.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-muted transition-colors hover:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                      >
                        View public repository
                      </a>
                    </div>
                  ) : external ? (
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                    >
                      Open external project
                    </a>
                  ) : (
                    <Link
                      href={record.url}
                      className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                    >
                      Read project article
                    </Link>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {visibleRecords.length === 0 && (
        <p className="border-b border-rule py-12 text-lg text-muted">
          No systems match this filter. Choose another system type.
        </p>
      )}
    </div>
  );
}
