import Link from 'next/link';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface SectionCardProps {
  href: string;
  /** Display index — "01", or a topic order. Rendered large + translucent. */
  number: string;
  name: string;
  description: string;
  /** Single-path 24x24 stroke icon — the site's SVG convention. */
  icon: string;
  color: SectionColor;
  available: boolean;
  /** Call-to-action verb. Defaults to "Open". */
  cta?: string;
  /** Informational tags (e.g. which toolkit lenses exist) — non-interactive. */
  chips?: string[];
}

/**
 * A rich, colour-coded section entry. Replaces the flat undifferentiated
 * `border-4` box with the Patterns-tier idiom: persistent coloured top edge,
 * big translucent index (ChapterHeader), hover lift + section-colour shadow,
 * underline-on-hover title (PatternCard), animated CTA (LearnHero pillar).
 *
 * Works as a grid item or a stacked sequence step — layout is the caller's.
 */
export function SectionCard({
  href,
  number,
  name,
  description,
  icon,
  color,
  available,
  cta = 'Open',
  chips,
}: SectionCardProps) {
  const t = SECTION_THEME[color];
  const base = `group relative flex h-full flex-col border-2 bg-surface/40 border-t-4 ${t.borderTop} p-6 transition-all duration-200`;

  const body = (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <svg
          className={`w-7 h-7 ${t.text} shrink-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
        <span
          className={`font-mono font-bold text-4xl ${t.text} opacity-20 leading-none tabular-nums`}
          aria-hidden="true"
        >
          {number}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:underline decoration-2 underline-offset-4">
        {name}
      </h3>
      <p className="text-sm text-muted leading-relaxed flex-1">{description}</p>

      {chips && chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="text-[10px] font-mono uppercase tracking-wider border border-text/25 text-muted px-2 py-1 group-hover:border-text/50 transition-colors"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
          {available ? 'Available' : 'Coming soon'}
        </span>
        {available && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${t.text}`}
          >
            {cta}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  if (!available) {
    return (
      <div className={`${base} border-text/20 opacity-50`} aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} border-text/60 hover:border-text hover:-translate-y-1 ${t.cardShadow} focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background`}
    >
      {body}
    </Link>
  );
}
