'use client';

import Link from 'next/link';
import * as m from 'framer-motion/m';

interface TagProps {
  tag: string;
  interactive?: boolean;
  className?: string;
  count?: number;
}

/**
 * Tag component for blog post categories
 * Can be interactive (link) or static (display only)
 */
export function Tag({ tag, interactive = true, className = '', count }: TagProps) {
  const baseStyles =
    'inline-block border-b border-text/20 px-0.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200';
  const interactiveStyles =
    'text-muted hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';
  const staticStyles = 'text-muted';

  const classNames = [baseStyles, interactive ? interactiveStyles : staticStyles, className].join(
    ' '
  );

  // Generate slug from tag (lowercase, replace spaces with hyphens)
  const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');

  if (interactive) {
    return (
      <m.span whileTap={{ scale: 0.98 }}>
        <Link href={`/blog/tags/${tagSlug}`} className={classNames}>
          #{tag}
          {count !== undefined && ` (${count})`}
        </Link>
      </m.span>
    );
  }

  return (
    <span className={classNames}>
      #{tag}
      {count !== undefined && ` (${count})`}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  interactive?: boolean;
  className?: string;
}

/**
 * TagList component for displaying multiple tags
 */
export function TagList({ tags, interactive = true, className = '' }: TagListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} interactive={interactive} />
      ))}
    </div>
  );
}
