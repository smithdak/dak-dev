import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/posts';
import { extractTableOfContents } from '@/lib/toc';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { Comments } from '@/components/blog/Comments';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TagList } from '@/components/ui/Tag';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';
import { SITE_URL as baseUrl } from '@/lib/site';
import { getMdxOptions } from '@/lib/mdx-options';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Use the article's hero image for OG (absolute URL required)
  const ogImageUrl = post.frontmatter.hero
    ? `${baseUrl}${post.frontmatter.hero}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.frontmatter.title)}&date=${encodeURIComponent(post.frontmatter.date)}`;

  // Bare title — the root layout's `%s | Dakota Smith` template adds the suffix
  // once. Returning a pre-suffixed title doubles it.
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    keywords: post.frontmatter.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author || 'Dakota Smith'],
      images: [
        {
          url: ogImageUrl,
          width: 1600,
          height: 900,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Extract table of contents
  const toc = extractTableOfContents(post.content);

  // Get related posts
  const relatedPostsData = getRelatedPosts(slug, 3);
  const relatedPosts = relatedPostsData.map((relatedPost) => ({
    slug: relatedPost.frontmatter.slug,
    title: relatedPost.frontmatter.title,
    excerpt: relatedPost.frontmatter.excerpt,
    thumbnail: relatedPost.frontmatter.thumbnail,
    tags: relatedPost.frontmatter.tags,
    date: relatedPost.frontmatter.date,
  }));

  const mdxOptions: any = await getMdxOptions();

  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  // Generate Schema.org structured data
  const blogPostingSchema = generateBlogPostingSchema(post.frontmatter);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.frontmatter.title },
  ]);

  // Generate full URL for sharing
  const fullUrl = `${baseUrl}/blog/${slug}`;

  return (
    <article className="min-h-screen pb-16">
      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Schema.org JSON-LD */}
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Full-Width Header Section */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex gap-6 lg:gap-12">
          {/* Main Header Content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-muted">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">
                  <span className="text-text font-semibold line-clamp-1">
                    {post.frontmatter.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.frontmatter.title}
            </h1>

            {/* Excerpt/Summary */}
            {post.frontmatter.excerpt && (
              <p className="text-xl md:text-2xl text-muted mb-6 leading-relaxed max-w-4xl">
                {post.frontmatter.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
              <time dateTime={post.frontmatter.date} className="font-semibold">
                {formattedDate}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime}</span>
              {post.frontmatter.author && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>By {post.frontmatter.author}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <TagList tags={post.frontmatter.tags} interactive={true} />
            )}
          </div>

          {/* Share Button - Right Side */}
          <div className="flex-shrink-0 pt-8">
            <ShareButtons
              title={post.frontmatter.title}
              url={fullUrl}
              excerpt={post.frontmatter.excerpt}
              variant="dropdown"
            />
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="border-b-4 border-text" />

      {/* Two-Column Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Hero Image */}
            {post.frontmatter.hero && (
              <figure className="mb-12">
                <div className="relative aspect-[16/9] border-4 border-text overflow-hidden">
                  <Image
                    src={post.frontmatter.hero}
                    alt={`Cover image for ${post.frontmatter.title}`}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E"
                  />
                </div>
              </figure>
            )}

            {/* Post Content */}
            <div
              className="prose prose-invert prose-lg max-w-[65ch] mdx-content"
              style={{ maxWidth: '65ch' }}
            >
              <CodeBlockWrapper>
                <MDXRemote
                  source={post.content}
                  options={mdxOptions}
                  components={mdxComponents}
                />
              </CodeBlockWrapper>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />

              {/* Share Buttons */}
              <div className="mt-6">
                <div className="border-4 border-text bg-surface p-6">
                  <h2 className="text-lg font-bold mb-4 uppercase tracking-wider">
                    Share
                  </h2>
                  <ShareButtons
                    title={post.frontmatter.title}
                    url={fullUrl}
                    excerpt={post.frontmatter.excerpt}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} className="mt-16" />
        )}

        {/* Comments Section */}
        <Comments className="mt-16" />

        {/* Back to Blog */}
        <div className="mt-16 pt-8 border-t-4 border-text">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text font-semibold hover:underline underline-offset-4 decoration-4 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </div>
    </article>
  );
}
