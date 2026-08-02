import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnSectionHero } from '@/components/learn/LearnSectionHero';
import { SectionConnects } from '@/components/learn/SectionConnects';
import { EvidenceStandard } from '@/components/toolkit/EvidenceStandard';
import { ToolkitCapabilityIndex } from '@/components/toolkit/ToolkitCapabilityIndex';
import {
  TOOLKIT_LENSES,
  TOOLKIT_REVIEWED_AT,
  TOOLKIT_TOPICS,
  getToolkitCoverageForTopic,
  getToolkitPage,
  getToolkitProducts,
  getToolkitTopicPages,
} from '@/lib/toolkit';
import { SITE_URL as siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Coding Agent Toolkit',
  description:
    'A source-backed capability comparison of Claude Code, OpenAI Codex, and GitHub Copilot, with implementation guidance for production agentic engineering.',
  openGraph: {
    title: 'Coding Agent Toolkit — Capability, Evidence, and Practice',
    description:
      'Compare nine coding-agent capabilities across Claude Code, OpenAI Codex, and GitHub Copilot.',
    url: `${siteUrl}/learn/toolkit`,
  },
  alternates: { canonical: '/learn/toolkit' },
};

// Toolkit routing invariant: capability slugs are stable public concepts. Vendor
// pages are generated projections of the same evidence registry, never a second
// prose tree. The legacy claude-md slug redirects to project-instructions.
const CONNECTS = [
  { label: 'Convention File', href: '/learn/patterns/convention-file', kind: 'Pattern' },
  { label: 'Safety Net', href: '/learn/patterns/safety-net', kind: 'Pattern' },
  { label: 'Memory Layer', href: '/learn/patterns/memory-layer', kind: 'Pattern' },
  { label: 'Parallel Fan-Out', href: '/learn/patterns/parallel-fan-out', kind: 'Pattern' },
  {
    label: 'Progressive Disclosure',
    href: '/learn/patterns/progressive-disclosure',
    kind: 'Pattern',
  },
  {
    label: 'Agent-Friendly Architecture',
    href: '/learn/patterns/agent-friendly-architecture',
    kind: 'Pattern',
  },
];

export default function ToolkitIndexPage() {
  const products = getToolkitProducts();
  const topics = TOOLKIT_TOPICS.map((topic) => ({
    ...topic,
    available: getToolkitPage(topic.slug) !== null,
    lensCount: getToolkitTopicPages(topic.slug).length,
    coverage: getToolkitCoverageForTopic(topic.slug),
  }));

  return (
    <PageTransition className="min-h-screen pb-20">
      <LearnSectionHero
        section="Toolkit"
        color="cyan"
        eyebrow={`Comparative reference · reviewed ${TOOLKIT_REVIEWED_AT}`}
        title="Coding Agent Toolkit"
        description="Nine durable capabilities. Three fast-moving products. One evidence model that separates documented behavior from operational proof."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <nav aria-label="Toolkit sections" className="mb-10 border-y border-text/20 py-4">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.12em]">
            <li>
              <a href="#capabilities" className="text-muted hover:text-text">
                Capabilities
              </a>
            </li>
            <li>
              <a href="#products" className="text-muted hover:text-text">
                Products
              </a>
            </li>
            <li>
              <a href="#evidence-standard" className="text-muted hover:text-text">
                Evidence standard
              </a>
            </li>
            <li>
              <a href="#lenses" className="text-muted hover:text-text">
                Implementation lenses
              </a>
            </li>
          </ul>
        </nav>

        <EvidenceStandard />

        <section
          id="products"
          aria-labelledby="products-heading"
          className="scroll-mt-20 py-12 md:py-16"
        >
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Product projections
            </p>
            <h2
              id="products-heading"
              className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Follow a product without creating three competing taxonomies.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Each product view is generated from the same capability and source registry used
              below. Product names never become the information architecture.
            </p>
          </div>
          <div className="border-t border-text/25">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/learn/toolkit/products/${product.id}`}
                className="group flex flex-col gap-3 border-b border-text/20 py-6 transition-colors hover:bg-surface/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <span>
                  <span className="block text-xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{product.description}</span>
                </span>
                <span className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  {product.surfaces.join(' · ')}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="capabilities"
          aria-labelledby="capabilities-heading"
          className="scroll-mt-20 pb-12 md:pb-16"
        >
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Capability index
            </p>
            <h2
              id="capabilities-heading"
              className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              The nine durable decisions
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Start with the problem you need to solve, then compare product behavior at the exact
              CLI, IDE, web, or cloud surface where the work will run. An “Unknown” marks a dated
              evidence gap only for the surface beside it, never a product-wide verdict.
            </p>
          </div>
          <ToolkitCapabilityIndex topics={topics} products={products} />
        </section>

        <section
          id="lenses"
          aria-labelledby="lenses-heading"
          className="scroll-mt-20 border-y border-text/20 py-10"
        >
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Implementation depth
            </p>
            <h2
              id="lenses-heading"
              className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Four lenses, with product scope stated explicitly
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every lens is capability-first and current across the reviewed product corpus. Product
              classifications remain documentation findings until independently runtime-tested.
            </p>
          </div>
          <ol className="divide-y divide-text/15 border-t border-text/20">
            {TOOLKIT_LENSES.map((lens, index) => (
              <li key={lens.slug} className="flex gap-5 py-5">
                <span className="w-8 shrink-0 font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="font-semibold">{lens.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {lens.blurb}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <SectionConnects
          id="connects"
          color="cyan"
          heading="Where This Connects"
          intro="Products change faster than the engineering problems. The Patterns library names the portable techniques that these capabilities implement."
          links={CONNECTS}
        />
      </div>
    </PageTransition>
  );
}
