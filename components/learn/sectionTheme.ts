// Static class literals keep the restrained field accents discoverable by
// Tailwind while preventing section components from inventing local colours.

export type SectionColor = 'accent' | 'green' | 'cyan' | 'purple' | 'red' | 'amber';

export interface SectionTheme {
  text: string;
}

export const SECTION_THEME: Record<SectionColor, SectionTheme> = {
  accent: {
    text: 'text-accent',
  },
  green: {
    text: 'text-chapter-1',
  },
  cyan: {
    text: 'text-chapter-2',
  },
  purple: {
    text: 'text-chapter-4',
  },
  red: {
    text: 'text-chapter-6',
  },
  amber: {
    text: 'text-chapter-5',
  },
};
