'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type {
  LearnNavigationItem,
  LearnSectionNavigation,
} from '@/components/learn/LearnNavigationTypes';

interface ExpansionOverride {
  pathname: string;
  href: string | null;
}

function containsPath(item: LearnNavigationItem, pathname: string) {
  return item.href === pathname || item.children?.some((child) => child.href === pathname) === true;
}

function NavigationLink({ item, pathname }: { item: LearnNavigationItem; pathname: string }) {
  const isCurrent = item.href === pathname;

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? 'page' : undefined}
      className={`flex min-h-11 items-center gap-3 border-l px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
        isCurrent
          ? 'border-accent bg-surface/60 font-semibold text-text'
          : 'border-rule text-muted hover:border-text hover:text-text'
      }`}
    >
      {item.marker ? (
        <span className="w-6 shrink-0 text-xs tabular-nums text-muted" aria-hidden="true">
          {item.marker}
        </span>
      ) : null}
      <span>{item.label}</span>
    </Link>
  );
}

export function LearnSidebar({
  title,
  overviewHref,
  overviewLabel,
  utilityItems = [],
  items,
}: LearnSectionNavigation) {
  const pathname = usePathname();
  const activeGroup = items.find((item) => containsPath(item, pathname))?.href ?? null;
  const [expansionOverride, setExpansionOverride] = useState<ExpansionOverride | null>(null);
  const expandedHref =
    expansionOverride?.pathname === pathname ? expansionOverride.href : activeGroup;

  return (
    <nav
      aria-label={`${title} syllabus`}
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-5"
    >
      <div className="border-b border-rule pb-4">
        <Link
          href={overviewHref}
          aria-current={pathname === overviewHref ? 'page' : undefined}
          className="text-lg font-semibold text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {title}
        </Link>
        <p className="mt-1 text-sm text-muted">{overviewLabel}</p>
      </div>

      {utilityItems.length > 0 ? (
        <ul className="border-b border-rule py-3">
          {utilityItems.map((item) => (
            <li key={item.href}>
              <NavigationLink item={item} pathname={pathname} />
            </li>
          ))}
        </ul>
      ) : null}

      <ol className="py-3">
        {items.map((item) => {
          const isExpanded = expandedHref === item.href;
          const hasChildren = Boolean(item.children?.length);
          const groupIsCurrent = containsPath(item, pathname);

          return (
            <li key={item.href}>
              <div className="flex items-stretch">
                <div className="min-w-0 flex-1">
                  <NavigationLink item={item} pathname={pathname} />
                </div>
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
                    className={`min-h-11 w-12 border-l border-rule text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                      groupIsCurrent ? 'text-text' : 'text-muted'
                    }`}
                  >
                    {isExpanded ? 'Close' : 'Open'}
                  </button>
                ) : null}
              </div>

              {hasChildren && isExpanded ? (
                <ul className="ml-6 border-l border-rule py-1">
                  {item.children?.map((child) => (
                    <li key={child.href}>
                      <NavigationLink item={child} pathname={pathname} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
