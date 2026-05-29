'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * ScrollStory — scroll-driven storytelling for narrative/architecture sections.
 *
 * The right column holds the canonical prose (one block per step) and is the
 * source of truth: it renders fully without JS and reads cleanly for screen
 * readers and RSS. The left panel is a sticky, aria-hidden visual that tracks
 * whichever step is currently centered in the viewport — pure reinforcement.
 *
 * Usage in MDX — steps is a single-quoted JSON STRING LITERAL (the FlowDiagram
 * convention). The `{JSON.stringify([…])}` expression form does NOT evaluate in
 * this RSC MDX path, so use a literal string:
 *   <ScrollStory
 *     eyebrow="How a harness boots"
 *     steps='[{"title":"Load the system prompt","body":"The harness assembles…"}]'
 *   />
 *
 * Motion inherits the global <MotionConfig reducedMotion="user"> contract; the
 * step-tracking observer also short-circuits to "first step active" when the
 * user prefers reduced motion. Colors are design tokens only (DESIGN.md §6.1).
 */

interface Step {
  title: string;
  body: string;
}

interface ScrollStoryProps {
  /** JSON-encoded array of { title, body } steps. */
  steps: string;
  eyebrow?: string;
}

export function ScrollStory({ steps, eyebrow }: ScrollStoryProps) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  let parsed: Step[] = [];
  try {
    const value = JSON.parse(steps);
    if (Array.isArray(value)) parsed = value;
  } catch {
    parsed = [];
  }

  useEffect(() => {
    // With reduced motion we don't drive a moving narrative; `active` stays at
    // its default (0) and no scroll observer is attached.
    if (prefersReducedMotion) return;
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the vertical center of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = Number((visible[0].target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [parsed.length, prefersReducedMotion]);

  if (parsed.length === 0) return null;

  return (
    <section
      className="my-10 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12"
      aria-label={eyebrow || 'Scroll-driven walkthrough'}
    >
      {/* Sticky visual — decorative reinforcement, hidden from a11y tree.
          The grid item ITSELF is sticky + self-start, so it sticks within the
          grid container (whose height is driven by the tall content column)
          instead of relying on a stretched wrapper. This is robust inside
          nested grids — e.g. the harness page's outer lg:grid. */}
      <div
        className="hidden border-4 border-text bg-surface/40 p-6 md:block md:self-start md:sticky md:top-28"
        aria-hidden="true"
      >
        {eyebrow && (
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
        )}
        <div
          className="font-mono text-7xl font-bold leading-none tabular-nums"
          style={{ color: 'var(--color-accent)' }}
        >
          {String(active + 1).padStart(2, '0')}
        </div>
        <div className="mt-4 h-1 w-full bg-text/15">
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
            animate={{
              width: `${((active + 1) / parsed.length) * 100}%`,
            }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="mt-4 min-h-[3.5rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-text"
            >
              {parsed[active]?.title}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-3 font-mono text-xs text-muted tabular-nums">
          step {active + 1} / {parsed.length}
        </p>
      </div>

      {/* Canonical scrolling content */}
      <ol className="space-y-16 md:space-y-32">
        {parsed.map((step, i) => (
          <li
            key={i}
            data-index={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="border-l-4 pl-5 transition-colors duration-300"
            style={{
              borderColor:
                i === active && !prefersReducedMotion
                  ? 'var(--color-accent)'
                  : 'color-mix(in srgb, var(--color-text) 25%, transparent)',
            }}
          >
            <p
              className="mb-2 font-mono text-xs font-bold tabular-nums"
              style={{ color: 'var(--color-accent)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-text">{step.title}</h3>
            <p className="leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
