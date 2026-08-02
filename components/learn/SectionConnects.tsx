import Link from 'next/link';
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

/** Cross-references the four Learn fields without turning them into a card wall. */
export function SectionConnects({ id, color, heading, intro, links }: SectionConnectsProps) {
  const theme = SECTION_THEME[color];
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="mt-24 scroll-mt-24">
      <div className="grid gap-8 border-t border-text/20 pt-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-14">
        <div>
          <h2
            id={headingId}
            className="font-display text-3xl leading-tight tracking-tight md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{intro}</p>
        </div>

        <ul className="border-t border-text/20">
          {links.map((link) => (
            <li key={link.href} className="border-b border-text/20">
              <Link
                href={link.href}
                className="group grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-4 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              >
                <span className="font-display text-xl leading-tight group-hover:underline group-hover:underline-offset-4">
                  {link.label}
                </span>
                <span className={`text-xs font-semibold ${theme.text}`}>{link.kind}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
