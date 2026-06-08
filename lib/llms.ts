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
import { SITE_URL } from './site';

const PILLARS = [
  {
    name: 'Agent Patterns',
    path: '/learn/patterns',
    note: 'Named, repeatable techniques for working effectively with AI coding agents.',
  },
  {
    name: 'Claude Code Toolkit',
    path: '/learn/toolkit',
    note: "Expert deep-dives into Claude Code's features for production agentic engineering.",
  },
  {
    name: 'The Harness',
    path: '/learn/harness',
    note: 'The runtime around the model — the agent loop, context, and tools.',
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

  const learnLines = PILLARS.map(
    (p) => `- [${p.name}](${SITE_URL}${p.path}): ${p.note}`
  ).join('\n');

  const postLines = posts
    .map((post) => {
      const { title, slug, excerpt } = post.frontmatter;
      return `- [${oneLine(title)}](${SITE_URL}/blog/${slug}): ${oneLine(excerpt)}`;
    })
    .join('\n');

  return `# Dakota Smith

> Personal engineering blog and a four-pillar Learn platform on agentic engineering — patterns, the Claude Code toolkit, the agent harness, and security.

Dakota Smith is a fullstack solutions architect. This site pairs an engineering blog with structured, expert-level guides for building with AI coding agents. Content is static MDX; full article bodies render server-side without JavaScript.

## Learn

${learnLines}

## Blog

${postLines}

## Optional

- [RSS feed](${SITE_URL}/feed.xml): Full-text feed of new posts.
- [Sitemap](${SITE_URL}/sitemap.xml): Complete URL index.
- [About](${SITE_URL}/about): Author background and contact.
`;
}
