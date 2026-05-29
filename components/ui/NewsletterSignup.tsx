'use client';

import { useState, FormEvent } from 'react';

/**
 * NewsletterSignup — free-content -> free-newsletter capture (the top of the
 * funnel). Provider-agnostic: when NEXT_PUBLIC_NEWSLETTER_ENDPOINT is set, the
 * email is POSTed to that endpoint (Buttondown / ConvertKit / beehiiv embed,
 * etc.); when it is unset, it gracefully falls back to a mailto: link so the
 * form is never dead.
 *
 * SSG-safe: this is a client island that uses fetch() (governed by the CSP
 * connect-src — NOT a native form POST, which form-action 'self' would block).
 * The provider origin must be added to connect-src in next.config.ts.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
const FALLBACK_EMAIL = 'dakota@twofold.tech';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');

    // No provider configured → fall back to opening the user's mail client.
    if (!ENDPOINT) {
      const subject = encodeURIComponent('Newsletter Signup');
      const body = encodeURIComponent(
        `I'd like to subscribe to blog updates.\n\nEmail: ${email}`
      );
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      setStatus('success');
      setEmail('');
      return;
    }

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

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3" role="status" aria-live="polite">
        <svg
          className="h-5 w-5 flex-shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="text-sm font-semibold text-text">
          {ENDPOINT
            ? "You're in. Check your inbox to confirm the subscription."
            : 'Your email client should open — send the email to complete signup.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
      {/* Left — copy */}
      <div className="flex-shrink-0">
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-muted">
          The agentic engineering brief
        </p>
        <p className="max-w-xs text-sm text-muted">
          New patterns, harness teardowns, and the occasional deep-dive. Free,
          no spam, unsubscribe anytime.
        </p>
      </div>

      {/* Right — form */}
      <form onSubmit={handleSubmit} className="flex max-w-md flex-1 gap-0">
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
          placeholder="your@email.com"
          disabled={status === 'submitting'}
          aria-invalid={status === 'error'}
          className="min-w-0 flex-1 border-2 border-text/20 bg-background px-4 py-3 text-sm text-text transition-colors placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="border-2 border-accent bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition-all duration-150 hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-sm font-semibold text-chapter-6" role="alert">
          Something went wrong. Try again, or email {FALLBACK_EMAIL}.
        </p>
      )}
    </div>
  );
}
