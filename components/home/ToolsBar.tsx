import { getAllProducts, type Product } from '@/lib/products';
import Link from 'next/link';

const CATEGORY_STYLES: Record<Product['category'], string> = {
  agent: 'border-accent/40 text-accent',
  plugin: 'border-chapter-4/40 text-chapter-4',
  product: 'border-chapter-2/40 text-chapter-2',
  infrastructure: 'border-chapter-3/40 text-chapter-3',
};

const CATEGORY_HOVER: Record<Product['category'], string> = {
  agent: 'group-hover:border-accent',
  plugin: 'group-hover:border-chapter-4',
  product: 'group-hover:border-chapter-2',
  infrastructure: 'group-hover:border-chapter-3',
};

function ProductIcon({ icon }: { icon: Product['icon'] }) {
  const cls = "w-5 h-5 flex-shrink-0";
  switch (icon) {
    case 'code':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'tool':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'app':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      );
    case 'package':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'api':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case 'website':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
  }
}

/**
 * Horizontal scrollable strip of project cards for the homepage
 * Shows icon + name + category badge for each product
 */
export async function ToolsBar() {
  const products = await getAllProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t-4 border-text">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted flex-shrink-0">
              Builds
            </h2>
            <div className="h-px w-12 bg-text/20" aria-hidden="true" />
          </div>
          <Link
            href="/about#tools"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            View all
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Scrollable strip */}
        <div className="relative">
          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
            data-no-scrollbar=""
            role="list"
            aria-label="Projects and tools"
          >
            {products.map((product) => (
              // role="listitem" belongs on a non-link wrapper — it is not an
              // allowed role on <a> (aria-allowed-role). The wrapper is the
              // scroll child, so width + snap-start live here.
              <div
                key={product.id}
                role="listitem"
                style={{ width: 172, minWidth: 172, maxWidth: 172 }}
                className="snap-start"
              >
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block h-full border-2 border-text/20 ${CATEGORY_HOVER[product.category]} bg-surface/30 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background`}
                >
                  <span className="block text-muted group-hover:text-text transition-colors mb-3">
                    <ProductIcon icon={product.icon} />
                  </span>
                  <span className="block text-sm font-bold text-text truncate mb-2 group-hover:underline decoration-2 underline-offset-4">
                    {product.name}
                  </span>
                  <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[product.category]}`}>
                    {product.category}
                  </span>
                </a>
              </div>
            ))}
          </div>
          {/* Right fade to indicate scrollability */}
          <div
            className="pointer-events-none absolute top-0 right-0 bottom-2 w-16 bg-gradient-to-l from-background to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
