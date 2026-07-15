/**
 * Resume PDF Preview Page
 * This page renders the resume in a print-friendly format
 * Users can use browser's "Print to PDF" or we can implement server-side PDF generation
 */

export const metadata = {
  title: 'Resume PDF | Dakota Smith',
  robots: {
    index: false,
    follow: false,
  },
};

const experiences = [
  {
    company: 'RBA Consulting',
    title: 'Senior Fullstack Architect',
    location: 'Remote',
    period: 'Dec 2023 – Present',
    highlights: [
      'Technical Strategy: Shifted team focus from tactical execution to strategic resource forecasting and workflow optimization.',
      'Global Delivery: Lead Architect for international web solutions, maintaining strict adherence to ADA accessibility and enterprise performance benchmarks.',
    ],
  },
  {
    company: 'Twofold Tech',
    title: 'Founder & Principal Architect',
    location: 'Remote',
    period: 'Mar 2020 – Present',
    highlights: [
      'Product Incubation: Architecting STUDIO, ALLOY, HandoffKit, RelayOps and Founder Engine, focusing on autonomous agentic systems.',
      'Executive Leadership: Define technical strategy and manage cross-functional delivery for multiple enterprise client projects.',
      'Consulting: Deliver bespoke e-commerce and SaaS solutions using high-integrity "anti-slop" design principles.',
    ],
  },
  {
    company: 'XCentium',
    title: 'Senior Fullstack Engineer',
    location: 'Remote',
    period: 'Apr 2019 – Mar 2020',
    highlights: [
      'Global Implementation: Pioneered the first Sitecore instance hosted behind China\'s firewall, navigating complex regulatory and infrastructure landscapes.',
      'Platform Engineering: Optimized content management efficiency by extending Sitecore pipelines and building reusable enterprise component libraries.',
    ],
  },
  {
    company: 'Aware',
    title: 'Senior Software Engineer',
    location: 'Remote',
    period: 'Sep 2016 – Mar 2019',
    highlights: [
      'Enterprise Migration: Architected complex CMS migrations (Sitecore to Optimizely) and custom data warehouse integrations for Fortune 500-scale clients.',
    ],
  },
  {
    company: 'AJi Software',
    title: 'Solutions Architect',
    location: 'Kansas City, MO',
    period: 'Aug 2014 – Sep 2016',
    highlights: [
      'Systems Design: Architected multi-site Sitecore environments and secure payment integrations for high-compliance healthcare and non-profit sectors.',
    ],
  },
  {
    company: 'Roundedcube',
    title: 'Lead Software Engineer',
    location: 'St. Louis, MO',
    period: 'Jan 2012 – Aug 2014',
    highlights: [
      'High-Traffic Architecture: Designed secure, multi-tier .NET systems and optimized multi-site Sitecore instances for global entertainment brands.',
    ],
  },
];

export default function ResumePDFPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-0 print:m-0">
      {/* Print styles handled via Tailwind print: prefix */}

      {/* Header */}
      <header className="mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-bold mb-2">Dakota Smith</h1>
        <p className="text-xl mb-2">Principal Architect | Enterprise DXP & Agentic Orchestration</p>
        <div className="text-sm">
          <p>dakota@twofold.tech</p>
          <p>github.com/smithdak | twofold.tech</p>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Executive Summary</h2>
        <p className="text-sm leading-relaxed">
          Systems Architect with <strong>15 years</strong> in enterprise software, specializing in the
          stabilization and modernization of complex Sitecore and .NET ecosystems. I bridge the gap
          between generative AI speed and enterprise-grade rigor through <strong>Deterministic
          Orchestration</strong>—ensuring agentic intelligence follows strict architectural logic
          rather than &quot;Prompt-and-Pray&quot; patterns.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          Proven track record of shipping <strong>30+ production-ready projects</strong> with a focus
          on <strong>Industrial Clarity</strong>: eliminating technical slop to build resilient,
          sub-second performance systems.
        </p>
      </section>

      {/* Core Competencies */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Core Competencies</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-1">Systems Architecture & Innovation</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Agentic Orchestration</li>
              <li>Enterprise CMS/DXP (15 years)</li>
              <li>Fullstack Mastery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-1">Technical Strategy & Operational Excellence</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Vision & ROI</li>
              <li>Agile Leadership (9+ years)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Toolkit */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Technical Toolkit</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-1">Architectural Paradigms</h3>
            <p>Agentic State Machines, Deterministic AI Orchestration, Helix/Modular Design</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Platforms</h3>
            <p>Sitecore (XM Cloud/XP), Optimizely, Umbraco, Azure DevOps, Vercel, Docker</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Backend & Data</h3>
            <p>.NET Core, C#, GraphQL, SQL Server, MongoDB, Postgres, Prisma, Solr</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Frontend</h3>
            <p>Next.js, React, TypeScript, TailwindCSS, SASS</p>
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Professional Experience</h2>
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.company}</h3>
                <span className="text-xs">{exp.period}</span>
              </div>
              <p className="italic mb-1">{exp.title} | {exp.location}</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Innovations */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Key Innovations</h2>
        <div className="text-sm space-y-3">
          <div>
            <h3 className="font-bold">Claude CMS Marketplace (Creator)</h3>
            <p>AI-powered plugins for analyzing architectural debt, security vulnerabilities, and performance bottlenecks across Sitecore and XM Cloud. CI/CD-ready agents for PR pipelines.</p>
          </div>
          <div>
            <h3 className="font-bold">STUDIO (Architect)</h3>
            <p>High-performance orchestration layer built for &quot;Industrial Clarity&quot; and engineering precision in AI-assisted development.</p>
          </div>
          <div>
            <h3 className="font-bold">HandoffKit (Creator)</h3>
            <p>AI-powered project handoff documentation for consulting agencies and freelancers.</p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-3 border-b border-black">Certifications & Education</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-2">Certifications</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Sitecore: XM Cloud Certified Developer</li>
              <li>Sitecore 9: Certified Developer</li>
              <li>Microsoft: Certified Technology Specialist (MCTS)</li>
              <li>Microsoft: Certified Professional (MCP)</li>
              <li>Shopify: Developer Certification (In Progress)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Education</h3>
            <p className="font-semibold">C# ASP.NET Graduate</p>
            <p>Centriq Training</p>
            <p className="text-xs">Leawood, KS | Jan 2011 - May 2011</p>
          </div>
        </div>
      </section>

      {/* Print Instructions */}
      <div className="mt-8 p-4 bg-gray-100 print:hidden">
        <p className="text-sm text-gray-700">
          To generate PDF: Use your browser&apos;s Print function (Cmd/Ctrl + P) and select &quot;Save as PDF&quot;
        </p>
      </div>
    </div>
  );
}
