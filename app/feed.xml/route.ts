import { generateRSSFeed } from '@/lib/rss';

/**
 * Prerender the feed at build time. This is a static site (DESIGN.md §3); the
 * feed is derived entirely from build-time MDX, so it must be emitted as a
 * static asset rather than server-rendered on demand.
 */
export const dynamic = 'force-static';

/**
 * RSS feed route handler
 * Generates and serves RSS 2.0 XML feed at /feed.xml
 */
export async function GET() {
  const feed = await generateRSSFeed(50);

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
