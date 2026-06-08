import type { Metadata } from 'next';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { computeGraphLayout, COLUMN_COUNT, SIDE_PADDING, TOP_PADDING } from '@/lib/graph-layout';
import { PatternLanguageGraph } from '@/components/patterns/PatternLanguageGraph';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';

import { SITE_URL as siteUrl } from '@/lib/site';

export function generateMetadata(): Metadata {
  const allPatterns = getAllPatterns();
  const description = `Interactive graph showing how ${allPatterns.length} agent patterns relate to each other — enables, composes, prevents, and contrasts relationships at a glance.`;
  const ogImage = `${siteUrl}/api/og?type=pattern&title=${encodeURIComponent('Pattern Language Map')}`;

  return {
    title: 'Pattern Language Map',
    description,
    keywords: [
      'pattern language',
      'pattern map',
      'agent patterns',
      'pattern relationships',
    ],
    openGraph: {
      title: 'Pattern Language Map — Agent Patterns',
      description,
      url: `${siteUrl}/learn/patterns/graph`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Pattern Language Map' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pattern Language Map — Agent Patterns',
      description,
      images: [ogImage],
    },
    alternates: { canonical: '/learn/patterns/graph' },
  };
}

export default function PatternGraphPage() {
  const allPatterns = getAllPatterns();
  const graphData = allPatterns.length >= 3 ? computeGraphLayout(allPatterns) : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Learn', url: '/learn' },
    { name: 'Patterns', url: '/learn/patterns' },
    { name: 'Graph' },
  ]);

  return (
    <div className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <header className="pt-2 pb-8 -mx-4 sm:-mx-6 lg:-mx-0 px-4 sm:px-6 lg:px-0">
        <nav className="mb-5" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-muted font-mono">
            <li>
              <Link
                href="/learn"
                className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background"
              >
                Learn
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/learn/patterns"
                className="hover:text-text hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background"
              >
                Patterns
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="text-text font-semibold">Graph</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Pattern Language Map
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          Hover to highlight connections. Click any node to navigate to that
          pattern. Lines show how patterns relate: enables, composes, prevents,
          and contrasts.
        </p>
      </header>

      <div className="border-b-2 border-text/30" />

      {/* Graph */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-10">
        {graphData ? (
          <PatternLanguageGraph
            nodes={graphData.nodes}
            edges={graphData.edges}
            width={graphData.width}
            height={graphData.height}
            columnCount={COLUMN_COUNT}
            sidePadding={SIDE_PADDING}
            topPadding={TOP_PADDING}
          />
        ) : (
          <div className="border border-dashed border-muted/30 p-12 text-center">
            <p className="text-xs font-mono text-muted uppercase tracking-wider">
              Graph requires at least 3 published patterns
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
