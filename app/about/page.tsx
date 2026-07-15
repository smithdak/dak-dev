import { PageTransition } from '@/components/ui/PageTransition';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateResumeSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getAllProducts } from '@/lib/products';
import { ProjectTable } from '@/components/about/ProjectTable';

export const metadata = {
  title: 'About | Dakota Smith',
  description:
    'Fullstack architect building with .NET, React, Next.js, and AI. See what I work with, things I\'ve built, and how to get in touch.',
};

export default async function AboutPage() {
  const products = await getAllProducts();
  const resumeSchema = generateResumeSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About' },
  ]);

  return (
    <PageTransition className="min-h-screen py-16">
      <JsonLd data={resumeSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── HERO: INFO + CONTACT ── */}
        <ScrollReveal>
          <section className="mb-16 md:mb-20" aria-label="About Dakota Smith">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-start">
              {/* Left — Identity */}
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-2">Dakota Smith</h1>
                <p className="text-lg text-accent font-semibold mb-8">
                  Fullstack Architect
                </p>
                <div className="h-[3px] w-16 bg-accent mb-8" aria-hidden="true" />
                <p className="text-lg text-muted leading-relaxed max-w-2xl">
                  I build enterprise web platforms and developer tools with a focus on
                  performance, clarity, and shipping things that actually work. Most of
                  my career has been spent deep in .NET and CMS ecosystems, but these
                  days I spend just as much time in TypeScript and React. I care about
                  clean architecture, accessible interfaces, and writing code that the
                  next person can read without wanting to quit.
                </p>
              </div>

              {/* Right — Contact */}
              <div id="contact" className="md:pt-2">
                <div className="border-2 border-text/20 bg-surface p-6 shadow-[4px_4px_0_0_var(--color-accent)]">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted mb-5">Get in touch</p>
                  <div className="flex flex-col gap-4">
                    <a
                      href="mailto:dakota@twofold.tech"
                      className="inline-flex items-center gap-3 px-6 py-3.5 text-lg bg-accent text-background font-bold border-2 border-text shadow-[3px_3px_0_0_var(--color-text)] hover:shadow-[5px_5px_0_0_var(--color-text)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                      aria-label="Send email to dakota@twofold.tech"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      dakota@twofold.tech
                    </a>
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/smithdak"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-text/30 text-muted hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                        aria-label="GitHub profile"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a
                        href="https://linkedin.com/in/dakota-smith-a855b230"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-text/30 text-muted hover:text-accent hover:border-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                        aria-label="LinkedIn profile"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── BUILDS ── */}
        <ScrollReveal>
          <section id="tools" className="mb-12" aria-label="Builds">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted flex-shrink-0">Builds</h2>
              <div className="h-px flex-1 bg-text/20" aria-hidden="true" />
            </div>
            {products.length > 0 ? (
              <ProjectTable products={products} />
            ) : (
              <div className="border-2 border-text/20 p-12 text-center">
                <p className="text-2xl font-semibold mb-2">Nothing here yet</p>
                <p className="text-muted">Check back soon.</p>
              </div>
            )}
          </section>
        </ScrollReveal>

      </div>
    </PageTransition>
  );
}
