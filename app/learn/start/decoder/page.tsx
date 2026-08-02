import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { Decoder } from '@/components/learn/Decoder';
import { GLOSSARY_CLUSTERS, GLOSSARY_TERMS } from '@/lib/onramp';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';

import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The Decoder',
  description: `${GLOSSARY_TERMS.length} plain-English definitions of agentic-engineering jargon — agent, context window, token, tool use, MCP, harness, RAG, hallucination — each paired with an analogy and a real example.`,
  keywords: [
    'AI glossary',
    'agentic engineering glossary',
    'AI terms explained',
    'what is a context window',
    'what is an AI agent',
    'MCP explained',
  ],
  openGraph: {
    title: 'The Decoder — Agentic Engineering Jargon in Plain English',
    description:
      'The words that fly past in a demo, decoded: analogy, precise definition, and a real example for each.',
    url: `${siteUrl}/learn/start/decoder`,
  },
  alternates: { canonical: '/learn/start/decoder' },
};

export default function DecoderPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Start Here', url: '/learn/start' },
    { name: 'The Decoder' },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      <div className="learn-standalone-shell">
        <nav className="px-4 pt-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
            <li>
              <Link href="/learn" className="underline-offset-2 hover:text-text hover:underline">
                Learn
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/learn/start"
                className="underline-offset-2 hover:text-text hover:underline"
              >
                Start Here
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">
              <span className="font-semibold text-text">The Decoder</span>
            </li>
          </ol>
        </nav>

        <header className="border-b border-text/20 px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(18rem,1fr)] lg:items-end lg:gap-16">
            <div>
              <p className="editorial-kicker mb-5 text-chapter-5">Plain-English field lexicon</p>
              <h1 className="font-display max-w-4xl text-balance text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                The Decoder
              </h1>
            </div>
            <div className="border-t border-rule pt-5 lg:pb-1">
              <p className="text-sm font-semibold text-chapter-5">
                {GLOSSARY_TERMS.length} terms · {GLOSSARY_CLUSTERS.length} clusters
              </p>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
                Familiar analogy, precise definition, and a real example for the language behind
                agentic systems—without sanding off the technical meaning.
              </p>
            </div>
          </div>
        </header>

        <div className="px-4 pt-10 sm:px-6 md:pt-14 lg:px-0">
          <Decoder />

          <div className="border-t border-rule pt-6">
            <Link
              href="/learn/start"
              className="editorial-link inline-flex min-h-11 items-center text-sm font-semibold text-chapter-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              Back to Start Here
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
