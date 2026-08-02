import { ArticleLead } from '@/components/blog/ArticleLead';
import { ArticleLedger } from '@/components/blog/ArticleLedger';
import { Pagination } from '@/components/blog/Pagination';
import { ResearchLanes } from '@/components/blog/ResearchLanes';
import { TopicIndex } from '@/components/blog/TopicIndex';
import { getPaginatedPosts } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { getTagCounts } from '@/lib/tags';
import { splitWritingPosts } from '@/lib/writing';

export const metadata = {
  title: 'Writing',
  description:
    'Analysis of accountable AI systems, agentic engineering, architecture, and durable delivery.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const { lead, archive } = splitWritingPosts(allPosts);
  const paginationData = getPaginatedPosts(archive, 1);
  const tagCounts = Object.fromEntries(getTagCounts(allPosts));

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="site-stage">
        <header className="grid gap-7 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)] md:items-end md:pb-14">
          <h1 className="font-display text-6xl leading-none tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
            Writing
          </h1>
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Analysis of agentic systems, accountable delivery, and the architecture required to
              move AI work beyond the prototype.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.11em] text-muted">
              {allPosts.length} published {allPosts.length === 1 ? 'analysis' : 'analyses'}
            </p>
          </div>
        </header>

        <div className="grid items-start xl:grid-cols-[minmax(0,5fr)_minmax(18rem,1fr)]">
          {lead ? <ArticleLead post={lead} /> : null}
          <ResearchLanes tagCounts={tagCounts} />
        </div>

        <section
          id="latest-analysis"
          aria-labelledby="latest-analysis-heading"
          className="pt-12 md:pt-16"
        >
          <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.6fr)] md:items-end">
            <h2
              id="latest-analysis-heading"
              className="font-display text-4xl leading-none tracking-[-0.03em] md:text-5xl"
            >
              Latest analysis
            </h2>
            <p className="text-sm leading-relaxed text-muted md:text-right">
              A chronological record. The lead essay is held above and does not repeat here.
            </p>
          </div>

          {paginationData.posts.length > 0 ? (
            <>
              <ArticleLedger posts={paginationData.posts} />
              <Pagination
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                basePath="/blog"
              />
            </>
          ) : (
            <div className="border-y border-rule py-14">
              <p className="font-display text-3xl">The archive is being prepared.</p>
            </div>
          )}
        </section>

        <TopicIndex tagCounts={tagCounts} className="mt-16 md:mt-20" />
      </div>
    </div>
  );
}
