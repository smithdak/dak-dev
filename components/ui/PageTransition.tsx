'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageTransitionVariants } from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition wrapper component
 * Applies smooth fade-in animations to page content
 * Respects prefers-reduced-motion via MotionConfig
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={false}
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
