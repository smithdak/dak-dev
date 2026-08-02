'use client';

import { useTheme } from '@/contexts/ThemeContext';

const themeConfig = {
  light: { label: 'Light', next: 'dark' as const },
  dark: { label: 'Dark', next: 'system' as const },
  system: { label: 'System', next: 'light' as const },
};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const config = themeConfig[theme];

  return (
    <button
      onClick={() => setTheme(config.next)}
      className={`inline-flex min-h-11 items-center justify-center border-b border-transparent px-2 text-xs font-semibold uppercase tracking-[0.1em] text-text transition-colors hover:border-text hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${className}`}
      aria-label={`Switch to ${config.next} mode. Currently ${config.label} mode`}
      title={`${config.label} mode; switch to ${config.next} mode`}
      type="button"
    >
      {config.label}
    </button>
  );
}
