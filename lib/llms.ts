/**
 * llms.txt generator.
 *
 * Emits an /llms.txt per the llmstxt.org convention: a required H1 (site name),
 * an optional `>` summary blockquote, then H2 sections of markdown link lists.
 * Built from the same content sources as the sitemap/RSS so the curated map an
 * AI agent reads stays in sync with what actually ships. The `## Optional`
 * heading is spec-significant: it marks lower-priority links to deprioritise.
 */

import { getAllPosts } from './posts';
import { getToolkitProducts } from './toolkit';
import { SITE_URL } from './site';

const PILLARS = [
  {
    name: 'Agent Patterns',
    path: '/learn/patterns',
    note: 'Named, repeatable techniques for working effectively with AI coding agents.',
  },
  {
    name: 'Agent Tooling',
    path: '/learn/toolkit',
    note: 'Source-backed capability guides comparing Claude Code, OpenAI Codex, and GitHub Copilot.',
  },
  {
    name: 'The Harness',
    path: '/learn/harness',
    note: 'Runtime control beneath the model and delivery control above one or more runtimes.',
  },
  {
    name: 'Security',
    path: '/learn/security',
    note: 'Threat models and controls for agentic systems.',
  },
];

/**
 * Collapse whitespace/newlines so a multi-line excerpt stays on one list line.
 */
function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Generate the /llms.txt body (markdown).
 */
export function generateLlmsTxt(): string {
  const posts = getAllPosts();
  const products = getToolkitProducts();

  const learnLines = PILLARS.map((p) => `- [${p.name}](${SITE_URL}${p.path}): ${p.note}`).join(
    '\n'
  );

  const postLines = posts
    .map((post) => {
      const { title, slug, excerpt } = post.frontmatter;
      return `- [${oneLine(title)}](${SITE_URL}/blog/${slug}): ${oneLine(excerpt)}`;
    })
    .join('\n');

  const productLines = products
    .map(
      (product) =>
        `- [${product.name} capability guide](${SITE_URL}/learn/toolkit/products/${product.id}): ${oneLine(product.description)}`
    )
    .join('\n');

  return `# Dakota Smith

> An independent publication and four-field guide to agentic engineering — patterns, cross-vendor tooling, delivery harnesses, and security.

Dakota Smith is a principal architect focused on agentic systems, governed delivery, and enterprise platforms. This site pairs an engineering blog with structured, expert-level guides for building with AI coding agents. Content is static MDX; full article bodies render server-side without JavaScript.

## Learn

${learnLines}

## Product capability guides

${productLines}

## Blog

${postLines}

## Optional

- [RSS feed](${SITE_URL}/feed.xml): Full-text feed of new posts.
- [Sitemap](${SITE_URL}/sitemap.xml): Complete URL index.
- [About](${SITE_URL}/about): Author background and contact.
`;
}
