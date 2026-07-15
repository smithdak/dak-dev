'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants, slideUpVariants, drawLineVariants } from '@/lib/animations';

import { TextDecode } from '@/components/ui/TextDecode';
import Link from 'next/link';

/**
 * Hero section for the homepage
 * Client component to support interactive Button with Framer Motion
 * Staggered entrance animation for first impression
 */
export function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center border-b-4 border-text patterns-grid-bg-depth overflow-hidden">
      {/* Scanline sweep */}
      <div className="hero-scanline z-[1]" aria-hidden="true" />

      {/* Corner marks + coordinate labels */}
      <div className="absolute z-[2] top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-accent/40" aria-hidden="true" />
      <span className="hero-coord z-[2] top-4 left-14" aria-hidden="true">0,0</span>
      <div className="absolute z-[2] top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent/40" aria-hidden="true" />
      <span className="hero-coord z-[2] top-4 right-14" aria-hidden="true">1,0</span>
      <div className="absolute z-[2] bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent/40" aria-hidden="true" />
      <span className="hero-coord z-[2] bottom-4 left-14" aria-hidden="true">0,1</span>
      <div className="absolute z-[2] bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-accent/40" aria-hidden="true" />
      <span className="hero-coord z-[2] bottom-4 right-14" aria-hidden="true">1,1</span>

      {/* Grid intersection accent dots */}
      <div className="hero-grid-dot z-[1]" style={{ top: '25%', left: '20%' }} aria-hidden="true" />
      <div className="hero-grid-dot z-[1]" style={{ top: '70%', left: '65%', animationDelay: '1.5s' }} aria-hidden="true" />
      <div className="hero-grid-dot z-[1]" style={{ top: '15%', left: '80%', animationDelay: '2.8s' }} aria-hidden="true" />
      <div className="hero-grid-dot z-[1]" style={{ top: '85%', left: '40%', animationDelay: '0.8s' }} aria-hidden="true" />
      <div className="hero-grid-dot z-[1]" style={{ top: '45%', left: '90%', animationDelay: '3.5s' }} aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="max-w-4xl"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting */}
          <motion.div variants={slideUpVariants} className="mb-6 inline-block border-4 border-accent bg-surface px-6 py-2">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              Software Engineer
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={slideUpVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <TextDecode text="Dakota Smith" delay={400} />
          </motion.h1>

          {/* Decorative accent line */}
          <motion.div
            className="h-1 bg-accent mb-8 origin-left"
            style={{ maxWidth: '200px' }}
            aria-hidden="true"
            variants={drawLineVariants}
          />

          {/* Bio */}
          <motion.p variants={slideUpVariants} className="text-xl md:text-2xl text-muted mb-8 leading-relaxed max-w-3xl">
            I build things that build things. Agentic systems, AI tooling, and
            enterprise digital solutions.
          </motion.p>

          {/* Social Links */}
          <motion.div variants={slideUpVariants} className="flex flex-wrap gap-4 mb-8">
            <a
              href="https://github.com/smithdak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-text px-4 py-2 text-sm font-semibold hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          </motion.div>

          {/* CTA Link */}
          <motion.div variants={slideUpVariants}>
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center font-semibold px-8 py-4 text-lg gap-3 bg-transparent text-accent border-4 border-accent hover:bg-accent hover:text-background shadow-[4px_4px_0_0_var(--color-accent)] hover:shadow-[6px_6px_0_0_var(--color-accent)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              Read My Articles
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
