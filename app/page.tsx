import { getAllPosts } from '@/lib/posts';
import { Hero } from '@/components/home/Hero';
import { LearnShowcase } from '@/components/home/LearnShowcase';
import { ToolsBar } from '@/components/home/ToolsBar';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebSiteSchema } from '@/lib/schema';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Dakota Smith | Fullstack Solutions Architect',
  description:
    'High-performance personal blog featuring tech articles and engineering insights. Building great software with Next.js, TypeScript, and modern web technologies.',
  alternates: { canonical: '/' },
};

export default async function Home() {
  // Fetch all posts; prefer a post pinned with `featured: true`, else the latest.
  // getAllPosts() is sorted newest-first, so find() yields the most recent featured.
  const allPosts = await getAllPosts();
  const featuredPost = allPosts.find((post) => post.frontmatter.featured) ?? allPosts[0];

  // Generate Schema.org structured data for homepage
  const webSiteSchema = generateWebSiteSchema();

  // Format date for featured post
  const formattedDate = featuredPost
    ? new Date(featuredPost.frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <>
      {/* Schema.org JSON-LD */}
      <JsonLd data={webSiteSchema} />

      {/* Hero Section */}
      <Hero />

      {/* Section Divider */}
      <div className="flex justify-center py-8">
        <div className="w-20 h-1 bg-accent" aria-hidden="true" />
      </div>

      {/* Featured Post Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 flex items-end justify-between border-b-4 border-text pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                Featured Post
              </h2>
              <p className="text-lg text-muted">
                Latest from the blog
              </p>
            </div>
            <Link
              href="/blog"
              className="group hidden sm:inline-flex items-center gap-2 text-text font-semibold hover:underline underline-offset-4 decoration-4 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
            >
              View All Posts
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Featured Post */}
          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.frontmatter.slug}`}
              className="group block relative border-4 border-text bg-surface p-6 md:p-8 shadow-[8px_8px_0_0_var(--color-text)] hover:border-accent hover:shadow-[12px_12px_0_0_var(--color-accent)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              <article>
                {/* Featured Badge */}
                <div className="absolute -top-4 left-6 bg-accent text-background px-4 py-1 border-4 border-text">
                  <span className="text-sm font-bold uppercase tracking-wider">Featured</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center pt-4">
                  {/* Image and Tags Column */}
                  <div>
                    {/* Featured Image */}
                    <div className="relative aspect-[16/9] border-4 border-text overflow-hidden bg-background">
                      {featuredPost.frontmatter.hero ? (
                        <Image
                          src={featuredPost.frontmatter.hero}
                          alt={`Cover image for ${featuredPost.frontmatter.title}`}
                          fill
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-muted text-lg">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {featuredPost.frontmatter.tags &&
                      featuredPost.frontmatter.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {featuredPost.frontmatter.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block border-2 border-text bg-background px-3 py-1 text-xs font-bold uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:underline underline-offset-4 decoration-4">
                      {featuredPost.frontmatter.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-base md:text-lg text-muted mb-6 leading-relaxed">
                      {featuredPost.frontmatter.excerpt}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-8">
                      <time
                        dateTime={featuredPost.frontmatter.date}
                        className="font-semibold"
                      >
                        {formattedDate}
                      </time>
                      <span aria-hidden="true">•</span>
                      <span>{featuredPost.readingTime}</span>
                    </div>

                    {/* Read More */}
                    <div className="inline-flex items-center gap-2 font-semibold text-text">
                      Read Article
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <div className="border-4 border-text p-12 text-center">
              <p className="text-2xl font-semibold mb-2">No posts yet</p>
              <p className="text-muted">Check back soon for new content.</p>
            </div>
          )}

          {/* Mobile "View All" Button */}
          <div className="mt-12 sm:hidden flex justify-center">
            <Link href="/blog" className="inline-flex items-center justify-center font-semibold px-6 py-3 text-base gap-2 bg-surface text-text border-4 border-text hover:bg-text hover:text-background shadow-[4px_4px_0_0_var(--color-text)] hover:shadow-[6px_6px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background">
                View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Learn Showcase — the four pillars (Patterns, Toolkit, Harness, Security) */}
      <LearnShowcase />

      {/* Compact Tools Bar */}
      <ToolsBar />
    </>
  );
}
