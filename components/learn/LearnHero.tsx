import Link from 'next/link';

interface LearnHeroProps {
  patternCount: number;
  chapterCount: number;
  toolkitTopicCount: number;
  harnessChapterCount: number;
  securityChapterCount: number;
}

interface Pillar {
  index: string;
  title: string;
  href: string;
  description: string;
  stat: string;
}

export function LearnHero({
  patternCount,
  chapterCount,
  toolkitTopicCount,
  harnessChapterCount,
  securityChapterCount,
}: LearnHeroProps) {
  const totalGuides = patternCount + toolkitTopicCount + harnessChapterCount + securityChapterCount;

  const pillars: Pillar[] = [
    {
      index: '01',
      title: 'Patterns',
      href: '/learn/patterns',
      description: 'Reference architectures and repeatable moves for AI-assisted engineering.',
      stat: `${patternCount} patterns · ${chapterCount} chapters`,
    },
    {
      index: '02',
      title: 'Toolkit',
      href: '/learn/toolkit',
      description: 'A source-backed comparison of Claude Code, Codex, and GitHub Copilot.',
      stat: `${toolkitTopicCount} capability guides`,
    },
    {
      index: '03',
      title: 'Harness',
      href: '/learn/harness',
      description: 'Runtime control beneath the model and accountable delivery control above it.',
      stat: `${harnessChapterCount} chapters · two layers`,
    },
    {
      index: '04',
      title: 'Security',
      href: '/learn/security',
      description: 'Trust surfaces: injection, secrets, permissions, data, and exfiltration.',
      stat: `${securityChapterCount} chapters`,
    },
  ];

  return (
    <header className="border-b border-text/15">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)] lg:gap-20 lg:px-8">
        <div>
          <p className="editorial-kicker mb-5">Learn · field guide</p>
          <h1 className="font-display max-w-3xl text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Practical knowledge for building agentic systems that ship.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            Four connected fields for practitioners designing AI systems that must work beyond the
            demo: reusable techniques, product capabilities, runtime control, and security.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-text/15 pt-5 text-sm text-muted">
            <span>
              <strong className="font-semibold text-text">{totalGuides}</strong> published guides
            </span>
            <span>Source-backed where products change</span>
            <span>Designed for implementation</span>
          </div>
        </div>

        <section aria-labelledby="fields-heading" className="self-end">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-text/20 pb-3">
            <h2 id="fields-heading" className="editorial-kicker">
              Fields of inquiry
            </h2>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
              {pillars.length} fields
            </span>
          </div>
          <ol>
            {pillars.map((pillar) => (
              <li key={pillar.href} className="border-b border-text/15 last:border-b-0">
                <Link
                  href={pillar.href}
                  className="group grid min-h-24 grid-cols-[2.5rem_minmax(7rem,0.55fr)_minmax(0,1.45fr)_auto] items-center gap-4 py-4 outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:gap-6"
                >
                  <span className="font-mono text-xs text-muted" aria-hidden="true">
                    {pillar.index}
                  </span>
                  <span className="text-lg font-semibold tracking-tight sm:text-xl">
                    {pillar.title}
                  </span>
                  <span className="hidden text-sm leading-6 text-muted sm:block">
                    {pillar.description}
                    <span className="mt-1 block font-mono text-[0.68rem] uppercase tracking-[0.12em]">
                      {pillar.stat}
                    </span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] underline decoration-1 underline-offset-4">
                    Open
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </header>
  );
}
