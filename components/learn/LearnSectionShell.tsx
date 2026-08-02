import type { ReactNode } from 'react';
import { LearnMobileNav } from '@/components/learn/LearnMobileNav';
import type { LearnSectionNavigation } from '@/components/learn/LearnNavigationTypes';
import { LearnSidebar } from '@/components/learn/LearnSidebar';

interface LearnSectionShellProps {
  children: ReactNode;
  navigation: LearnSectionNavigation;
}

export function LearnSectionShell({ children, navigation }: LearnSectionShellProps) {
  // overflow-x-clip avoids creating a scroll container, so sticky descendants
  // in the syllabus and article body still pin to the viewport.
  return (
    <div className="learn-section-stage overflow-x-clip">
      <LearnMobileNav {...navigation} className="px-4 pt-3 sm:px-6 xl:px-0" />
      <div className="xl:grid xl:grid-cols-[260px_1fr] xl:gap-10 xl:pb-8 xl:pt-6">
        <div className="hidden xl:block">
          <LearnSidebar {...navigation} />
        </div>
        <div className="min-w-0 lg:px-8 xl:px-0">{children}</div>
      </div>
    </div>
  );
}
