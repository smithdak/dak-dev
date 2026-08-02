'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

interface ShareActionsProps {
  title: string;
  url: string;
  excerpt: string;
}

const actionClass =
  'inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.1em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent';

const subscribeToShareCapability = () => () => undefined;
const getShareCapability = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

export function ShareActions({ title, url, excerpt }: ShareActionsProps) {
  const shareSupported = useSyncExternalStore(
    subscribeToShareCapability,
    getShareCapability,
    () => false
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    []
  );

  const resetCopyStatusLater = () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setCopyStatus('idle');
      resetTimer.current = null;
    }, 2000);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    resetCopyStatusLater();
  };

  return (
    <>
      {shareSupported ? (
        <button type="button" onClick={handleNativeShare} className={actionClass}>
          Device share
        </button>
      ) : null}
      <button type="button" onClick={handleCopyLink} className={actionClass}>
        {copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy link'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copyStatus === 'copied'
          ? 'Link copied to clipboard.'
          : copyStatus === 'failed'
            ? 'The link could not be copied.'
            : ''}
      </span>
    </>
  );
}
