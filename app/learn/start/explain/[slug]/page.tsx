import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getExplainer, getAllExplainerSlugs, getExplainerMeta } from '@/lib/onramp';
import { interactiveMdxComponents } from '@/components/blog/InteractiveMdxComponents';
import { Callout } from '@/components/patterns/Callout';
import { Annotation } from '@/components/learn/Annotation';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';
import { MobileTableOfContents } from '@/components/learn/MobileTableOfContents';
import { StickyTableOfContents } from '@/components/learn/StickyTableOfContents';

import { SITE_URL as siteUrl } from '@/lib/site';

// Explainer MDX may use the shared interactive islands plus Callout/Annotation.
// First-use jargon is auto-decoded via the <glossaryterm> native popover in
// interactiveMdxComponents (lib/rehype-glossary).
const explainerComponents = { ...interactiveMdxComponents, Callout, Annotation };

export const dynamicParams = false;

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

export default async function ExplainerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getExplainerMeta(slug);
  const page = getExplainer(slug);
  if (!meta || !page) notFound();

  const toc = extractTableOfContents(page.content);
  const mdxOptions = await getMdxOptions();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Start Here', url: '/learn/start' },
    { name: meta.title },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      <nav className="mb-5 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/learn" className="hover:text-text hover:underline underline-offset-2">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/learn/start"
              className="hover:text-text hover:underline underline-offset-2"
            >
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
        <article className="mdx-content min-w-0 text-lg">
          <SectionKicker section="Start Here" kicker="Understand the idea" color="amber" />
          <MobileTableOfContents items={toc} />
          <div className="max-w-[68ch]">
            <CodeBlockWrapper>
              <MDXRemote
                source={page.content}
                components={explainerComponents}
                options={mdxOptions as Parameters<typeof MDXRemote>[0]['options']}
              />
            </CodeBlockWrapper>
          </div>

          <div className="not-prose mt-12 border-t border-rule pt-6">
            <Link
              href="/learn/start"
              className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-chapter-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              Back to Start Here
            </Link>
          </div>
        </article>

        <StickyTableOfContents items={toc} />
      </div>
    </PageTransition>
  );
}
