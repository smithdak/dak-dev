import Link from 'next/link';
import { getPageNumbers } from '@/lib/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '/blog' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const pageUrl = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`);

  return (
    <nav
      className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-text/20 pt-6"
      aria-label="Pagination navigation"
    >
      <div>
        {currentPage > 1 ? (
          <Link
            href={pageUrl(currentPage - 1)}
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Previous page
          </Link>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            First page
          </span>
        )}
      </div>

      <ol className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className="px-2 text-muted">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={pageUrl(page)}
                aria-label={
                  page === currentPage ? `Current page, page ${page}` : `Go to page ${page}`
                }
                aria-current={page === currentPage ? 'page' : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center border-b text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                  page === currentPage
                    ? 'border-accent text-accent pointer-events-none'
                    : 'border-transparent text-muted hover:border-text hover:text-text'
                }`}
              >
                {page}
              </Link>
            </li>
          )
        )}
      </ol>

      <div className="text-right">
        {currentPage < totalPages ? (
          <Link
            href={pageUrl(currentPage + 1)}
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.12em] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Next page
          </Link>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Last page
          </span>
        )}
      </div>
    </nav>
  );
}
