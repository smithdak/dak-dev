# Learn Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify Patterns and a new Claude Code Toolkit under a single "Learn" section at `/learn`, with shared navigation, cross-referencing, and full SEO support.

**Architecture:** Move existing `/patterns/*` routes under `/learn/patterns/*` with 301 redirects. Create parallel `/learn/toolkit/*` routes for 9 deep-dive topics. Both share a new `LearnSidebar` component inside a shared `/learn` layout. The landing page at `/learn` presents both tracks side by side.

**Tech Stack:** Next.js App Router (SSG), MDX with gray-matter, TypeScript, Tailwind CSS, Framer Motion, Shiki

---

## Phase 1: Content Infrastructure

### Task 1: Create Toolkit TypeScript Types and Content Loading

**Files:**
- Create: `lib/toolkit.ts`

**Step 1: Create `lib/toolkit.ts` with types and loading functions**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type ToolkitSubPage = 'mental-model' | 'playbook' | 'compositions' | 'pitfalls';

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
  icon: string; // SVG path data for the nav icon
}

export const TOOLKIT_TOPICS: ToolkitTopicMeta[] = [
  { slug: 'claude-md', name: 'CLAUDE.md', description: 'Project instruction architecture, layered configs, context priming strategies', order: 1, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { slug: 'hooks', name: 'Hooks', description: 'Execution lifecycle automation, validation pipelines, agent guardrails', order: 2, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { slug: 'skills', name: 'Skills', description: 'Reusable prompt engineering, skill composition, invocation patterns', order: 3, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { slug: 'agents', name: 'Agents & Subagents', description: 'Delegation patterns, isolation strategies, worktree workflows', order: 4, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { slug: 'agent-teams', name: 'Agent Teams', description: 'Multi-agent orchestration, role-based pipelines, coordination architectures', order: 5, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { slug: 'mcp', name: 'MCP Servers', description: 'External tool integration, custom server patterns, protocol mastery', order: 6, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  { slug: 'commands', name: 'Commands', description: 'Custom slash commands, workflow automation, command composition', order: 7, icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { slug: 'settings', name: 'Settings & Config', description: 'Permission architectures, model selection strategy, profile management', order: 8, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { slug: 'memory', name: 'Memory System', description: 'Persistent context strategies, memory taxonomy, cross-session intelligence', order: 9, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
];

const toolkitDirectory = path.join(process.cwd(), 'content/toolkit');

export function getAllToolkitTopicSlugs(): string[] {
  return TOOLKIT_TOPICS.map((t) => t.slug);
}

export function getToolkitTopicBySlug(slug: string): ToolkitTopicMeta | undefined {
  return TOOLKIT_TOPICS.find((t) => t.slug === slug);
}

export function getToolkitPage(topic: string, subPage?: string): ToolkitPage | null {
  try {
    const fileName = subPage ? `${subPage}.mdx` : 'index.mdx';
    const fullPath = path.join(toolkitDirectory, topic, fileName);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as ToolkitFrontmatter;
    if (!frontmatter.published) return null;
    const stats = readingTime(content);
    return { frontmatter, content, readingTime: stats.text };
  } catch {
    return null;
  }
}

export function getToolkitTopicPages(topic: string): ToolkitPage[] {
  const topicDir = path.join(toolkitDirectory, topic);
  if (!fs.existsSync(topicDir)) return [];

  return fs.readdirSync(topicDir)
    .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
    .map((f) => {
      const sub = f.replace(/\.mdx$/, '');
      return getToolkitPage(topic, sub);
    })
    .filter((p): p is ToolkitPage => p !== null)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getAllToolkitPages(): ToolkitPage[] {
  return TOOLKIT_TOPICS.flatMap((topic) => {
    const index = getToolkitPage(topic.slug);
    const subPages = getToolkitTopicPages(topic.slug);
    return [index, ...subPages].filter((p): p is ToolkitPage => p !== null);
  });
}

/** Sub-page metadata for sidebar navigation */
export const SUB_PAGE_META: Record<ToolkitSubPage, { label: string; icon: string }> = {
  'mental-model': { label: 'Mental Model', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  'playbook': { label: 'Playbook', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  'compositions': { label: 'Compositions', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
  'pitfalls': { label: 'Pitfalls', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
};
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to toolkit.ts

**Step 3: Commit**

```bash
git add lib/toolkit.ts
git commit -m "feat(learn): add toolkit content types and loading utilities"
```

---

### Task 2: Seed Toolkit Content Directory Structure

**Files:**
- Create: `content/toolkit/hooks/index.mdx` (seed topic — hooks is the most concrete example)
- Create: `content/toolkit/claude-md/index.mdx`

We seed two topics to validate the pipeline. Remaining topics can be added incrementally.

**Step 1: Create `content/toolkit/hooks/index.mdx`**

```mdx
---
title: "Hooks: Expert's Guide"
topic: "hooks"
order: 1
description: "Master Claude Code hooks — lifecycle automation, validation pipelines, and agent guardrails for production workflows."
relatedPatterns: ["safety-net", "convention-file"]
relatedTopics: ["skills", "agents", "claude-md"]
published: true
keywords: ["claude code hooks", "lifecycle automation", "validation pipeline", "agent guardrails"]
---

# Hooks

Hooks are Claude Code's lifecycle automation system. They fire shell commands at precise moments — before or after tool calls — giving you programmatic control over agent behavior without touching the agent itself.

## Why Hooks Matter

Most developers discover hooks when they want auto-formatting. That's the tip of the iceberg. Hooks are the mechanism for building **deterministic guardrails** around non-deterministic agent behavior. They're how you enforce invariants that prompts alone can't guarantee.

## When to Use Hooks vs. Alternatives

| Need | Use |
|------|-----|
| Enforce a rule on every tool call | **Hook** |
| Teach the agent a reusable workflow | Skill |
| Give the agent a one-time instruction | CLAUDE.md |
| Block dangerous operations | **Hook** (PreToolUse) |
| Format code after edits | **Hook** (PostToolUse) |

## What's Inside

Explore the sub-pages for deep expertise:

- **Mental Model** — How hooks fit into Claude Code's execution lifecycle
- **Playbook** — Production-ready hook configurations with rationale
- **Compositions** — Hooks combined with skills, agents, and MCP
- **Pitfalls** — Silent failures, ordering surprises, and performance traps
```

**Step 2: Create `content/toolkit/claude-md/index.mdx`**

```mdx
---
title: "CLAUDE.md: Expert's Guide"
topic: "claude-md"
order: 1
description: "Master CLAUDE.md project instructions — layered architecture, context priming, and instruction design for production agent workflows."
relatedPatterns: ["convention-file", "context-priming"]
relatedTopics: ["hooks", "skills", "memory"]
published: true
keywords: ["CLAUDE.md", "project instructions", "context priming", "convention file"]
---

# CLAUDE.md

CLAUDE.md is Claude Code's project instruction file — the primary mechanism for shaping agent behavior before a conversation begins. It's the difference between an agent that knows your codebase and one that's guessing.

## Why CLAUDE.md Matters

Every Claude Code session starts by reading CLAUDE.md files. This isn't optional context — it's the agent's mental model of your project. A well-architected CLAUDE.md eliminates entire categories of mistakes.

## The Layered Architecture

CLAUDE.md files cascade from three levels:

1. **User-level** (`~/.claude/CLAUDE.md`) — Personal preferences, global tooling
2. **Project-level** (`./CLAUDE.md`) — Repo-specific conventions, architecture
3. **Directory-level** (`./src/CLAUDE.md`) — Module-specific rules, patterns

## What's Inside

- **Mental Model** — How instruction layering works and when each level fires
- **Playbook** — Production CLAUDE.md architectures for different project types
- **Compositions** — CLAUDE.md with hooks, skills, and memory for full-stack control
- **Pitfalls** — Instruction conflicts, context window pressure, stale instructions
```

**Step 3: Verify content loads**

Run: `node -e "const t = require('./lib/toolkit'); console.log(t.getToolkitPage('hooks')?.frontmatter.title)"`
Expected: "Hooks: Expert's Guide" (or may need ts-node/build — verify via build step)

**Step 4: Commit**

```bash
git add content/toolkit/
git commit -m "feat(learn): seed toolkit content for hooks and claude-md topics"
```

---

## Phase 2: Route Migration — Move Patterns Under /learn

### Task 3: Create /learn Route Group and Move Patterns

This is the most critical task. We move `app/patterns/` into `app/learn/patterns/` and create the `/learn` layout.

**Files:**
- Move: `app/patterns/` → `app/learn/patterns/` (all files)
- Create: `app/learn/layout.tsx`
- Create: `app/learn/page.tsx` (placeholder landing page)

**Step 1: Create the directory structure and move patterns**

```bash
mkdir -p app/learn
# Move entire patterns directory under learn
mv app/patterns app/learn/patterns
```

**Step 2: Create `app/learn/layout.tsx`**

Initially this is a thin wrapper. We'll add the shared sidebar in Phase 3.

```typescript
import { ReactNode } from 'react';

export default function LearnLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

**Step 3: Create placeholder `app/learn/page.tsx`**

```typescript
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev';

export const metadata: Metadata = {
  title: 'Learn | Dakota Smith',
  description: 'Expert guides for agentic engineering — patterns for AI-assisted development and deep-dives into Claude Code\'s toolkit.',
  openGraph: {
    title: 'Learn — Patterns & Toolkit',
    description: 'Expert guides for agentic engineering with Claude Code.',
    url: `${siteUrl}/learn`,
  },
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  return (
    <PageTransition className="min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">Learn</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/learn/patterns"
            className="block border-4 border-text p-8 hover:shadow-[6px_6px_0_0_var(--color-accent)] transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Patterns</h2>
            <p className="text-muted">Named patterns for AI-assisted engineering</p>
          </Link>
          <Link
            href="/learn/toolkit"
            className="block border-4 border-text p-8 hover:shadow-[6px_6px_0_0_var(--color-accent)] transition-all"
          >
            <h2 className="text-2xl font-bold mb-2">Claude Code Toolkit</h2>
            <p className="text-muted">Expert&apos;s guide to agentic engineering with Claude</p>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
```

**Step 4: Verify build compiles**

Run: `npx next build 2>&1 | tail -30`
Expected: Build succeeds (may have link warnings — that's OK for now)

**Step 5: Commit**

```bash
git add app/learn/
git commit -m "feat(learn): move patterns under /learn route group"
```

---

### Task 4: Update All Internal `/patterns` Links to `/learn/patterns`

**Files:**
- Modify: `components/patterns/PatternsSidebar.tsx` — all href="/patterns..." → "/learn/patterns..."
- Modify: `components/patterns/PatternsMobileNav.tsx` — same
- Modify: `components/patterns/PatternCard.tsx`
- Modify: `components/patterns/PatternNavigation.tsx`
- Modify: `components/patterns/PatternsHero.tsx`
- Modify: `components/patterns/PatternMdxComponents.tsx` (PatternRef)
- Modify: `components/patterns/RelatedPatternLink.tsx`
- Modify: `components/patterns/RelatedPatternsGraph.tsx`
- Modify: `components/patterns/QuickReferenceCard.tsx`
- Modify: `components/patterns/ProblemIndex.tsx`
- Modify: `components/patterns/PatternLanguageGraph.tsx`
- Modify: `components/home/PatternsShowcase.tsx`
- Modify: `components/ui/Search.tsx`
- Modify: `app/learn/patterns/page.tsx` — canonical URL
- Modify: `app/learn/patterns/[slug]/page.tsx` — breadcrumbs, URLs
- Modify: `app/learn/patterns/chapter/[chapter]/page.tsx` — breadcrumbs, URLs
- Modify: `app/learn/patterns/cards/page.tsx` — breadcrumbs, URLs
- Modify: `app/learn/patterns/graph/page.tsx` — breadcrumbs, URLs

**Step 1: Batch find-and-replace `/patterns` → `/learn/patterns` in all pattern components**

For each component file listed above, replace:
- `href="/patterns"` → `href="/learn/patterns"`
- `href="/patterns/` → `href="/learn/patterns/`
- `'/patterns'` → `'/learn/patterns'`
- `pathname.startsWith('/patterns')` → `pathname.startsWith('/learn/patterns')`
- `pathname === '/patterns'` → `pathname === '/learn/patterns'`
- `pathname.split('/patterns/')` → `pathname.split('/learn/patterns/')`

Be careful NOT to change import paths (`@/lib/patterns`, `@/components/patterns/`) — those are filesystem imports, not URLs.

**Step 2: Update breadcrumbs in pattern pages**

In `app/learn/patterns/[slug]/page.tsx`, update breadcrumb nav:
```jsx
<li><Link href="/learn/patterns">Patterns</Link></li>
```
→ becomes:
```jsx
<li><Link href="/learn">Learn</Link></li>
<li aria-hidden="true">/</li>
<li><Link href="/learn/patterns">Patterns</Link></li>
```

Same pattern for chapter, cards, and graph pages — add "Learn" as the first breadcrumb item.

**Step 3: Update schema.ts URLs**

In `lib/schema.ts`:
- `${SITE_URL}/patterns/${pattern.slug}` → `${SITE_URL}/learn/patterns/${pattern.slug}`
- `${SITE_URL}/patterns` → `${SITE_URL}/learn/patterns`
- `${SITE_URL}/patterns/chapter/${chapter.slug}` → `${SITE_URL}/learn/patterns/chapter/${chapter.slug}`

**Step 4: Update OG metadata URLs in pattern pages**

In `app/learn/patterns/page.tsx`:
- `url: '${siteUrl}/patterns'` → `url: '${siteUrl}/learn/patterns'`
- `alternates: { canonical: '/patterns' }` → `alternates: { canonical: '/learn/patterns' }`

Same for [slug], chapter, cards, graph pages.

**Step 5: Verify build compiles**

Run: `npx next build 2>&1 | tail -30`
Expected: Build succeeds with no broken link warnings

**Step 6: Commit**

```bash
git add -A
git commit -m "feat(learn): update all internal links from /patterns to /learn/patterns"
```

---

### Task 5: Update Header Navigation

**Files:**
- Modify: `components/layout/Header.tsx:10-15`

**Step 1: Change "Patterns" to "Learn" in the navigation array**

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Learn', href: '/learn' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];
```

**Step 2: Verify the active state detection still works**

The existing `isActive` function uses `pathname.startsWith(href)`. Since `/learn` is the prefix for both `/learn/patterns` and `/learn/toolkit`, this will correctly highlight the "Learn" link for all child routes.

**Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat(learn): update header nav from Patterns to Learn"
```

---

### Task 6: Add 301 Redirects for Old `/patterns` URLs

**Files:**
- Modify: `next.config.ts:109-123`

**Step 1: Add pattern redirects to next.config.ts**

Add these redirects to the existing `redirects()` array:

```typescript
// Patterns → Learn/Patterns redirects
{
  source: '/patterns',
  destination: '/learn/patterns',
  permanent: true,
},
{
  source: '/patterns/:path*',
  destination: '/learn/patterns/:path*',
  permanent: true,
},
```

**Step 2: Verify redirects work**

Run: `npx next build && npx next start &`
Then: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3000/patterns`
Expected: `308 http://localhost:3000/learn/patterns` (Next.js uses 308 for permanent redirects with method preservation)

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(learn): add 301 redirects from /patterns to /learn/patterns"
```

---

### Task 7: Update Sitemap

**Files:**
- Modify: `app/sitemap.ts`

**Step 1: Update all pattern URLs in sitemap to use /learn prefix**

Replace all `/patterns` URL references with `/learn/patterns`:

```typescript
// Static pages — add /learn landing and update patterns
{
  url: `${SITE_URL}/learn`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,
},
{
  url: `${SITE_URL}/learn/patterns`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,
},

// Pattern pages
const patternPages = patterns.map((pattern) => ({
  url: `${SITE_URL}/learn/patterns/${pattern.frontmatter.slug}`,
  ...
}));

// Pattern sub-pages
url: `${SITE_URL}/learn/patterns/graph`,
url: `${SITE_URL}/learn/patterns/cards`,

// Chapter pages
url: `${SITE_URL}/learn/patterns/chapter/${chapter.slug}`,
```

Also add toolkit pages to the sitemap:

```typescript
import { TOOLKIT_TOPICS } from '@/lib/toolkit';

// Toolkit pages
const toolkitPages: MetadataRoute.Sitemap = [
  {
    url: `${SITE_URL}/learn/toolkit`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  ...TOOLKIT_TOPICS.map((topic) => ({
    url: `${SITE_URL}/learn/toolkit/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  })),
];
```

**Step 2: Verify build**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(learn): update sitemap with /learn URLs and toolkit pages"
```

---

## Phase 3: Shared Navigation Components

### Task 8: Create LearnSidebar Component

**Files:**
- Create: `components/learn/LearnSidebar.tsx`

**Step 1: Create the LearnSidebar with two collapsible sections (Patterns + Toolkit)**

This component wraps the existing PatternsSidebar chapter navigation and adds a new Toolkit section. It uses the same neo-brutalist styling patterns.

```typescript
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { ChapterMeta } from '@/lib/patterns';
import type { ToolkitTopicMeta } from '@/lib/toolkit';
import { SUB_PAGE_META, type ToolkitSubPage } from '@/lib/toolkit';

const CHAPTER_BORDER_COLORS: Record<number, string> = {
  1: 'border-chapter-1', 2: 'border-chapter-2', 3: 'border-chapter-3',
  4: 'border-chapter-4', 5: 'border-chapter-5', 6: 'border-chapter-6',
};
const CHAPTER_TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1', 2: 'text-chapter-2', 3: 'text-chapter-3',
  4: 'text-chapter-4', 5: 'text-chapter-5', 6: 'text-chapter-6',
};
const CHAPTER_BG_COLORS: Record<number, string> = {
  1: 'bg-chapter-1/10', 2: 'bg-chapter-2/10', 3: 'bg-chapter-3/10',
  4: 'bg-chapter-4/10', 5: 'bg-chapter-5/10', 6: 'bg-chapter-6/10',
};

interface SidebarPattern {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  difficulty: string;
}

interface LearnSidebarProps {
  chapters: ChapterMeta[];
  patterns: SidebarPattern[];
  toolkitTopics: ToolkitTopicMeta[];
  /** Which toolkit topics have published sub-pages, keyed by topic slug */
  topicSubPages: Record<string, ToolkitSubPage[]>;
}

export function LearnSidebar({
  chapters,
  patterns,
  toolkitTopics,
  topicSubPages,
}: LearnSidebarProps) {
  const pathname = usePathname();
  const isInPatterns = pathname.startsWith('/learn/patterns');
  const isInToolkit = pathname.startsWith('/learn/toolkit');

  // Section collapse state — auto-expand whichever section the user is in
  const [patternsOpen, setPatternsOpen] = useState(isInPatterns || (!isInPatterns && !isInToolkit));
  const [toolkitOpen, setToolkitOpen] = useState(isInToolkit);

  // Pattern active state
  const activePatternSlug = isInPatterns
    ? pathname.replace('/learn/patterns/', '').split('/')[0]
    : null;
  const activePattern = patterns.find((p) => p.slug === activePatternSlug);
  const activeChapterNum = activePattern?.chapter ?? null;

  // Chapter expand state
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(() => {
    const s = new Set<number>();
    if (activeChapterNum) s.add(activeChapterNum);
    return s;
  });

  // Toolkit active state
  const activeTopicSlug = isInToolkit
    ? pathname.replace('/learn/toolkit/', '').split('/')[0]
    : null;

  // Toolkit topic expand state
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (activeTopicSlug) s.add(activeTopicSlug);
    return s;
  });

  const toggleChapter = (num: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num); else next.add(num);
      return next;
    });
  };

  const toggleTopic = (slug: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  return (
    <nav
      className="sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] patterns-sidebar-scroll"
      aria-label="Learn navigation"
    >
      {/* ── PATTERNS SECTION ── */}
      <SectionHeader
        title="Patterns"
        isOpen={patternsOpen}
        onToggle={() => setPatternsOpen(!patternsOpen)}
        count={patterns.length}
        isActive={isInPatterns}
      />

      {patternsOpen && (
        <div className="mb-4">
          {/* Quick links */}
          <div className="flex gap-1.5 mb-3 px-1">
            <SidebarPill href="/learn/patterns" isActive={pathname === '/learn/patterns'}>All</SidebarPill>
            <SidebarPill href="/learn/patterns/graph" isActive={pathname === '/learn/patterns/graph'}>Map</SidebarPill>
            <SidebarPill href="/learn/patterns/cards" isActive={pathname === '/learn/patterns/cards'}>Cards</SidebarPill>
          </div>

          {/* Chapters */}
          <div className="space-y-0.5">
            {chapters.map((chapter) => {
              const chapterPatterns = patterns.filter((p) => p.chapter === chapter.number);
              const isExpanded = expandedChapters.has(chapter.number);
              const isActiveChapter = activeChapterNum === chapter.number;

              return (
                <div key={chapter.number}>
                  <div
                    className={`flex items-center border-l-4 transition-colors ${
                      isActiveChapter
                        ? `${CHAPTER_BORDER_COLORS[chapter.number]} ${CHAPTER_BG_COLORS[chapter.number]}`
                        : 'border-transparent hover:border-text/20'
                    }`}
                  >
                    <Link
                      href={`/learn/patterns/chapter/${chapter.slug}`}
                      className={`flex-1 flex items-center gap-2 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                        isActiveChapter ? 'text-text font-semibold' : 'text-muted hover:text-text'
                      }`}
                    >
                      <span className={`font-mono font-bold text-sm leading-none ${CHAPTER_TEXT_COLORS[chapter.number]} ${isActiveChapter ? 'opacity-100' : 'opacity-50'}`}>
                        {chapter.number}
                      </span>
                      <span className="truncate">{chapter.name}</span>
                    </Link>
                    {chapterPatterns.length > 0 && (
                      <button
                        onClick={() => toggleChapter(chapter.number)}
                        className="mr-2 px-1 py-1 text-muted hover:text-text"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${chapter.name}`}
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                  </div>

                  {isExpanded && chapterPatterns.length > 0 && (
                    <ul className="pb-0.5">
                      {chapterPatterns.map((pattern) => {
                        const isActive = activePatternSlug === pattern.slug;
                        return (
                          <li key={pattern.slug}>
                            <Link
                              href={`/learn/patterns/${pattern.slug}`}
                              className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm transition-all ${
                                isActive
                                  ? `font-bold text-text border-l-4 ${CHAPTER_BORDER_COLORS[pattern.chapter]} ${CHAPTER_BG_COLORS[pattern.chapter]} -ml-px`
                                  : 'text-muted/70 border-l border-text/10 hover:text-text hover:border-l-2 hover:border-text/30'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className={`font-mono text-xs ${CHAPTER_TEXT_COLORS[pattern.chapter]} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                {pattern.number}
                              </span>
                              <span className="truncate">{pattern.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DIVIDER ── */}
      <div className="border-t-2 border-text/20 my-4" />

      {/* ── TOOLKIT SECTION ── */}
      <SectionHeader
        title="Toolkit"
        isOpen={toolkitOpen}
        onToggle={() => setToolkitOpen(!toolkitOpen)}
        count={toolkitTopics.length}
        isActive={isInToolkit}
      />

      {toolkitOpen && (
        <div className="mb-4">
          <div className="space-y-0.5">
            {toolkitTopics.map((topic) => {
              const isActiveTopic = activeTopicSlug === topic.slug;
              const isExpanded = expandedTopics.has(topic.slug);
              const subPages = topicSubPages[topic.slug] || [];

              return (
                <div key={topic.slug}>
                  <div
                    className={`flex items-center border-l-4 transition-colors ${
                      isActiveTopic
                        ? 'border-accent bg-accent/10'
                        : 'border-transparent hover:border-text/20'
                    }`}
                  >
                    <Link
                      href={`/learn/toolkit/${topic.slug}`}
                      className={`flex-1 flex items-center gap-2.5 pl-3 pr-1 py-2.5 min-w-0 text-sm transition-colors ${
                        isActiveTopic ? 'text-text font-semibold' : 'text-muted hover:text-text'
                      }`}
                    >
                      <svg className={`w-4 h-4 shrink-0 ${isActiveTopic ? 'text-accent' : 'text-muted/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic.icon} />
                      </svg>
                      <span className="truncate">{topic.name}</span>
                    </Link>
                    {subPages.length > 0 && (
                      <button
                        onClick={() => toggleTopic(topic.slug)}
                        className="mr-2 px-1 py-1 text-muted hover:text-text"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${topic.name}`}
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                  </div>

                  {isExpanded && subPages.length > 0 && (
                    <ul className="pb-0.5">
                      {subPages.map((sub) => {
                        const subMeta = SUB_PAGE_META[sub];
                        const subHref = `/learn/toolkit/${topic.slug}/${sub}`;
                        const isActive = pathname === subHref;
                        return (
                          <li key={sub}>
                            <Link
                              href={subHref}
                              className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm transition-all ${
                                isActive
                                  ? 'font-bold text-text border-l-4 border-accent bg-accent/10 -ml-px'
                                  : 'text-muted/70 border-l border-text/10 hover:text-text hover:border-l-2 hover:border-text/30'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className="truncate">{subMeta.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-text/10">
        <p className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">
          {patterns.length} patterns &middot; {toolkitTopics.length} deep-dives
        </p>
      </div>
    </nav>
  );
}

/* ── Helper components ── */

function SectionHeader({
  title,
  isOpen,
  onToggle,
  count,
  isActive,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
        isActive ? 'text-accent' : 'text-muted hover:text-text'
      }`}
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      <span className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono tabular-nums opacity-60">{count}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}

function SidebarPill({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
        isActive
          ? 'bg-accent text-background border border-accent'
          : 'border border-text/30 text-muted hover:border-text hover:text-text'
      }`}
    >
      {children}
    </Link>
  );
}
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add components/learn/
git commit -m "feat(learn): create LearnSidebar with patterns and toolkit sections"
```

---

### Task 9: Create LearnMobileNav Component

**Files:**
- Create: `components/learn/LearnMobileNav.tsx`

**Step 1: Create the mobile navigation component**

This adapts the PatternsMobileNav approach for the unified Learn section. It shows two tabs (Patterns / Toolkit) inside the dropdown.

```typescript
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { ChapterMeta } from '@/lib/patterns';
import type { ToolkitTopicMeta } from '@/lib/toolkit';

const TEXT_COLORS: Record<number, string> = {
  1: 'text-chapter-1', 2: 'text-chapter-2', 3: 'text-chapter-3',
  4: 'text-chapter-4', 5: 'text-chapter-5', 6: 'text-chapter-6',
};
const BORDER_COLORS: Record<number, string> = {
  1: 'border-chapter-1', 2: 'border-chapter-2', 3: 'border-chapter-3',
  4: 'border-chapter-4', 5: 'border-chapter-5', 6: 'border-chapter-6',
};

interface SidebarPattern {
  slug: string;
  name: string;
  number: string;
  chapter: number;
  difficulty: string;
}

interface LearnMobileNavProps {
  chapters: ChapterMeta[];
  patterns: SidebarPattern[];
  toolkitTopics: ToolkitTopicMeta[];
  className?: string;
}

export function LearnMobileNav({
  chapters,
  patterns,
  toolkitTopics,
  className = '',
}: LearnMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'patterns' | 'toolkit'>(
    pathname.startsWith('/learn/toolkit') ? 'toolkit' : 'patterns'
  );

  const activePatternSlug = pathname.startsWith('/learn/patterns/')
    ? pathname.replace('/learn/patterns/', '').split('/')[0]
    : null;
  const activePattern = patterns.find((p) => p.slug === activePatternSlug);
  const activeTopicSlug = pathname.startsWith('/learn/toolkit/')
    ? pathname.replace('/learn/toolkit/', '').split('/')[0]
    : null;
  const activeTopic = toolkitTopics.find((t) => t.slug === activeTopicSlug);

  const currentLabel = activePattern
    ? `${activePattern.number} ${activePattern.name}`
    : activeTopic
    ? activeTopic.name
    : 'Navigate Learn';

  return (
    <div className={`lg:hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-4 border-text bg-surface font-semibold text-sm"
        aria-expanded={isOpen}
      >
        <span>{currentLabel}</span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <nav className="border-4 border-t-0 border-text bg-surface max-h-[60vh] overflow-y-auto">
          {/* Tab switcher */}
          <div className="flex border-b-2 border-text/20">
            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex-1 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'patterns' ? 'bg-background text-text border-b-2 border-accent -mb-0.5' : 'text-muted hover:text-text'
              }`}
            >
              Patterns
            </button>
            <button
              onClick={() => setActiveTab('toolkit')}
              className={`flex-1 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'toolkit' ? 'bg-background text-text border-b-2 border-accent -mb-0.5' : 'text-muted hover:text-text'
              }`}
            >
              Toolkit
            </button>
          </div>

          {activeTab === 'patterns' && (
            <>
              <Link href="/learn/patterns" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b border-muted/20 hover:bg-background">All Patterns</Link>
              <Link href="/learn/patterns/graph" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b border-muted/20 hover:bg-background">Language Map</Link>
              <Link href="/learn/patterns/cards" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 border-muted/20 hover:bg-background">Cards</Link>

              {chapters.map((chapter) => {
                const chapterPatterns = patterns.filter((p) => p.chapter === chapter.number);
                return (
                  <div key={chapter.number} className="border-b border-muted/20 last:border-b-0">
                    <Link
                      href={`/learn/patterns/chapter/${chapter.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 border-l-4 ${BORDER_COLORS[chapter.number]} hover:bg-background`}
                    >
                      <span className={`font-mono font-bold text-xs ${TEXT_COLORS[chapter.number]}`}>{chapter.number}</span>
                      <span className="text-sm font-semibold">{chapter.name}</span>
                    </Link>
                    {chapterPatterns.length > 0 && (
                      <ul>
                        {chapterPatterns.map((pattern) => (
                          <li key={pattern.slug}>
                            <Link
                              href={`/learn/patterns/${pattern.slug}`}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-2 px-4 pl-10 py-2 text-sm transition-colors ${
                                activePatternSlug === pattern.slug ? 'font-semibold text-text bg-background' : 'text-muted hover:text-text hover:bg-background'
                              }`}
                            >
                              <span className={`font-mono text-xs ${TEXT_COLORS[pattern.chapter]}`}>{pattern.number}</span>
                              <span className="truncate">{pattern.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {activeTab === 'toolkit' && (
            <>
              <Link href="/learn/toolkit" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 border-muted/20 hover:bg-background">All Topics</Link>
              {toolkitTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/learn/toolkit/${topic.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-muted/20 last:border-b-0 hover:bg-background transition-colors ${
                    activeTopicSlug === topic.slug ? 'font-semibold text-text bg-background' : 'text-muted'
                  }`}
                >
                  <svg className="w-4 h-4 text-accent/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic.icon} />
                  </svg>
                  <div className="min-w-0">
                    <span className="text-sm block truncate">{topic.name}</span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/learn/LearnMobileNav.tsx
git commit -m "feat(learn): create LearnMobileNav with patterns/toolkit tabs"
```

---

### Task 10: Wire LearnSidebar into the /learn Layout

**Files:**
- Modify: `app/learn/layout.tsx`
- Modify: `app/learn/patterns/layout.tsx` — simplify to just render children (sidebar now in parent)

**Step 1: Update `app/learn/layout.tsx` to use LearnSidebar**

```typescript
import { ReactNode } from 'react';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS, getToolkitTopicPages, type ToolkitSubPage } from '@/lib/toolkit';
import { LearnSidebar } from '@/components/learn/LearnSidebar';
import { LearnMobileNav } from '@/components/learn/LearnMobileNav';

export default function LearnLayout({ children }: { children: ReactNode }) {
  const allPatterns = getAllPatterns();

  const sidebarPatterns = allPatterns.map((p) => ({
    slug: p.frontmatter.slug,
    name: p.frontmatter.name,
    number: p.frontmatter.number,
    chapter: p.frontmatter.chapter,
    difficulty: p.frontmatter.difficulty,
  }));

  // Compute which sub-pages exist for each toolkit topic
  const topicSubPages: Record<string, ToolkitSubPage[]> = {};
  for (const topic of TOOLKIT_TOPICS) {
    const pages = getToolkitTopicPages(topic.slug);
    topicSubPages[topic.slug] = pages.map((p) => p.frontmatter.subPage!).filter(Boolean);
  }

  return (
    <div className="mx-auto max-w-[1400px] overflow-x-hidden">
      {/* Mobile nav */}
      <LearnMobileNav
        chapters={CHAPTERS}
        patterns={sidebarPatterns}
        toolkitTopics={TOOLKIT_TOPICS}
        className="px-4 sm:px-6 lg:hidden pt-4"
      />

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:px-8 lg:pb-8 lg:pt-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <LearnSidebar
            chapters={CHAPTERS}
            patterns={sidebarPatterns}
            toolkitTopics={TOOLKIT_TOPICS}
            topicSubPages={topicSubPages}
          />
        </div>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
```

**Step 2: Simplify `app/learn/patterns/layout.tsx`**

Since the sidebar is now in the parent layout, the patterns layout just passes through:

```typescript
import { ReactNode } from 'react';

export default function PatternsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/learn/layout.tsx app/learn/patterns/layout.tsx
git commit -m "feat(learn): wire LearnSidebar and LearnMobileNav into /learn layout"
```

---

## Phase 4: Toolkit Routes

### Task 11: Create Toolkit Index Page

**Files:**
- Create: `app/learn/toolkit/page.tsx`

**Step 1: Create the toolkit index page**

```typescript
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { TOOLKIT_TOPICS, getToolkitPage } from '@/lib/toolkit';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev';

export const metadata: Metadata = {
  title: 'Claude Code Toolkit | Dakota Smith',
  description: 'Expert\'s guide to agentic engineering with Claude Code — 9 deep-dives into hooks, skills, agents, MCP, and more.',
  openGraph: {
    title: 'Claude Code Toolkit — Expert\'s Guide',
    description: '9 deep-dives into Claude Code features for expert agentic engineering.',
    url: `${siteUrl}/learn/toolkit`,
  },
  alternates: { canonical: '/learn/toolkit' },
};

export default function ToolkitIndexPage() {
  const topicsWithStatus = TOOLKIT_TOPICS.map((topic) => ({
    ...topic,
    hasContent: getToolkitPage(topic.slug) !== null,
  }));

  return (
    <PageTransition className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs text-muted font-mono">
          <li><Link href="/learn" className="hover:text-text hover:underline underline-offset-2">Learn</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page"><span className="text-text font-semibold">Toolkit</span></li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-12 px-4 sm:px-6 lg:px-0">
        <div className="inline-block border-4 border-accent bg-surface px-6 py-2 mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">
            Reference &middot; {TOOLKIT_TOPICS.length} Deep-Dives
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Claude Code Toolkit</h1>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          Expert&apos;s guide to agentic engineering. Not documentation — mental models, production architectures, and the pitfalls the docs don&apos;t warn about.
        </p>
      </header>

      {/* Topic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6 lg:px-0">
        {topicsWithStatus.map((topic) => (
          <Link
            key={topic.slug}
            href={topic.hasContent ? `/learn/toolkit/${topic.slug}` : '#'}
            className={`group block border-4 p-6 transition-all ${
              topic.hasContent
                ? 'border-text hover:shadow-[6px_6px_0_0_var(--color-accent)] hover:-translate-x-px hover:-translate-y-px'
                : 'border-text/20 opacity-50 cursor-not-allowed'
            }`}
            aria-disabled={!topic.hasContent}
          >
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-6 h-6 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic.icon} />
              </svg>
              <div>
                <h2 className="text-lg font-bold">{topic.name}</h2>
                <span className="text-xs font-mono text-muted uppercase">
                  {topic.hasContent ? 'Available' : 'Coming Soon'}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">{topic.description}</p>
          </Link>
        ))}
      </div>
    </PageTransition>
  );
}
```

**Step 2: Commit**

```bash
git add app/learn/toolkit/
git commit -m "feat(learn): create toolkit index page with topic grid"
```

---

### Task 12: Create Toolkit Topic Page ([topic])

**Files:**
- Create: `app/learn/toolkit/[topic]/page.tsx`

**Step 1: Create the dynamic topic page**

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getAllToolkitTopicSlugs, getToolkitTopicBySlug, getToolkitPage, getToolkitTopicPages, SUB_PAGE_META } from '@/lib/toolkit';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { mdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev';

export function generateStaticParams() {
  return getAllToolkitTopicSlugs().map((topic) => ({ topic }));
}

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const topic = getToolkitTopicBySlug(params.topic);
  const page = getToolkitPage(params.topic);
  if (!topic || !page) return {};

  const title = page.frontmatter.title;
  const description = page.frontmatter.description;

  return {
    title: `${title} | Dakota Smith`,
    description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/learn/toolkit/${topic.slug}`,
    },
    alternates: { canonical: `/learn/toolkit/${topic.slug}` },
  };
}

export default function ToolkitTopicPage({ params }: { params: { topic: string } }) {
  const topic = getToolkitTopicBySlug(params.topic);
  const page = getToolkitPage(params.topic);
  if (!topic || !page) notFound();

  const subPages = getToolkitTopicPages(params.topic);
  const toc = extractTableOfContents(page.content);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <nav className="mb-5 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
          <li><Link href="/learn" className="hover:text-text hover:underline underline-offset-2">Learn</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/learn/toolkit" className="hover:text-text hover:underline underline-offset-2">Toolkit</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page"><span className="text-text font-semibold">{topic.name}</span></li>
        </ol>
      </nav>

      {/* Content */}
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose-neo">
          <MDXRemote source={page.content} components={mdxComponents} options={{ mdxOptions }} />

          {/* Sub-page cards */}
          {subPages.length > 0 && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {subPages.map((sp) => {
                const sub = sp.frontmatter.subPage!;
                const meta = SUB_PAGE_META[sub];
                return (
                  <Link
                    key={sub}
                    href={`/learn/toolkit/${topic.slug}/${sub}`}
                    className="block border-4 border-text p-5 hover:shadow-[4px_4px_0_0_var(--color-accent)] hover:-translate-x-px hover:-translate-y-px transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={meta.icon} />
                      </svg>
                      <h3 className="font-bold">{meta.label}</h3>
                    </div>
                    <p className="text-sm text-muted">{sp.frontmatter.description}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
```

**Step 2: Commit**

```bash
git add app/learn/toolkit/[topic]/
git commit -m "feat(learn): create dynamic toolkit topic page with MDX rendering"
```

---

### Task 13: Create Toolkit Sub-page Route ([topic]/[sub])

**Files:**
- Create: `app/learn/toolkit/[topic]/[sub]/page.tsx`

**Step 1: Create the sub-page route**

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageTransition } from '@/components/ui/PageTransition';
import { getAllToolkitTopicSlugs, getToolkitTopicBySlug, getToolkitPage, SUB_PAGE_META, type ToolkitSubPage } from '@/lib/toolkit';
import { mdxComponents } from '@/components/blog/MdxComponents';
import { mdxOptions } from '@/lib/mdx-options';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractTableOfContents } from '@/lib/toc';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev';
const VALID_SUB_PAGES: ToolkitSubPage[] = ['mental-model', 'playbook', 'compositions', 'pitfalls'];

export function generateStaticParams() {
  const topics = getAllToolkitTopicSlugs();
  return topics.flatMap((topic) =>
    VALID_SUB_PAGES.map((sub) => ({ topic, sub }))
  );
}

export function generateMetadata({ params }: { params: { topic: string; sub: string } }): Metadata {
  const topic = getToolkitTopicBySlug(params.topic);
  const page = getToolkitPage(params.topic, params.sub);
  if (!topic || !page) return {};

  return {
    title: `${page.frontmatter.title} | Dakota Smith`,
    description: page.frontmatter.description,
    keywords: page.frontmatter.keywords,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${siteUrl}/learn/toolkit/${topic.slug}/${params.sub}`,
    },
    alternates: { canonical: `/learn/toolkit/${topic.slug}/${params.sub}` },
  };
}

export default function ToolkitSubPage({ params }: { params: { topic: string; sub: string } }) {
  const topic = getToolkitTopicBySlug(params.topic);
  const page = getToolkitPage(params.topic, params.sub);
  if (!topic || !page) notFound();

  const subMeta = SUB_PAGE_META[params.sub as ToolkitSubPage];
  if (!subMeta) notFound();

  const toc = extractTableOfContents(page.content);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Learn', url: '/learn' },
    { name: 'Toolkit', url: '/learn/toolkit' },
    { name: topic.name, url: `/learn/toolkit/${topic.slug}` },
    { name: subMeta.label },
  ]);

  return (
    <PageTransition className="min-h-screen pb-16">
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <nav className="mb-5 pt-4 px-4 sm:px-6 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
          <li><Link href="/learn" className="hover:text-text hover:underline underline-offset-2">Learn</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/learn/toolkit" className="hover:text-text hover:underline underline-offset-2">Toolkit</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/learn/toolkit/${topic.slug}`} className="hover:text-text hover:underline underline-offset-2">{topic.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page"><span className="text-text font-semibold">{subMeta.label}</span></li>
        </ol>
      </nav>

      {/* Content */}
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 px-4 sm:px-6 lg:px-0">
        <article className="min-w-0 prose-neo">
          <MDXRemote source={page.content} components={mdxComponents} options={{ mdxOptions }} />
        </article>

        <aside className="hidden lg:block">
          {toc.length > 0 && <TableOfContents items={toc} />}
        </aside>
      </div>
    </PageTransition>
  );
}
```

**Step 2: Verify the full build**

Run: `npx next build 2>&1 | tail -30`
Expected: Build succeeds. Sub-pages without content will 404 gracefully.

**Step 3: Commit**

```bash
git add app/learn/toolkit/[topic]/[sub]/
git commit -m "feat(learn): create toolkit sub-page route for mental-model/playbook/compositions/pitfalls"
```

---

## Phase 5: Landing Page

### Task 14: Build the /learn Split Hero Landing Page

**Files:**
- Modify: `app/learn/page.tsx` (replace placeholder from Task 3)
- Create: `components/learn/LearnHero.tsx`
- Create: `components/learn/ConnectionsMap.tsx`

**Step 1: Create `components/learn/LearnHero.tsx`**

Split hero with Patterns on left, Toolkit on right. Follow existing PatternsHero aesthetic.

```typescript
'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants, slideUpVariants } from '@/lib/animations';
import Link from 'next/link';

interface LearnHeroProps {
  patternCount: number;
  chapterCount: number;
  toolkitTopicCount: number;
}

export function LearnHero({ patternCount, chapterCount, toolkitTopicCount }: LearnHeroProps) {
  return (
    <header className="relative border-b-4 border-text overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section badge */}
          <motion.div variants={slideUpVariants} className="mb-8 inline-block border-4 border-accent bg-surface px-6 py-2">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              Learn &middot; Expert Guides
            </p>
          </motion.div>

          {/* Split tracks */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Patterns track */}
            <motion.div variants={slideUpVariants}>
              <Link
                href="/learn/patterns"
                className="group block border-4 border-text p-8 transition-all hover:shadow-[8px_8px_0_0_var(--color-accent)] hover:-translate-x-1 hover:-translate-y-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-accent transition-colors">
                  Patterns
                </h2>
                <p className="text-muted text-lg mb-6 leading-relaxed">
                  Named patterns for AI-assisted engineering. A structured reference of repeatable techniques.
                </p>
                <div className="flex gap-4 text-sm font-mono text-muted">
                  <span><span className="text-text font-bold">{patternCount}</span> patterns</span>
                  <span><span className="text-text font-bold">{chapterCount}</span> chapters</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                  Browse patterns
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>

            {/* Toolkit track */}
            <motion.div variants={slideUpVariants}>
              <Link
                href="/learn/toolkit"
                className="group block border-4 border-text p-8 transition-all hover:shadow-[8px_8px_0_0_var(--color-accent)] hover:-translate-x-1 hover:-translate-y-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-accent transition-colors">
                  Claude Code Toolkit
                </h2>
                <p className="text-muted text-lg mb-6 leading-relaxed">
                  Expert&apos;s guide to agentic engineering. Mental models, production architectures, and real-world pitfalls.
                </p>
                <div className="flex gap-4 text-sm font-mono text-muted">
                  <span><span className="text-text font-bold">{toolkitTopicCount}</span> deep-dives</span>
                  <span>interactive tutorials</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                  Explore toolkit
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
```

**Step 2: Create `components/learn/ConnectionsMap.tsx`**

Visual mapping of which patterns relate to which toolkit topics.

```typescript
import Link from 'next/link';

interface Connection {
  pattern: { name: string; slug: string };
  topic: { name: string; slug: string };
}

const CONNECTIONS: Connection[] = [
  { pattern: { name: 'Convention File', slug: 'convention-file' }, topic: { name: 'CLAUDE.md', slug: 'claude-md' } },
  { pattern: { name: 'Safety Net', slug: 'safety-net' }, topic: { name: 'Hooks', slug: 'hooks' } },
  { pattern: { name: 'Memory Layer', slug: 'memory-layer' }, topic: { name: 'Memory System', slug: 'memory' } },
  { pattern: { name: 'Parallel Fan-Out', slug: 'parallel-fan-out' }, topic: { name: 'Agent Teams', slug: 'agent-teams' } },
  { pattern: { name: 'Progressive Disclosure', slug: 'progressive-disclosure' }, topic: { name: 'Skills', slug: 'skills' } },
  { pattern: { name: 'Agent-Friendly Architecture', slug: 'agent-friendly-architecture' }, topic: { name: 'MCP Servers', slug: 'mcp' } },
];

export function ConnectionsMap() {
  return (
    <section className="mt-16 px-4 sm:px-6 lg:px-0">
      <h2 className="text-2xl font-bold mb-2">Connections</h2>
      <p className="text-muted mb-8">Patterns and toolkit topics that reinforce each other.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONNECTIONS.map((conn) => (
          <div
            key={conn.pattern.slug}
            className="flex items-center gap-3 border-2 border-text/30 px-4 py-3 hover:border-text transition-colors"
          >
            <Link
              href={`/learn/patterns/${conn.pattern.slug}`}
              className="text-sm font-semibold hover:text-accent transition-colors truncate"
            >
              {conn.pattern.name}
            </Link>
            <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <Link
              href={`/learn/toolkit/${conn.topic.slug}`}
              className="text-sm font-semibold hover:text-accent transition-colors truncate"
            >
              {conn.topic.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 3: Update `app/learn/page.tsx` to use the new components**

```typescript
import type { Metadata } from 'next';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS } from '@/lib/toolkit';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnHero } from '@/components/learn/LearnHero';
import { ConnectionsMap } from '@/components/learn/ConnectionsMap';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev';

export const metadata: Metadata = {
  title: 'Learn | Dakota Smith',
  description: 'Expert guides for agentic engineering — patterns for AI-assisted development and deep-dives into Claude Code\'s toolkit.',
  openGraph: {
    title: 'Learn — Patterns & Claude Code Toolkit',
    description: 'Expert guides for agentic engineering with Claude Code.',
    url: `${siteUrl}/learn`,
  },
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  const allPatterns = getAllPatterns();

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnHero
        patternCount={allPatterns.length}
        chapterCount={CHAPTERS.length}
        toolkitTopicCount={TOOLKIT_TOPICS.length}
      />

      <div className="mx-auto max-w-7xl">
        <ConnectionsMap />
      </div>
    </PageTransition>
  );
}
```

**Step 4: Commit**

```bash
git add components/learn/LearnHero.tsx components/learn/ConnectionsMap.tsx app/learn/page.tsx
git commit -m "feat(learn): build split hero landing page with connections map"
```

---

## Phase 6: Cross-Referencing & SEO

### Task 15: Add Related Toolkit Panel to Pattern Pages

**Files:**
- Create: `components/learn/RelatedToolkitPanel.tsx`
- Modify: `app/learn/patterns/[slug]/page.tsx` — add RelatedToolkitPanel to sidebar

**Step 1: Create `components/learn/RelatedToolkitPanel.tsx`**

```typescript
import Link from 'next/link';
import { getToolkitTopicBySlug } from '@/lib/toolkit';

interface RelatedToolkitPanelProps {
  topicSlugs: string[];
}

export function RelatedToolkitPanel({ topicSlugs }: RelatedToolkitPanelProps) {
  const topics = topicSlugs
    .map((slug) => getToolkitTopicBySlug(slug))
    .filter(Boolean);

  if (topics.length === 0) return null;

  return (
    <div className="border-4 border-text/20 p-4 mt-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
        Related Toolkit
      </h3>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li key={topic!.slug}>
            <Link
              href={`/learn/toolkit/${topic!.slug}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4 text-accent/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={topic!.icon} />
              </svg>
              <span>{topic!.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 2: Add the panel to pattern detail pages**

In `app/learn/patterns/[slug]/page.tsx`, import and render `RelatedToolkitPanel` in the sidebar area, below the existing `RelatedPatternsPanel`. The `relatedTopics` data can be derived from a mapping of pattern slugs to toolkit topic slugs.

Create a mapping constant (or derive from the CONNECTIONS data in ConnectionsMap):

```typescript
// At the top of the file or in a shared constant
const PATTERN_TO_TOOLKIT: Record<string, string[]> = {
  'convention-file': ['claude-md'],
  'safety-net': ['hooks'],
  'memory-layer': ['memory'],
  'parallel-fan-out': ['agents', 'agent-teams'],
  'progressive-disclosure': ['skills'],
  'agent-friendly-architecture': ['mcp'],
  'context-priming': ['claude-md'],
  'scope-fence': ['hooks', 'settings'],
};
```

Then in the sidebar JSX:
```typescript
{PATTERN_TO_TOOLKIT[slug] && (
  <RelatedToolkitPanel topicSlugs={PATTERN_TO_TOOLKIT[slug]} />
)}
```

**Step 3: Commit**

```bash
git add components/learn/RelatedToolkitPanel.tsx app/learn/patterns/[slug]/page.tsx
git commit -m "feat(learn): add related toolkit panel to pattern detail pages"
```

---

### Task 16: Add Toolkit Schema Generators

**Files:**
- Modify: `lib/schema.ts` — add toolkit schema generators

**Step 1: Add toolkit TechArticle schema**

```typescript
import type { ToolkitFrontmatter, ToolkitTopicMeta } from './toolkit';

export function generateToolkitTopicSchema(
  topic: ToolkitTopicMeta,
  page: ToolkitFrontmatter
) {
  const topicUrl = `${SITE_URL}/learn/toolkit/${topic.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.title,
    description: page.description,
    url: topicUrl,
    author: generatePersonSchema(),
    publisher: generatePersonSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': topicUrl,
    },
    keywords: page.keywords || [],
    proficiencyLevel: 'Expert',
    articleSection: 'Claude Code Toolkit',
  };
}

export function generateToolkitCollectionSchema(topicCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Claude Code Toolkit — Expert\'s Guide to Agentic Engineering',
    description: `${topicCount} expert deep-dives into Claude Code features for production agentic engineering.`,
    url: `${SITE_URL}/learn/toolkit`,
    author: generatePersonSchema(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topicCount,
    },
  };
}
```

**Step 2: Commit**

```bash
git add lib/schema.ts
git commit -m "feat(learn): add toolkit JSON-LD schema generators"
```

---

### Task 17: Update OG Image Route for Toolkit

**Files:**
- Modify: `app/api/og/route.tsx` — add toolkit type support

**Step 1: Add toolkit type to OG image generation**

Add a `toolkit` type alongside the existing `post` and `pattern` types. Style it similarly to patterns but with a different accent.

In the route handler, add:
```typescript
if (type === 'toolkit') {
  // Render toolkit-themed OG image
  // Use topic name as title, "Claude Code Toolkit" as subtitle
}
```

**Step 2: Commit**

```bash
git add app/api/og/route.tsx
git commit -m "feat(learn): add toolkit type to OG image generation"
```

---

### Task 18: Final Build Verification and Cleanup

**Step 1: Run full build**

Run: `npx next build 2>&1`
Expected: Build succeeds with all pages generated

**Step 2: Verify key routes**

Run: `npx next start &` then verify:
- `/learn` — Landing page renders
- `/learn/patterns` — Patterns index renders
- `/learn/patterns/convention-file` — Pattern detail renders
- `/learn/toolkit` — Toolkit index renders
- `/learn/toolkit/hooks` — Hooks topic renders
- `/patterns` → redirects to `/learn/patterns`
- `/patterns/convention-file` → redirects to `/learn/patterns/convention-file`

**Step 3: Verify sidebar navigation**

- Both Patterns and Toolkit sections appear in sidebar
- Correct section auto-expands based on current route
- Mobile nav shows Patterns/Toolkit tabs

**Step 4: Clean up old PatternsSidebar/PatternsMobileNav imports**

If the old components are no longer imported anywhere (since LearnSidebar/LearnMobileNav replaced them), they can remain in the codebase for reference or be removed. Check with:

Run: `grep -r "PatternsSidebar\|PatternsMobileNav" app/ --include="*.tsx" --include="*.ts"`

If no results, the old components are unused. Leave them for now — they can be removed in a future cleanup.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(learn): final build verification and cleanup"
```

---

## Summary of All Tasks

| Phase | Task | Description |
|-------|------|-------------|
| 1 | 1 | Create toolkit types and content loading (`lib/toolkit.ts`) |
| 1 | 2 | Seed toolkit content directory (hooks, claude-md index.mdx) |
| 2 | 3 | Create /learn route group and move patterns |
| 2 | 4 | Update all internal `/patterns` links to `/learn/patterns` |
| 2 | 5 | Update header navigation (Patterns → Learn) |
| 2 | 6 | Add 301 redirects for old `/patterns` URLs |
| 2 | 7 | Update sitemap with /learn URLs and toolkit |
| 3 | 8 | Create LearnSidebar component |
| 3 | 9 | Create LearnMobileNav component |
| 3 | 10 | Wire sidebar into /learn layout, simplify patterns layout |
| 4 | 11 | Create toolkit index page |
| 4 | 12 | Create toolkit topic page ([topic]) |
| 4 | 13 | Create toolkit sub-page route ([topic]/[sub]) |
| 5 | 14 | Build /learn split hero landing page with connections map |
| 6 | 15 | Add related toolkit panel to pattern pages |
| 6 | 16 | Add toolkit schema generators |
| 6 | 17 | Update OG image route for toolkit |
| 6 | 18 | Final build verification and cleanup |

**Total: 18 tasks across 6 phases**

**Critical path:** Tasks 1-7 must be sequential (infrastructure → migration). Tasks 8-10 depend on Tasks 1-7. Tasks 11-14 can partially parallelize after Task 10. Tasks 15-18 are finishing touches.
