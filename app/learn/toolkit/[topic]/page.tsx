import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { SectionKicker } from '@/components/learn/SectionKicker';
import { MobileTableOfContents } from '@/components/learn/MobileTableOfContents';
import { StickyTableOfContents } from '@/components/learn/StickyTableOfContents';
import { CapabilityComparison } from '@/components/toolkit/CapabilityComparison';
import { SourceRegister } from '@/components/toolkit/SourceRegister';
import {
  SUB_PAGE_META,
  getAllToolkitTopicSlugs,
  getToolkitCoverageForTopic,
  getToolkitCoverageSources,
  getToolkitPage,
  getToolkitProducts,
  getToolkitTopicBySlug,
  getToolkitTopicPages,
} from '@/lib/toolkit';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { extractTableOfContents } from '@/lib/toc';
import { SITE_URL as siteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
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

export default async function ToolkitTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicSlug } = await params;
  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug);
  if (!topic || !page) notFound();

  const subPages = getToolkitTopicPages(topic.slug);
  const claims = getToolkitCoverageForTopic(topic.slug);
  const products = getToolkitProducts();
  const sources = getToolkitCoverageSources(claims);
  const toc = extractTableOfContents(page.content);
  const mdxOptions = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name },
  ]);

  return (
    <PageTransition className="min-h-screen pb-20">
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-5 px-4 pt-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/learn" className="underline-offset-2 hover:text-text hover:underline">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/learn/toolkit"
              className="underline-offset-2 hover:text-text hover:underline"
            >
              Toolkit
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="font-semibold text-text">{topic.name}</span>
          </li>
        </ol>
      </nav>

      <div className="px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10 lg:px-0">
        <article className="mdx-content min-w-0 text-lg">
          <SectionKicker
            section="Toolkit"
            kicker={`Capability ${String(topic.order).padStart(2, '0')} · reviewed ${page.frontmatter.reviewedAt}`}
            color="cyan"
          />
          <MobileTableOfContents items={toc} />
          <div className="max-w-[68ch]">
            <CodeBlockWrapper>
              <MDXRemote
                source={page.content}
                components={mdxComponents}
                options={mdxOptions as Parameters<typeof MDXRemote>[0]['options']}
              />
            </CodeBlockWrapper>
          </div>

          <CapabilityComparison
            topicName={topic.name}
            products={products}
            claims={claims}
            sources={sources}
          />

          <SourceRegister sources={sources} heading={`${topic.name} sources`} />

          {subPages.length > 0 && (
            <section
              aria-labelledby="implementation-lenses-heading"
              className="not-prose mt-14 border-t border-text/20 pt-8"
            >
              <div className="mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Comparative implementation depth
                </p>
                <h2
                  id="implementation-lenses-heading"
                  className="mt-2 text-xl font-semibold tracking-tight"
                >
                  Four implementation lenses
                </h2>
              </div>
              <div className="divide-y divide-text/15 border-t border-text/20">
                {subPages.map((subPage) => {
                  const sub = subPage.frontmatter.subPage!;
                  const meta = SUB_PAGE_META[sub];
                  return (
                    <Link
                      key={sub}
                      href={`/learn/toolkit/${topic.slug}/${sub}`}
                      className="group flex flex-col gap-2 py-5 transition-colors hover:bg-surface/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:flex-row sm:items-start sm:justify-between sm:px-2"
                    >
                      <span className="font-semibold group-hover:underline group-hover:underline-offset-4">
                        {meta.label}
                      </span>
                      <span className="max-w-xl text-sm leading-relaxed text-muted">
                        {subPage.frontmatter.description}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>

        <StickyTableOfContents items={toc} />
      </div>
    </PageTransition>
  );
}
