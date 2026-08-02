import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Server-rendered compatibility wrapper for page content.
 * Route motion belongs at an actual transition boundary, not around the SSG body.
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return <div className={className}>{children}</div>;
}
