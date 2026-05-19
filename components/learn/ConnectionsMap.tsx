import Link from 'next/link';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';

interface Pair {
  left: { name: string; href: string };
  right: { name: string; href: string };
}

interface RelationshipBlock {
  eyebrow: string;
  thesis: string;
  /** Static literals so Tailwind's class extraction keeps them. */
  leftBorder: string;
  arrowColor: string;
  /** Single-path 24x24 stroke icon, matches the site's SVG convention. */
  arrow: string;
  pairs: Pair[];
}

const ARROW_BIDIRECTIONAL =
  'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
const ARROW_UP = 'M5 10l7-7m0 0l7 7m-7-7v18';

// Patterns and toolkit topics that reinforce each other.
const PATTERN_TOOLKIT: Pair[] = [
  {
    left: { name: 'Convention File', href: '/learn/patterns/convention-file' },
    right: { name: 'CLAUDE.md', href: '/learn/toolkit/claude-md' },
  },
  {
    left: { name: 'Safety Net', href: '/learn/patterns/safety-net' },
    right: { name: 'Hooks', href: '/learn/toolkit/hooks' },
  },
  {
    left: { name: 'Memory Layer', href: '/learn/patterns/memory-layer' },
    right: { name: 'Memory System', href: '/learn/toolkit/memory' },
  },
  {
    left: { name: 'Parallel Fan-Out', href: '/learn/patterns/parallel-fan-out' },
    right: { name: 'Agent Teams', href: '/learn/toolkit/agent-teams' },
  },
  {
    left: { name: 'Progressive Disclosure', href: '/learn/patterns/progressive-disclosure' },
    right: { name: 'Skills', href: '/learn/toolkit/skills' },
  },
  {
    left: { name: 'Agent-Friendly Architecture', href: '/learn/patterns/agent-friendly-architecture' },
    right: { name: 'MCP Servers', href: '/learn/toolkit/mcp' },
  },
];

// Harness Engineering is the floor under the other two pillars. Each chapter
// is a pattern or toolkit idea seen at the runtime layer.
const HARNESS_LINKS: Pair[] = [
  {
    left: { name: 'Context Window Economics', href: '/learn/harness/context-economics' },
    right: { name: 'Context Priming', href: '/learn/patterns/context-priming' },
  },
  {
    left: { name: 'Compaction & Continuity', href: '/learn/harness/compaction-continuity' },
    right: { name: 'Memory System', href: '/learn/toolkit/memory' },
  },
  {
    left: { name: 'Tool Result Curation', href: '/learn/harness/tool-result-curation' },
    right: { name: 'Progressive Disclosure', href: '/learn/patterns/progressive-disclosure' },
  },
  {
    left: { name: 'The Agent Loop', href: '/learn/harness/agent-loop' },
    right: { name: 'Checkpoint Loop', href: '/learn/patterns/checkpoint-loop' },
  },
];

// Security is the trust surface cutting across all three pillars. Each chapter
// hardens an idea the other pillars already established.
const SECURITY_LINKS: Pair[] = [
  {
    left: { name: 'Prompt Injection', href: '/learn/security/prompt-injection' },
    right: { name: 'System Prompt Architecture', href: '/learn/harness/system-prompt-architecture' },
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
    eyebrow: 'Patterns ↔ Toolkit',
    thesis: 'Each portable pattern has a Claude Code feature that implements it.',
    leftBorder: 'border-l-chapter-2',
    arrowColor: 'text-chapter-2',
    arrow: ARROW_BIDIRECTIONAL,
    pairs: PATTERN_TOOLKIT,
  },
  {
    eyebrow: 'Harness · The Floor Beneath',
    thesis:
      'Harness Engineering is the runtime layer the patterns and toolkit stand on — each chapter is an idea above it, seen at the loop level.',
    leftBorder: 'border-l-chapter-4',
    arrowColor: 'text-chapter-4',
    arrow: ARROW_UP,
    pairs: HARNESS_LINKS,
  },
  {
    eyebrow: 'Security · Cuts Across',
    thesis:
      'Security is not a fourth silo — each chapter hardens an idea the other pillars already established.',
    leftBorder: 'border-l-chapter-6',
    arrowColor: 'text-chapter-6',
    arrow: ARROW_UP,
    pairs: SECURITY_LINKS,
  },
];

export function ConnectionsMap() {
  return (
    <section
      aria-labelledby="learn-connections-heading"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 md:mt-8"
    >
      <ScrollReveal>
        <div className="mb-10 border-b-4 border-text pb-6">
          <h2
            id="learn-connections-heading"
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            How It Connects
          </h2>
          <p className="text-lg text-muted">
            The four pillars are one system, not four silos.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal stagger>
        <div className="space-y-6">
          {BLOCKS.map((block) => (
            <ScrollRevealItem key={block.eyebrow}>
              <div
                className={`border-4 border-text border-l-8 ${block.leftBorder} bg-surface/20 p-6 md:p-8`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
                  {block.eyebrow}
                </p>
                <p className="text-text font-semibold mb-6 max-w-3xl">{block.thesis}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {block.pairs.map((pair) => (
                    <div
                      key={pair.left.href}
                      className="flex items-center gap-3 border-2 border-text/30 bg-surface/40 px-4 py-3 transition-all duration-150 hover:border-text hover:-translate-x-0.5 hover:shadow-[3px_3px_0_0_var(--color-text)]"
                    >
                      <Link
                        href={pair.left.href}
                        className="text-sm font-semibold truncate hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                      >
                        {pair.left.name}
                      </Link>
                      <svg
                        className={`w-5 h-5 shrink-0 ${block.arrowColor}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={block.arrow}
                        />
                      </svg>
                      <Link
                        href={pair.right.href}
                        className="text-sm font-semibold truncate hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                      >
                        {pair.right.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mt-8">
          <Link
            href="/learn/patterns/graph"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
              <circle cx="4" cy="6" r="2" strokeWidth={2} />
              <circle cx="20" cy="6" r="2" strokeWidth={2} />
              <circle cx="4" cy="18" r="2" strokeWidth={2} />
              <circle cx="20" cy="18" r="2" strokeWidth={2} />
              <path strokeWidth={1.5} d="M6 7l4 3M18 7l-4 3M6 17l4-3M18 17l-4-3" />
            </svg>
            See the full language map
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
