/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap with all posts, patterns, toolkit, pages, and tag pages
 */

import { getAllPosts } from '@/lib/posts';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS } from '@/lib/toolkit';
import { HARNESS_CHAPTERS } from '@/lib/harness';
import { SECURITY_CHAPTERS } from '@/lib/security';
import { getAllTagSlugs } from '@/lib/tags';
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://dak-dev.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const patterns = getAllPatterns();
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
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
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
  const toolkitPages: MetadataRoute.Sitemap = TOOLKIT_TOPICS.map((topic) => ({
    url: `${SITE_URL}/learn/toolkit/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

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

  return [...staticPages, ...postPages, ...patternPages, ...patternSubPages, ...chapterPages, ...toolkitPages, ...harnessPages, ...securityPages, ...tagPages];
}
