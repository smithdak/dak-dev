import Link from 'next/link';
import { SECTION_THEME, type SectionColor } from './sectionTheme';

interface LearnSectionHeroProps {
  section: string;
  eyebrow: string;
  title: string;
  description: string;
  color?: SectionColor;
}

/** Editorial masthead shared by each Learn field. */
export function LearnSectionHero({
  section,
  eyebrow,
  title,
  description,
  color = 'green',
}: LearnSectionHeroProps) {
  const theme = SECTION_THEME[color];

  return (
    <header className="mb-10 border-b border-text/20 px-4 pb-9 pt-6 sm:px-6 md:mb-14 md:pb-12 md:pt-10 lg:px-0">
      <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <li>
            <Link
              href="/learn"
              className="underline-offset-4 transition-colors hover:text-text hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              Learn
            </Link>
          </li>
          <li aria-hidden="true" className="text-text/30">
            /
          </li>
          <li aria-current="page" className="text-text">
            {section}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(16rem,1fr)] lg:items-end lg:gap-16">
        <h1 className="font-display max-w-4xl text-balance text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <div className="border-t border-rule pt-5 lg:pb-1">
          <p className={`text-sm font-semibold ${theme.text}`}>{eyebrow}</p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
        </div>
      </div>
    </header>
  );
}
