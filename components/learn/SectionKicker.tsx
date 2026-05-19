import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface SectionKickerProps {
  /** Pillar label, e.g. "Harness". */
  section: string;
  /** Position label, e.g. "Chapter 02" or "Deep-Dive". */
  kicker: string;
  color: SectionColor;
}

/**
 * Slim, colour-coded article eyebrow that sits directly above the MDX `# H1`.
 * Deliberately NOT a heading — every sub-page's MDX body already owns its H1,
 * so this gives the article a section identity without a duplicate-H1 a11y/SEO
 * regression. The colour signature matches the section index.
 */
export function SectionKicker({ section, kicker, color }: SectionKickerProps) {
  const t = SECTION_THEME[color];
  return (
    <div className={`not-prose mb-8 border-l-4 ${t.borderLeft} pl-4 py-1`}>
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted">
        <span className={`${t.text} font-bold`}>{section}</span>
        <span aria-hidden="true" className="mx-2 text-muted/40">
          /
        </span>
        {kicker}
      </p>
    </div>
  );
}
