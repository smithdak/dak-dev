'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const SearchDialog = dynamic(
  () => import('@/components/ui/SearchDialog').then((module) => module.SearchDialog),
  { ssr: false }
);

function isVisible(element: HTMLElement | null): element is HTMLElement {
  return element !== null && element.isConnected && element.getClientRects().length > 0;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActivated, setSearchActivated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopSearchRef = useRef<HTMLButtonElement>(null);
  const mobileSearchRef = useRef<HTMLButtonElement>(null);
  const searchOpenRef = useRef(false);
  const searchReturnTargetRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const visibleSearchControl = useCallback(
    () =>
      [desktopSearchRef.current, mobileSearchRef.current, mobileMenuButtonRef.current].find(
        isVisible
      ) ?? null,
    []
  );

  const openSearch = useCallback(
    (trigger: HTMLElement | null = null) => {
      searchReturnTargetRef.current = isVisible(trigger) ? trigger : visibleSearchControl();
      searchOpenRef.current = true;
      setSearchActivated(true);
      setSearchOpen(true);
    },
    [visibleSearchControl]
  );

  const closeSearch = useCallback((restoreFocus = true) => {
    searchOpenRef.current = false;
    setSearchOpen(false);

    if (!restoreFocus) return;

    requestAnimationFrame(() => {
      const returnTarget = [
        searchReturnTargetRef.current,
        desktopSearchRef.current,
        mobileSearchRef.current,
        mobileMenuButtonRef.current,
      ].find(isVisible);
      returnTarget?.focus();
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch(visibleSearchControl());
        return;
      }

      if (event.key !== 'Escape') return;

      // Header owns Escape synchronously, including while the lazy dialog
      // chunk is loading and while its exit animation is in progress.
      if (searchOpenRef.current) {
        event.preventDefault();
        event.stopPropagation();
        closeSearch();
        return;
      }

      if (!mobileMenuOpen || event.defaultPrevented) return;

      event.preventDefault();
      setMobileMenuOpen(false);
      requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [closeSearch, mobileMenuOpen, openSearch, visibleSearchControl]);

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
              <Search
                ref={desktopSearchRef}
                expanded={searchOpen}
                onOpen={openSearch}
                className="editorial-search-trigger !border-0 !bg-transparent !px-2 !font-normal !shadow-none hover:!bg-surface hover:!text-text"
              />
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
                  <Search
                    ref={mobileSearchRef}
                    expanded={searchOpen}
                    onOpen={openSearch}
                    className="w-full !justify-start !border-0 !bg-transparent !px-1 !font-semibold !shadow-none hover:!text-accent"
                  />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>

      {searchActivated && <SearchDialog open={searchOpen} onClose={closeSearch} />}
    </header>
  );
}
