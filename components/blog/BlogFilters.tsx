'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Tag } from '@/components/ui/Tag';
import { staggerItemVariants } from '@/lib/animations';

const fastStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

interface BlogFiltersProps {
  tagCounts: Record<string, number>;
  className?: string;
}

export function BlogFilters({ tagCounts, className = '' }: BlogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const tags = Object.keys(tagCounts).sort();
  const totalTags = tags.length;

  if (totalTags === 0) return null;

  const duration = shouldReduceMotion ? 0 : 0.2;

  return (
    <div className={className}>
      {/* Mobile: collapsible */}
      <nav aria-label="Filter by tag" className="md:hidden border-b-4 border-surface bg-surface/20">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="blog-filters-panel"
          className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
        >
          <span className="text-sm font-semibold text-muted">Filter by tag</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-bold border-2 border-text text-text">
              {totalTags}
            </span>
            <svg
              className="h-5 w-5 text-muted transition-transform duration-200"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        <div id="blog-filters-panel">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={fastStaggerContainer}
                  initial={false}
                  animate="visible"
                  className="flex flex-wrap gap-2 px-6 pt-2 pb-6"
                >
                  {tags.map((tag) => (
                    <motion.div key={tag} variants={staggerItemVariants}>
                      <Tag tag={tag} interactive count={tagCounts[tag]} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Desktop: always visible with scroll entrance */}
      <nav
        aria-label="Filter by tag"
        className="hidden md:block border-b-4 border-surface bg-surface/20 p-6"
      >
        <p className="text-sm font-semibold text-muted mb-3">Filter by tag</p>
        <motion.div
          variants={fastStaggerContainer}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap gap-2"
        >
          {tags.map((tag) => (
            <motion.div key={tag} variants={staggerItemVariants}>
              <Tag tag={tag} interactive count={tagCounts[tag]} />
            </motion.div>
          ))}
        </motion.div>
      </nav>
    </div>
  );
}
