/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap with all posts, patterns, toolkit, pages, and tag pages
 */

import { getAllPosts } from '@/lib/posts';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_REVIEWED_AT, getAllToolkitPages, getToolkitProductSlugs } from '@/lib/toolkit';
import { HARNESS_CHAPTERS } from '@/lib/harness';
import { SECURITY_CHAPTERS } from '@/lib/security';
import { getAllDemos, getAllExplainers } from '@/lib/onramp';
import { getAllTagSlugs } from '@/lib/tags';
import { SITE_URL } from '@/lib/site';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const patterns = getAllPatterns();
  const toolkitPages = getAllToolkitPages();
  const toolkitProductSlugs = getToolkitProductSlugs();
  const demos = getAllDemos();
  const explainers = getAllExplainers();
  const tagSlugs = getAllTagSlugs(posts);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/patterns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/toolkit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/harness`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/security`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn/start`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/learn/start/decoder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Blog post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Pattern pages
  const patternPages: MetadataRoute.Sitemap = patterns.map((pattern) => ({
    url: `${SITE_URL}/learn/patterns/${pattern.frontmatter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const toolkitProductPages: MetadataRoute.Sitemap = toolkitProductSlugs.map((product) => ({
    url: `${SITE_URL}/learn/toolkit/products/${product}`,
    lastModified: new Date(TOOLKIT_REVIEWED_AT),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Pattern sub-pages (graph, cards)
  const patternSubPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/learn/patterns/graph`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/learn/patterns/cards`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Chapter pages
  const chapterPages: MetadataRoute.Sitemap = CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/learn/patterns/chapter/${chapter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Toolkit topic pages
  const toolkitContentPages: MetadataRoute.Sitemap = toolkitPages.map((page) => ({
    url: page.frontmatter.subPage
      ? `${SITE_URL}/learn/toolkit/${page.frontmatter.topic}/${page.frontmatter.subPage}`
      : `${SITE_URL}/learn/toolkit/${page.frontmatter.topic}`,
    lastModified: new Date(page.frontmatter.reviewedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const onrampPages: MetadataRoute.Sitemap = [
    ...demos.map((demo) => ({
      url: `${SITE_URL}/learn/start/demo/${demo.frontmatter.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...explainers.map((explainer) => ({
      url: `${SITE_URL}/learn/start/explain/${explainer.frontmatter.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Harness chapter pages
  const harnessPages: MetadataRoute.Sitemap = HARNESS_CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/learn/harness/${chapter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Security chapter pages
  const securityPages: MetadataRoute.Sitemap = SECURITY_CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/learn/security/${chapter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tagSlugs.map((tagSlug) => ({
    url: `${SITE_URL}/blog/tags/${tagSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...postPages,
    ...patternPages,
    ...patternSubPages,
    ...chapterPages,
    ...toolkitContentPages,
    ...toolkitProductPages,
    ...harnessPages,
    ...securityPages,
    ...onrampPages,
    ...tagPages,
  ];
}
