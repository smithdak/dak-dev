/**
 * robots.txt generator.
 *
 * robots.txt with explicit User-Agent rules is the real control lever for how
 * AI crawlers treat the site (llms.txt is not — major LLM crawlers ignore it).
 * This site WANTS reach and AI-search citations, so the major AI crawlers are
 * explicitly allowed rather than left to the wildcard, making intent legible.
 * To opt OUT of a crawler later, change its entry to `disallow: '/'`.
 */

import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dak-dev.vercel.app';

// Private/utility paths no crawler should index.
const DISALLOW = ['/api/', '/components-demo/'];

// AI training + answer-engine crawlers we explicitly welcome.
const AI_CRAWLERS = [
  'GPTBot', // OpenAI (ChatGPT training)
  'OAI-SearchBot', // OpenAI (ChatGPT search citations)
  'ChatGPT-User', // OpenAI (user-initiated browsing)
  'ClaudeBot', // Anthropic (Claude training)
  'Claude-Web', // Anthropic (Claude browsing)
  'anthropic-ai', // Anthropic (legacy)
  'PerplexityBot', // Perplexity (index + citations)
  'Perplexity-User', // Perplexity (user-initiated fetch)
  'Google-Extended', // Google (Gemini/Vertex training opt-in)
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl (feeds many models)
  'Bytespider', // ByteDance
  'cohere-ai', // Cohere
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default policy for traditional search + everything unlisted.
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // Explicitly welcome AI crawlers (citations/training) under the same
      // disallow set. One rule per agent keeps the intent auditable.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
