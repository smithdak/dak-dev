import { generateLlmsTxt } from '@/lib/llms';

// SSG: deterministic at build (reads the same content loaders as the sitemap),
// so prerender it rather than server-render on demand.
export const dynamic = 'force-static';

/**
 * llms.txt route handler.
 * Serves the curated AI-agent site map at /llms.txt (llmstxt.org convention).
 */
export async function GET() {
  const body = generateLlmsTxt();

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
