import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getPatternBySlug,
  getAllPatterns,
  getAllPatternSlugs,
  getRelatedPatterns,
  extractSignals,
  getToolExamples,
  CHAPTERS,
} from '@/lib/patterns';
import { extractTableOfContents } from '@/lib/toc';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedPatternsPanel } from '@/components/patterns/RelatedPatternsPanel';
import { RelatedPatternsGraph } from '@/components/patterns/RelatedPatternsGraph';
import { PatternNavigation } from '@/components/patterns/PatternNavigation';
import { QuickReferenceCard } from '@/components/patterns/QuickReferenceCard';
import { ToolExamples } from '@/components/patterns/ToolExamples';
import { patternMdxComponents } from '@/components/patterns/PatternMdxComponents';
import { RelatedToolkitPanel } from '@/components/learn/RelatedToolkitPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateBreadcrumbSchema,
  generatePatternSchema,
} from '@/lib/schema';
import { SITE_URL as baseUrl } from '@/lib/site';
import { getMdxOptions } from '@/lib/mdx-options';
import Link from 'next/link';

const PATTERN_TO_TOOLKIT: Record<string, string[]> = {
  'convention-file': ['claude-md'],
  'safety-net': ['hooks'],
  'memory-layer': ['memory'],
  'parallel-fan-out': ['agents', 'agent-teams'],
  'progressive-disclosure': ['skills'],
  'agent-friendly-architecture': ['mcp'],
  'context-priming': ['claude-md'],
  'scope-fence': ['hooks', 'settings'],
};

export async function generateStaticParams() {
  const slugs = getAllPatternSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    return { title: 'Pattern Not Found' };
  }

  const chapter = CHAPTERS.find(
    (c) => c.number === pattern.frontmatter.chapter
  );
  const ogImageUrl = `${baseUrl}/api/og?type=pattern&title=${encodeURIComponent(pattern.frontmatter.name)}&chapter=${pattern.frontmatter.chapter}&number=${encodeURIComponent(pattern.frontmatter.number)}`;

  return {
    title: `${pattern.frontmatter.name} — Pattern ${pattern.frontmatter.number}`,
    description: pattern.frontmatter.intent,
    keywords: pattern.frontmatter.keywords,
    openGraph: {
      title: `${pattern.frontmatter.name} — Agent Pattern ${pattern.frontmatter.number}`,
      description: pattern.frontmatter.intent,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pattern.frontmatter.name} — ${chapter?.name} pattern`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pattern.frontmatter.name} — Agent Pattern ${pattern.frontmatter.number}`,
      description: pattern.frontmatter.intent,
      images: [ogImageUrl],
    },
    alternates: { canonical: `/learn/patterns/${slug}` },
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

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern || !pattern.frontmatter.published) {
    notFound();
  }

  const chapter = CHAPTERS.find(
    (c) => c.number === pattern.frontmatter.chapter
  );
  const toc = extractTableOfContents(pattern.content);
  const signals = extractSignals(pattern.content);
  const relatedPatterns = getRelatedPatterns(pattern);
  const toolExamples = getToolExamples(slug);

  // Compute prev/next pattern navigation
  const allPatterns = getAllPatterns();
  const currentIndex = allPatterns.findIndex(
    (p) => p.frontmatter.slug === slug
  );
  const prevPattern = currentIndex > 0 ? allPatterns[currentIndex - 1] : null;
  const nextPattern =
    currentIndex < allPatterns.length - 1
      ? allPatterns[currentIndex + 1]
      : null;

  const mdxOptions: any = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Learn', url: '/learn' },
    { name: 'Patterns', url: '/learn/patterns' },
    { name: chapter?.name || '', url: `/learn/patterns/chapter/${chapter?.slug}` },
    { name: pattern.frontmatter.name },
  ]);

  const patternSchema = chapter
    ? generatePatternSchema(pattern.frontmatter, chapter)
    : null;

  return (
    <article className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />
      {patternSchema && <JsonLd data={patternSchema} />}

      {/* Hero */}
      <header className="pt-2 pb-8 -mx-4 sm:-mx-6 lg:-mx-0 px-4 sm:px-6 lg:px-0">
        {/* Breadcrumb */}
        <nav className="mb-5" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
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
            <li>
              <Link
                href={`/learn/patterns/chapter/${chapter?.slug}`}
                className={`hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background ${CHAPTER_TEXT_COLORS[pattern.frontmatter.chapter]}`}
              >
                {chapter?.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="text-text font-semibold">
                {pattern.frontmatter.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero: Card + Relationship Graph side by side */}
        <div className={`grid grid-cols-1 ${relatedPatterns.length > 0 ? 'lg:grid-cols-[1fr_380px]' : ''} gap-6 items-stretch`}>
          <QuickReferenceCard
            frontmatter={pattern.frontmatter}
            signals={signals}
            readingTime={pattern.readingTime}
            variant="hero"
          />

          {relatedPatterns.length > 0 && (
            <div className="hidden lg:block">
              <RelatedPatternsGraph
                currentPattern={pattern}
                relatedPatterns={relatedPatterns}
              />
            </div>
          )}
        </div>

        {/* Relationship graph on mobile (stacked below card) */}
        {relatedPatterns.length > 0 && (
          <div className="mt-6 lg:hidden">
            <RelatedPatternsGraph
              currentPattern={pattern}
              relatedPatterns={relatedPatterns}
            />
          </div>
        )}
      </header>

      {/* Divider */}
      <div className="border-b-2 border-text/30" />

      {/* Two-Column Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            <div
              className="prose prose-invert prose-lg max-w-[65ch] mdx-content"
              style={{ maxWidth: '65ch' }}
            >
              <CodeBlockWrapper>
                <MDXRemote
                  source={pattern.content}
                  options={mdxOptions}
                  components={patternMdxComponents}
                />
              </CodeBlockWrapper>
            </div>

            {/* Tool-Specific Examples */}
            {toolExamples && <ToolExamples examples={toolExamples} />}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents items={toc} />
              {relatedPatterns.length > 0 && (
                <>
                  <div className="border-t border-text/10" />
                  <RelatedPatternsPanel relatedPatterns={relatedPatterns} />
                </>
              )}
              {PATTERN_TO_TOOLKIT[slug] && (
                <RelatedToolkitPanel topicSlugs={PATTERN_TO_TOOLKIT[slug]} />
              )}
            </div>
          </aside>
        </div>

        {/* Pattern Navigation */}
        <div className="mt-16 pt-8 border-t-2 border-text/30">
          <PatternNavigation previous={prevPattern} next={nextPattern} />
        </div>
      </div>
    </article>
  );
}
