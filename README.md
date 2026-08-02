# daksmith.dev

Dakota Smith's independent publication and field guide for agentic engineering. The site combines long-form writing with structured guides to patterns, agent tooling, delivery harnesses, and security.

## Product shape

- Distinct Writing, Learn, Work, and About surfaces for an AI systems architect
  and full-stack engineer working across AI systems, innovation strategy, and
  accountable delivery.
- Static Next.js App Router site; all MDX content is read and rendered at build time.
- Capability-first Toolkit comparing Claude Code, OpenAI Codex, and GitHub Copilot with dated official sources.
- Native Next.js metadata, structured data, RSS, sitemap, search, and static social assets.
- Versioned, deterministic editorial art with reproducible hero, thumbnail, and
  blur outputs for every post.
- Accessibility, Best Practices, and SEO Lighthouse scores of 100 are merge gates; Performance must remain at least 90.

## Stack

- Next.js 16 and React 19
- TypeScript in strict mode
- Tailwind CSS v4 with CSS-first tokens
- File-based MDX content
- Shiki production syntax highlighting
- Framer Motion with reduced-motion support
- Vercel Analytics and Speed Insights

## Local development

Requirements: Node `>=22.22.2` and the repository-pinned `pnpm@10.33.4`.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

The development server does not run the production Shiki path. Use the production build before treating MDX work as complete:

```powershell
pnpm lint
pnpm test
pnpm validate:content
pnpm images:check
pnpm build
```

## Content

- Writing: `content/posts/*.mdx`
- Post-art manifest: `.content/images/post-art.v1.json`
- Agent patterns: `content/patterns/*.mdx`
- Tool capability guides: `content/toolkit/`
- Harness chapters: `content/harness/*.mdx`
- Security chapters: `content/security/*.mdx`

See `docs/content-ops.md` for the publishing workflow and `DESIGN.md` for architecture decisions and invariants.

## Deployment

The production target is Vercel. The site remains statically generated: do not add middleware, cookies, a server data store, or request-time page rendering.

All rights reserved by Dakota Smith.
