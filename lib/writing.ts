import type { Post } from './posts';

export const WRITING_LANES = [
  {
    name: 'Agent systems',
    tag: 'agents',
    description: 'Orchestration, durable execution, and the architecture around model-driven work.',
  },
  {
    name: 'Delivery architecture',
    tag: 'architecture',
    description:
      'The control surfaces that turn experimental capability into maintainable systems.',
  },
  {
    name: 'Tools and capability',
    tag: 'developer-tools',
    description:
      'How coding agents, skills, protocols, and platforms change the engineering workflow.',
  },
  {
    name: 'Security and assurance',
    tag: 'security',
    description: 'Operational boundaries, evidence, and risk controls for AI-enabled delivery.',
  },
] as const;

export function splitWritingPosts(posts: Post[]): { lead: Post | null; archive: Post[] } {
  const lead = posts.find((post) => post.frontmatter.featured) ?? posts[0] ?? null;

  if (!lead) {
    return { lead: null, archive: [] };
  }

  return {
    lead,
    archive: posts.filter((post) => post.frontmatter.slug !== lead.frontmatter.slug),
  };
}

const TAG_LABELS: Record<string, string> = {
  ai: 'AI',
  'ai-tools': 'AI tools',
  cms: 'CMS',
  'claude-code': 'Claude Code',
  dotnet: '.NET',
  mcp: 'MCP',
  nextjs: 'Next.js',
  'open-source': 'Open source',
  'project-showcase': 'Project work',
  'prompt-engineering': 'Prompt architecture',
  'web-development': 'Web engineering',
};

export function formatWritingTag(tag: string): string {
  return (
    TAG_LABELS[tag] ??
    tag
      .split('-')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(' ')
  );
}
