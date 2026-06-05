'use client';

import { useId, useRef, useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { GLOSSARY_TERMS } from '@/lib/onramp-types';
import { slugify } from '@/lib/utils';

interface GlossaryTermProps {
  /** Canonical term for lookup; set by the rehype auto-glossary plugin. */
  term?: string;
  children?: ReactNode;
}

function childText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childText).join('');
  return '';
}

/**
 * GlossaryTerm — an accessible "define on first use" toggletip.
 *
 * Rendered for first-use jargon (auto-wrapped by lib/rehype-glossary, or used
 * directly in MDX). It is a click-activated toggletip, not a hover tooltip:
 * a real <button aria-expanded aria-controls> reveals a panel with the plain-
 * English definition and a deep link into the Decoder. Dismissed by Escape,
 * an outside click, or toggling the button — the WCAG-1.4.13-safe pattern that
 * also works on touch. The canonical term is looked up from the children text,
 * so it works even if the `term` prop does not survive the MDX pipeline; if no
 * glossary entry matches, the children render untouched. Colours are tokens.
 */
export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const key = (term || childText(children)).trim().toLowerCase();
  const entry = GLOSSARY_TERMS.find((t) => t.term.toLowerCase() === key);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    function onPointer(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  // No matching glossary entry — leave the text exactly as it was.
  if (!entry) return <>{children}</>;

  const anchor = `/learn/start/decoder#term-${slugify(entry.term)}`;

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="inline cursor-help border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] leading-[inherit] text-text underline decoration-dotted decoration-chapter-5 decoration-2 underline-offset-4 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        {children}
      </button>
      {open && (
        <span
          id={panelId}
          role="note"
          className="not-prose absolute left-0 top-full z-50 mt-2 block w-72 max-w-[calc(100vw-2rem)] border-2 border-chapter-5 bg-surface p-4 text-left shadow-[4px_4px_0_0_var(--color-text)]"
        >
          <span className="mb-1 block font-mono text-sm font-bold text-chapter-5">
            {entry.term}
          </span>
          <span className="mb-2 block text-xs leading-relaxed text-muted">{entry.analogy}</span>
          <span className="mb-3 block text-xs leading-relaxed text-text">{entry.definition}</span>
          <Link
            href={anchor}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-chapter-5 underline decoration-2 underline-offset-2 hover:decoration-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Full definition →
          </Link>
        </span>
      )}
    </span>
  );
}
