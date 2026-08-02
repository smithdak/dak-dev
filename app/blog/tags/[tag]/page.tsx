import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleLedger } from '@/components/blog/ArticleLedger';
import { getAllPosts } from '@/lib/posts';
import { getAllTagSlugs, getPostsByTag, getTagNameFromSlug } from '@/lib/tags';
import { formatWritingTag } from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  const allPosts = getAllPosts();
  return getAllTagSlugs(allPosts).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const allPosts = getAllPosts();
  const tagName = getTagNameFromSlug(allPosts, tag);

  if (!tagName) {
    return { title: 'Topic not found' };
  }

  const displayName = formatWritingTag(tagName);

  return {
    title: `${displayName} — Writing archive`,
    description: `Analysis filed under ${displayName} in Dakota Smith's writing archive.`,
    alternates: { canonical: `/blog/tags/${tag}` },
  };
}

export default async function WritingTopicPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const allPosts = getAllPosts();
  const tagName = getTagNameFromSlug(allPosts, tag);

  if (!tagName) notFound();

  const filteredPosts = getPostsByTag(allPosts, tag);
  if (filteredPosts.length === 0) notFound();
  const displayName = formatWritingTag(tagName);

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="editorial-shell">
        <header className="border-b border-rule pb-10 md:pb-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <li>
                <Link
                  href="/blog"
                  className="editorial-link focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Writing
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text">
                {displayName}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h1 className="max-w-[16ch] font-display text-5xl leading-none tracking-[-0.035em] sm:text-6xl md:text-7xl">
                {displayName}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                Every published analysis filed under this topic.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'analysis' : 'analyses'}
            </p>
          </div>
        </header>

        <section className="pt-10 md:pt-14" aria-label={`${displayName} writing records`}>
          <ArticleLedger posts={filteredPosts} headingLevel="h2" />
        </section>

        <div className="mt-14 border-t border-rule pt-6">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.11em] text-text underline-offset-4 hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Return to all writing
          </Link>
        </div>
      </div>
    </div>
  );
}
