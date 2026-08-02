import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface SectionKickerProps {
  /** Pillar label, e.g. "Harness". */
  section: string;
  /** Position label, e.g. "Chapter 02" or "Deep-Dive". */
  kicker: string;
  color: SectionColor;
}

/** Context strip for Learn articles whose MDX body already owns the page H1. */
export function SectionKicker({ section, kicker, color }: SectionKickerProps) {
  const t = SECTION_THEME[color];
  return (
    <div className="not-prose mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-y border-rule py-3 text-sm">
      <p className={`${t.text} font-semibold`}>{section}</p>
      <p className="text-muted">{kicker}</p>
    </div>
  );
}
