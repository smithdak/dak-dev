'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import * as m from 'framer-motion/m';
import { Search } from '@/components/ui/Search';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
  { name: 'Writing', href: '/blog', match: '/blog' },
  { name: 'Learn', href: '/learn', match: '/learn' },
  { name: 'Work', href: '/work', match: '/work' },
  { name: 'About', href: '/about', match: '/about' },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      // A nested dialog owns Escape while it is open. Closing the menu at the
      // same time would unmount its search trigger before focus can return.
      if (
        event.defaultPrevented ||
        event.key !== 'Escape' ||
        document.querySelector('[role="dialog"]')
      )
        return;

      setMobileMenuOpen(false);
      requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (match: string | null) =>
    match ? pathname === match || pathname.startsWith(`${match}/`) : false;

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-background">
      <nav className="site-stage" aria-label="Main navigation">
        <div className="flex h-[var(--layout-header-height)] items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[1.75rem] font-medium leading-none tracking-[-0.035em] text-text transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background sm:text-[1.9rem]"
          >
            Dakota Smith
          </Link>

          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-1 lg:gap-4">
              {navigation.map((item) => {
                const active = isActive(item.match);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative inline-flex min-h-11 items-center px-3 py-2 text-[0.95rem] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
                      active ? 'text-text' : 'text-text/75 hover:text-accent'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                    {active && (
                      <span
                        className="absolute inset-x-3 bottom-1 h-px bg-accent"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="ml-5 flex items-center gap-1 border-l border-rule pl-5">
              <Search className="editorial-search-trigger !border-0 !bg-transparent !px-2 !font-normal !shadow-none hover:!bg-surface hover:!text-text" />
              <ThemeToggle className="!border-0 !bg-transparent !shadow-none hover:!bg-surface hover:!shadow-none" />
            </div>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle className="!border-0 !bg-transparent !shadow-none hover:!bg-surface hover:!shadow-none" />
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold text-text transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <m.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-rule md:hidden"
            >
              <div className="divide-y divide-rule py-2">
                {navigation.map((item) => {
                  const active = isActive(item.match);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-12 items-center justify-between px-1 py-3 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent ${
                        active ? 'text-accent' : 'text-text hover:text-accent'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="py-3">
                  <Search className="w-full !justify-start !border-0 !bg-transparent !px-1 !font-semibold !shadow-none hover:!text-accent" />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
