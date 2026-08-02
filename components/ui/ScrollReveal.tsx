'use client';

import type { Variants } from 'framer-motion';
import * as m from 'framer-motion/m';
import type { ReactNode } from 'react';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

const singleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface ScrollRevealProps {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
}

export function ScrollReveal({ children, stagger = false, className }: ScrollRevealProps) {
  return (
    <m.div
      variants={stagger ? staggerContainerVariants : singleVariants}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface ScrollRevealItemProps {
  children: ReactNode;
  className?: string;
}

export function ScrollRevealItem({ children, className }: ScrollRevealItemProps) {
  return (
    <m.div variants={staggerItemVariants} className={className}>
      {children}
    </m.div>
  );
}
