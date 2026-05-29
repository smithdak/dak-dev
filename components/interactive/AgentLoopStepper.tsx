'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AgentLoopStepper — an "explorable explanation" of the agentic ReAct loop.
 *
 * The reader steps through a scripted Think -> Act -> Observe trace and watches
 * the context window fill as turns accumulate, until the agent converges on the
 * goal. This is the interactive counterpart to the prose in the Harness pillar:
 * instead of describing the loop, the reader drives it.
 *
 * Motion inherits the global <MotionConfig reducedMotion="user"> contract
 * (app/layout.tsx) — no per-component reduced-motion guard needed. Colors are
 * design tokens only (var(--color-*)) per DESIGN.md §6.1.
 */

type Phase = 'think' | 'act' | 'observe';

interface Turn {
  phase: Phase;
  /** Short label shown in the trace rail. */
  label: string;
  /** The model's "voice" for this step. */
  detail: string;
  /** Tokens this turn adds to the running context window. */
  tokens: number;
}

// A scripted trace: "Fix the failing test in the checkout flow."
const TRACE: Turn[] = [
  {
    phase: 'think',
    label: 'Reason about the goal',
    detail:
      'The test `checkout.spec.ts` is red. I should read it first to learn what behavior it expects before touching anything.',
    tokens: 320,
  },
  {
    phase: 'act',
    label: 'read_file("checkout.spec.ts")',
    detail: 'Call the read tool to pull the failing test into context.',
    tokens: 180,
  },
  {
    phase: 'observe',
    label: 'Test asserts a 10% discount',
    detail:
      'The spec expects `applyDiscount(100)` to return 90. The tool result lands back in the context window.',
    tokens: 540,
  },
  {
    phase: 'think',
    label: 'Form a hypothesis',
    detail:
      'The implementation probably multiplies by 0.1 instead of 0.9, or forgets to subtract. I need to see the source.',
    tokens: 260,
  },
  {
    phase: 'act',
    label: 'read_file("discount.ts")',
    detail: 'Pull the implementation into context to confirm the bug.',
    tokens: 150,
  },
  {
    phase: 'observe',
    label: 'Found: returns price * 0.1',
    detail:
      'Confirmed. `return price * 0.1` returns the discount amount, not the discounted price. The result enters context.',
    tokens: 410,
  },
  {
    phase: 'act',
    label: 'edit_file → price * 0.9',
    detail: 'Apply the one-line fix that satisfies the spec.',
    tokens: 220,
  },
  {
    phase: 'act',
    label: 'run_tests()',
    detail: 'Verify the change against the suite before claiming success.',
    tokens: 140,
  },
  {
    phase: 'observe',
    label: 'All tests green ✓',
    detail:
      'The suite passes. The goal condition is met, so the loop terminates instead of taking another turn.',
    tokens: 300,
  },
];

const CONTEXT_BUDGET = 4000; // illustrative token budget for the meter

const PHASE_META: Record<
  Phase,
  { token: string; label: string; glyph: string }
> = {
  // Each phase maps to one of the site's chapter accent tokens.
  think: { token: 'var(--color-chapter-2)', label: 'Think', glyph: '◆' },
  act: { token: 'var(--color-chapter-3)', label: 'Act', glyph: '▶' },
  observe: { token: 'var(--color-chapter-1)', label: 'Observe', glyph: '◉' },
};

export function AgentLoopStepper() {
  // step = number of turns revealed (0 = nothing yet, TRACE.length = done)
  const [step, setStep] = useState(0);

  const advance = useCallback(() => {
    setStep((s) => Math.min(s + 1, TRACE.length));
  }, []);
  const reset = useCallback(() => setStep(0), []);

  const done = step >= TRACE.length;
  const usedTokens = TRACE.slice(0, step).reduce((sum, t) => sum + t.tokens, 0);
  const pct = Math.min(100, Math.round((usedTokens / CONTEXT_BUDGET) * 100));
  const current = step > 0 ? TRACE[step - 1] : null;

  return (
    <div
      className="my-10 border-4 border-text bg-surface/40"
      role="group"
      aria-label="Interactive agent loop walkthrough"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-text px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">
          The agent loop · <span className="text-text">Fix the failing test</span>
        </p>
        <span className="font-mono text-xs text-muted tabular-nums">
          turn {step}/{TRACE.length}
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_minmax(220px,280px)]">
        {/* Trace rail */}
        <ol className="min-w-0 divide-y divide-text/15">
          <AnimatePresence initial={false}>
            {TRACE.slice(0, step).map((turn, i) => {
              const meta = PHASE_META[turn.phase];
              const isCurrent = i === step - 1;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 px-4 py-3"
                  style={{
                    backgroundColor: isCurrent
                      ? 'color-mix(in srgb, var(--color-surface) 60%, transparent)'
                      : 'transparent',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 select-none font-mono text-sm font-bold"
                    style={{ color: meta.token }}
                  >
                    {meta.glyph}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: meta.token }}
                      >
                        {meta.label}
                      </span>
                      <span className="truncate font-mono text-sm text-text">
                        {turn.label}
                      </span>
                    </p>
                    {isCurrent && (
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {turn.detail}
                      </p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>

          {step === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted">
              Press <span className="font-bold text-text">Step</span> to run the
              loop one turn at a time.
            </li>
          )}

          {done && (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3"
              style={{ color: 'var(--color-chapter-1)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest">
                ■ Loop terminated — goal condition met
              </p>
            </motion.li>
          )}
        </ol>

        {/* Side panel: context meter + phase legend */}
        <div className="border-t-2 border-text px-4 py-4 md:border-l-2 md:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
            Context window
          </p>
          <div
            className="mt-2 h-3 w-full border-2 border-text bg-background"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Context window usage"
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-1 font-mono text-xs text-muted tabular-nums">
            {usedTokens.toLocaleString()} / {CONTEXT_BUDGET.toLocaleString()} tok
            {' '}({pct}%)
          </p>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted">
            Phases
          </p>
          <ul className="mt-2 space-y-1.5">
            {(Object.keys(PHASE_META) as Phase[]).map((p) => {
              const meta = PHASE_META[p];
              const active = current?.phase === p;
              return (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <span
                    aria-hidden="true"
                    className="font-mono font-bold"
                    style={{ color: meta.token }}
                  >
                    {meta.glyph}
                  </span>
                  <span
                    className={active ? 'font-bold text-text' : 'text-muted'}
                  >
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Live region announces the current turn for screen readers */}
      <p className="sr-only" role="status" aria-live="polite">
        {current
          ? `Turn ${step}. ${PHASE_META[current.phase].label}: ${current.label}. ${current.detail}`
          : 'Ready.'}
        {done ? ' Loop terminated, goal condition met.' : ''}
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 border-t-2 border-text px-4 py-3">
        <button
          type="button"
          onClick={advance}
          disabled={done}
          className="border-2 border-accent bg-accent px-5 py-2 text-sm font-bold uppercase tracking-wider text-background transition-all duration-150 hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-text)] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {done ? 'Done' : current ? 'Step' : 'Run loop'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={step === 0}
          className="border-2 border-text px-5 py-2 text-sm font-bold uppercase tracking-wider text-text transition-all duration-150 hover:bg-text hover:text-background focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
