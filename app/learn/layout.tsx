import type { ReactNode } from 'react';
import { LearnPrimaryNav } from '@/components/learn/LearnPrimaryNav';

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="border-b border-rule">
        <div className="site-stage">
          <LearnPrimaryNav />
        </div>
      </div>
      {children}
    </div>
  );
}
