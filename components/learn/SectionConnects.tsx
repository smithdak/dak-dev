import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface ConnectLink {
  label: string;
  href: string;
  kind: string;
}

interface SectionConnectsProps {
  id: string;
  color: SectionColor;
  heading: string;
  intro: string;
  links: ConnectLink[];
}

/**
 * The cross-link grid that keeps the four pillars one system, not four silos.
 * Section-coloured header rule; reveals on scroll. Shared by all three
 * sections so "Where This Connects" reads identically everywhere.
 */
export function SectionConnects({
  id,
  color,
  heading,
  intro,
  links,
}: SectionConnectsProps) {
  const t = SECTION_THEME[color];
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mt-20 px-4 sm:px-6 lg:px-0 scroll-mt-20"
    >
      <ScrollReveal>
        <div
          className={`border-l-8 ${t.borderLeft} border-b-2 border-text/30 pl-5 pb-4 mb-8`}
        >
          <h2
            id={headingId}
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            {heading}
          </h2>
          <p className="text-sm text-muted mt-2 max-w-3xl leading-relaxed">
            {intro}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center justify-between gap-3 border-2 border-text/30 bg-surface/40 px-4 py-3 transition-all duration-150 hover:border-text hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              <span className="text-sm font-semibold truncate group-hover:text-accent transition-colors">
                {c.label}
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest ${t.text} shrink-0 opacity-70`}
              >
                {c.kind}
              </span>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
