import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generatePersonSchema } from '@/lib/schema';

export const metadata = {
  title: 'About',
  description:
    'About Dakota Smith, a Principal Architect working across agentic systems, innovation strategy, and accountable delivery.',
  alternates: { canonical: '/about' },
};

const focusAreas = [
  {
    title: 'Agentic systems architecture',
    description:
      'Designing the boundaries, tools, context, and control structures that make an agent useful beyond a single impressive run.',
  },
  {
    title: 'Accountable delivery',
    description:
      'Connecting implementation to evidence, review, policy, and release decisions so change can be understood and governed.',
  },
  {
    title: 'AI innovation strategy',
    description:
      'Translating emerging capability into durable operating models rather than treating adoption as a sequence of tool purchases.',
  },
] as const;

const operatingPrinciples = [
  {
    title: 'Start with the system',
    description:
      'A model sits inside architecture, permissions, evidence, security, and change control. The surrounding system determines whether capability becomes dependable work.',
  },
  {
    title: 'Keep proof attached',
    description:
      'Documented capability, observed behavior, and production evidence are different claims. The distinction should remain visible when decisions are made.',
  },
  {
    title: 'Design for replacement',
    description:
      'Models and tools will change. Durable boundaries, explicit contracts, and portable operating rules keep the work from depending on one vendor moment.',
  },
] as const;

export default function AboutPage() {
  const personSchema = generatePersonSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About' },
  ]);

  return (
    <div className="min-h-screen">
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />

      <header className="border-b border-rule">
        <div className="site-stage grid gap-8 py-16 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24 xl:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-balance max-w-[13ch] font-serif text-[clamp(3.25rem,6vw,5.75rem)] font-medium leading-[0.96] tracking-[-0.04em] text-text">
              Architecture is how AI change becomes accountable.
            </h1>
            <p className="mt-8 text-xl font-semibold text-accent">Dakota Smith</p>
            <p className="mt-1 text-base text-muted">Principal Architect</p>
          </div>

          <div className="flex flex-col justify-end border-t border-rule pt-6 lg:col-span-5 lg:border-t-0 lg:pt-0 lg:pl-12 xl:pl-20">
            <p className="max-w-[42ch] text-xl leading-[1.55] text-text">
              I build agentic systems, delivery harnesses, enterprise web platforms, and developer
              tools. The aim is not to make a model look capable. It is to make the surrounding
              system observable, governable, and safe to change.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/work"
                className="inline-flex min-h-12 items-center justify-center bg-accent px-6 py-3 font-semibold text-background transition-colors hover:bg-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                View the work
              </Link>
              <a
                href="mailto:dakota@twofold.tech"
                className="editorial-link inline-flex min-h-12 items-center font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                Start a conversation
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-rule py-14 md:py-18" aria-labelledby="practice-heading">
        <div className="site-stage grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-24">
          <div>
            <h2
              id="practice-heading"
              className="text-balance font-serif text-[clamp(2.7rem,4vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-text"
            >
              The practice
            </h2>
            <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-muted">
              The work joins technical architecture with the operating decisions that determine
              whether AI-enabled change can be trusted.
            </p>
          </div>

          <div className="border-t border-rule">
            {focusAreas.map((area) => (
              <article
                key={area.title}
                className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[minmax(11rem,0.72fr)_minmax(0,1.28fr)] sm:gap-10"
              >
                <h3 className="text-lg font-semibold leading-snug text-text">{area.title}</h3>
                <p className="max-w-[56ch] leading-7 text-muted">{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="principles-heading">
        <div className="site-stage">
          <div className="grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24 lg:pb-16">
            <h2
              id="principles-heading"
              className="text-balance max-w-[17ch] font-serif text-[clamp(2.75rem,4.8vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-text"
            >
              The system around the model is the real work.
            </h2>
            <p className="self-end max-w-[42ch] text-lg leading-relaxed text-muted">
              Capability matters. So do authority, provenance, isolation, verification, and the
              human decision that releases a change. These principles keep those concerns in the
              architecture rather than in the afterthoughts.
            </p>
          </div>

          <dl className="grid gap-x-14 border-b border-rule lg:grid-cols-3">
            {operatingPrinciples.map((principle) => (
              <div
                key={principle.title}
                className="border-b border-rule py-8 last:border-b-0 lg:border-b-0"
              >
                <dt className="text-lg font-semibold text-text">{principle.title}</dt>
                <dd className="mt-4 max-w-[42ch] leading-7 text-muted">{principle.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-rule py-12 md:py-16" aria-labelledby="context-heading">
        <div className="site-stage grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-24">
          <h2
            id="context-heading"
            className="font-serif text-[clamp(2.6rem,3.8vw,4rem)] font-medium leading-none tracking-[-0.035em] text-text"
          >
            Professional trajectory
          </h2>
          <dl className="border-t border-rule">
            <div className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-10">
              <dt className="text-sm font-semibold text-text">Foundation</dt>
              <dd>
                <p className="max-w-[66ch] text-lg leading-8 text-text/85">
                  Enterprise platform architecture across .NET, CMS, TypeScript, and React.
                </p>
                <Link
                  href="/work"
                  className="editorial-link mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                >
                  Inspect the systems record
                </Link>
              </dd>
            </div>
            <div className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-10">
              <dt className="text-sm font-semibold text-text">Current practice</dt>
              <dd>
                <p className="max-w-[66ch] text-lg leading-8 text-text/85">
                  Agentic systems and delivery harnesses that keep state, evidence, policy, and
                  consequential authority outside the model session.
                </p>
                <Link
                  href="/blog/agent-delivery-harness"
                  className="editorial-link mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                >
                  Read the current position
                </Link>
              </dd>
            </div>
            <div className="grid gap-3 border-b border-rule py-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-10">
              <dt className="text-sm font-semibold text-text">Direction</dt>
              <dd>
                <p className="max-w-[66ch] text-lg leading-8 text-text/85">
                  Building toward AI innovation leadership by turning emerging capability into
                  durable operating models.
                </p>
                <p className="mt-3 text-sm font-semibold text-muted">
                  Current position <span aria-hidden="true">·</span> Principal Architect
                </p>
                <Link
                  href="/learn"
                  className="editorial-link mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                >
                  Explore the field guide
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 py-14 md:py-18"
        aria-labelledby="contact-heading"
      >
        <div className="site-stage grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24">
          <div>
            <h2
              id="contact-heading"
              className="text-balance max-w-[13ch] font-serif text-[clamp(3rem,5vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.04em] text-text"
            >
              Continue with the work—or the conversation.
            </h2>
          </div>
          <div className="self-end border-t border-rule pt-7">
            <p className="max-w-[42ch] leading-7 text-muted">
              The Work index is the concrete record. Email is the direct route for professional
              conversations; GitHub and LinkedIn provide the broader public context.
            </p>
            <nav
              aria-label="About page contact links"
              className="mt-8 flex flex-wrap gap-x-8 gap-y-4"
            >
              <Link
                href="/work"
                className="editorial-link inline-flex min-h-11 items-center font-semibold text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                Work
              </Link>
              <a
                href="mailto:dakota@twofold.tech"
                className="editorial-link inline-flex min-h-11 items-center font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                Email
              </a>
              <a
                href="https://github.com/smithdak"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link inline-flex min-h-11 items-center font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                GitHub (external)
              </a>
              <a
                href="https://linkedin.com/in/dakota-smith-a855b230"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link inline-flex min-h-11 items-center font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                LinkedIn (external)
              </a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
