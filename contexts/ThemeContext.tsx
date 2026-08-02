'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme-preference';
const THEME_EVENT = 'theme-preference-change';
let fallbackTheme: Theme = 'light';
let forceFallbackTheme = false;

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light';
  if (forceFallbackTheme) return fallbackTheme;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : fallbackTheme;
  } catch {
    return fallbackTheme;
  }
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

function subscribeToTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => onStoreChange();

  window.addEventListener('storage', handleChange);
  window.addEventListener(THEME_EVENT, handleChange);
  mediaQuery.addEventListener('change', handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(THEME_EVENT, handleChange);
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * Detects the system's preferred color scheme
 * Returns the canonical editorial light theme if matchMedia is unavailable.
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Resolves the actual theme to apply based on user preference
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Applies the theme to the document by setting class on html element
 */
function applyTheme(theme: ResolvedTheme, animate = true) {
  if (typeof document === 'undefined') {
    return;
  }

  const html = document.documentElement;

  if (animate) html.classList.add('theme-transitioning');

  // Remove both classes first
  html.classList.remove('light', 'dark');

  // Add the current theme class
  html.classList.add(theme);

  if (animate) {
    setTimeout(() => {
      html.classList.remove('theme-transitioning');
    }, 300);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const resolvedTheme = resolveTheme(theme);

  // The head bootstrap owns first paint; this keeps cross-tab and system
  // preference changes synchronized without an extra entrance transition.
  useEffect(() => {
    applyTheme(resolvedTheme, false);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    fallbackTheme = newTheme;
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      forceFallbackTheme = false;
    } catch {
      forceFallbackTheme = true;
    }

    applyTheme(resolveTheme(newTheme));
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * Returns { theme, setTheme, resolvedTheme }
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
