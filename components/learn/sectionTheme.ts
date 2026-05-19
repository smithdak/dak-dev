// Single source of truth for the per-section colour contract.
//
// The contract is set on the Learn landing (LearnHero): Toolkit = chapter-2
// (cyan), Harness = chapter-4 (purple), Security = chapter-6 (red). These
// modules carry that identity down into each section so the landing page's
// promise matches the section it links to.
//
// Every value is a STATIC literal string. Tailwind v4 scans source for class
// names, so a runtime lookup (`SECTION_THEME[color].text`) keeps working only
// because the literals exist verbatim here — the same idiom ChapterHeader and
// PatternCard already use for the chapter palette.

export type SectionColor = 'green' | 'cyan' | 'purple' | 'red';

export interface SectionTheme {
  /** Numbers, icons, stats, CTA — the section's voice. */
  text: string;
  /** Badge frame. */
  border: string;
  /** Card top edge — the persistent colour signature. */
  borderTop: string;
  /** Section-header and spine accent. */
  borderLeft: string;
  /** Trailing edge — the "next" side of a pager. */
  borderRight: string;
  /** The draw-line under the hero title. */
  line: string;
  /** Hard offset shadow in the section colour, on card hover. */
  cardShadow: string;
  /** Faint section tint for the sequential reading rail. */
  rail: string;
}

export const SECTION_THEME: Record<SectionColor, SectionTheme> = {
  // Patterns — chapter-1 is #00ff88, identical to the dark-mode accent, so the
  // Patterns banner is visually unchanged while still going through the
  // one-contract mechanism.
  green: {
    text: 'text-chapter-1',
    border: 'border-chapter-1',
    borderTop: 'border-t-chapter-1',
    borderLeft: 'border-l-chapter-1',
    borderRight: 'border-r-chapter-1',
    line: 'bg-chapter-1',
    cardShadow: 'hover:shadow-[6px_6px_0_0_var(--color-chapter-1)]',
    rail: 'border-chapter-1/25',
  },
  cyan: {
    text: 'text-chapter-2',
    border: 'border-chapter-2',
    borderTop: 'border-t-chapter-2',
    borderLeft: 'border-l-chapter-2',
    borderRight: 'border-r-chapter-2',
    line: 'bg-chapter-2',
    cardShadow: 'hover:shadow-[6px_6px_0_0_var(--color-chapter-2)]',
    rail: 'border-chapter-2/25',
  },
  purple: {
    text: 'text-chapter-4',
    border: 'border-chapter-4',
    borderTop: 'border-t-chapter-4',
    borderLeft: 'border-l-chapter-4',
    borderRight: 'border-r-chapter-4',
    line: 'bg-chapter-4',
    cardShadow: 'hover:shadow-[6px_6px_0_0_var(--color-chapter-4)]',
    rail: 'border-chapter-4/25',
  },
  red: {
    text: 'text-chapter-6',
    border: 'border-chapter-6',
    borderTop: 'border-t-chapter-6',
    borderLeft: 'border-l-chapter-6',
    borderRight: 'border-r-chapter-6',
    line: 'bg-chapter-6',
    cardShadow: 'hover:shadow-[6px_6px_0_0_var(--color-chapter-6)]',
    rail: 'border-chapter-6/25',
  },
};
