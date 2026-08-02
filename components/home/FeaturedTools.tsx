import { getAllProducts } from '@/lib/products';
import { ProductCardList } from '@/components/ui/ProductCard';
import Link from 'next/link';
import type { Product } from '@/lib/products';

const SPOTLIGHT_ID = 'plugin-architect';
const ADDITIONAL_IDS = ['plugin-gtm', 'plugin-ops', 'claude-marketplace'];

const iconPaths: Record<Product['icon'], React.ReactNode> = {
  tool: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </>
  ),
  code: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  ),
  app: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
  package: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  ),
  api: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  ),
  website: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  ),
};

/**
 * FeaturedTools section for the homepage
 * Spotlight card for a single tool + row of additional tools
 */
export async function FeaturedTools() {
  const products = await getAllProducts();
  const spotlight = products.find((p) => p.id === SPOTLIGHT_ID);
  const additional = ADDITIONAL_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => p !== undefined
  );

  if (!spotlight) return null;

  return (
    <section className="py-16 md:py-24 border-t-4 border-text">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex items-end justify-between border-b-4 border-text pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">Featured Tool</h2>
            <p className="text-lg text-muted">From the workbench</p>
          </div>
          <Link
            href="/work"
            className="hidden sm:inline-flex items-center gap-2 text-text font-semibold hover:underline underline-offset-4 decoration-4 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
          >
            View All Tools
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Spotlight Card */}
        <a
          href={spotlight.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative border-4 border-text bg-surface p-6 md:p-8 shadow-[8px_8px_0_0_var(--color-accent)] hover:shadow-[12px_12px_0_0_var(--color-accent)] hover:border-accent transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
        >
          {/* Spotlight Badge */}
          <div className="absolute -top-4 left-6 bg-accent text-background px-4 py-1 border-4 border-text">
            <span className="text-sm font-bold uppercase tracking-wider">Spotlight</span>
          </div>

          <div className="pt-4">
            {/* Icon + Name Lockup */}
            <div className="flex items-center gap-4 md:gap-6 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 border-4 border-text bg-background text-accent group-hover:bg-accent group-hover:text-background transition-colors duration-300 flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {iconPaths[spotlight.icon]}
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:underline underline-offset-4 decoration-4">
                {spotlight.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-muted mb-6 leading-relaxed max-w-3xl">
              {spotlight.description}
            </p>

            {/* CTA */}
            <div className="inline-flex items-center gap-2 font-semibold text-accent">
              View on GitHub
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
        </a>

        {/* More Tools */}
        {additional.length > 0 && (
          <>
            <div className="mt-16 mb-8 flex items-center gap-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted flex-shrink-0">
                More Tools
              </p>
              <div className="h-px flex-1 bg-muted" aria-hidden="true" />
            </div>
            <ProductCardList products={additional} />
          </>
        )}

        {/* Mobile "View All" Button */}
        <div className="mt-12 sm:hidden flex justify-center">
          <Link
            href="/work"
            className="inline-flex items-center justify-center font-semibold px-6 py-3 text-base gap-2 bg-surface text-text border-4 border-text hover:bg-text hover:text-background shadow-[4px_4px_0_0_var(--color-text)] hover:shadow-[6px_6px_0_0_var(--color-text)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-text focus:ring-offset-4 focus:ring-offset-background"
          >
            View All Tools
          </Link>
        </div>
      </div>
    </section>
  );
}
