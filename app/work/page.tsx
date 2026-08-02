import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { SystemsLedger } from '@/components/work/SystemsLedger';
import {
  formatWorkDate,
  isExternalWorkUrl,
  WORK_CATEGORY_LABELS,
  type WorkRecord,
} from '@/components/work/work-types';
import { getAllProducts } from '@/lib/products';
import { generateBreadcrumbSchema, generatePersonSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Work',
  description:
    'Selected agentic systems, delivery infrastructure, plugins, and developer tools by Dakota Smith.',
  alternates: { canonical: '/work' },
};

function ProjectAction({ record }: { record: WorkRecord }) {
  const className =
    'editorial-link inline-flex min-h-11 items-center font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background';

  if (isExternalWorkUrl(record.url)) {
    return (
      <a href={record.url} target="_blank" rel="noopener noreferrer" className={className}>
        Inspect public repository
      </a>
    );
  }

  return (
    <Link href={record.url} className={className}>
      Read project article
    </Link>
  );
}

export default async function WorkPage() {
  const products = await getAllProducts();
  const records: WorkRecord[] = products.map(({ id, name, description, url, category, date }) => ({
    id,
    name,
    description,
    url,
    category,
    date,
  }));
  const selectedRecords = products
    .filter((product) => product.featured)
    .slice(0, 4)
    .map(({ id, name, description, url, category, date }) => ({
      id,
      name,
      description,
      url,
      category,
      date,
    }));

  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Work' }]);
  const workSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Work — Dakota Smith',
    description:
      'Selected agentic systems, delivery infrastructure, plugins, and developer tools by Dakota Smith.',
    url: `${SITE_URL}/work`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: records.length,
      itemListElement: records.map((record, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: record.name,
        description: record.description,
        url: isExternalWorkUrl(record.url) ? record.url : `${SITE_URL}${record.url}`,
      })),
    },
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={workSchema} />
      <JsonLd data={breadcrumbSchema} />

      <header className="border-b border-rule">
        <div className="site-stage grid gap-8 py-16 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24 xl:gap-10">
          <div className="lg:col-span-5">
            <h1 className="text-balance max-w-[13ch] font-serif text-[clamp(3.3rem,6vw,5.8rem)] font-medium leading-[0.96] tracking-[-0.04em] text-text">
              A body of systems, not a shelf of logos.
            </h1>
          </div>
          <div className="flex flex-col justify-end border-t border-rule pt-6 lg:col-span-7 lg:border-t-0 lg:pt-0 lg:pl-12 xl:pl-20">
            <p className="max-w-[43ch] text-xl leading-[1.55] text-text">
              These records make the practice concrete: agentic systems, delivery infrastructure,
              and developer tools built around repeatability, governance, and accountable change.
            </p>
            <p className="mt-6 max-w-[48ch] leading-7 text-muted">
              Scope is intentionally narrow. Names, dates, classifications, descriptions, and links
              come from the public project catalog; no adoption, production, or outcome claims are
              implied.
            </p>
            <a
              href="#systems-ledger"
              className="editorial-link mt-7 inline-flex min-h-11 items-center self-start font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              Browse the complete ledger
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-rule py-14 md:py-20" aria-labelledby="selected-heading">
        <div className="site-stage">
          <div className="grid gap-6 pb-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:pb-10">
            <h2
              id="selected-heading"
              className="font-serif text-[clamp(2.75rem,4vw,4.4rem)] font-medium leading-none tracking-[-0.035em] text-text"
            >
              Selected systems
            </h2>
            <p className="max-w-[56ch] self-end text-lg leading-relaxed text-muted">
              Recent featured records from the catalog. Each entry names the mechanism the system is
              designed to make possible; the source link carries the implementation detail.
            </p>
          </div>

          {selectedRecords.length > 0 ? (
            <ol className="border-t border-rule">
              {selectedRecords.map((record, index) => (
                <li key={record.id} id={record.id} className="scroll-mt-24 border-b border-rule">
                  <article className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-5 py-8 md:py-10 lg:grid-cols-[8rem_minmax(12rem,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
                    <p className="font-serif text-4xl font-medium leading-none text-accent tabular-nums sm:text-5xl">
                      <span className="sr-only">Record </span>
                      {String(index + 1).padStart(2, '0')}
                    </p>

                    <div>
                      <h3 className="text-balance font-serif text-[clamp(2.2rem,3vw,3.35rem)] font-medium leading-[1.02] tracking-[-0.03em] text-text">
                        {record.name}
                      </h3>
                      <p className="mt-4 text-sm font-semibold text-muted">
                        {WORK_CATEGORY_LABELS[record.category]} <span aria-hidden="true">·</span>{' '}
                        <time dateTime={record.date}>{formatWorkDate(record.date)}</time>
                      </p>
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <p className="max-w-[62ch] text-lg leading-8 text-text/85">
                        {record.description}
                      </p>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                        Evidence basis: public repository and recorded project description{' '}
                        <span aria-hidden="true">·</span> no adoption or production outcome implied
                      </p>
                      <div className="mt-7">
                        <ProjectAction record={record} />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <p className="border-y border-rule py-12 text-lg text-muted">
              No featured systems are published in the catalog.
            </p>
          )}
        </div>
      </section>

      <section
        id="systems-ledger"
        className="scroll-mt-24 py-14 md:py-20"
        aria-labelledby="ledger-heading"
      >
        <div className="site-stage">
          <div className="grid gap-6 pb-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:pb-10">
            <h2
              id="ledger-heading"
              className="font-serif text-[clamp(2.75rem,4vw,4.4rem)] font-medium leading-none tracking-[-0.035em] text-text"
            >
              Systems ledger
            </h2>
            <p className="max-w-[58ch] self-end text-lg leading-relaxed text-muted">
              The complete public catalog, ordered by its recorded date. Filter by system type
              without losing the source description or destination.
            </p>
          </div>

          {records.length > 0 ? (
            <SystemsLedger records={records} />
          ) : (
            <p className="border-y border-rule py-12 text-lg text-muted">
              No systems are published in the catalog.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
