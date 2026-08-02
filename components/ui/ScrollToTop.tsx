'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Floating scroll-to-top button
 * Shows after 500px scroll with the publication's quiet utility treatment.
 * Respects prefers-reduced-motion
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 500);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 flex min-h-11 min-w-11 items-center justify-center border border-text/25 bg-background px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text shadow-lg transition-colors hover:border-text hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
        >
          Top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
