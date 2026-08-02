import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { Comments } from '@/components/blog/Comments';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { JsonLd } from '@/components/seo/JsonLd';
import { getMdxOptions } from '@/lib/mdx-options';
import { getPostBySlug, getPublishedPostSlugs, getRelatedPosts } from '@/lib/posts';
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL as baseUrl } from '@/lib/site';
import { slugifyTag } from '@/lib/tags';
import { extractTableOfContents } from '@/lib/toc';
import { formatCalendarDate } from '@/lib/utils';
import { formatWritingTag } from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.frontmatter.published) {
    return { title: 'Post not found' };
  }

  const ogImageUrl = post.frontmatter.hero
    ? `${baseUrl}${post.frontmatter.hero}`
    : `${baseUrl}/og-default.png`;

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
          alt: `Editorial artwork for ${post.frontmatter.title}`,
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

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.frontmatter.published) notFound();

  const toc = extractTableOfContents(post.content);
  const relatedPosts = getRelatedPosts(slug, 3).map((relatedPost) => ({
    slug: relatedPost.frontmatter.slug,
    title: relatedPost.frontmatter.title,
    excerpt: relatedPost.frontmatter.excerpt,
    thumbnail: relatedPost.frontmatter.thumbnail,
    tags: relatedPost.frontmatter.tags,
    date: relatedPost.frontmatter.date,
  }));
  const mdxOptions = await getMdxOptions();
  const formattedDate = formatCalendarDate(post.frontmatter.date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fullUrl = `${baseUrl}/blog/${slug}`;

  const blogPostingSchema = generateBlogPostingSchema(post.frontmatter);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Writing', url: '/blog' },
    { name: post.frontmatter.title },
  ]);

  return (
    <article className="min-h-screen pb-16 md:pb-20">
      <ReadingProgress />
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />

      <header className="editorial-shell pb-8 pt-10 md:pb-10 md:pt-14 lg:pt-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex min-w-0 items-center gap-2 text-sm text-muted">
            <li>
              <Link
                href="/blog"
                className="editorial-link focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Writing
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 truncate text-text">
              {post.frontmatter.title}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.35fr)] lg:items-end lg:gap-14">
          <div>
            <h1 className="max-w-[18ch] font-display text-5xl leading-[1.01] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {post.frontmatter.title}
            </h1>
            <p className="mt-6 max-w-[58rem] text-xl leading-relaxed text-muted md:text-2xl">
              {post.frontmatter.excerpt}
            </p>
          </div>

          <div className="border-y border-rule py-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <time dateTime={post.frontmatter.date} className="font-semibold text-text">
                {formattedDate}
              </time>
              <span>{post.readingTime}</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              By {post.frontmatter.author || 'Dakota Smith'}
            </p>
            <ShareButtons
              title={post.frontmatter.title}
              url={fullUrl}
              excerpt={post.frontmatter.excerpt}
              className="mt-4"
            />
          </div>
        </div>

        <nav aria-label="Article topics" className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
          {post.frontmatter.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${slugifyTag(tag)}`}
              className="inline-flex min-h-11 items-center border-b border-rule text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {formatWritingTag(tag)}
            </Link>
          ))}
        </nav>
      </header>

      <div className="editorial-shell border-t border-rule pt-7 md:pt-9">
        <figure className="relative aspect-video overflow-hidden bg-surface">
          <Image
            src={post.frontmatter.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1536px) calc(100vw - 2rem), 1440px"
            placeholder={post.frontmatter.heroBlur ? 'blur' : 'empty'}
            blurDataURL={post.frontmatter.heroBlur}
          />
        </figure>

        <div className="mt-10 grid gap-12 xl:mt-16 xl:grid-cols-[minmax(0,68ch)_15rem] xl:justify-center xl:gap-20">
          <div className="min-w-0">
            {toc.length > 0 ? (
              <details className="mb-10 border-y border-rule xl:hidden">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-3 text-sm font-semibold text-text marker:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent [&::-webkit-details-marker]:hidden">
                  <span>On this page</span>
                  <span className="text-xs uppercase tracking-[0.1em] text-muted">
                    {toc.length} sections
                  </span>
                </summary>
                <TableOfContents
                  items={toc}
                  showTitle={false}
                  observeActive={false}
                  className="border-t border-rule py-5"
                />
              </details>
            ) : null}

            <div className="mdx-content max-w-[68ch] text-lg">
              <CodeBlockWrapper>
                <MDXRemote
                  source={post.content}
                  options={mdxOptions as Parameters<typeof MDXRemote>[0]['options']}
                  components={mdxComponents}
                />
              </CodeBlockWrapper>
            </div>
          </div>

          {toc.length > 0 ? (
            <aside className="hidden xl:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} />
              </div>
            </aside>
          ) : null}
        </div>

        {relatedPosts.length > 0 ? <RelatedPosts posts={relatedPosts} className="mt-16" /> : null}
        <Comments className="mt-16" />

        <div className="mt-16 border-t border-rule pt-8">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.11em] text-text underline-offset-4 hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Return to all writing
          </Link>
        </div>
      </div>
    </article>
  );
}
