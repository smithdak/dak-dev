import { getAllPosts } from './posts';
import { SITE_URL } from './site';

const SITE_NAME = 'Dakota Smith Blog';
const SITE_DESCRIPTION = 'High-performance personal blog featuring engineering projects, web development insights, and technical tutorials.';
const AUTHOR_NAME = 'Dakota Smith';
const AUTHOR_EMAIL = 'dakota@twofold.tech';

/**
 * Escape XML special characters to prevent invalid XML
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate RSS 2.0 compliant XML feed
 * @param limit - Maximum number of posts to include (default: 50)
 * @returns RSS XML string
 */
export function generateRSSFeed(limit: number = 50): string {
  const posts = getAllPosts().slice(0, limit);
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const { title, excerpt, slug, date, author, tags } = post.frontmatter;
      const postUrl = `${SITE_URL}/blog/${slug}`;
      const pubDate = new Date(date).toUTCString();
      const authorName = author || AUTHOR_NAME;

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${escapeXml(authorName)})</author>
      ${tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
${items}
  </channel>
</rss>`;
}
