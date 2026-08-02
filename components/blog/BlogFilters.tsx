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
      <nav aria-label="Filter by tag" className="border-y border-text/20 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="blog-filters-panel"
          className="flex w-full items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
        >
          <span className="text-sm font-semibold text-muted">Filter by tag</span>
          <span className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">{totalTags}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text">
              {isOpen ? 'Close' : 'Open'}
            </span>
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
                  className="flex flex-wrap gap-x-4 gap-y-2 pb-5 pt-2"
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
      <nav aria-label="Filter by tag" className="hidden border-y border-text/20 py-4 md:block">
        <p className="text-sm font-semibold text-muted mb-3">Filter by tag</p>
        <motion.div
          variants={fastStaggerContainer}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap gap-x-5 gap-y-2"
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
