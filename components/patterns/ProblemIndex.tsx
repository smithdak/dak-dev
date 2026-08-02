import Link from 'next/link';

interface ProblemEntry {
  problem: string;
  patterns: Array<{ slug: string; name: string; number: string }>;
}

const PROBLEMS: ProblemEntry[] = [
  {
    problem: "The agent keeps making changes I didn't ask for",
    patterns: [
      { slug: 'scope-fence', name: 'Scope Fence', number: '2.2' },
      { slug: 'negative-space', name: 'Negative Space', number: '4.3' },
    ],
  },
  {
    problem: 'I keep re-explaining the same things',
    patterns: [
      { slug: 'convention-file', name: 'Convention File', number: '1.1' },
      { slug: 'memory-layer', name: 'Memory Layer', number: '1.3' },
    ],
  },
  {
    problem: "Output is correct but doesn't match codebase style",
    patterns: [
      { slug: 'convention-file', name: 'Convention File', number: '1.1' },
      { slug: 'agent-friendly-architecture', name: 'Agent-Friendly Architecture', number: '1.4' },
    ],
  },
  {
    problem: "Huge diff and I'm not sure it's right",
    patterns: [
      { slug: 'checkpoint-loop', name: 'Checkpoint Loop', number: '3.2' },
      { slug: 'incremental-verification', name: 'Incremental Verification', number: '5.1' },
      { slug: 'diff-review', name: 'Diff Review', number: '5.4' },
    ],
  },
  {
    problem: 'The conversation got confused and is going in circles',
    patterns: [
      { slug: 'clean-slate', name: 'Clean Slate', number: '6.1' },
      { slug: 'rollback-point', name: 'Rollback Point', number: '6.2' },
    ],
  },
  {
    problem: 'Not getting enough value from agents on complex tasks',
    patterns: [
      { slug: 'vertical-slice', name: 'Vertical Slice', number: '3.1' },
      { slug: 'scaffold-first', name: 'Scaffold First', number: '3.3' },
      { slug: 'test-first-steering', name: 'Test-First Steering', number: '4.1' },
    ],
  },
  {
    problem: 'The agent broke something unrelated',
    patterns: [
      { slug: 'scope-fence', name: 'Scope Fence', number: '2.2' },
      { slug: 'safety-net', name: 'Safety Net', number: '1.2' },
      { slug: 'regression-guard', name: 'Regression Guard', number: '5.3' },
    ],
  },
  {
    problem: 'Spending more time fixing agent output than writing it myself',
    patterns: [
      { slug: 'test-first-steering', name: 'Test-First Steering', number: '4.1' },
      { slug: 'constraint-over-instruction', name: 'Constraint Over Instruction', number: '4.4' },
      { slug: 'checkpoint-loop', name: 'Checkpoint Loop', number: '3.2' },
    ],
  },
];

interface ProblemIndexProps {
  className?: string;
  publishedSlugs?: Set<string>;
}

export function ProblemIndex({ className = '', publishedSlugs }: ProblemIndexProps) {
  return (
    <section id="problems" className={`scroll-mt-20 ${className}`}>
      <div className="mb-8 border-b border-text/20 pb-5">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-accent uppercase tracking-widest">02</span>
          <h2 className="font-display text-4xl tracking-tight">Find by Problem</h2>
        </div>
        <p className="text-sm text-muted mt-1 ml-8">
          Start from the symptom you&apos;re experiencing.
        </p>
      </div>

      <div className="border-y border-text/20">
        {PROBLEMS.map((entry) => {
          const availablePatterns = publishedSlugs
            ? entry.patterns.filter((p) => publishedSlugs.has(p.slug))
            : entry.patterns;

          if (availablePatterns.length === 0) return null;

          return (
            <div
              key={entry.problem}
              className="group grid gap-4 border-b border-text/20 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)] md:items-start"
            >
              <p className="font-display text-xl leading-snug text-text">
                &ldquo;{entry.problem}&rdquo;
              </p>
              <div className="flex flex-wrap gap-1.5">
                {availablePatterns.map((pattern) => (
                  <Link
                    key={pattern.slug}
                    href={`/learn/patterns/${pattern.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted underline decoration-text/20 underline-offset-4 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <span className="font-mono text-[10px] text-accent">{pattern.number}</span>
                    {pattern.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
