// Security Engineering — the trust and privacy surface of building with AI.
// Fourth peer pillar of Learn, alongside Patterns (portable techniques),
// Toolkit (Claude Code features), and Harness (the runtime). This module is
// client-safe (no fs).
//
// FLAT-ONLY CONSTRAINT: this section is intentionally flat — routes are
// /learn/security/<chapter> and never /learn/security/<chapter>/<sub>. The
// sidebar/mobile-nav active-slug parsing assumes one segment. Do not add
// nested sub-pages without revisiting that parsing.

export interface SecurityFrontmatter {
  title: string;
  slug: string;
  number: string;
  description: string;
  relatedPatterns?: string[];
  relatedTopics?: string[];
  published: boolean;
  keywords?: string[];
}

export interface SecurityChapter {
  frontmatter: SecurityFrontmatter;
  content: string;
  readingTime: string;
}

export interface SecurityChapterMeta {
  slug: string;
  name: string;
  number: string;
  description: string;
  order: number;
  icon: string;
}

// The boundary statement. Rendered on the Learn hero and the section index so
// the four-pillar mental model stays legible. It says what this is NOT, on
// purpose — that fence is what makes it this site, not an OWASP checklist.
export const SECURITY_BOUNDARY =
  'The privacy and trust surface of building with agents — what data leaves, what the model retains, what a tool can do on your behalf, and how an attacker turns your own context window against you. Not generic appsec. Not model alignment. The boundary between your secrets and a stateless model you do not control.';

export const SECURITY_CHAPTERS: SecurityChapterMeta[] = [
  {
    slug: 'the-real-risks',
    name: 'The Real Risks',
    number: '01',
    description:
      'What actually leaves your machine, what the model retains, and what an agent can do on your behalf — the honest threat landscape.',
    order: 1,
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  {
    slug: 'data-and-pii',
    name: 'Data & PII in Context',
    number: '02',
    description:
      'What enters the context window, provider retention and training exposure, data minimization, and redaction that survives the loop.',
    order: 2,
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    slug: 'threat-model',
    name: 'A Threat Model for AI',
    number: '03',
    description:
      'The attack surface of an agent: what is genuinely new versus classic appsec, and the four trust boundaries — model, context, tools, output.',
    order: 3,
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    slug: 'prompt-injection',
    name: 'Prompt Injection',
    number: '04',
    description:
      'Direct and indirect injection, tool-result poisoning, the limits of the instruction hierarchy, and why there is no single fix.',
    order: 4,
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    slug: 'secrets-and-credentials',
    name: 'Secrets & Credentials',
    number: '05',
    description:
      'Keys in prompts, env, and logs; the never-in-context rule; scoping and short-lived credentials; agent credential isolation and secret scanning.',
    order: 5,
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  },
  {
    slug: 'permission-architecture',
    name: 'Permission Architecture',
    number: '06',
    description:
      'Least-privilege tools, allow/deny, sandboxing, blast radius and reversibility tiers, human-in-the-loop gates, and SSRF via the agent fetch.',
    order: 6,
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    slug: 'exfiltration-and-output',
    name: 'Output & Exfiltration',
    number: '07',
    description:
      'Exfiltration via tool calls, links, and markdown image beacons; the danger of rendering untrusted model output as live HTML.',
    order: 7,
    icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  },
  {
    slug: 'supply-chain-and-audit',
    name: 'Supply Chain & Audit',
    number: '08',
    description:
      'MCP, plugin, and model provenance; dependency and lockfile hardening; what to log and what never to log; traceability for autonomous actions.',
    order: 8,
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
];

export function getAllSecurityChapterSlugs(): string[] {
  return SECURITY_CHAPTERS.map((c) => c.slug);
}

export function getSecurityChapterBySlug(slug: string): SecurityChapterMeta | undefined {
  return SECURITY_CHAPTERS.find((c) => c.slug === slug);
}
