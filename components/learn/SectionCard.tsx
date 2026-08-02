import Link from 'next/link';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface SectionCardProps {
  href: string;
  number: string;
  name: string;
  description: string;
  icon: string;
  color: SectionColor;
  available: boolean;
  cta?: string;
  chips?: string[];
}

/** A numbered editorial entry for a sequenced Learn collection. */
export function SectionCard({
  href,
  number,
  name,
  description,
  color,
  available,
  cta = 'Open',
  chips,
}: SectionCardProps) {
  const theme = SECTION_THEME[color];

  const content = (
    <>
      <div className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start sm:gap-7">
        <span
          className={`font-display text-3xl leading-none tabular-nums ${theme.text}`}
          aria-hidden="true"
        >
          {number}
        </span>
        <div>
          <h3 className="font-display text-2xl leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4 md:text-3xl">
            {name}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{description}</p>
          {chips && chips.length > 0 ? (
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              {chips.join(' · ')}
            </p>
          ) : null}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${theme.text}`}>
          {available ? cta : 'Coming soon'}
        </span>
      </div>
    </>
  );

  if (!available) {
    return (
      <div className="border-t border-text/15 py-6 opacity-55" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block border-t border-text/20 py-6 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
    >
      {content}
    </Link>
  );
}
