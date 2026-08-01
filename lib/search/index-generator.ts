/**
 * Search index generator - server-only (uses Node.js fs)
 * Generates one canonical search index from every published content loader.
 */

import { getAllPosts, type Post } from '../posts';
import { getAllPatterns, CHAPTERS, type Pattern } from '../patterns';
import { getAllToolkitPages, getToolkitTopicBySlug, SUB_PAGE_META } from '../toolkit';
import { getAllHarnessChapters } from '../harness';
import { getAllSecurityChapters } from '../security';
import { getAllDemos, getAllExplainers, GLOSSARY_TERMS } from '../onramp';
import { slugify } from '../utils';
import type { SearchContentType, SearchIndexItem } from './types';

/**
 * Strip MDX/HTML tags and special characters from content
 */
function stripMarkdown(content: string): string {
  return (
    content
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`[^`]*`/g, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove MDX component syntax
      .replace(/<\/?[A-Z][A-Za-z0-9]*[^>]*>/g, '')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove markdown bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove markdown links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // Remove frontmatter
      .replace(/^---[\s\S]*?---/gm, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

interface SearchSource {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  content: string;
  type: SearchContentType;
  label: string;
  section?: string;
  tags?: string[];
  keywords?: string[];
  date?: string;
}

function toSearchItem(source: SearchSource): SearchIndexItem {
  return {
    slug: source.slug,
    href: source.href,
    title: source.title,
    excerpt: source.excerpt,
    contentPreview: stripMarkdown(source.content).slice(0, 500),
    tags: source.tags ?? [],
    keywords: source.keywords ?? [],
    date: source.date,
    type: source.type,
    label: source.label,
    section: source.section,
  };
}

function generatePostSearchItems(): SearchIndexItem[] {
  return getAllPosts().map((post: Post) =>
    toSearchItem({
      slug: post.frontmatter.slug,
      href: `/blog/${post.frontmatter.slug}`,
      title: post.frontmatter.title,
      excerpt: post.frontmatter.excerpt,
      content: post.content,
      tags: post.frontmatter.tags,
      keywords: post.frontmatter.keywords,
      date: post.frontmatter.date,
      type: 'post',
      label: 'Article',
      section: 'Blog',
    })
  );
}

function generatePatternSearchItems(): SearchIndexItem[] {
  return getAllPatterns().map((pattern: Pattern) => {
    const chapter = CHAPTERS.find((item) => item.number === pattern.frontmatter.chapter);

    return toSearchItem({
      slug: pattern.frontmatter.slug,
      href: `/learn/patterns/${pattern.frontmatter.slug}`,
      title: pattern.frontmatter.name,
      excerpt: pattern.frontmatter.intent,
      content: pattern.content,
      keywords: pattern.frontmatter.keywords,
      type: 'pattern',
      label: `Pattern ${pattern.frontmatter.number}`,
      section: chapter?.name ?? 'Agent Patterns',
    });
  });
}

function generateToolkitSearchItems(): SearchIndexItem[] {
  return getAllToolkitPages().map((page) => {
    const { topic, subPage } = page.frontmatter;
    const topicMeta = getToolkitTopicBySlug(topic);
    const subPageLabel = subPage ? SUB_PAGE_META[subPage].label : 'Expert Guide';

    return toSearchItem({
      slug: subPage ? `${topic}-${subPage}` : topic,
      href: subPage ? `/learn/toolkit/${topic}/${subPage}` : `/learn/toolkit/${topic}`,
      title: page.frontmatter.title,
      excerpt: page.frontmatter.description,
      content: page.content,
      keywords: page.frontmatter.keywords,
      type: 'toolkit',
      label: 'Toolkit',
      section: `${topicMeta?.name ?? topic} · ${subPageLabel}`,
    });
  });
}

function generateHarnessSearchItems(): SearchIndexItem[] {
  return getAllHarnessChapters().map((chapter) =>
    toSearchItem({
      slug: chapter.frontmatter.slug,
      href: `/learn/harness/${chapter.frontmatter.slug}`,
      title: chapter.frontmatter.title,
      excerpt: chapter.frontmatter.description,
      content: chapter.content,
      keywords: chapter.frontmatter.keywords,
      type: 'harness',
      label: `Harness ${chapter.frontmatter.number}`,
      section: 'Harness Engineering',
    })
  );
}

function generateSecuritySearchItems(): SearchIndexItem[] {
  return getAllSecurityChapters().map((chapter) =>
    toSearchItem({
      slug: chapter.frontmatter.slug,
      href: `/learn/security/${chapter.frontmatter.slug}`,
      title: chapter.frontmatter.title,
      excerpt: chapter.frontmatter.description,
      content: chapter.content,
      keywords: chapter.frontmatter.keywords,
      type: 'security',
      label: `Security ${chapter.frontmatter.number}`,
      section: 'Security Engineering',
    })
  );
}

function generateStartSearchItems(): SearchIndexItem[] {
  const demos = getAllDemos().map((demo) =>
    toSearchItem({
      slug: demo.frontmatter.slug,
      href: `/learn/start/demo/${demo.frontmatter.slug}`,
      title: demo.frontmatter.title,
      excerpt: demo.frontmatter.description,
      content: `${demo.frontmatter.scenario} ${demo.content}`,
      keywords: demo.frontmatter.keywords,
      type: 'start',
      label: 'Demo, Decoded',
      section: 'Start Here',
    })
  );

  const explainers = getAllExplainers().map((explainer) =>
    toSearchItem({
      slug: explainer.frontmatter.slug,
      href: `/learn/start/explain/${explainer.frontmatter.slug}`,
      title: explainer.frontmatter.title,
      excerpt: explainer.frontmatter.description,
      content: `${explainer.frontmatter.mentalModel} ${explainer.content}`,
      keywords: explainer.frontmatter.keywords,
      type: 'start',
      label: 'Explainer',
      section: 'Start Here',
    })
  );

  const decoderTerms = GLOSSARY_TERMS.map((term) => {
    const termSlug = slugify(term.term);
    return toSearchItem({
      slug: `decoder-${termSlug}`,
      href: `/learn/start/decoder#term-${termSlug}`,
      title: term.term,
      excerpt: term.definition,
      content: `${term.analogy} ${term.definition} ${term.example}`,
      type: 'start',
      label: 'Decoder',
      section: 'Start Here',
    });
  });

  return [...demos, ...explainers, ...decoderTerms];
}

/**
 * Generate the search index from all published leaf content. Collection pages
 * are intentionally excluded so they do not compete with their own children.
 * Returns array of searchable items optimized for client-side search
 */
export function generateSearchIndex(): SearchIndexItem[] {
  return [
    ...generatePostSearchItems(),
    ...generatePatternSearchItems(),
    ...generateToolkitSearchItems(),
    ...generateHarnessSearchItems(),
    ...generateSecuritySearchItems(),
    ...generateStartSearchItems(),
  ];
}
