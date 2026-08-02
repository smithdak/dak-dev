import { ReactNode } from 'react';

interface AnnotationProps {
  /** The jargon term being decoded for this step, e.g. "tool call". */
  term: string;
  children: ReactNode;
}

/**
 * A margin-style "decoder" note for Demo, Decoded walkthroughs. It sits beside a
 * step in an agent transcript and translates one piece of jargon into plain
 * English — the signalling cue that turns a raw transcript into a worked
 * example. Presentational and server-rendered; colours are amber/chapter-5
 * tokens only. Exposed to demo MDX via the demo component map.
 */
export function Annotation({ term, children }: AnnotationProps) {
  return (
    <aside
      className="not-prose my-6 flex gap-3 border-y border-rule bg-chapter-5/5 px-4 py-3"
      aria-label={`In plain English: ${term}`}
    >
      <div className="min-w-0">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-chapter-5">
          {term}
        </span>
        <div className="text-sm leading-relaxed text-muted [&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
