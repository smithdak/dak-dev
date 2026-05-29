import Link from 'next/link';
import { getPageNumbers } from '@/lib/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

/**
 * Pagination component with Previous/Next navigation and page numbers
 * Accessible with keyboard navigation and ARIA labels
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath = '/blog',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/page/${page}`;
  };

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-16"
      aria-label="Pagination navigation"
    >
      {/* Previous Button */}
      {hasPrevPage ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-text font-semibold hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          aria-label="Go to previous page"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-muted text-muted font-semibold cursor-not-allowed">
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2" role="list">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                role="listitem"
                className="px-3 py-2 text-muted"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          // role="listitem" goes on a wrapping span — it is not an allowed
          // role on <a>/<Link> (aria-allowed-role).
          return (
            <span key={page} role="listitem" className="inline-flex">
              <Link
                href={getPageUrl(page)}
                className={`
                inline-flex items-center justify-center min-w-[44px] px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background
                ${
                  isCurrentPage
                    ? 'bg-text text-background border-4 border-accent shadow-[4px_4px_0_0_var(--color-accent)] pointer-events-none'
                    : 'border-2 border-text hover:bg-text hover:text-background'
                }
              `}
                aria-label={
                  isCurrentPage ? `Current page, page ${page}` : `Go to page ${page}`
                }
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            </span>
          );
        })}
      </div>

      {/* Next Button */}
      {hasNextPage ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-text font-semibold hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          aria-label="Go to next page"
        >
          Next
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-muted text-muted font-semibold cursor-not-allowed">
          Next
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      )}
    </nav>
  );
}
