import Link from 'next/link';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface PagerLink {
  href: string;
  number: string;
  name: string;
}

interface SectionPagerProps {
  color: SectionColor;
  prev: PagerLink | null;
  next: PagerLink | null;
}

/** Quiet sequence navigation for long-form Learn chapters. */
export function SectionPager({ color, prev, next }: SectionPagerProps) {
  const theme = SECTION_THEME[color];

  return (
    <nav
      aria-label="Chapter sequence"
      className="not-prose mt-14 grid border-y border-text/20 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group min-h-28 px-1 py-6 transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:border-r sm:border-text/20 sm:pr-8"
        >
          <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${theme.text}`}>
            Previous · {prev.number}
          </span>
          <span className="mt-3 block font-display text-2xl leading-tight group-hover:underline group-hover:underline-offset-4">
            {prev.name}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block sm:border-r sm:border-text/20" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group min-h-28 border-t border-text/20 px-1 py-6 transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:border-t-0 sm:pl-8 sm:text-right"
        >
          <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${theme.text}`}>
            Next · {next.number}
          </span>
          <span className="mt-3 block font-display text-2xl leading-tight group-hover:underline group-hover:underline-offset-4">
            {next.name}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
