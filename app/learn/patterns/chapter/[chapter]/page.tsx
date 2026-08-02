import { notFound } from 'next/navigation';
import { CHAPTERS, getChapterBySlug, getPatternsByChapter } from '@/lib/patterns';
import { PageTransition } from '@/components/ui/PageTransition';
import { PatternCard } from '@/components/patterns/PatternCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateChapterSchema } from '@/lib/schema';
import Link from 'next/link';

import { SITE_URL as siteUrl } from '@/lib/site';

export const dynamicParams = false;

export async function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }

  const title = `Chapter ${chapter.number}: ${chapter.name} — Agent Patterns`;
  const ogImage = `${siteUrl}/og-default.png`;

  return {
    title,
    description: chapter.description,
    keywords: [
      'AI coding patterns',
      chapter.name.toLowerCase(),
      'agent patterns',
      `chapter ${chapter.number}`,
    ],
    openGraph: {
      title: `Chapter ${chapter.number}: ${chapter.name} — Agent Patterns`,
      description: chapter.description,
      url: `${siteUrl}/learn/patterns/chapter/${chapter.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${chapter.name} patterns` }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `Chapter ${chapter.number}: ${chapter.name} — Agent Patterns`,
      description: chapter.description,
      images: [ogImage],
    },
    alternates: { canonical: `/learn/patterns/chapter/${chapter.slug}` },
  };
}

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    notFound();
  }

  const patterns = getPatternsByChapter(chapter.number);

  const chapterIndex = CHAPTERS.findIndex((c) => c.number === chapter.number);
  const prevChapter = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Learn', url: '/learn' },
    { name: 'Patterns', url: '/learn/patterns' },
    { name: chapter.name },
  ]);
  const chapterSchema = generateChapterSchema(chapter, patterns.length);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={chapterSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        {/* Breadcrumb */}
        <nav className="mb-6 pt-2" aria-label="Breadcrumb">
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
              <span className="text-text font-semibold">{chapter.name}</span>
            </li>
          </ol>
        </nav>

        <header className="mb-10 border-b border-text/20 pb-10 pt-8">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className={`font-display text-4xl ${CHAPTER_TEXT_COLORS[chapter.number]} leading-none`}
            >
              {chapter.number}
            </span>
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">{chapter.name}</h1>
          </div>
          <p className="text-lg text-muted max-w-3xl mt-3 leading-relaxed">{chapter.description}</p>
          {patterns.length > 0 && (
            <p className="text-xs text-muted mt-4 font-mono tabular-nums">
              {patterns.length} pattern{patterns.length !== 1 ? 's' : ''}
            </p>
          )}
        </header>

        {/* Patterns */}
        {patterns.length > 0 ? (
          <div>
            {patterns.map((pattern) => (
              <PatternCard key={pattern.frontmatter.slug} pattern={pattern} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted/40 p-12 text-center">
            <p className="text-sm font-mono text-muted uppercase tracking-wider">
              Patterns coming soon
            </p>
          </div>
        )}

        {/* Chapter Navigation */}
        <nav
          className="mt-16 grid border-y border-text/20 sm:grid-cols-2"
          aria-label="Chapter navigation"
        >
          {prevChapter ? (
            <Link
              href={`/learn/patterns/chapter/${prevChapter.slug}`}
              className="group min-h-28 px-1 py-6 transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:border-r sm:border-text/20"
            >
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
                Prev Chapter
              </span>
              <p className="mt-2 font-display text-xl group-hover:underline group-hover:underline-offset-4">
                {prevChapter.number}. {prevChapter.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              href={`/learn/patterns/chapter/${nextChapter.slug}`}
              className="group min-h-28 px-1 py-6 text-right transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
            >
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
                Next Chapter
              </span>
              <p className="mt-2 font-display text-xl group-hover:underline group-hover:underline-offset-4">
                {nextChapter.number}. {nextChapter.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </PageTransition>
  );
}
