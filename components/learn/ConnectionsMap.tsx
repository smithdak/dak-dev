import Link from 'next/link';

interface Pair {
  left: { name: string; href: string };
  right: { name: string; href: string };
}

interface RelationshipBlock {
  index: string;
  eyebrow: string;
  thesis: string;
  pairs: Pair[];
}

const PATTERN_TOOLKIT: Pair[] = [
  {
    left: { name: 'Convention File', href: '/learn/patterns/convention-file' },
    right: { name: 'Project instructions', href: '/learn/toolkit/project-instructions' },
  },
  {
    left: { name: 'Safety Net', href: '/learn/patterns/safety-net' },
    right: { name: 'Hooks', href: '/learn/toolkit/hooks' },
  },
  {
    left: { name: 'Memory Layer', href: '/learn/patterns/memory-layer' },
    right: { name: 'Memory', href: '/learn/toolkit/memory' },
  },
  {
    left: { name: 'Parallel Fan-Out', href: '/learn/patterns/parallel-fan-out' },
    right: { name: 'Multi-agent orchestration', href: '/learn/toolkit/agent-teams' },
  },
  {
    left: { name: 'Progressive Disclosure', href: '/learn/patterns/progressive-disclosure' },
    right: { name: 'Skills', href: '/learn/toolkit/skills' },
  },
  {
    left: {
      name: 'Agent-Friendly Architecture',
      href: '/learn/patterns/agent-friendly-architecture',
    },
    right: { name: 'MCP', href: '/learn/toolkit/mcp' },
  },
];

const HARNESS_LINKS: Pair[] = [
  {
    left: { name: 'Context Window Economics', href: '/learn/harness/context-economics' },
    right: { name: 'Context Priming', href: '/learn/patterns/context-priming' },
  },
  {
    left: { name: 'Compaction & Continuity', href: '/learn/harness/compaction-continuity' },
    right: { name: 'Memory', href: '/learn/toolkit/memory' },
  },
  {
    left: { name: 'Tool Result Curation', href: '/learn/harness/tool-result-curation' },
    right: { name: 'Progressive Disclosure', href: '/learn/patterns/progressive-disclosure' },
  },
  {
    left: { name: 'The Agent Loop', href: '/learn/harness/agent-loop' },
    right: { name: 'Checkpoint Loop', href: '/learn/patterns/checkpoint-loop' },
  },
  {
    left: {
      name: 'Delivery Control Above the Agent Loop',
      href: '/learn/harness/delivery-control-above-agent-loop',
    },
    right: { name: 'Supply Chain & Audit', href: '/learn/security/supply-chain-and-audit' },
  },
];

const SECURITY_LINKS: Pair[] = [
  {
    left: { name: 'Prompt Injection', href: '/learn/security/prompt-injection' },
    right: {
      name: 'System Prompt Architecture',
      href: '/learn/harness/system-prompt-architecture',
    },
  },
  {
    left: { name: 'Data & PII in Context', href: '/learn/security/data-and-pii' },
    right: { name: 'Context Window Economics', href: '/learn/harness/context-economics' },
  },
  {
    left: { name: 'Permission Architecture', href: '/learn/security/permission-architecture' },
    right: { name: 'Scope Fence', href: '/learn/patterns/scope-fence' },
  },
  {
    left: { name: 'Supply Chain & Audit', href: '/learn/security/supply-chain-and-audit' },
    right: { name: 'Safety Net', href: '/learn/patterns/safety-net' },
  },
];

const BLOCKS: RelationshipBlock[] = [
  {
    index: '01',
    eyebrow: 'Patterns and product capabilities',
    thesis:
      'Portable techniques stay stable while Claude Code, Codex, and GitHub Copilot implement them differently.',
    pairs: PATTERN_TOOLKIT,
  },
  {
    index: '02',
    eyebrow: 'Harness and the agent loop',
    thesis:
      'Harness Engineering connects runtime behavior beneath the model to accountable acceptance above it.',
    pairs: HARNESS_LINKS,
  },
  {
    index: '03',
    eyebrow: 'Security across the system',
    thesis:
      'Security is not a separate silo; it hardens the same context, tool, permission, and delivery boundaries.',
    pairs: SECURITY_LINKS,
  },
];

export function ConnectionsMap() {
  return (
    <section
      aria-labelledby="learn-connections-heading"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8"
    >
      <div className="grid gap-10 border-t border-text/20 pt-10 lg:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
        <div>
          <p className="editorial-kicker mb-3">System map</p>
          <h2
            id="learn-connections-heading"
            className="font-display text-4xl leading-tight sm:text-5xl"
          >
            The fields connect. The boundaries matter.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-muted">
            Follow the cross-references to move from a portable idea to its implementation,
            operating boundary, and security consequence.
          </p>
          <Link
            href="/learn/patterns/graph"
            className="mt-8 inline-flex min-h-11 items-center border-b border-text pb-1 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Open the language map
          </Link>
        </div>

        <div>
          {BLOCKS.map((block) => (
            <section
              key={block.index}
              className="border-b border-text/20 py-8 first:pt-0 last:border-b-0"
            >
              <div className="grid gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-xs text-muted" aria-hidden="true">
                  {block.index}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{block.eyebrow}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-muted">{block.thesis}</p>
                </div>
              </div>
              <dl className="mt-6 sm:ml-[4.5rem]">
                {block.pairs.map((pair) => (
                  <div
                    key={pair.left.href}
                    className="grid gap-1 border-t border-text/10 py-3 first:border-t-0 sm:grid-cols-2 sm:gap-6"
                  >
                    <dt>
                      <Link
                        href={pair.left.href}
                        className="font-medium underline decoration-text/20 underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {pair.left.name}
                      </Link>
                    </dt>
                    <dd>
                      <Link
                        href={pair.right.href}
                        className="text-muted underline decoration-text/15 underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {pair.right.name}
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
