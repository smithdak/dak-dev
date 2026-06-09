# Dakota Smith — Personal Blog & Learn Platform

**IMPORTANT: this project uses `pnpm` (pinned `pnpm@10.33.4`), never `npm` or `yarn`.** Node `>=22.22.2` (`.nvmrc`).
**Run `pnpm build` before claiming any MDX/content work is done.** Syntax highlighting (Shiki) is production-only, so `pnpm dev` will not surface MDX rendering errors (`DESIGN.md` §5.2).
This is a **static site (SSG)** — no server, no `middleware.ts`, no backend. Anything that forces dynamic rendering is a design error; read `DESIGN.md` §3 first.
TypeScript runs in **strict** mode. ESLint + Prettier are configured and CI-enforced — do not hand-format or restate lint rules here.

---

## What this is

A high-performance Next.js 16 / React 19 blog plus a four-pillar "Learn"
platform on agentic engineering (Patterns, Toolkit, Harness, Security).
Neo-brutalist dark design, file-based MDX content, deployed on Vercel.

**`DESIGN.md` is the canonical architecture reference** — the "why," the
decision ledger, and the risk register. Read it for any structural change.

## Stack — only the non-obvious, mistake-preventing facts

Everything else is inferable from `package.json` and the code; this lists only
what prevents a wrong assumption:

- **Tailwind v4, CSS-first.** No `tailwind.config.ts`. Tokens are CSS variables
  in `app/globals.css` via `@theme inline`. Extend a token — never hardcode a
  color (`DESIGN.md` §6.1).
- **SSG end to end.** Content is `.mdx` under `content/`, read at build time by
  `lib/*.ts`. No CMS, no database.
- **Metadata is the native Next.js Metadata API** (`export const metadata` /
  `generateMetadata`); OG images use `next/og` `ImageResponse` in
  `app/api/og/route.tsx`. Not `next-seo`, not `@vercel/og`.

## Hard constraints (non-negotiable; CI-enforced)

- Lighthouse **Accessibility, Best-Practices, and SEO must score 100**;
  Performance ≥ 90. These block merge (`lighthouserc.json`,
  `.github/workflows/lighthouse.yml`; `DESIGN.md` §12).
- Accessibility regressions fail the build by design — interactive/icon
  elements need accessible names, images need alt text (`DESIGN.md` §9).
- Security controls live **at the point of the control**: CSP and headers in
  `next.config.ts`, supply chain in `.npmrc`. Adding an external origin
  requires a CSP edit *with a comment* or it is blocked in production
  (`DESIGN.md` §10).
- Static only, no cookies, single author. Giscus (GitHub auth) for comments;
  page-view-only analytics.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Local dev (Turbopack; no Shiki — see above) |
| `pnpm build` | Production build — **run before claiming MDX/content done** |
| `pnpm lint` | ESLint |
| `pnpm validate:content` / `:all` | Validate published / all posts |
| `pnpm analyze` | Bundle analysis |

Skills (slash commands; load on demand, zero cost until invoked):

| Skill | Use when |
|---|---|
| `/write-post` | Drafting a new post (brand-consistent scaffold) |
| `/review-post` | Pre-publish brand + SEO review |
| `/brand-check` | Quick brand-voice check on any text |
| `/content-calendar` | Managing the content pipeline/backlog |
| `/content-strategist` | SEO: keywords, gaps, clusters, audits |
| `/frontend-design` | UI/component design work |
| `/product-owner` | Scoping/prioritizing product work |

## Conventions Codex can't infer from the code

- **The Server/Client boundary is an I/O boundary.** Server Components own
  `lib/` data loading; Client Components (`'use client'`) own interaction,
  state, and motion. Keep the `'use client'` leaf small — extract a component
  rather than promoting a page (`DESIGN.md` §7).
- **Motion goes through Framer Motion** (inherits the global
  `prefers-reduced-motion` contract). Bespoke CSS keyframes must add their own
  reduced-motion guard (`DESIGN.md` §6.4).
- **A new Learn pillar** ships a client-safe `*-types.ts`, a server `*.ts`
  loader, a boundary statement, and a colocated routing-invariant comment
  (`DESIGN.md` §4).
- Conventional Commits (`feat:`, `fix:`, `docs:`); branch off `main`.
- Change architecture → update `DESIGN.md` in the same PR (anchors are
  `path:line`; keep them honest).

## Knowledge base — read on demand (intentionally not auto-loaded)

Deep docs are referenced, not imported, to keep this file lean. Read the
relevant one when the task calls for it:

| Doc | Read when |
|---|---|
| **`DESIGN.md`** | Any structural/architectural change |
| `docs/README.md` | You need the doc-system map / where new material goes |
| `docs/content-ops.md` | Content workflow, brand voice, or SEO work |
| `docs/ui-workflow.md` | UI work with the Pencil.dev MCP |
| `docs/project-history.md` | You need the original plan, epics, or decisions |
| `docs/research/*` | Questions about Codex mechanics |
| `docs/plans/*` | Prior per-feature design/plan docs |
| `.content/brand/voice.md`, `.content/brand/guidelines.json` | Canonical brand voice + rules (don't restate them) |

---

**Highest-violation reminders:** use **pnpm**, never npm/yarn · **`pnpm build`
before claiming MDX/content done** · extend a color token, never hardcode ·
no `middleware.ts`/SSR (SSG-only) · keep this file under 200 lines and free of
anything inferable from code.
