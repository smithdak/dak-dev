import type { ReactNode } from 'react';
import { LearnSectionShell } from '@/components/learn/LearnSectionShell';
import type { LearnSectionNavigation } from '@/components/learn/LearnNavigationTypes';
import { HARNESS_CHAPTERS } from '@/lib/harness-types';

export default function HarnessLayout({ children }: { children: ReactNode }) {
  const navigation: LearnSectionNavigation = {
    title: 'Harness',
    overviewHref: '/learn/harness',
    overviewLabel: 'Harness overview',
    items: HARNESS_CHAPTERS.map((chapter) => ({
      href: `/learn/harness/${chapter.slug}`,
      label: chapter.name,
      marker: chapter.number,
    })),
  };

  return <LearnSectionShell navigation={navigation}>{children}</LearnSectionShell>;
}
