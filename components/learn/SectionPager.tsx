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

/**
 * Prev/next sequence nav for section sub-pages. Carries the section colour on
 * the leading edge and uses the same hover language as SectionCard and the
 * Patterns chapter nav — lift + hard offset shadow.
 */
export function SectionPager({ color, prev, next }: SectionPagerProps) {
  const t = SECTION_THEME[color];

  return (
    <div className="not-prose mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={prev.href}
          className={`group border-2 border-text/60 hover:border-text p-5 border-l-4 ${t.borderLeft} transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background`}
        >
          <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
            ← Previous · {prev.number}
          </span>
          <p className="font-bold mt-1 group-hover:underline decoration-2 underline-offset-4">
            {prev.name}
          </p>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={next.href}
          className={`group border-2 border-text/60 hover:border-text p-5 border-r-4 ${t.borderRight} text-right transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background`}
        >
          <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
            Next · {next.number} →
          </span>
          <p className="font-bold mt-1 group-hover:underline decoration-2 underline-offset-4">
            {next.name}
          </p>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}
