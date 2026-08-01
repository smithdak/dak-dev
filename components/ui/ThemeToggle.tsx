'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from 'framer-motion';

// SVG Icons
function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="0" ry="0" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const themeConfig = {
  light: {
    icon: SunIcon,
    label: 'Light mode',
    next: 'dark' as const,
  },
  dark: {
    icon: MoonIcon,
    label: 'Dark mode',
    next: 'system' as const,
  },
  system: {
    icon: MonitorIcon,
    label: 'System mode',
    next: 'light' as const,
  },
};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const config = themeConfig[theme];
  const Icon = config.icon;

  const handleToggle = () => {
    setTheme(config.next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center bg-surface border-2 border-text text-text shadow-[2px_2px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
        prefersReducedMotion
          ? ''
          : 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-accent)] active:translate-y-0 active:shadow-none'
      } ${className}`}
      aria-label={`Switch to ${config.next} mode. Currently ${config.label}`}
      title={`${config.label}; switch to ${config.next} mode`}
      type="button"
    >
      <Icon />
    </button>
  );
}
