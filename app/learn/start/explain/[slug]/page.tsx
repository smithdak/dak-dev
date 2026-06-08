import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getExplainer, getAllExplainerSlugs, getExplainerMeta } from '@/lib/onramp';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { Callout } from '@/components/patterns/Callout';
import { Annotation } from '@/components/learn/Annotation';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';

import { SITE_URL as siteUrl } from '@/lib/site';

// Explainer MDX may use the shared interactive islands plus Callout/Annotation.
// First-use jargon is auto-decoded via the <glossaryterm> toggletip already in
// mdxComponents (lib/rehype-glossary).
const explainerComponents = { ...mdxComponents, Callout, Annotation };

export function generateStaticParams() {
  return getAllExplainerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getExplainerMeta(slug);
  const page = getExplainer(slug);
  if (!meta || !page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/start/explain/${slug}`,
    },
    alternates: { canonical: `/learn/start/explain/${slug}` },
  };
}

export default async function ExplainerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getExplainerMeta(slug);
  const page = getExplainer(slug);
  if (!meta || !page) notFound();

  const toc = extractTableOfContents(page.content);
  const mdxOptions: any = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Start Here', url: '/learn/start' },
    { name: meta.title },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-5 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
          <li>
            <Link href="/learn" className="hover:text-text hover:underline underline-offset-2">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/learn/start" className="hover:text-text hover:underline underline-offset-2">
              Start Here
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="text-text font-semibold">{meta.title}</span>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose prose-invert prose-lg mdx-content">
          <SectionKicker section="Start Here" kicker="Understand the idea" color="amber" />
          <CodeBlockWrapper>
            <MDXRemote source={page.content} components={explainerComponents} options={mdxOptions} />
          </CodeBlockWrapper>

          <div className="not-prose mt-12 border-t-4 border-text pt-6">
            <Link
              href="/learn/start"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-chapter-5 hover:underline decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Start Here
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
