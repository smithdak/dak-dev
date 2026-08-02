import type { ReactNode } from 'react';
import { LearnSectionShell } from '@/components/learn/LearnSectionShell';
import type { LearnSectionNavigation } from '@/components/learn/LearnNavigationTypes';
import { CHAPTERS, getAllPatterns } from '@/lib/patterns';

export default function PatternsLayout({ children }: { children: ReactNode }) {
  const patterns = getAllPatterns();
  const navigation: LearnSectionNavigation = {
    title: 'Patterns',
    overviewHref: '/learn/patterns',
    overviewLabel: 'Pattern index',
    utilityItems: [
      { href: '/learn/patterns/graph', label: 'Language map' },
      { href: '/learn/patterns/cards', label: 'Reference cards' },
    ],
    items: CHAPTERS.map((chapter) => ({
      href: `/learn/patterns/chapter/${chapter.slug}`,
      label: chapter.name,
      marker: String(chapter.number).padStart(2, '0'),
      children: patterns
        .filter((pattern) => pattern.frontmatter.chapter === chapter.number)
        .map((pattern) => ({
          href: `/learn/patterns/${pattern.frontmatter.slug}`,
          label: pattern.frontmatter.name,
          marker: pattern.frontmatter.number,
        })),
    })),
  };

  return <LearnSectionShell navigation={navigation}>{children}</LearnSectionShell>;
}
