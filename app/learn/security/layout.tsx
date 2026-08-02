import type { ReactNode } from 'react';
import { LearnSectionShell } from '@/components/learn/LearnSectionShell';
import type { LearnSectionNavigation } from '@/components/learn/LearnNavigationTypes';
import { SECURITY_CHAPTERS } from '@/lib/security-types';

export default function SecurityLayout({ children }: { children: ReactNode }) {
  const navigation: LearnSectionNavigation = {
    title: 'Security',
    overviewHref: '/learn/security',
    overviewLabel: 'Security overview',
    items: SECURITY_CHAPTERS.map((chapter) => ({
      href: `/learn/security/${chapter.slug}`,
      label: chapter.name,
      marker: chapter.number,
    })),
  };

  return <LearnSectionShell navigation={navigation}>{children}</LearnSectionShell>;
}
