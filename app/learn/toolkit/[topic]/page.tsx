import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getAllToolkitTopicSlugs, getToolkitTopicBySlug, getToolkitPage, getToolkitTopicPages, SUB_PAGE_META } from '@/lib/toolkit';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dak-dev.vercel.app';

export async function generateStaticParams() {
  return getAllToolkitTopicSlugs().map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug);
  if (!topic || !page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/toolkit/${topic.slug}`,
    },
    alternates: { canonical: `/learn/toolkit/${topic.slug}` },
  };
}

export default async function ToolkitTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug);
  if (!topic || !page) notFound();

  const subPages = getToolkitTopicPages(topicSlug);
  const toc = extractTableOfContents(page.content);
  const mdxOptions: any = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-5 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
          <li><Link href="/learn" className="hover:text-text hover:underline underline-offset-2">Learn</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/learn/toolkit" className="hover:text-text hover:underline underline-offset-2">Toolkit</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page"><span className="text-text font-semibold">{topic.name}</span></li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose prose-invert prose-lg mdx-content">
          <SectionKicker
            section="Toolkit"
            kicker={`Deep-Dive ${String(topic.order).padStart(2, '0')}`}
            color="cyan"
          />
          <CodeBlockWrapper>
          <MDXRemote source={page.content} components={mdxComponents} options={mdxOptions} />
          </CodeBlockWrapper>

          {subPages.length > 0 && (
            <div className="mt-14 not-prose">
              <div className="border-l-4 border-l-chapter-2 pl-4 mb-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted">
                  <span className="text-chapter-2 font-bold">Go Deeper</span>
                  <span aria-hidden="true" className="mx-2 text-muted/40">
                    /
                  </span>
                  {subPages.length} lenses
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subPages.map((sp) => {
                  const sub = sp.frontmatter.subPage!;
                  const meta = SUB_PAGE_META[sub];
                  return (
                    <Link
                      key={sub}
                      href={`/learn/toolkit/${topic.slug}/${sub}`}
                      className="group block border-2 border-text/60 hover:border-text bg-surface/40 border-t-4 border-t-chapter-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-chapter-2)] focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-chapter-2 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={meta.icon} />
                        </svg>
                        <h3 className="font-bold group-hover:underline decoration-2 underline-offset-4">
                          {meta.label}
                        </h3>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{sp.frontmatter.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
