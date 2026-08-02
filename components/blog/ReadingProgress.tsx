'use client';

import { useReadingProgress } from '@/hooks/useReadingProgress';

interface ReadingProgressProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reading progress indicator bar
 * Displays a fixed progress bar at the top of the viewport
 * showing how far through the article the user has scrolled
 */
export function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const { progress, isVisible } = useReadingProgress();

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed left-0 right-0 top-[var(--layout-header-height)] z-40 ${className}`}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-0.5 origin-left bg-accent transition-transform will-change-transform motion-reduce:transition-none"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />

      {/* Accessibility: Screen reader percentage announcement */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {Math.round(progress)}% read
      </span>
    </div>
  );
}
