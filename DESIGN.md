# Frontend Engineering Design

> The architecture, the constraints that shaped it, and the decisions behind it.

**Status:** Living document — reflects `security-hardening` and `main`
**Audience:** Engineers contributing to this codebase
**Owner:** Dakota Smith
**Last reconciled with code:** 2026-05-19

---

## 0. How to read this document

This document is the *why* and the *how it actually works* — the canonical
architecture reference. `CLAUDE.md` is the lean operational spine (rules,
constraints, commands, pointers); the original build plan and product
clarifications are archived in `docs/project-history.md`; `docs/README.md` maps
the whole documentation system. Where any of these disagree with the code, the
code is the source of truth. Two stack decisions diverged from the initial spec
during implementation and are called out here because they change the
*implemented* architecture, not just a value:

- **Tailwind v4, not v3.** There is no `tailwind.config.ts`. Configuration is
  CSS-first in `app/globals.css` (`@import "tailwindcss"` + `@theme inline`).
  See §6.
- **The accent color is decided** — `#00ff88` (dark) / `#00cc6a` (light), no
  longer the `TBD` of the original spec. See §6.

Every claim here is anchored to a file path. When you change the
behavior, change the anchor's neighbor — and update this section's date. A
design doc that drifts from the code is worse than no design doc.

---

## 1. The problem and the constraints

This is a content-heavy personal site — a blog plus a four-pillar learning
corpus on agentic engineering (~90 MDX documents across five content types).
It is not a generic blog. Three forcing functions shape every decision:

1. **A hard performance/accessibility bar.** Lighthouse Accessibility, Best
   Practices, and SEO must score **100** (enforced as `1.0` in
   `lighthouserc.json:16-18`). Performance must clear **0.90**. These are not
   aspirations; they are merge gates (§12).
2. **A real security posture.** This site teaches AI security; shipping a weak
   header set would be self-refuting. The `security-hardening` branch makes the
   trust surface a first-class deliverable, not an afterthought (§10).
3. **A static deployment target.** Vercel, SSG, free `*.vercel.app` domain, no
   application backend. Anything that forces dynamic rendering (per-request
   middleware, server data fetching) is in tension with the performance budget
   and is rejected unless it pays for itself.

The constraint hierarchy, when these conflict: **correctness > accessibility >
security > performance > developer convenience.** Most decisions below are
resolutions of a tension between two of these, and the ordering is what breaks
the tie.

---

## 2. Design principles

These are the durable rules. They exist so a new contributor can make a *new*
decision the same way the existing ones were made.

1. **Static by default; dynamic only when it earns the budget.** Every page is
   prerendered at build time. The cost of a feature includes whether it forces
   dynamic rendering. (Drives §3, §5, §10.)
2. **The Server/Client boundary is an I/O boundary, not a styling boundary.**
   Server Components own filesystem reads, frontmatter parsing, and data
   shaping. Client Components own interaction, state, and motion. The boundary
   is the file carrying `'use client'`. Push it as far down the tree as
   possible. (Drives §7.)
3. **Tokens are CSS variables; components never hardcode color.** Theming is a
   variable swap on `<html>`, not a re-render and not a layout shift.
   (Drives §6.)
4. **Invariants live next to the data they constrain, in prose, and they state
   their blast radius.** See the `FLAT-ONLY CONSTRAINT` comment in
   `lib/security-types.ts:6-9`: it says what the invariant is, *and* what
   breaks if you violate it (sidebar slug parsing). This is the house style for
   load-bearing constraints. (Drives §4.)
5. **Accessibility is a mechanism, not a checklist.** Every a11y claim in this
   doc names the code that enforces it. If it isn't enforced, it isn't true.
   (Drives §9, §12.)
6. **Security decisions are documented at the point of the weakness.** Where we
   accept a weaker control, the `next.config.ts` comment explains why, the
   alternative, and the revisit condition (e.g. `next.config.ts:8-15`,
   `:112-114`). (Drives §10.)
7. **Voice and structure are part of the product.** The content system enforces
   brand voice; the engineering should match it — direct, specific, no filler.

---

## 3. System architecture

### 3.1 Rendering model

Next.js 16 App Router (`next@^16.1.4`, `react@^19.2.3`), **SSG end to end**.
There is no `middleware.ts` and no per-request server work. The lifecycle is:

```
build time:  content/*.mdx ──► lib/*.ts (fs + gray-matter) ──► generateStaticParams
                                                                      │
                                                                      ▼
             Server Components render ──► MDXRemote compiles MDX ──► static HTML
                                                                      │
request time: Vercel Edge serves prerendered HTML + immutable static assets
                                                                      │
                                                                      ▼
             Client Components hydrate (interaction, theme, motion only)
```

The single most consequential property of this system is that **there is no
request-time server**. It is the root of the CSP decision (§10.1), the caching
strategy (§3.3), and the cost model for every feature.

### 3.2 Route surface

Five content types, one app. Routes under `app/`:

- **Blog** — `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
  `app/blog/page/[page]/page.tsx`, `app/blog/tags/[tag]/page.tsx`.
- **Learn** — shared chrome in `app/learn/layout.tsx`; four pillars below (§4).
- **Static** — `app/page.tsx` (home), `app/about/page.tsx`.
- **Generated endpoints** — `app/sitemap.ts`, `app/robots.ts`,
  `app/feed.xml/route.ts`, `app/llms.txt/route.ts`, `app/api/og/route.tsx`,
  `app/api/search/route.ts`, `app/icon.tsx`, `app/apple-icon.tsx`,
  `app/twofold-logo/route.tsx` (publisher logo).
- **Redirects** — consolidation rules in `next.config.ts:152-175`
  (`/patterns/*` → `/learn/patterns/*`, `/tools` → `/about#tools`,
  `/contact` → `/about#contact`). Redirects are config, not pages, so they
  cost nothing at runtime and preserve link equity (`permanent: true`).

### 3.3 Caching

Set entirely via response headers in `next.config.ts:70-149`, because there is
no server to cache *in*:

- Immutable static assets (`svg|jpg|png|webp|avif|woff|woff2`) and
  `/_next/static/*`: `public, max-age=31536000, immutable`.
- HTML: `public, max-age=0, must-revalidate` — the CDN holds the prerendered
  document; the browser always revalidates. Correct for a site that redeploys
  on content change.

---

## 4. Information architecture: the four-pillar Learn model

This is the most distinctive engineering in the codebase and the easiest to
erode, so it gets its own section.

`Learn` has four **peer** pillars, each a content type with its own `lib/`
loader and types module:

| Pillar   | Concept                          | Loader            | Types / constants        | Routing |
|----------|----------------------------------|-------------------|--------------------------|---------|
| Patterns | Portable techniques              | `lib/patterns.ts` | (chaptered, 6 chapters)  | nested  |
| Toolkit  | Claude Code features             | `lib/toolkit.ts`  | `lib/toolkit-types.ts`   | topic/sub |
| Harness  | The runtime beneath the model    | `lib/harness.ts`  | `lib/harness-types.ts`   | flat    |
| Security | The trust & privacy surface      | `lib/security.ts` | `lib/security-types.ts`  | flat    |

Two engineering patterns hold this together:

**Boundary statements.** Each pillar exports a prose constant defining what it
*is not* (`HARNESS_BOUNDARY` in `lib/harness-types.ts:33-34`,
`SECURITY_BOUNDARY` in `lib/security-types.ts:40-41`). These render on the
Learn hero and section indexes. They exist because a four-pillar model decays
into overlapping mush without a maintained fence. The comment says it plainly:
*"that fence is what makes it this site, not an OWASP checklist."* **A new
pillar must ship a boundary statement.** This is not optional polish; it is the
mechanism that keeps the IA legible.

**Colocated routing invariants.** `lib/security-types.ts:6-9` declares the
`FLAT-ONLY CONSTRAINT` directly above the data it governs: routes are
`/learn/security/<chapter>`, never `/<chapter>/<sub>`, *because* the sidebar
and mobile-nav active-slug parsing assume a single segment. The constraint, its
reason, and its blast radius are one comment. Replicate this pattern for any
invariant a future contributor could plausibly violate without noticing.

The client-safe split (`*-types.ts`) is deliberate: chapter metadata, ordering,
icons, and boundary text contain no `fs` access, so Client Components
(sidebars, mobile nav, hero) import them without dragging Node APIs into the
bundle. Server loaders (`lib/harness.ts`, `lib/security.ts`) own the filesystem
and re-export the types module so callers have one import site.

### 4.1 The on-ramp layer (a non-pillar front door)

`/learn/start` is a fifth Learn area that is **deliberately not a pillar**. It is
a plain-English on-ramp for non-technical readers (founders, PMs, designers,
ops) who watched an agentic-engineering demo and want to understand it, not
build it. It decodes the vocabulary (the **Decoder**, a thematic glossary at
`/learn/start/decoder`) and the core mental models (**explainers** at
`/learn/start/explain/<slug>` and **Demo, Decoded** walkthroughs at
`/learn/start/demo/<slug>`), then links *into* the four pillars.

**Define-on-first-use toggletips are site-wide.** `lib/rehype-glossary.ts` runs
in the shared MDX pipeline (`lib/mdx-options.ts`) and wraps the first occurrence
of each Decoder term in any document in a `<glossaryterm>` element, mapped in
`components/blog/MdxComponents.tsx` to an accessible click-toggletip
(`components/learn/GlossaryTerm.tsx`) that links back to the Decoder. It skips
code, links, and headings, and wraps each term at most once per document.

It follows the per-section convention without claiming peer status: a boundary
statement plus a client-safe types module (`lib/onramp-types.ts`, which also
carries the glossary data so the Decoder client island imports it directly), a
server loader (`lib/onramp.ts`) for the demo MDX, and a colocated routing
invariant. Its identity colour is `amber` (chapter-5) — a fifth entry in
`SECTION_THEME` (`components/learn/sectionTheme.ts`) chosen so the four-pillar
colour contract (green/cyan/purple/red) stays intact.

**It is excluded from the four-pillar sidebar/active-slug parsing on purpose.**
`LearnSidebar` and `LearnMobileNav` key off `/learn/{patterns,toolkit,harness,
security}`; `/learn/start` matches none and renders inside the Learn chrome with
no pillar active. Discovery is via a CTA band on the `/learn` index, not the
pillar nav. Wiring the on-ramp into that nav means revisiting both components.

---

## 5. Content pipeline

File-based content store. No CMS, no database. Content is `.mdx` under
`content/{posts,patterns,toolkit,harness,security}/` plus JSON sidecars
(`content/referrals.json`, products, pattern tool examples).

### 5.1 File → HTML

1. **Read & parse.** `lib/posts.ts:30-76` and peers: `fs.readdirSync` →
   `gray-matter` splits frontmatter from body → `reading-time` computes the
   "N min read" string. Frontmatter is typed (`PostFrontmatter`,
   `lib/posts.ts:6-20`, and the per-pillar analogues).
2. **Filter & sort.** `getAllPosts()` drops `published: false` and sorts by
   `date` descending (`lib/posts.ts:43-48`). Drafts never reach a static param.
3. **Derive.** TOC extraction, signal extraction, related-content scoring
   (§5.3).
4. **Compile.** `MDXRemote` (`next-mdx-remote@^6.0.0`, App-Router compatible)
   renders the body with options from `lib/mdx-options.ts` and a
   per-content-type component map (blog vs. pattern MDX components).

### 5.2 The deliberate dev/prod MDX divergence

`lib/mdx-options.ts:5-39` returns **different pipelines per environment**:

- **Dev:** `remark-gfm` only.
- **Prod:** `remark-gfm` + `rehype-pretty-code` with a custom Shiki theme
  (`neoBrutalistTheme`), loaded via dynamic `import()` and a singleton
  highlighter (`lib/shiki-highlighter.ts`).

This is an explicit trade-off. The Shiki highlighter and its language grammars
are heavy; loading them on every HMR cycle would make authoring sluggish.
Skipping syntax highlighting in dev keeps the inner loop fast. **The cost: code
blocks are unstyled in `pnpm dev` and you do not see real highlighting until a
production build.** Accept this; do not "fix" it by enabling Shiki in dev
without re-evaluating HMR cost. The dynamic `import()` in the prod branch also
keeps Shiki out of any bundle that doesn't render MDX.

### 5.3 Related-content algorithm

`getRelatedPosts()` (`lib/posts.ts:93-150`) is the reference implementation for
relationship surfacing: score every other post by tag-set intersection size,
sort by score then recency, and if fewer than `limit` posts share a tag,
backfill with the most recent posts so the slot count is always met. Pattern
relationships are explicit instead (typed edges in pattern frontmatter), which
is the right call for a curated graph and the wrong call for a growing blog —
the asymmetry is intentional.

---

## 6. Design system

### 6.1 Tokens and the theming mechanism

There is **no `tailwind.config.ts`**. Tailwind v4 is configured CSS-first in
`app/globals.css`:

- `:root` defines raw values for both themes plus the active aliases
  (`app/globals.css:7-44`).
- `html.light` / `html.dark` rebind the active aliases
  (`app/globals.css:46-62`).
- `@theme inline` (`app/globals.css:65-78`) maps the CSS variables to Tailwind
  utility names so `bg-background`, `text-text`, `border-accent` resolve to
  live variables.

Core palette (dark default → light):

| Token        | Dark      | Light     | Role                          |
|--------------|-----------|-----------|-------------------------------|
| `background` | `#0a0a0a` | `#f5f5f5` | Page base                     |
| `surface`    | `#333333` | `#e0e0e0` | Cards, code, panels           |
| `text`       | `#f5f5f5` | `#0a0a0a` | Foreground                    |
| `muted`      | `#a9a9a9` | `#666666` | Secondary text, hairlines     |
| `accent`     | `#00ff88` | `#00cc6a` | Links, focus, active state    |

Six `--color-chapter-N` tokens (`app/globals.css:29-43`) give each Patterns
chapter its own accent, with light-mode-muted variants — the only place the
palette is allowed to expand, and it expands by token, never by literal.

**Why CSS variables and not Tailwind's dark variant:** theme switching must not
cause a layout shift or a React re-render of the tree. A class swap on
`<html>` re-resolves every variable in one paint. This is principle #3, and it
is *why* the bootstrap script in §6.3 exists.

### 6.2 Typography

`Space_Grotesk` via `next/font/google` (`app/layout.tsx:16-21`), weights
400/600/700, `display: 'swap'`, exposed as `--font-space-grotesk` and mapped to
`--font-sans` in `@theme inline`. `next/font` self-hosts the font files at
build time — there is no runtime request to Google. That is both a performance
property (no third-party round trip, no FOIT) and a privacy/security property
that is *consistent with* the CSP `font-src 'self'` (`next.config.ts:28`). The
coherence is the point: the font strategy and the CSP were designed together.

### 6.3 The theme bootstrap (and why it costs us a CSP control)

`app/layout.tsx:90-110` injects a blocking inline `<script>` in `<head>` that
reads `localStorage['theme-preference']` (default `dark`, `system` resolved via
`matchMedia`) and sets the class on `documentElement` *before* CSS applies.
`<html suppressHydrationWarning>` covers the resulting server/client class
mismatch.

This eliminates the flash of wrong theme. It is also a direct cause of the CSP
`'unsafe-inline'` decision (§10.1): a render-blocking inline script that must
run before paint cannot be deferred or externalized without reintroducing the
flash. The two decisions are coupled; change one and you must revisit the
other.

### 6.4 Neo-brutalist primitives and motion

The visual language is enforced in `app/globals.css`: 2px borders on content
containers (`.mdx-content .code-block-container`, `:152-153`), hard offset
shadows (no blur), zero border-radius, uppercase letter-spaced table headers
(`:122-132`). Code blocks get a full grid-based line treatment with line
numbers, highlight ranges, and `+/-` diff markers driven by `data-` attributes
from `rehype-pretty-code` (`app/globals.css:172-220+`).

Motion is governed globally by `<MotionConfig reducedMotion="user">`
(`app/layout.tsx:127`). This is the *mechanism* behind every "respects
`prefers-reduced-motion`" claim — Framer Motion reads the OS setting at the
provider, so individual components do not each re-implement the check. New
animation goes through Framer Motion so it inherits this for free; bespoke CSS
keyframe animation must add its own `@media (prefers-reduced-motion)` guard.

---

## 7. Component architecture

Components are grouped by domain under `components/` (`ui/`, `layout/`, `blog/`,
`home/`, `patterns/`, `learn/`, `seo/`, `about/`) with a barrel `index.ts`.

The organizing rule is principle #2 — the boundary is an I/O boundary:

- **Server (default):** index pages, data-fetching pages, MDX rendering,
  `Footer`, `LearnShowcase`, `JsonLd`. These touch `lib/` (filesystem,
  parsing) and produce static HTML.
- **Client (`'use client'`):** `Header`, `Search`, `BlogFilters`,
  `TableOfContents`, `Comments`, theme toggle, all sidebars/mobile-nav, all
  Framer Motion. These hold state and respond to input; they receive
  already-shaped data as props.

The discipline that keeps hydration cost down: data fetching stays at the
Server Component layer and interactive leaves are kept small. A page is a
Server Component that loads and shapes data, then hands plain props to a few
Client leaves. Do not promote a whole page to a Client Component to make one
button interactive — extract the button.

MDX gets two component maps because blog prose and pattern prose need different
element overrides (callouts, diff blocks, tool-example tabs exist only in
patterns). Both route code through the same Shiki path so highlighting is
identical everywhere it appears.

**Interactive "explorable" components** live in `components/interactive/`
(`AgentLoopStepper`, `ScrollStory`, `RunnableSnippet`) and are registered in the
*base* `mdxComponents` map (`components/blog/MdxComponents.tsx`), so they are
available to blog, harness, and pattern prose alike (the pattern map spreads the
base). They are small `'use client'` islands that receive already-shaped props
and inherit the global reduced-motion contract (§6.4). Following the
`FlowDiagram` convention, components that take structured data accept it as a
**single-quoted JSON string literal** parsed inside the component
(`<ScrollStory steps='[{"title":"…","body":"…"}]' />`). Neither raw
array/object literals nor the `{JSON.stringify([…])}` expression form survive
the RSC MDX attribute path — only a literal string does.

---

## 8. Performance engineering

The budget (`CLAUDE.md` performance table; enforced subset in §12):
LCP < 2.0s, CLS < 0.05, bundle < 100KB gzip, Lighthouse Performance ≥ 90.

Mechanisms, each tied to code:

- **SSG** — no TTFB server work; the CDN serves a finished document (§3.1).
- **`optimizePackageImports: ['framer-motion']`** (`next.config.ts:48`) —
  tree-shakes the one heavy UI dependency to its used surface.
- **Image policy** (`next.config.ts:52-62`) — AVIF then WebP, an explicit
  `deviceSizes`/`imageSizes` ladder so `next/image` emits a tight `srcset`;
  remote images restricted to `images.unsplash.com`.
- **`removeConsole` in production** (`next.config.ts:66`) — strips logging
  weight and noise from shipped JS.
- **Font self-hosting** (§6.2) — no third-party round trip, `swap` avoids
  invisible text.
- **Lazy Shiki** (§5.2) — the heaviest content dependency is dynamically
  imported and prod-only.
- **Conditional analytics** — `<Analytics />` / `<SpeedInsights />` render only
  when `NEXT_PUBLIC_VERCEL_ENV` is set (`app/layout.tsx:135-136`), so they cost
  nothing in local/preview-less contexts.
- **Immutable asset caching** (§3.3).

**Known characteristic, not a bug:** `getAllPosts()` and peers re-read and
re-parse the filesystem on every call with no memoization (`lib/posts.ts:30`).
At build time, with ~90 documents, this is irrelevant. It is a documented
scaling cliff: at thousands of documents, add a build-scoped cache. Don't
pre-optimize it now.

---

## 9. Accessibility

100 is a merge gate (§12), so a11y is enforced, not reviewed. The mechanisms:

- **Skip link** — `app/layout.tsx:120-125`, `sr-only` until focused, jumps to
  `#main-content` (`:129`).
- **Reduced motion** — globally via `MotionConfig` (§6.4), not per-component.
- **Focus visibility** — high-contrast `accent` focus styling; the neo-brutalist
  system uses thick focus borders rather than subtle rings, which helps rather
  than hurts here.
- **Contrast** — the palette is built for it (`#f5f5f5` on `#0a0a0a`), and
  `color-contrast` is asserted at `1.0` in CI (`lighthouserc.json:19`).
- **Semantics & labels** — single `<main id="main-content">`, `<html lang>`;
  `button-name`, `image-alt`, `link-name`, `aria-prohibited-attr`,
  `label-content-name-mismatch` each asserted at `1.0`
  (`lighthouserc.json:20-24`).

The principle: a11y regressions fail the build. If you add an icon button
without a name, CI stops you — that is the design, and it is why the audit list
in `lighthouserc.json` is specific rather than just `categories:accessibility`.

---

## 10. Security architecture

The `security-hardening` branch treats the trust surface as a deliverable. The
controls and, more importantly, the *reasoning* are in `next.config.ts` and
`.npmrc` so they are reviewed alongside the code they protect.

### 10.1 Content-Security-Policy

Defined in `next.config.ts:17-36`. The shape:

- Locked down: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `frame-ancestors 'self'`, `font-src 'self'`,
  `upgrade-insecure-requests`.
- Narrowly opened: `script-src` adds only `va.vercel-scripts.com` and
  `giscus.app`; `connect-src` only Vercel analytics/insights; `frame-src` only
  `giscus.app`; `img-src` only `self`, `data:`, Unsplash.
- Dev-only: `'unsafe-eval'` and `ws:` are appended *only* when not production
  (`:24`, `:30`) for HMR — they never ship.

**The accepted weakness, documented at the weakness:** `script-src` includes
`'unsafe-inline'`. The rationale is in the file comment (`next.config.ts:8-15`):
a strict nonce-based policy requires per-request middleware, which forces
dynamic rendering and breaks the SSG performance budget — and the theme
bootstrap (§6.3) is exactly such a required inline script. The decision: accept
`'unsafe-inline'` for scripts, then make it as close to harmless as possible by
eliminating every *other* injection vector (no external script origins beyond
two, no `eval`, no `object`, no `base` hijack, no form exfil). The revisit
condition: if this site ever gains a server/middleware tier, move to nonces.

`X-XSS-Protection` is **intentionally omitted** — see `next.config.ts:112-114`.
The legacy auditor is deprecated, disabled in modern browsers, and can itself
introduce cross-site leaks; CSP supersedes it. This is documented so a future
security scanner's "missing header" finding doesn't get it re-added.

### 10.2 Transport and isolation headers

All from `next.config.ts:96-135`: HSTS `max-age=63072000; includeSubDomains;
preload` (2y), `X-Content-Type-Options: nosniff`, `X-Frame-Options:
SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Cross-Origin-Opener-Policy: same-origin`, `X-Permitted-Cross-Domain-Policies:
none`, `Permissions-Policy` denying camera/mic/geolocation/`browsing-topics`/
`interest-cohort` (the last two also opt out of ad-tech surveillance APIs).
`poweredByHeader: false` (`:43`) removes the framework fingerprint.

### 10.3 Supply chain

`.npmrc` encodes a defense against the publish-then-yank worm class
(Shai-Hulud), with the threat model written into the file:

- `minimum-release-age=4320` — refuse any dependency version younger than 3
  days; the detection-and-unpublish window for malicious releases is shorter
  than that, so this site is never patient zero.
- `verify-deps-before-run=warn` — flag `node_modules`/lockfile drift before
  scripts run.
- Lifecycle scripts blocked by default (pnpm 10); only
  `pnpm.onlyBuiltDependencies` (`package.json:78-82`: `esbuild`, `sharp`,
  `unrs-resolver`) may run them. Keep that list minimal.
- `overrides` pins `postcss` to a patched range (`package.json:83-85`).

CI reinforces it (§12): every workflow runs `pnpm install --frozen-lockfile`,
Node is pinned by `.nvmrc` (single source), pnpm is pinned via `packageManager`
(`package.json:34`), and **every GitHub Action is pinned to a commit SHA**, not
a tag (`ci.yml:23,26,27` etc.) — a moved tag cannot inject code. Workflows
declare `permissions: contents: read` at the top and widen to
`pull-requests: write` only on the one job that comments
(`lighthouse.yml:21-23`). Least privilege, by default, per workflow.

---

## 11. SEO and metadata

- **One URL origin** — `lib/site.ts` exports `SITE_URL`, sourced from
  `NEXT_PUBLIC_SITE_URL` with trailing slashes stripped. Everything that builds
  an absolute URL (metadata, JSON-LD, sitemap, robots, RSS, OG/share links)
  imports it instead of re-deriving the origin inline. The normalisation makes
  the `${SITE_URL}/path` → `host//path` double-slash class of bug structurally
  impossible regardless of how the env var is set; the canonical/OG/JSON-LD
  signals can't split across `/path` and `//path`.
- **Metadata API** — root defaults with a title `template` in
  `app/layout.tsx` (`metadataBase`, OpenGraph, Twitter card, `robots` with
  `max-image-preview: large`); pages override via `generateMetadata`.
  `title.template` adds `| Dakota Smith` once and is **not** applied to the
  segment that defines it (the root `page.tsx`), so child pages return a *bare*
  title — a pre-suffixed string double-suffixes. Home and every `/blog` route
  set `alternates.canonical`, matching the Learn routes.
- **Structured data** — `lib/schema.ts` generators rendered through
  `components/seo/JsonLd`; every page type has a matching schema (BlogPosting,
  TechArticle for patterns, BreadcrumbList, Person, CollectionPage incl. the
  `/learn` hub, `WebSite` with a `SearchAction`). Author is a `Person` whose
  `url` is the on-site `/about` page with off-site profiles in `sameAs`;
  Article-class `publisher` is the `Organization` (Twofold) carrying a logo
  (`app/twofold-logo` ImageObject), not the author Person. Breadcrumb schema is
  what earns rich results, so it is not optional on nested pages.
- **Sitemap** — `app/sitemap.ts` enumerates all five content types plus tag
  pages with tiered priorities; it reads the same `lib/` loaders as the pages,
  so it cannot drift out of sync with what actually exists.
- **robots / RSS / llms.txt** — `app/robots.ts` allows `/`, disallows `/api/`
  and `/components-demo/` (no legacy `Host` directive); `app/feed.xml/route.ts`
  serves RSS, linked from `<head>`; `app/llms.txt/route.ts` serves a curated
  AI-agent site map (llmstxt.org) built from the same `lib/` loaders.

SEO `1.0` is a merge gate (§12), which is why these are wired to the data
layer rather than hand-maintained.

---

## 12. Quality gates — what actually blocks a merge

CI runs on every PR to `main`. These are the real gates, not guidelines:

**`ci.yml`** — three jobs; `build` depends on `typecheck` + `lint` passing
first (`ci.yml:51`):
- `pnpm exec tsc --noEmit` — strict TypeScript, zero errors.
- `pnpm lint` — ESLint 9, zero errors.
- `pnpm build` — production build must succeed, with `.next/cache` keyed on
  lockfile + source hash.

**`lighthouse.yml`** — builds, audits `/`, `/blog`, `/about` 3× each
(`lighthouserc.json`), posts a scored table to the PR, and **fails** on:
- Accessibility, Best Practices, SEO < `1.0` (hard 100).
- Performance < `0.90`, aggregated `optimistic`.
- Specific a11y audits < `1.0` (§9).

**`content-check.yml`** — on content-path PRs only: runs content + image
validation and **fails if average content score < 80**
(`content-check.yml:117-124`).

**One asymmetry to understand before you trust the green check:** the
Performance gate is `0.90` with `optimistic` aggregation — the *best* of three
runs must clear 90, not the median. Accessibility/Best-Practices/SEO are hard
`1.0`. This is deliberate: lab performance is noisy on shared CI runners and we
refuse to make a flaky gate block merges, but correctness-class categories have
no such excuse and get no slack. If you tighten performance, also switch off
`optimistic` — leaving both lenient knobs on hides regressions.

---

## 13. Decision ledger

The load-bearing decisions, with the alternative we rejected and the condition
that should make us revisit. Detail is in the cited section.

| # | Decision | Rejected alternative | Revisit when | §  |
|---|----------|----------------------|--------------|----|
| 1 | SSG only, no middleware | SSR/ISR for freshness | A real backend appears | 3 |
| 2 | CSP allows `script-src 'unsafe-inline'` | Nonce-based strict CSP | A server/middleware tier exists | 10.1 |
| 3 | Omit `X-XSS-Protection` | Keep legacy header | Never (CSP supersedes); documented to prevent re-adding | 10.1 |
| 4 | Tailwind v4 CSS-first, tokens as CSS vars | `tailwind.config.ts` + dark variant | Tokens outgrow CSS-var theming | 6 |
| 5 | Dev = no Shiki, prod = Shiki | Highlight in dev too | HMR cost stops mattering | 5.2 |
| 6 | Blocking inline theme script in `<head>` | Defer / accept theme flash | Coupled to #2 — revisit together | 6.3 |
| 7 | 3-day dependency cooldown + SHA-pinned actions + frozen lockfile | Trust latest, tag-pinned actions | Threat model changes | 10.3 |
| 8 | Four pillars + boundary statements + colocated routing invariants | Free-form sections | Adding a pillar (must ship a boundary) | 4 |
| 9 | Filesystem content, no CMS, no memoization | Database/CMS, or cached reads | Thousands of docs, or non-git authoring | 5, 8 |
| 10 | Perf gate `0.90` optimistic; correctness gates hard `1.0` | Uniform threshold | Perf is tightened (drop optimistic with it) | 12 |
| 11 | Runnable code embeds (Codapi) opt-in, OFF by default behind `NEXT_PUBLIC_ENABLE_CODAPI` | Ship runnable by default | The CSP relaxation (wasm-unsafe-eval + unpkg origin) is accepted and Lighthouse re-verified | 10.1, 14 |
| 12 | `robots.txt` explicitly *welcomes* major AI crawlers (per-agent rules) | Wildcard-only, or block AI bots | A crawler abuses access, or citation policy changes (flip its entry to `disallow`) | 11 |
| 13 | `/quality-gate`: enforced prose-rubric gate + human sign-off, "gates over trust" | Trust the mechanical score alone | LLM-as-judge proves unreliable enough to drop, or a deterministic prose check replaces it | — |

---

## 14. Known trade-offs, risks, and future work

Stated plainly so nobody rediscovers them as surprises:

- **`'unsafe-inline'` in `script-src` is a genuine residual XSS risk.** It is
  mitigated to near-irrelevance (§10.1) but not eliminated. It is the single
  control most worth removing if the architecture ever permits nonces.
- **The dev/prod MDX divergence is a correctness blind spot.** Highlighting,
  diff markers, and line ranges are unverified until a prod build. Mitigation:
  run `pnpm build` before merging content-heavy or MDX-rendering changes; the
  CI `build` job is the backstop.
- **Lighthouse `optimistic` aggregation can mask a real performance
  regression** that only shows on the median run. The hard `1.0` correctness
  gates have no such hole; performance does. Tighten with eyes open (§12).
- **Unmemoized filesystem reads** are an O(documents) build-time cost with no
  cache (§8). Fine now; a documented cliff later.
- **`reactStrictMode` double-invokes effects in dev** (`next.config.ts:40`) —
  intentional; new effects must be idempotent or they will misbehave in dev and
  potentially in prod under concurrent React.
- **Runnable embeds pressure the CSP if enabled.** `RunnableSnippet` is OFF by
  default and changes nothing while off. Turning it on
  (`NEXT_PUBLIC_ENABLE_CODAPI=true`) requires relaxing `script-src`
  (`'wasm-unsafe-eval'` + `https://unpkg.com`) and `connect-src` — a real
  weakening of §10.1, documented inline in `next.config.ts`. Re-verify
  Lighthouse Best-Practices in CI before merging an activation. WASI sandboxes
  are limited to Python/SQLite/etc; JS/agent demos are not covered here.
- **The newsletter funnel depends on an external provider.** `NewsletterSignup`
  POSTs to `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` (opaque `no-cors`, optimistic
  success) and falls back to `mailto:` when unset. The provider origin must be
  added to `connect-src` (see the `NEWSLETTER_ORIGIN` comment in
  `next.config.ts`) or the POST is blocked in production.
- **The four-pillar IA degrades silently.** Nothing *enforces* a boundary
  statement or the flat-only routing invariant — they are prose contracts
  (§4). The protection is review discipline plus the colocated comments.
  Candidate future work: a unit test asserting every pillar exports a non-empty
  boundary constant and that flat pillars have no two-segment routes.

---

## 15. Conventions for contributors

- New interactive UI: extract a small Client leaf; keep the page a Server
  Component (§7).
- New color: add a CSS variable in `app/globals.css` and map it in
  `@theme inline`. Never a literal in a component (§6.1).
- New animation: Framer Motion (inherits reduced-motion); bespoke keyframes
  must add their own `prefers-reduced-motion` guard (§6.4).
- New Learn pillar: ship a `*-types.ts` (client-safe), a `*.ts` loader (owns
  `fs`), a boundary statement, and a colocated comment for any routing
  invariant (§4).
- New external origin (script/style/img/connect/frame): it must be added to the
  CSP in `next.config.ts` *with a comment saying why*, or it will be blocked in
  production — by design (§10.1).
- Accept a weaker security control only with a comment at the weakness stating
  the alternative and the revisit condition (principle #6).
- Before merging MDX/content changes: `pnpm build` locally (§5.2, §14).

---

*This document describes the system as built. If you change the system, change
this document in the same PR. Anchors are `path:line` — keep them honest.*
