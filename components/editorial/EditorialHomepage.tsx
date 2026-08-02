import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';

interface PublicationRecord {
  analyses: number;
  fieldPages: number;
  systems: number;
}

interface EditorialHomepageProps {
  featuredPost: Post | null;
  publicationRecord: PublicationRecord;
}

const proofSequence = [
  {
    number: '01',
    kind: 'Position',
    title: 'The Agent Delivery Harness',
    description:
      'A falsifiable seven-invariant profile for accountable acceptance outside model sessions.',
    href: '/blog/agent-delivery-harness',
    action: 'Read the conformance profile',
  },
  {
    number: '02',
    kind: 'Field guide',
    title: 'Delivery control above the agent loop',
    description:
      'The machinery that separates runtime execution from evidence, policy, and authorization.',
    href: '/learn/harness/delivery-control-above-agent-loop',
    action: 'Study the control layer',
  },
  {
    number: '03',
    kind: 'Public system',
    title: 'delivery-harness',
    description:
      'Durable work state, exact-candidate gates, content-addressed evidence, and bounded authority.',
    href: '/work#delivery-harness',
    action: 'Inspect the implementation',
  },
  {
    number: '04',
    kind: 'Evidence boundary',
    title: 'Local contract 7/7. Operational proof 0/4.',
    description:
      'An author self-audit: process conformance is documented; live delivery and external acceptance remain unproven.',
    href: '/blog/agent-delivery-harness#my-public-delivery-harness-as-a-scored-self-audit',
    action: 'Review the stated limits',
  },
] as const;

const learnPillars = [
  {
    title: 'Patterns',
    href: '/learn/patterns',
    description: 'Reference architectures and repeatable moves.',
  },
  {
    title: 'Toolkit',
    href: '/learn/toolkit',
    description: 'Portable capabilities across Claude Code, Codex, and GitHub Copilot.',
  },
  {
    title: 'Harness',
    href: '/learn/harness',
    description: 'Runtime control, evaluation, and accountable delivery.',
  },
  {
    title: 'Security',
    href: '/learn/security',
    description: 'Trust surfaces: injection, secrets, permissions, and exfiltration.',
  },
] as const;

function formatDate(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateOnly));
}

export function EditorialHomepage({ featuredPost, publicationRecord }: EditorialHomepageProps) {
  const featuredHref = featuredPost ? `/blog/${featuredPost.frontmatter.slug}` : '/blog';

  return (
    <div>
      <section className="border-b border-rule" aria-labelledby="homepage-thesis">
        <div className="site-stage grid gap-12 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20 xl:gap-10">
          <div className="flex min-w-0 flex-col items-start lg:col-span-7">
            <h1
              id="homepage-thesis"
              className="max-w-[14ch] text-balance font-serif text-[clamp(3.35rem,5.3vw,6rem)] font-medium leading-[0.94] tracking-[-0.04em] text-text"
            >
              Designing the authority layer around agent-produced change.
            </h1>
            <p className="mt-7 max-w-[57ch] text-xl leading-[1.55] text-text/85 sm:text-2xl">
              Models propose. Systems preserve state, bind evidence to exact candidates, enforce
              policy, and keep consequential decisions with named humans.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/blog/agent-delivery-harness"
                className="inline-flex min-h-12 items-center justify-center bg-accent px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                Read the conformance profile
              </Link>
              <Link
                href="/work#delivery-harness"
                className="inline-flex min-h-12 items-center justify-center border border-text px-6 py-3 text-base font-semibold text-text transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                Inspect the public implementation
              </Link>
            </div>

            <p className="mt-7 border-t border-rule pt-5 text-sm font-semibold text-text">
              Dakota Smith{' '}
              <span className="mx-2 text-accent" aria-hidden="true">
                /
              </span>{' '}
              Principal Architect{' '}
              <span className="mx-2 text-accent" aria-hidden="true">
                /
              </span>{' '}
              daksmith.dev
            </p>
          </div>

          <div className="min-w-0 border-t border-rule pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-14">
            <div className="flex items-center gap-6">
              <p className="shrink-0 text-sm font-semibold text-accent">Current analysis</p>
              <div className="h-px flex-1 bg-rule" aria-hidden="true" />
            </div>

            {featuredPost ? (
              <article className="mt-6">
                <Link
                  href={featuredHref}
                  className="group block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                >
                  <figure className="relative aspect-[16/8] overflow-hidden bg-surface">
                    <Image
                      src={featuredPost.frontmatter.hero}
                      alt=""
                      fill
                      priority
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transform-none"
                      sizes="(max-width: 1024px) 100vw, (max-width: 1920px) 38vw, 720px"
                      placeholder={featuredPost.frontmatter.heroBlur ? 'blur' : 'empty'}
                      blurDataURL={featuredPost.frontmatter.heroBlur}
                    />
                  </figure>
                  <h2 className="mt-6 max-w-[18ch] text-balance font-serif text-[clamp(2.35rem,3vw,3.75rem)] font-medium leading-[1.01] tracking-[-0.035em] text-text transition-colors group-hover:text-accent">
                    {featuredPost.frontmatter.title}
                  </h2>
                </Link>
                <p className="mt-4 max-w-[52ch] text-base leading-7 text-muted sm:text-lg">
                  {featuredPost.frontmatter.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-rule pt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  <time dateTime={featuredPost.frontmatter.date}>
                    {formatDate(featuredPost.frontmatter.date)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.readingTime}</span>
                </div>
              </article>
            ) : (
              <div className="mt-8 py-12">
                <p className="font-serif text-4xl font-medium tracking-[-0.03em] text-text">
                  Writing on accountable AI delivery.
                </p>
                <Link
                  href="/blog"
                  className="editorial-link mt-5 inline-flex font-semibold text-accent"
                >
                  Browse the writing
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-rule" aria-labelledby="publication-record-heading">
        <div className="site-stage grid gap-5 py-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
          <h2
            id="publication-record-heading"
            className="shrink-0 text-sm font-semibold text-text lg:border-r lg:border-rule lg:pr-10"
          >
            Publication record
          </h2>
          <ul className="grid gap-x-10 gap-y-3 text-sm text-text/80 sm:grid-cols-3">
            <li>
              <strong className="font-semibold text-text">{publicationRecord.analyses}</strong>{' '}
              published analyses
            </li>
            <li>
              <strong className="font-semibold text-text">{publicationRecord.fieldPages}</strong>{' '}
              field-guide pages
            </li>
            <li>
              <strong className="font-semibold text-text">{publicationRecord.systems}</strong>{' '}
              public system records
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-rule py-14 md:py-20" aria-labelledby="proof-heading">
        <div className="site-stage">
          <div className="grid gap-6 pb-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <h2
              id="proof-heading"
              className="max-w-[13ch] text-balance font-serif text-[clamp(2.9rem,4.6vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-text lg:col-span-5"
            >
              From position to proof.
            </h2>
            <div className="self-end lg:col-span-7 lg:pl-12 xl:pl-20">
              <p className="max-w-[64ch] text-lg leading-8 text-muted">
                One argument, carried through the publication: define the boundary, teach the
                machinery, inspect the implementation, and keep the unproven claims visible.
              </p>
              <Link
                href="/about"
                className="editorial-link mt-5 inline-flex min-h-11 items-center font-semibold text-accent"
              >
                About the practice
              </Link>
            </div>
          </div>

          <ol className="grid border-y border-rule md:grid-cols-2 xl:grid-cols-4">
            {proofSequence.map((item, index) => (
              <li
                key={item.title}
                className={`border-b border-rule last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 ${
                  index % 2 === 1 ? 'md:border-l md:pl-7' : 'md:pr-7'
                } ${index > 0 ? 'xl:border-l xl:pl-7' : ''} ${index < 3 ? 'xl:pr-7' : ''} xl:border-b-0`}
              >
                <Link
                  href={item.href}
                  className="group flex h-full min-h-72 flex-col py-8 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                >
                  <p className="text-xs font-semibold text-muted">
                    <span className="mr-3 tabular-nums text-accent" aria-hidden="true">
                      {item.number}
                    </span>
                    {item.kind}
                  </p>
                  <h3 className="mt-6 max-w-[18ch] text-balance font-serif text-3xl leading-[1.04] tracking-[-0.025em] text-text transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[42ch] text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                  <span className="editorial-link mt-auto pt-7 text-sm font-semibold text-text group-hover:text-accent">
                    {item.action}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="learn-heading">
        <div className="site-stage grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-5">
            <h2
              id="learn-heading"
              className="max-w-[14ch] text-balance font-serif text-[clamp(2.9rem,4.4vw,4.8rem)] font-medium leading-[1] tracking-[-0.04em] text-text"
            >
              Practical knowledge for building agentic systems that ship.
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-8 text-muted">
              A four-part field guide from work structure and portable capabilities through runtime
              control, delivery authority, and security.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link href="/learn" className="editorial-link font-semibold text-accent">
                Explore the field guide
              </Link>
              <Link href="/work" className="editorial-link text-sm text-text/75">
                Inspect public systems
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-12 xl:pl-20">
            <div className="border-t border-rule">
              {learnPillars.map((pillar) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="group grid min-h-20 gap-1 border-b border-rule py-4 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-6"
                >
                  <h3 className="text-xl font-semibold text-text transition-colors group-hover:text-accent">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted transition-colors group-hover:text-text">
                    {pillar.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
