'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt: string;
  className?: string;
  variant?: 'inline' | 'dropdown';
}

const actionClass =
  'inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.1em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent';

const subscribeToShareCapability = () => () => undefined;
const getShareCapability = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

export function ShareButtons({
  title,
  url,
  excerpt,
  className = '',
  variant = 'inline',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareSupported = useSyncExternalStore(
    subscribeToShareCapability,
    getShareCapability,
    () => false
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'dropdown') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=daksmitty`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      // Closing the system share sheet is not an error state for the page.
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const actions = (
    <>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
        X
      </a>
      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
        LinkedIn
      </a>
      {shareSupported ? (
        <button type="button" onClick={handleNativeShare} className={actionClass}>
          Device share
        </button>
      ) : null}
      <button type="button" onClick={handleCopyLink} className={actionClass} aria-live="polite">
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </>
  );

  if (variant === 'dropdown') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="share-menu"
          className="inline-flex min-h-11 items-center border-b border-text/30 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Share
        </button>
        {isOpen ? (
          <div
            id="share-menu"
            className="absolute right-0 top-full z-50 mt-2 flex min-w-44 flex-col items-start gap-1 border border-text/20 bg-background p-4 shadow-xl"
          >
            {actions}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 ${className}`}>{actions}</div>
  );
}
