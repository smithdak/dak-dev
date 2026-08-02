import Link from 'next/link';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

const footerNavigation = [
  { name: 'Writing', href: '/blog' },
  { name: 'Learn', href: '/learn' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
] as const;

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/dakota-smith-a855b230' },
  { name: 'GitHub', href: 'https://github.com/smithdak' },
  { name: 'RSS', href: '/feed.xml' },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-rule bg-background">
      <div className="site-stage py-12 lg:py-16">
        <NewsletterSignup />
      </div>

      <div className="site-stage grid gap-10 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Link
            href="/"
            className="font-serif text-[1.75rem] font-medium tracking-[-0.035em] text-text transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
          >
            Dakota Smith
          </Link>
          <p className="mt-2 text-sm text-muted">
            AI Systems Architect &amp; Full-Stack Engineer · daksmith.dev
          </p>
          <p className="mt-6 text-xs text-muted">
            &copy; {currentYear} Dakota Smith. All rights reserved.
          </p>
        </div>

        <div className="space-y-5 md:text-right">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end"
            aria-label="Footer navigation"
          >
            {footerNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="editorial-link text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="editorial-link text-sm text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/about#contact"
              className="editorial-link text-sm text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-3 focus:ring-offset-background"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
