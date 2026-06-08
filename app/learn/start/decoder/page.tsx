import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { Decoder } from '@/components/learn/Decoder';
import { GLOSSARY_TERMS } from '@/lib/onramp';
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

      <nav className="mb-8 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
          <li>
            <Link href="/learn" className="hover:text-text hover:underline underline-offset-2">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/learn/start" className="hover:text-text hover:underline underline-offset-2">
              Start Here
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="text-text font-semibold">The Decoder</span>
          </li>
        </ol>
      </nav>

      <header className="px-4 sm:px-6 lg:px-0 mb-12 max-w-3xl">
        <p className="mb-4 inline-block border-4 border-chapter-5 bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-chapter-5">
          Plain English
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">The Decoder</h1>
        <div className="h-1 bg-chapter-5 mb-6" style={{ maxWidth: '160px' }} aria-hidden="true" />
        <p className="text-lg md:text-xl text-muted leading-relaxed">
          The words that fly past in a demo, decoded. Each one pairs a familiar analogy with the
          precise meaning — understanding without dumbing it down — plus a real example and a way to
          go deeper.
        </p>
      </header>

      <div className="px-4 sm:px-6 lg:px-0">
        <Decoder />
      </div>
    </PageTransition>
  );
}
