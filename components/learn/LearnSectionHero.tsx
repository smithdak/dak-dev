'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  staggerContainerVariants,
  slideUpVariants,
  drawLineVariants,
} from '@/lib/animations';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface LearnSectionHeroProps {
  /** Current-page label shown in the breadcrumb (e.g. "Patterns"). */
  section: string;
  /** Eyebrow badge text (e.g. "Reference · 24 Patterns · 6 Chapters"). */
  eyebrow: string;
  /** Page H1. */
  title: string;
  /** Lead paragraph beneath the title. */
  description: string;
  /**
   * Per-section identity colour (the LearnHero contract): Patterns = green,
   * Toolkit = cyan, Harness = purple, Security = red. The banner shape is
   * identical across all four; only the badge + draw-line take the colour.
   */
  color?: SectionColor;
}

/**
 * Shared banner for the four Learn sections (Patterns, Toolkit, Harness,
 * Security). One consistent treatment across all of them — deliberately
 * simpler than, and visually distinct from, the unique /learn landing hero
 * (no TextDecode headline, no coordinate frame, no stats bar).
 */
export function LearnSectionHero({
  section,
  eyebrow,
  title,
  description,
  color = 'green',
}: LearnSectionHeroProps) {
  const t = SECTION_THEME[color];

  return (
    <header className="border-b-4 border-text mb-12">
      <div className="px-4 sm:px-6 lg:px-0 py-10 md:py-14">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
          <motion.nav variants={slideUpVariants} className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-muted font-mono">
              <li>
                <Link
                  href="/learn"
                  className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                >
                  Learn
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">
                <span className="text-text font-semibold">{section}</span>
              </li>
            </ol>
          </motion.nav>

          <motion.div
            variants={slideUpVariants}
            className={`mb-6 inline-block border-4 ${t.border} bg-surface px-6 py-2`}
          >
            <p className={`text-sm font-bold uppercase tracking-wider ${t.text}`}>
              {eyebrow}
            </p>
          </motion.div>

          <motion.h1
            variants={slideUpVariants}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            {title}
          </motion.h1>

          <motion.div
            className={`h-1 ${t.line} mb-8 origin-left`}
            style={{ maxWidth: '200px' }}
            aria-hidden="true"
            variants={drawLineVariants}
          />

          <motion.p
            variants={slideUpVariants}
            className="text-xl text-muted max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </header>
  );
}
