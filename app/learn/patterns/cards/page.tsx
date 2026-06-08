import type { Metadata } from 'next';
import { getAllPatterns, extractSignals, CHAPTERS } from '@/lib/patterns';
import { QuickReferenceCard } from '@/components/patterns/QuickReferenceCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';

import { SITE_URL as siteUrl } from '@/lib/site';

export function generateMetadata(): Metadata {
  const allPatterns = getAllPatterns();
  const description = `At-a-glance reference cards for ${allPatterns.length} agent patterns — see signals, difficulty, and keywords at a glance.`;
  const ogImage = `${siteUrl}/api/og?type=pattern&title=${encodeURIComponent('Quick-Reference Cards')}`;

  return {
    title: 'Pattern Quick-Reference Cards',
    description,
    keywords: [
      'pattern cards',
      'quick reference',
      'agent patterns',
      'AI coding cheatsheet',
    ],
    openGraph: {
      title: 'Quick-Reference Cards — Agent Patterns',
      description,
      url: `${siteUrl}/learn/patterns/cards`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Pattern Quick-Reference Cards' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Quick-Reference Cards — Agent Patterns',
      description,
      images: [ogImage],
    },
    alternates: { canonical: '/learn/patterns/cards' },
  };
}

export default function PatternCardsPage() {
  const allPatterns = getAllPatterns();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Learn', url: '/learn' },
    { name: 'Patterns', url: '/learn/patterns' },
    { name: 'Cards' },
  ]);

  return (
    <div className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <header className="pt-2 pb-8 -mx-4 sm:-mx-6 lg:-mx-0 px-4 sm:px-6 lg:px-0">
        <nav className="mb-5" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-muted font-mono">
            <li>
              <Link
                href="/learn"
                className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background"
              >
                Learn
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/learn/patterns"
                className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background"
              >
                Patterns
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="text-text font-semibold">Cards</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Quick-Reference Cards
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          All {allPatterns.length} patterns at a glance. Each card shows the
          pattern&apos;s intent, key signals, difficulty, and keywords.
        </p>
      </header>

      <div className="border-b-2 border-text/30" />

      {/* Card Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-10">
        {CHAPTERS.map((chapter) => {
          const chapterPatterns = allPatterns.filter(
            (p) => p.frontmatter.chapter === chapter.number
          );
          if (chapterPatterns.length === 0) return null;

          return (
            <section key={chapter.number} className="mb-10 last:mb-0">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-4">
                Chapter {chapter.number} — {chapter.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapterPatterns.map((pattern) => {
                  const signals = extractSignals(pattern.content);
                  return (
                    <QuickReferenceCard
                      key={pattern.frontmatter.slug}
                      frontmatter={pattern.frontmatter}
                      signals={signals}
                      variant="standalone"
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
