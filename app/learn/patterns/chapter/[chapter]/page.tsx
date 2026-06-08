import { notFound } from 'next/navigation';
import {
  CHAPTERS,
  getChapterBySlug,
  getPatternsByChapter,
} from '@/lib/patterns';
import { PageTransition } from '@/components/ui/PageTransition';
import { PatternCard } from '@/components/patterns/PatternCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateChapterSchema } from '@/lib/schema';
import Link from 'next/link';

import { SITE_URL as siteUrl } from '@/lib/site';

export async function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ chapter: chapter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }

  const patterns = getPatternsByChapter(chapter.number);
  const title = `Chapter ${chapter.number}: ${chapter.name} — Agent Patterns | Dakota Smith`;
  const ogImage = `${siteUrl}/api/og?type=pattern&title=${encodeURIComponent(chapter.name)}&chapter=${chapter.number}`;

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

const CHAPTER_BORDER_COLORS: Record<number, string> = {
  1: 'border-chapter-1',
  2: 'border-chapter-2',
  3: 'border-chapter-3',
  4: 'border-chapter-4',
  5: 'border-chapter-5',
  6: 'border-chapter-6',
};

const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1',
  2: 'text-chapter-2',
  3: 'text-chapter-3',
  4: 'text-chapter-4',
  5: 'text-chapter-5',
  6: 'text-chapter-6',
};

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    notFound();
  }

  const patterns = getPatternsByChapter(chapter.number);

  const chapterIndex = CHAPTERS.findIndex(
    (c) => c.number === chapter.number
  );
  const prevChapter = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null;

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

        {/* Chapter Header with grid bg */}
        <header
          className={`mb-10 border-b-4 border-text pb-8 border-l-4 ${CHAPTER_BORDER_COLORS[chapter.number]} pl-6 pt-8 -mx-4 sm:-mx-6 lg:-mx-0 px-6`}
        >
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className={`text-6xl font-bold opacity-15 ${CHAPTER_TEXT_COLORS[chapter.number]} leading-none`}
            >
              {chapter.number}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {chapter.name}
            </h1>
          </div>
          <p className="text-lg text-muted max-w-3xl mt-3 leading-relaxed">
            {chapter.description}
          </p>
          {patterns.length > 0 && (
            <p className="text-xs text-muted mt-4 font-mono tabular-nums">
              {patterns.length} pattern{patterns.length !== 1 ? 's' : ''}
            </p>
          )}
        </header>

        {/* Patterns */}
        {patterns.length > 0 ? (
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <PatternCard
                key={pattern.frontmatter.slug}
                pattern={pattern}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted/40 p-12 text-center">
            <p className="text-sm font-mono text-muted uppercase tracking-wider">Patterns coming soon</p>
          </div>
        )}

        {/* Chapter Navigation */}
        <div className="mt-16 pt-8 border-t-2 border-text/30 grid grid-cols-2 gap-4">
          {prevChapter ? (
            <Link
              href={`/learn/patterns/chapter/${prevChapter.slug}`}
              className={`group border-2 border-text/60 hover:border-text p-4 border-l-4 ${CHAPTER_BORDER_COLORS[prevChapter.number]} transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
                Prev Chapter
              </span>
              <p className="font-bold mt-1 group-hover:underline decoration-2 underline-offset-4 text-sm">
                {prevChapter.number}. {prevChapter.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              href={`/learn/patterns/chapter/${nextChapter.slug}`}
              className={`group border-2 border-text/60 hover:border-text p-4 border-r-4 ${CHAPTER_BORDER_COLORS[nextChapter.number]} text-right transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">
                Next Chapter
              </span>
              <p className="font-bold mt-1 group-hover:underline decoration-2 underline-offset-4 text-sm">
                {nextChapter.number}. {nextChapter.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
