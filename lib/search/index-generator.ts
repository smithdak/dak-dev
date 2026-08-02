/**
 * Search index generator - server-only (uses Node.js fs)
 * Generates one canonical search index from every published content loader.
 */

import { getAllPosts, type Post } from '../posts';
import { getAllPatterns, CHAPTERS, type Pattern } from '../patterns';
import {
  getAllToolkitPages,
  getToolkitProducts,
  getToolkitTopicBySlug,
  SUB_PAGE_META,
} from '../toolkit';
import { getAllHarnessChapters } from '../harness';
import { getAllSecurityChapters } from '../security';
import { getAllDemos, getAllExplainers, GLOSSARY_TERMS } from '../onramp';
import { slugify } from '../utils';
import type { SearchContentType, SearchIndexItem } from './types';
import workProducts from '../../content/products.json';

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
  const topicItems = getAllToolkitPages().map((page) => {
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

  const productItems = getToolkitProducts().map((product) =>
    toSearchItem({
      slug: `toolkit-product-${product.id}`,
      href: `/learn/toolkit/products/${product.id}`,
      title: `${product.name} Capability Guide`,
      excerpt: product.description,
      content: `${product.vendor} ${product.name} ${product.surfaces.join(' ')}`,
      keywords: [product.name, product.vendor, ...product.surfaces],
      type: 'toolkit',
      label: 'Product guide',
      section: 'Agent Tooling',
    })
  );

  return [...topicItems, ...productItems];
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

const WORK_SECTION_LABELS: Record<string, string> = {
  agent: 'Agent systems',
  infrastructure: 'Infrastructure',
  plugin: 'Plugins',
  product: 'Products',
};

function generateWorkSearchItems(): SearchIndexItem[] {
  return workProducts
    .filter((product) => /^https?:\/\//.test(product.url))
    .map((product) =>
      toSearchItem({
        slug: `work-${product.id}`,
        href: product.url,
        title: product.name,
        excerpt: product.description,
        content: `${product.description} ${product.category} ${product.date}`,
        tags: ['work', product.category],
        keywords: [product.id, product.name, product.category],
        type: 'work',
        label: product.url.startsWith('https://github.com/')
          ? 'Public repository'
          : 'External project',
        section: `Work · ${WORK_SECTION_LABELS[product.category] ?? product.category}`,
      })
    );
}

/**
 * Generate the search index from all published leaf content and external Work
 * records. Internal Work links are already indexed by their canonical content
 * loader and are excluded here to avoid competing duplicate destinations.
 * Collection pages are intentionally excluded so they do not compete with
 * their own children. Returns items optimized for client-side search.
 */
export function generateSearchIndex(): SearchIndexItem[] {
  return [
    ...generatePostSearchItems(),
    ...generatePatternSearchItems(),
    ...generateToolkitSearchItems(),
    ...generateHarnessSearchItems(),
    ...generateSecuritySearchItems(),
    ...generateStartSearchItems(),
    ...generateWorkSearchItems(),
  ];
}
