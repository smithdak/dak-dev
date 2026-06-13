import { getAllPosts } from './posts';
import { SITE_URL } from './site';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { toHtml } from 'hast-util-to-html';
import type { Element, Root, RootContent } from 'hast';

const SITE_NAME = 'Dakota Smith Blog';
const SITE_DESCRIPTION =
  'High-performance personal blog featuring engineering projects, web development insights, and technical tutorials.';
const AUTHOR_NAME = 'Dakota Smith';
const AUTHOR_EMAIL = 'dakota@twofold.tech';
const SITE_LANGUAGE = 'en-us';
const FEED_TTL_MINUTES = 60;
/** Raster brand asset used as the feed's channel logo (SVG is not portable across readers). */
const FEED_IMAGE_URL = `${SITE_URL}/og-default.png`;
const GENERATOR = 'Custom RSS generator (Next.js)';
const SPEC_DOCS = 'https://www.rssboard.org/rss-specification';

/**
 * Escape XML special characters to prevent invalid XML.
 * Used for element text and attribute values that are NOT inside CDATA.
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
 * Resolve a (possibly root-relative) URL to an absolute one. Feed readers
 * render content outside the site origin, so every link/image must be absolute.
 */
function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Best-effort MIME type from a file extension, for media enclosures. */
function imageMimeType(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}

/** Wrap HTML in a CDATA section, escaping any `]]>` that would close it early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

/** Rewrite relative <a href> / <img|source src> URLs in a hast tree to absolute. */
function absolutizeTree(node: Root | RootContent): void {
  if (node.type === 'element') {
    const el = node as Element;
    const props = el.properties ?? {};
    if (el.tagName === 'a' && typeof props.href === 'string') {
      props.href = absoluteUrl(props.href);
    }
    if ((el.tagName === 'img' || el.tagName === 'source') && typeof props.src === 'string') {
      props.src = absoluteUrl(props.src);
    }
  }
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) absolutizeTree(child);
  }
}

// Markdown (CommonMark + GFM) → HTML. Code blocks are emitted as plain
// <pre><code>; syntax highlighting is an on-site concern, and feed readers
// strip styling regardless. Custom MDX components are not used in post prose.
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true });

async function renderContentHtml(markdown: string): Promise<string> {
  const mdast = markdownProcessor.parse(markdown);
  const hast = (await markdownProcessor.run(mdast)) as Root;
  absolutizeTree(hast);
  return toHtml(hast, {
    allowDangerousHtml: true,
    // Named references keep ampersands/quotes as &amp;/&quot; rather than
    // numeric escapes — friendlier output and easier to validate.
    characterReferences: { useNamedReferences: true },
  });
}

/**
 * Generate an RSS 2.0 feed with full-text content, per-item images, and
 * Dublin Core author names.
 *
 * @param limit - Maximum number of posts to include (default: 50)
 * @returns RSS XML string
 */
export async function generateRSSFeed(limit: number = 50): Promise<string> {
  const posts = getAllPosts().slice(0, limit);

  // Derive feed timestamps from content (newest post) rather than wall-clock
  // time, so an unchanged corpus produces a byte-identical feed across builds.
  const newestDate = posts.length > 0 ? new Date(posts[0].frontmatter.date) : new Date(0);
  const buildDate = newestDate.toUTCString();
  const copyrightYear = newestDate.getUTCFullYear();

  const items = (
    await Promise.all(
      posts.map(async (post) => {
        const { title, excerpt, slug, date, author, tags, hero, thumbnail } = post.frontmatter;
        const postUrl = `${SITE_URL}/blog/${slug}`;
        const pubDate = new Date(date).toUTCString();
        const authorName = author || AUTHOR_NAME;
        const contentHtml = await renderContentHtml(post.content);

        const categories = (tags ?? [])
          .map((tag) => `      <category>${escapeXml(tag)}</category>`)
          .join('\n');

        const media: string[] = [];
        if (hero) {
          const heroUrl = absoluteUrl(hero);
          media.push(
            `      <media:content url="${escapeXml(heroUrl)}" medium="image" type="${imageMimeType(heroUrl)}" />`
          );
        }
        if (thumbnail) {
          const thumbUrl = absoluteUrl(thumbnail);
          media.push(`      <media:thumbnail url="${escapeXml(thumbUrl)}" />`);
        }

        return [
          '    <item>',
          `      <title>${escapeXml(title)}</title>`,
          `      <link>${postUrl}</link>`,
          `      <guid isPermaLink="true">${postUrl}</guid>`,
          `      <pubDate>${pubDate}</pubDate>`,
          `      <dc:creator>${escapeXml(authorName)}</dc:creator>`,
          `      <author>${AUTHOR_EMAIL} (${escapeXml(authorName)})</author>`,
          `      <description>${escapeXml(excerpt)}</description>`,
          `      <content:encoded>${cdata(contentHtml)}</content:encoded>`,
          categories,
          ...media,
          '    </item>',
        ]
          .filter(Boolean)
          .join('\n');
      })
    )
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <copyright>© ${copyrightYear} ${escapeXml(AUTHOR_NAME)}</copyright>
    <managingEditor>${AUTHOR_EMAIL} (${escapeXml(AUTHOR_NAME)})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${escapeXml(AUTHOR_NAME)})</webMaster>
    <pubDate>${buildDate}</pubDate>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>${escapeXml(GENERATOR)}</generator>
    <docs>${SPEC_DOCS}</docs>
    <ttl>${FEED_TTL_MINUTES}</ttl>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(FEED_IMAGE_URL)}</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;
}
