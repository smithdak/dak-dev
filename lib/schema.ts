/**
 * Schema.org JSON-LD structured data generators
 * Provides rich snippets for search engines and social platforms
 */

import type { PostFrontmatter } from './posts';
import type { PatternFrontmatter, ChapterMeta } from './patterns';
import type { ToolkitFrontmatter, ToolkitTopicMeta } from './toolkit';
import { SITE_URL } from './site';

const SITE_NAME = 'Dakota Smith Blog';
const AUTHOR_NAME = 'Dakota Smith';
// On-site author page — the canonical entity URL for "Dakota Smith". Off-site
// profiles live in `sameAs` so knowledge graphs resolve them to this one node.
const AUTHOR_URL = `${SITE_URL}/about`;
const GITHUB_URL = 'https://github.com/smithdak';
const LINKEDIN_URL = 'https://linkedin.com/in/dakota-smith-a855b230';
// The publishing organisation ("the house, not the person"). Article-class
// schema expects an Organization publisher carrying a logo, distinct from the
// Person author.
const ORG_NAME = 'Twofold';
const ORG_URL = 'https://twofold.tech';
const ORG_LOGO_URL = `${SITE_URL}/twofold-logo`;

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url: string;
  sameAs?: string[];
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: PersonSchema;
  inLanguage: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface BlogPostingSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
  url: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface ProfilePageSchema {
  '@context': 'https://schema.org';
  '@type': 'ProfilePage';
  mainEntity: {
    '@type': 'Person';
    name: string;
    jobTitle: string;
    description: string;
    url: string;
    address?: {
      '@type': 'PostalAddress';
      addressLocality: string;
      addressRegion: string;
    };
    sameAs: string[];
    knowsAbout: string[];
  };
}

/**
 * Generate Person schema for author
 */
export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    // sameAs is the primary signal that resolves "Dakota Smith" to one entity.
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  };
}

/**
 * Generate Organization schema for the publisher.
 *
 * Article-class rich results expect publisher to be an Organization carrying a
 * logo (ImageObject), distinct from the Person author.
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: ORG_URL,
    logo: {
      '@type': 'ImageObject',
      url: ORG_LOGO_URL,
      width: 600,
      height: 60,
    },
  };
}

/**
 * Generate WebSite schema for homepage
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'High-performance personal blog featuring engineering projects, web development insights, and technical tutorials.',
    author: generatePersonSchema(),
    inLanguage: 'en-US',
    // Sitelinks search box eligibility — maps to the on-site ⌘K search.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BlogPosting schema for individual blog posts
 */
export function generateBlogPostingSchema(
  post: PostFrontmatter,
  content?: string
): BlogPostingSchema {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.hero.startsWith('http') ? post.hero : `${SITE_URL}${post.hero}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date, // Add dateModified to frontmatter if needed
    author: generatePersonSchema(),
    publisher: generateOrganizationSchema(),
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.keywords || post.tags,
  };
}

/**
 * Generate BreadcrumbList schema for navigation hierarchy
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${SITE_URL}${item.url}` }),
    })),
  };
}

/**
 * Generate ProfilePage schema for resume page
 */
export function generateResumeSchema(): ProfilePageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      jobTitle: 'Principal Architect | Enterprise DXP & Agentic Orchestration',
      description:
        'Systems Architect with 15 years in enterprise software, specializing in Sitecore/.NET modernization and Deterministic AI Orchestration. 30+ production-ready projects.',
      url: `${SITE_URL}/resume`,
      sameAs: [
        'https://linkedin.com/in/dakota-smith-a855b230',
        'https://github.com/smithdak',
      ],
      knowsAbout: [
        'Next.js',
        'React',
        'TypeScript',
        '.NET',
        'Sitecore',
        'Enterprise CMS',
        'AI Integration',
        'Solution Architecture',
      ],
    },
  };
}

/**
 * Generate TechArticle schema for individual pattern pages
 */
export function generatePatternSchema(
  pattern: PatternFrontmatter,
  chapter: ChapterMeta
) {
  const patternUrl = `${SITE_URL}/learn/patterns/${pattern.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${pattern.name} — Agent Pattern ${pattern.number}`,
    description: pattern.intent,
    url: patternUrl,
    author: generatePersonSchema(),
    publisher: generateOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': patternUrl,
    },
    keywords: pattern.keywords || [],
    proficiencyLevel: pattern.difficulty === 'beginner' ? 'Beginner' : pattern.difficulty === 'intermediate' ? 'Intermediate' : 'Expert',
    articleSection: `Chapter ${chapter.number}: ${chapter.name}`,
  };
}

/**
 * Generate CollectionPage schema for the patterns index
 */
export function generatePatternCollectionSchema(
  patternCount: number,
  chapterCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Agent Patterns — AI Coding Agent Reference',
    description: `A structured reference of ${patternCount} named patterns across ${chapterCount} chapters for working effectively with AI coding agents.`,
    url: `${SITE_URL}/learn/patterns`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: patternCount,
    },
  };
}

/**
 * Generate CollectionPage schema for a chapter page
 */
export function generateChapterSchema(
  chapter: ChapterMeta,
  patternCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Chapter ${chapter.number}: ${chapter.name} — Agent Patterns`,
    description: chapter.description,
    url: `${SITE_URL}/learn/patterns/chapter/${chapter.slug}`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: patternCount,
    },
  };
}

/**
 * Generate TechArticle schema for toolkit topic pages
 */
export function generateToolkitTopicSchema(
  topic: ToolkitTopicMeta,
  page: ToolkitFrontmatter
) {
  const topicUrl = `${SITE_URL}/learn/toolkit/${topic.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.title,
    description: page.description,
    url: topicUrl,
    author: generatePersonSchema(),
    publisher: generateOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': topicUrl,
    },
    keywords: page.keywords || [],
    proficiencyLevel: 'Expert',
    articleSection: 'Claude Code Toolkit',
  };
}

/**
 * Generate CollectionPage schema for the toolkit index
 */
export function generateToolkitCollectionSchema(topicCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Toolkit — Expert\'s Guide to Agentic Engineering',
    description: `${topicCount} expert deep-dives into Claude Code features for production agentic engineering.`,
    url: `${SITE_URL}/learn/toolkit`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topicCount,
    },
  };
}

/**
 * Generate CollectionPage + ItemList schema for the /learn hub.
 *
 * The hub that links the whole Learn platform is the natural CollectionPage of
 * the four pillars; without this it is invisible as a structured entity while
 * its children carry CollectionPage/ItemList.
 */
export function generateLearnCollectionSchema() {
  const pillars = [
    {
      name: 'Agent Patterns',
      url: `${SITE_URL}/learn/patterns`,
      description:
        'A structured reference of named patterns for working effectively with AI coding agents.',
    },
    {
      name: 'Claude Code Toolkit',
      url: `${SITE_URL}/learn/toolkit`,
      description:
        "Expert deep-dives into Claude Code's features for production agentic engineering.",
    },
    {
      name: 'The Harness',
      url: `${SITE_URL}/learn/harness`,
      description:
        'How the agent loop, context, and tools fit together — the runtime around the model.',
    },
    {
      name: 'Security',
      url: `${SITE_URL}/learn/security`,
      description:
        'Threat models and controls for agentic systems — prompt injection, tool risk, and trust boundaries.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Learn — Agentic Engineering',
    description:
      'Expert guides for agentic engineering across four pillars: Patterns, Toolkit, Harness, and Security.',
    url: `${SITE_URL}/learn`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pillars.length,
      itemListElement: pillars.map((pillar, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pillar.name,
        description: pillar.description,
        url: pillar.url,
      })),
    },
  };
}

/**
 * Render JSON-LD script tag
 */
export function renderJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
