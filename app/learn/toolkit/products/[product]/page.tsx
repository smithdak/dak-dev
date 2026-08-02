import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { ProductCapabilityIndex } from '@/components/toolkit/ProductCapabilityIndex';
import { SourceRegister } from '@/components/toolkit/SourceRegister';
import {
  TOOLKIT_REVIEWED_AT,
  TOOLKIT_TOPICS,
  getToolkitCoverageForProduct,
  getToolkitCoverageSources,
  getToolkitProductBySlug,
  getToolkitProductSlugs,
} from '@/lib/toolkit';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL as siteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getToolkitProductSlugs().map((product) => ({ product }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = getToolkitProductBySlug(productSlug);
  if (!product) return {};

  const title = `${product.name} Capability Guide`;
  const description = `Source-backed coverage of ${product.name} across nine coding-agent capabilities, reviewed ${TOOLKIT_REVIEWED_AT}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/learn/toolkit/products/${product.id}`,
    },
    alternates: { canonical: `/learn/toolkit/products/${product.id}` },
  };
}

export default async function ToolkitProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: productSlug } = await params;
  const product = getToolkitProductBySlug(productSlug);
  if (!product) notFound();

  const claims = getToolkitCoverageForProduct(product.id);
  const sources = getToolkitCoverageSources(claims);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: product.name },
  ]);

  return (
    <PageTransition className="min-h-screen pb-20">
      <JsonLd data={breadcrumbSchema} />

      <nav className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <li>
            <Link href="/learn" className="underline-offset-2 hover:text-text hover:underline">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/learn/toolkit"
              className="underline-offset-2 hover:text-text hover:underline"
            >
              Toolkit
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">
            <span className="font-semibold text-text">{product.name}</span>
          </li>
        </ol>
      </nav>

      <header className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-24 lg:px-0">
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {product.vendor} · product view · reviewed {TOOLKIT_REVIEWED_AT}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
            {product.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.12em]">
            <span className="text-muted">Surfaces: {product.surfaces.join(' · ')}</span>
            <a
              href={product.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-text underline decoration-text/30 underline-offset-4 hover:decoration-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              Official documentation
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <section aria-labelledby="product-capabilities-heading" className="mb-16">
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Documented capability
            </p>
            <h2
              id="product-capabilities-heading"
              className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Nine capabilities, surface by surface
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Status describes official documentation, not measured reliability or production
              conformance. “No documented equivalent” is an evidence finding, not a claim that the
              product cannot perform the task.
            </p>
          </div>
          <ProductCapabilityIndex topics={TOOLKIT_TOPICS} claims={claims} />
        </section>

        <SourceRegister sources={sources} heading={`${product.name} sources`} />
      </div>
    </PageTransition>
  );
}
