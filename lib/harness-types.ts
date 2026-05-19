// Harness Engineering — the runtime layer beneath the model.
// Third peer pillar of Learn, alongside Patterns (portable techniques) and
// Toolkit (Claude Code features). This module is client-safe (no fs).

export interface HarnessFrontmatter {
  title: string;
  slug: string;
  number: string;
  description: string;
  relatedPatterns?: string[];
  relatedTopics?: string[];
  published: boolean;
  keywords?: string[];
}

export interface HarnessChapter {
  frontmatter: HarnessFrontmatter;
  content: string;
  readingTime: string;
}

export interface HarnessChapterMeta {
  slug: string;
  name: string;
  number: string;
  description: string;
  order: number;
  icon: string;
}

// The boundary statement. Rendered on the Learn hero and the section index so
// the three-pillar mental model stays legible.
export const HARNESS_BOUNDARY =
  'The runtime layer beneath the model — the loop, the context window, compaction, and the system prompt. Not Claude Code features (that is the Toolkit). Not portable techniques (that is Patterns). The floor the other two stand on.';

export const HARNESS_CHAPTERS: HarnessChapterMeta[] = [
  {
    slug: 'agent-loop',
    name: 'The Agent Loop',
    number: '01',
    description: 'The core run loop: prompt, model, tool calls, results, repeat — and the stop conditions that end it.',
    order: 1,
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    slug: 'context-economics',
    name: 'Context Window Economics',
    number: '02',
    description: 'The token budget as the scarce resource: what occupies the window, the cost model, and what to evict.',
    order: 2,
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    slug: 'compaction-continuity',
    name: 'Compaction & Continuity',
    number: '03',
    description: 'What survives a context-overflow boundary: summarization fidelity, the handoff, and designing for it.',
    order: 3,
    icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
  },
  {
    slug: 'tool-result-curation',
    name: 'Tool Result Curation',
    number: '04',
    description: 'The signal-to-noise problem: verbose tool output, truncation, deferral, and protecting the window.',
    order: 4,
    icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
  },
  {
    slug: 'system-prompt-architecture',
    name: 'System Prompt Architecture',
    number: '05',
    description: 'Where steering actually lives: instruction hierarchy, the harness preamble, and layered precedence.',
    order: 5,
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
  },
  {
    slug: 'building-a-harness',
    name: 'Building a Harness',
    number: '06',
    description: 'Rolling your own loop with the Claude Agent SDK — when it pays off, and when to use the managed one.',
    order: 6,
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
];

export function getAllHarnessChapterSlugs(): string[] {
  return HARNESS_CHAPTERS.map((c) => c.slug);
}

export function getHarnessChapterBySlug(slug: string): HarnessChapterMeta | undefined {
  return HARNESS_CHAPTERS.find((c) => c.slug === slug);
}
