import { ReactNode } from 'react';

const VARIANTS = {
  warning: {
    border: 'border-[#facc15]',
    bg: 'bg-[#facc15]/5',
    icon: (
      <svg className="w-5 h-5 text-[#facc15] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    label: 'Warning',
    labelColor: 'text-[#facc15]',
  },
  info: {
    border: 'border-[#00d4ff]',
    bg: 'bg-[#00d4ff]/5',
    icon: (
      <svg className="w-5 h-5 text-[#00d4ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Note',
    labelColor: 'text-[#00d4ff]',
  },
  critical: {
    border: 'border-[#ff3366]',
    bg: 'bg-[#ff3366]/5',
    icon: (
      <svg className="w-5 h-5 text-[#ff3366] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Critical',
    labelColor: 'text-[#ff3366]',
  },
} as const;

interface CalloutProps {
  type?: keyof typeof VARIANTS;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const v = VARIANTS[type];

  return (
    <div className={`my-8 border-l ${v.border} ${v.bg} p-5`} role="note">
      <div className="flex items-center gap-2 mb-2">
        {v.icon}
        <span className={`text-xs font-bold uppercase tracking-widest ${v.labelColor}`}>
          {title || v.label}
        </span>
      </div>
      <div className="text-sm text-muted leading-relaxed [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}
