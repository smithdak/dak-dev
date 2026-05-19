import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getAllToolkitTopicSlugs, getToolkitTopicBySlug, getToolkitPage, SUB_PAGE_META, type ToolkitSubPage } from '@/lib/toolkit';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dak-dev.vercel.app';
const VALID_SUB_PAGES: ToolkitSubPage[] = ['mental-model', 'playbook', 'compositions', 'pitfalls'];

export function generateStaticParams() {
  const topics = getAllToolkitTopicSlugs();
  return topics.flatMap((topic) =>
    VALID_SUB_PAGES.map((sub) => ({ topic, sub }))
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
  if (!topic || !page) return {};

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
  const topic = getToolkitTopicBySlug(topicSlug);
  const page = getToolkitPage(topicSlug, sub);
  if (!topic || !page) notFound();

  const subMeta = SUB_PAGE_META[sub as ToolkitSubPage];
  if (!subMeta) notFound();

  const toc = extractTableOfContents(page.content);
  const mdxOptions: any = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name, url: `/learn/toolkit/${topic.slug}` },
    { name: subMeta.label },
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
          <li><Link href={`/learn/toolkit/${topic.slug}`} className="hover:text-text hover:underline underline-offset-2">{topic.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page"><span className="text-text font-semibold">{subMeta.label}</span></li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose prose-invert prose-lg mdx-content">
          <SectionKicker
            section="Toolkit"
            kicker={`${topic.name} · ${subMeta.label}`}
            color="cyan"
          />
          <CodeBlockWrapper>
          <MDXRemote source={page.content} components={mdxComponents} options={mdxOptions} />
          </CodeBlockWrapper>
        </article>

        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
