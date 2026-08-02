'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type {
  LearnNavigationItem,
  LearnSectionNavigation,
} from '@/components/learn/LearnNavigationTypes';

interface LearnMobileNavProps extends LearnSectionNavigation {
  className?: string;
}

interface ExpansionOverride {
  pathname: string;
  href: string | null;
}

function findCurrentLabel(
  pathname: string,
  overviewHref: string,
  overviewLabel: string,
  items: LearnNavigationItem[]
) {
  if (pathname === overviewHref) return overviewLabel;

  for (const item of items) {
    if (pathname === item.href) return item.label;
    const child = item.children?.find((candidate) => candidate.href === pathname);
    if (child) return child.label;
  }

  return overviewLabel;
}

function containsPath(item: LearnNavigationItem, pathname: string) {
  return item.href === pathname || item.children?.some((child) => child.href === pathname) === true;
}

export function LearnMobileNav({
  title,
  overviewHref,
  overviewLabel,
  utilityItems = [],
  items,
  className = '',
}: LearnMobileNavProps) {
  const pathname = usePathname();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const activeGroup = items.find((item) => containsPath(item, pathname))?.href ?? null;
  const [expansionOverride, setExpansionOverride] = useState<ExpansionOverride | null>(null);
  const expandedHref =
    expansionOverride?.pathname === pathname ? expansionOverride.href : activeGroup;
  const currentLabel = findCurrentLabel(pathname, overviewHref, overviewLabel, [
    ...utilityItems,
    ...items,
  ]);

  const linkClass = (href: string) =>
    `flex min-h-11 items-center gap-3 border-l px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
      pathname === href
        ? 'border-accent bg-background font-semibold text-text'
        : 'border-rule text-muted hover:border-text hover:text-text'
    }`;

  return (
    <div className={`xl:hidden ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-12 w-full items-center justify-between gap-4 border-y border-rule bg-surface px-4 py-3 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <span className="min-w-0 truncate">
          <span className="text-muted">{title}</span>
          <span className="mx-2 text-rule" aria-hidden="true">
            /
          </span>
          {currentLabel}
        </span>
        <span className="shrink-0 text-[0.68rem] uppercase tracking-[0.08em] text-muted">
          {isOpen ? 'Close' : 'Browse'}
        </span>
      </button>

      {isOpen ? (
        <nav
          id={panelId}
          aria-label={`${title} mobile syllabus`}
          className="max-h-[65vh] overflow-y-auto border-b border-rule bg-surface py-3"
        >
          <ul>
            <li>
              <Link
                href={overviewHref}
                aria-current={pathname === overviewHref ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                className={linkClass(overviewHref)}
              >
                {overviewLabel}
              </Link>
            </li>
            {utilityItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={linkClass(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ol className="mt-2 border-t border-rule pt-2">
            {items.map((item) => {
              const isExpanded = expandedHref === item.href;
              const hasChildren = Boolean(item.children?.length);

              return (
                <li key={item.href}>
                  <div className="flex items-stretch">
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`${linkClass(item.href)} min-w-0 flex-1`}
                    >
                      {item.marker ? (
                        <span
                          className="w-6 shrink-0 text-xs tabular-nums text-muted"
                          aria-hidden="true"
                        >
                          {item.marker}
                        </span>
                      ) : null}
                      {item.label}
                    </Link>
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
                        onClick={() =>
                          setExpansionOverride({
                            pathname,
                            href: isExpanded ? null : item.href,
                          })
                        }
                        className="min-h-11 w-16 border-l border-rule text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                      >
                        {isExpanded ? 'Close' : 'Open'}
                      </button>
                    ) : null}
                  </div>

                  {hasChildren && isExpanded ? (
                    <ul className="ml-7 border-l border-rule py-1">
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={pathname === child.href ? 'page' : undefined}
                            onClick={() => setIsOpen(false)}
                            className={linkClass(child.href)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
