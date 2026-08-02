import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleLedger } from '@/components/blog/ArticleLedger';
import { Pagination } from '@/components/blog/Pagination';
import { getPaginatedPosts, POSTS_PER_PAGE } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { splitWritingPosts } from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  const { archive } = splitWritingPosts(getAllPosts());
  const totalPages = Math.ceil(archive.length / POSTS_PER_PAGE);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);

  return {
    title: `Writing archive — Page ${pageNumber}`,
    description:
      'Earlier analysis of accountable AI systems, agentic engineering, architecture, and delivery.',
    alternates: { canonical: `/blog/page/${pageNumber}` },
  };
}

export default async function WritingArchivePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);

  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const allPosts = getAllPosts();
  const { archive } = splitWritingPosts(allPosts);
  const paginationData = getPaginatedPosts(archive, pageNumber);

  if (paginationData.posts.length === 0) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE + 1;

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="editorial-shell">
        <header className="border-b border-rule pb-10 md:pb-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted">
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
                Archive
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h1 className="font-display text-5xl leading-none tracking-[-0.035em] sm:text-6xl md:text-7xl">
                Writing archive
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                Earlier field notes and long-form analysis, ordered by publication date.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted">
              Page {paginationData.currentPage} of {paginationData.totalPages}
            </p>
          </div>
        </header>

        <section className="pt-10 md:pt-14" aria-label="Writing archive records">
          <ArticleLedger posts={paginationData.posts} startIndex={startIndex} headingLevel="h2" />
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            basePath="/blog"
          />
        </section>
      </div>
    </div>
  );
}
