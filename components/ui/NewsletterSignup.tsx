'use client';

import { useState, FormEvent } from 'react';

/**
 * Provider-agnostic publication follow-up. When
 * NEXT_PUBLIC_NEWSLETTER_ENDPOINT is set, the email is POSTed to that endpoint
 * (Buttondown / ConvertKit / beehiiv embed, etc.). Without a provider, the UI
 * offers the RSS feed and direct email instead of presenting a non-functional
 * subscription form.
 *
 * SSG-safe: this is a client island that uses fetch() (governed by the CSP
 * connect-src — NOT a native form POST, which form-action 'self' would block).
 * The provider origin must be added to connect-src in next.config.ts.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
const CONTACT_EMAIL = 'dakota@twofold.tech';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ENDPOINT || !email || !email.includes('@')) return;

    setStatus('submitting');

    try {
      // Opaque (no-cors) POST: most embed endpoints accept a urlencoded `email`
      // field and don't return CORS headers. We optimistically confirm on a
      // resolved request and only surface an error on a genuine network failure.
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (!ENDPOINT) {
    return (
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
        <div>
          <p className="font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-text sm:text-4xl">
            Follow the publication.
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
            Every published essay is available through RSS. For a direct professional conversation,
            email Dakota.
          </p>
        </div>

        <nav aria-label="Publication follow options" className="flex flex-wrap gap-x-8 gap-y-3">
          <a
            href="/feed.xml"
            className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background"
          >
            Open the RSS feed
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background"
          >
            Email Dakota
          </a>
        </nav>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="border-y border-rule py-8" role="status" aria-live="polite">
        <p className="font-serif text-3xl font-medium tracking-[-0.03em] text-text">
          Check your inbox.
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          The subscription request was sent. Complete any confirmation step from your email
          provider.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
      <div>
        <p className="font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-text sm:text-4xl">
          Notes on accountable AI systems.
        </p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
          New essays and field notes on building, governing, and delivering agentic systems.
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Email address"
            disabled={status === 'submitting'}
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
            className="min-h-12 min-w-0 flex-1 border border-rule bg-background px-4 py-3 text-base text-text transition-colors placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="min-h-12 bg-accent px-7 py-3 text-base font-semibold text-background transition-colors hover:bg-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending…' : 'Subscribe'}
          </button>
        </form>

        {status === 'error' && (
          <p
            id="newsletter-error"
            className="mt-3 text-sm font-semibold text-chapter-6"
            role="alert"
          >
            The request could not be sent. Try again, or email {CONTACT_EMAIL}.
          </p>
        )}
      </div>
    </div>
  );
}
