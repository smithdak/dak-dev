import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  SECURITY_CHAPTERS,
  getAllSecurityChapterSlugs,
  getSecurityChapterBySlug,
  getSecurityChapter,
} from '@/lib/security';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { getMdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { CodeBlockWrapper } from '@/components/blog/CodeBlockWrapper';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';
import { SectionKicker } from '@/components/learn/SectionKicker';
import { SectionPager } from '@/components/learn/SectionPager';

import { SITE_URL as siteUrl } from '@/lib/site';

export function generateStaticParams() {
  return getAllSecurityChapterSlugs().map((chapter) => ({ chapter }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: chapterSlug } = await params;
  const meta = getSecurityChapterBySlug(chapterSlug);
  const page = getSecurityChapter(chapterSlug);
  if (!meta || !page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/security/${meta.slug}`,
    },
    alternates: { canonical: `/learn/security/${meta.slug}` },
  };
}

export default async function SecurityChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const meta = getSecurityChapterBySlug(chapterSlug);
  const page = getSecurityChapter(chapterSlug);
  if (!meta || !page) notFound();

  const toc = extractTableOfContents(page.content);
  const mdxOptions: any = await getMdxOptions();

  const idx = SECURITY_CHAPTERS.findIndex((c) => c.slug === meta.slug);
  const prev = idx > 0 ? SECURITY_CHAPTERS[idx - 1] : null;
  const next = idx < SECURITY_CHAPTERS.length - 1 ? SECURITY_CHAPTERS[idx + 1] : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Security', url: '/learn/security' },
    { name: meta.name },
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
            <Link
              href="/learn/security"
              className="hover:text-text hover:underline underline-offset-2"
            >
              Security
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="text-text font-semibold">{meta.name}</span>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose prose-invert prose-lg mdx-content">
          <SectionKicker
            section="Security"
            kicker={`Chapter ${meta.number}`}
            color="red"
          />
          <CodeBlockWrapper>
            <MDXRemote source={page.content} components={mdxComponents} options={mdxOptions} />
          </CodeBlockWrapper>

          <SectionPager
            color="red"
            prev={
              prev
                ? { href: `/learn/security/${prev.slug}`, number: prev.number, name: prev.name }
                : null
            }
            next={
              next
                ? { href: `/learn/security/${next.slug}`, number: next.number, name: next.name }
                : null
            }
          />
        </article>

        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
