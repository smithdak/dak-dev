'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';

const loadMotionFeatures = () => import('./motion-features').then((module) => module.default);

interface MotionProviderProps {
  children: ReactNode;
}

/** Keeps the reduced-motion policy global while deferring animation features. */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
