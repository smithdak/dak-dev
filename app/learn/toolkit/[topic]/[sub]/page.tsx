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
import { EvidenceScopeNote } from '@/components/toolkit/EvidenceScopeNote';
import { SourceRegister } from '@/components/toolkit/SourceRegister';
import {
  SUB_PAGE_META,
  TOOLKIT_LENSES,
  getAllToolkitTopicSlugs,
  getToolkitPage,
  getToolkitSourcesByIds,
  getToolkitTopicBySlug,
  isToolkitSubPage,
} from '@/lib/toolkit';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { extractTableOfContents } from '@/lib/toc';
import { SITE_URL as siteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllToolkitTopicSlugs().flatMap((topic) =>
    TOOLKIT_LENSES.map((lens) => ({ topic, sub: lens.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; sub: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug, sub } = await params;
  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug, sub);
  if (!topic || !page || !isToolkitSubPage(sub)) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/toolkit/${topic.slug}/${sub}`,
    },
    alternates: { canonical: `/learn/toolkit/${topic.slug}/${sub}` },
  };
}

export default async function ToolkitSubPageRoute({
  params,
}: {
  params: Promise<{ topic: string; sub: string }>;
}) {
  const { topic: topicSlug, sub } = await params;
  if (!isToolkitSubPage(sub)) notFound();

  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug, sub);
  if (!topic || !page) notFound();

  const subMeta = SUB_PAGE_META[sub];
  const sources = getToolkitSourcesByIds(page.frontmatter.sourceIds);
  const toc = extractTableOfContents(page.content);
  const mdxOptions = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name, url: `/learn/toolkit/${topic.slug}` },
    { name: subMeta.label },
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
          <li>
            <Link
              href={`/learn/toolkit/${topic.slug}`}
              className="underline-offset-2 hover:text-text hover:underline"
            >
              {topic.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="font-semibold text-text">{subMeta.label}</span>
          </li>
        </ol>
      </nav>

      <div className="px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10 lg:px-0">
        <article className="mdx-content min-w-0 text-lg">
          <SectionKicker
            section="Toolkit"
            kicker={`${topic.name} · ${subMeta.label}`}
            color="cyan"
          />
          <EvidenceScopeNote
            topicHref={`/learn/toolkit/${topic.slug}`}
            lens={sub}
            reviewedAt={page.frontmatter.reviewedAt}
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
          <SourceRegister sources={sources} heading={`${topic.name} sources`} />
        </article>

        <StickyTableOfContents items={toc} />
      </div>
    </PageTransition>
  );
}
