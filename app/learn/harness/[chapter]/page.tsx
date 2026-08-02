import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  HARNESS_CHAPTERS,
  getAllHarnessChapterSlugs,
  getHarnessChapterBySlug,
  getHarnessChapter,
} from '@/lib/harness';
import { interactiveMdxComponents } from '@/components/blog/InteractiveMdxComponents';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';
import { SectionPager } from '@/components/learn/SectionPager';
import { MobileTableOfContents } from '@/components/learn/MobileTableOfContents';
import { StickyTableOfContents } from '@/components/learn/StickyTableOfContents';

import { SITE_URL as siteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllHarnessChapterSlugs().map((chapter) => ({ chapter }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: chapterSlug } = await params;
  const meta = getHarnessChapterBySlug(chapterSlug);
  const page = getHarnessChapter(chapterSlug);
  if (!meta || !page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/harness/${meta.slug}`,
    },
    alternates: { canonical: `/learn/harness/${meta.slug}` },
  };
}

export default async function HarnessChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const meta = getHarnessChapterBySlug(chapterSlug);
  const page = getHarnessChapter(chapterSlug);
  if (!meta || !page) notFound();

  const toc = extractTableOfContents(page.content);
  const mdxOptions = await getMdxOptions();

  const idx = HARNESS_CHAPTERS.findIndex((c) => c.slug === meta.slug);
  const prev = idx > 0 ? HARNESS_CHAPTERS[idx - 1] : null;
  const next = idx < HARNESS_CHAPTERS.length - 1 ? HARNESS_CHAPTERS[idx + 1] : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Harness', url: '/learn/harness' },
    { name: meta.name },
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
              href="/learn/harness"
              className="hover:text-text hover:underline underline-offset-2"
            >
              Harness
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="text-text font-semibold">{meta.name}</span>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="mdx-content min-w-0 text-lg">
          <SectionKicker section="Harness" kicker={`Chapter ${meta.number}`} color="accent" />
          <MobileTableOfContents items={toc} />
          <div className="max-w-[68ch]">
            <CodeBlockWrapper>
              <MDXRemote
                source={page.content}
                components={interactiveMdxComponents}
                options={mdxOptions as Parameters<typeof MDXRemote>[0]['options']}
              />
            </CodeBlockWrapper>
          </div>

          <SectionPager
            color="accent"
            prev={
              prev
                ? { href: `/learn/harness/${prev.slug}`, number: prev.number, name: prev.name }
                : null
            }
            next={
              next
                ? { href: `/learn/harness/${next.slug}`, number: next.number, name: next.name }
                : null
            }
          />
        </article>

        <StickyTableOfContents items={toc} />
      </div>
    </PageTransition>
  );
}
