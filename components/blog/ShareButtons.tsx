import { ShareActions } from '@/components/blog/ShareActions';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt: string;
  className?: string;
}

const actionClass =
  'inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.1em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent';

/**
 * Static share controls with a native-popover shell. Only clipboard and Web
 * Share capability detection cross the client boundary in ShareActions.
 */
export function ShareButtons({ title, url, excerpt, className = '' }: ShareButtonsProps) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=daksmitty`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const popoverId = 'share-article';

  return (
    <div className={className}>
      <button
        type="button"
        popoverTarget={popoverId}
        className="inline-flex min-h-11 items-center border-b border-text/30 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Share
      </button>
      <div
        id={popoverId}
        popover="auto"
        role="group"
        aria-label="Share article"
        className="fixed inset-x-4 bottom-4 top-auto z-50 m-0 w-auto max-w-none border border-text/20 bg-background p-5 text-text shadow-2xl backdrop:bg-background/70 sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-72 sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        <div className="flex flex-col items-start gap-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Share article
          </p>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
            X
          </a>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
            LinkedIn
          </a>
          <ShareActions title={title} url={url} excerpt={excerpt} />
          <button
            type="button"
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            className={`${actionClass} mt-2`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
