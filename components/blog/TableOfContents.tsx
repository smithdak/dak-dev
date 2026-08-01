'use client';

import { useEffect, useState } from 'react';
import { TocItem } from '@/lib/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Table of Contents component
 * Shows heading navigation with active state based on scroll position
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    // Observe all headings
    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
        On this page
      </h2>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isH3 = item.level === 3;

          return (
            <li key={item.id} className={isH3 ? 'ml-3' : ''}>
              <a
                href={`#${item.id}`}
                className={`
                  block text-[13px] leading-relaxed py-1 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-accent
                  ${
                    isActive
                      ? 'text-text font-semibold border-l-2 border-accent pl-3'
                      : 'text-muted hover:text-text border-l border-text/10 pl-3 hover:border-text/30'
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', `#${item.id}`);
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
