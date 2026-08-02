export const TOOLKIT_REVIEWED_AT = '2026-08-01';

export const TOOLKIT_LENSES = [
  {
    slug: 'mental-model',
    label: 'Mental Model',
    blurb: 'The mechanism, constraints, and decision boundary behind the capability.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    slug: 'playbook',
    label: 'Playbook',
    blurb: 'A concrete implementation path, including the product-specific details.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    slug: 'compositions',
    label: 'Compositions',
    blurb: 'How the capability combines with other controls into a delivery system.',
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
  },
  {
    slug: 'pitfalls',
    label: 'Pitfalls',
    blurb: 'Failure modes, false assurances, and operational limits to test.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3.414 1.732 3.414z',
  },
] as const;

export type ToolkitSubPage = (typeof TOOLKIT_LENSES)[number]['slug'];
export type AgentToolId = 'claude-code' | 'openai-codex' | 'github-copilot';
export type ToolSurface = 'cli' | 'ide' | 'web' | 'cloud';
export type CoverageStatus =
  'native' | 'partial' | 'external' | 'no-documented-equivalent' | 'unknown';
export type EvidenceKind = 'official-docs' | 'release-note' | 'official-repository';
export type EvidenceBasis = 'documented' | 'observed';

export interface ToolkitFrontmatter {
  title: string;
  topic: string;
  subPage?: ToolkitSubPage;
  order: number;
  description: string;
  relatedPatterns?: string[];
  relatedTopics?: string[];
  published: boolean;
  keywords?: string[];
  reviewedAt: string;
  sourceIds: string[];
}

export interface ToolkitPage {
  frontmatter: ToolkitFrontmatter;
  content: string;
  readingTime: string;
}

export interface ToolkitTopicMeta {
  slug: string;
  name: string;
  description: string;
  order: number;
  icon: string;
}

export interface AgentToolMeta {
  id: AgentToolId;
  name: string;
  shortName: string;
  vendor: string;
  description: string;
  surfaces: ToolSurface[];
  officialUrl: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  kind: EvidenceKind;
  url: string;
  accessedAt: string;
  publishedAt?: string;
}

export interface ToolkitCoverage {
  topic: string;
  tool: AgentToolId;
  surfaces: ToolSurface[];
  status: CoverageStatus;
  summary: string;
  sourceIds: string[];
  basis: EvidenceBasis;
}

export const TOOLKIT_BOUNDARY =
  'Capability pages compare documented product behavior. Deep implementation lenses retain product-specific examples where portability would be misleading. Documentation evidence is not runtime conformance evidence.';

export const TOOLKIT_TOPICS: ToolkitTopicMeta[] = [
  {
    slug: 'project-instructions',
    name: 'Project Instructions',
    description: 'Persistent repository guidance, scope, precedence, and instruction architecture',
    order: 1,
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    slug: 'hooks',
    name: 'Lifecycle Hooks',
    description: 'Event-driven automation, validation, and the limits of hook-based enforcement',
    order: 2,
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  },
  {
    slug: 'skills',
    name: 'Reusable Skills',
    description: 'Progressively disclosed instructions, scripts, resources, and invocation policy',
    order: 3,
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    slug: 'agents',
    name: 'Agents & Subagents',
    description: 'Delegated context, specialization, isolation, and coordinator-managed work',
    order: 4,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    slug: 'agent-teams',
    name: 'Multi-Agent Coordination',
    description: 'Parallel delegation, coordination topology, shared state, and peer communication',
    order: 5,
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    slug: 'mcp',
    name: 'MCP Integration',
    description:
      'External tools and context through Model Context Protocol, with surface-specific limits',
    order: 6,
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  },
  {
    slug: 'commands',
    name: 'Commands & Workflows',
    description: 'Interactive commands and invocable workflows for repeatable operator intent',
    order: 7,
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    slug: 'settings',
    name: 'Settings & Policy',
    description: 'Configuration scope, permissions, model choice, and managed controls',
    order: 8,
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    slug: 'memory',
    name: 'Persistent Memory',
    description: 'Cross-session recall, storage boundaries, provenance, and stale-context risk',
    order: 9,
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  },
];

export const TOOLKIT_TOPIC_ALIASES: Record<string, string> = {
  'claude-md': 'project-instructions',
};

export function resolveToolkitTopicSlug(slug: string): string {
  return TOOLKIT_TOPIC_ALIASES[slug] ?? slug;
}

export function getAllToolkitTopicSlugs(): string[] {
  return TOOLKIT_TOPICS.map((topic) => topic.slug);
}

export function getToolkitTopicBySlug(slug: string): ToolkitTopicMeta | undefined {
  const canonicalSlug = resolveToolkitTopicSlug(slug);
  return TOOLKIT_TOPICS.find((topic) => topic.slug === canonicalSlug);
}

export function isToolkitSubPage(value: string): value is ToolkitSubPage {
  return TOOLKIT_LENSES.some((lens) => lens.slug === value);
}

export const SUB_PAGE_META = Object.fromEntries(
  TOOLKIT_LENSES.map(({ slug, label, icon }) => [slug, { label, icon }])
) as Record<ToolkitSubPage, { label: string; icon: string }>;

export const COVERAGE_STATUS_META: Record<CoverageStatus, { label: string; description: string }> =
  {
    native: {
      label: 'Native',
      description: 'The official product documents a first-party implementation on this surface.',
    },
    partial: {
      label: 'Partial',
      description:
        'The product covers part of the capability or carries a material documented limit.',
    },
    external: {
      label: 'External',
      description: 'The capability depends on an external tool, extension, or integration.',
    },
    'no-documented-equivalent': {
      label: 'No documented equivalent',
      description:
        'The reviewed official sources did not document an equivalent as of the review date.',
    },
    unknown: {
      label: 'Unknown',
      description: 'The evidence reviewed was insufficient to make a defensible classification.',
    },
  };
