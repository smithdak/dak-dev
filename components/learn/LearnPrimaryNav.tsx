'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LEARN_DESTINATIONS = [
  { label: 'Overview', href: '/learn', matches: (pathname: string) => pathname === '/learn' },
  {
    label: 'Foundations',
    href: '/learn/start',
    matches: (pathname: string) => pathname.startsWith('/learn/start'),
  },
  {
    label: 'Patterns',
    href: '/learn/patterns',
    matches: (pathname: string) => pathname.startsWith('/learn/patterns'),
  },
  {
    label: 'Toolkit',
    href: '/learn/toolkit',
    matches: (pathname: string) => pathname.startsWith('/learn/toolkit'),
  },
  {
    label: 'Harness',
    href: '/learn/harness',
    matches: (pathname: string) => pathname.startsWith('/learn/harness'),
  },
  {
    label: 'Security',
    href: '/learn/security',
    matches: (pathname: string) => pathname.startsWith('/learn/security'),
  },
] as const;

export function LearnPrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Learn">
      <ul className="grid grid-cols-3 lg:flex lg:gap-7">
        {LEARN_DESTINATIONS.map((destination) => {
          const isCurrent = destination.matches(pathname);

          return (
            <li key={destination.href}>
              <Link
                href={destination.href}
                aria-current={
                  isCurrent ? (pathname === destination.href ? 'page' : 'location') : undefined
                }
                className={`flex min-h-12 items-center justify-center border-b-2 px-1 text-center text-xs font-semibold leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-2 sm:text-sm sm:leading-5 lg:justify-start lg:px-0 lg:text-left ${
                  isCurrent
                    ? 'border-accent text-text'
                    : 'border-transparent text-muted hover:border-rule hover:text-text'
                }`}
              >
                {destination.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
