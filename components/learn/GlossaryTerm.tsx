import type { ReactNode } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

interface GlossaryTermProps {
  /** Canonical entry data injected at build time by rehype-glossary. */
  term?: string;
  analogy?: string;
  definition?: string;
  children?: ReactNode;
}

function childText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childText).join('');
  return '';
}

/**
 * GlossaryTerm — an accessible "define on first use" popover.
 *
 * Rendered for first-use jargon (auto-wrapped by lib/rehype-glossary, or used
 * directly in MDX). A real button targets a native HTML popover containing the
 * plain-English definition and a deep link into the Decoder. The browser owns
 * focus, Escape, and light-dismiss behavior without a hydrated state machine.
 * The build-time rehype pass sends only the matched entry instead of shipping
 * the full glossary registry to every MDX route. If entry data is missing, the
 * children render untouched. Colours are tokens.
 */
export function GlossaryTerm({ term, analogy, definition, children }: GlossaryTermProps) {
  const canonicalTerm = (term || childText(children)).trim();

  // No injected glossary entry — leave the text exactly as it was.
  if (!canonicalTerm || !analogy || !definition) return <>{children}</>;

  const slug = slugify(canonicalTerm);
  const anchor = `/learn/start/decoder#term-${slug}`;
  const panelId = `glossary-${slug}`;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        popoverTarget={panelId}
        className="inline cursor-help border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] leading-[inherit] text-text underline decoration-dotted decoration-chapter-5 decoration-2 underline-offset-4 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        {children}
      </button>
      <span
        id={panelId}
        popover="auto"
        role="note"
        className="not-prose fixed inset-x-4 bottom-4 top-auto z-50 m-0 max-h-[calc(100dvh-2rem)] w-auto max-w-none overflow-y-auto overscroll-contain border border-text/20 bg-background p-5 text-left text-text shadow-2xl backdrop:bg-background/70 sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-80 sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        <span className="mb-1 block font-mono text-sm font-bold text-chapter-5">
          {canonicalTerm}
        </span>
        <span className="mb-2 block text-xs leading-relaxed text-muted">{analogy}</span>
        <span className="mb-4 block text-xs leading-relaxed text-text">{definition}</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={anchor}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-chapter-5 underline decoration-2 underline-offset-2 hover:decoration-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Full definition
          </Link>
          <button
            type="button"
            popoverTarget={panelId}
            popoverTargetAction="hide"
            className="text-[11px] font-bold uppercase tracking-wider text-muted underline underline-offset-2 hover:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Close
          </button>
        </span>
      </span>
    </span>
  );
}
