# Dakota Smith — Product and Engineering Design

> The architecture, the constraints that shaped it, and the decisions behind it.

**Status:** Living document — reflects the implemented 2026 modernization
**Audience:** Engineers contributing to this codebase
**Owner:** Dakota Smith
**Public identity:** Dakota Smith · AI Systems Architect & Full-Stack Engineer · `daksmith.dev`
**Last reconciled with code:** 2026-08-02

---

## 0. How to read this document

This document is the _why_ and the _how it actually works_ — the canonical
architecture reference. `CLAUDE.md` is the lean operational spine (rules,
constraints, commands, pointers); the original build plan and product
clarifications are archived in `docs/project-history.md`; `docs/README.md` maps
the whole documentation system. Where any of these disagree with the code, the
code is the source of truth. Five implemented decisions supersede the original
build plan and older visual guidance:

- **Tailwind v4, not v3.** There is no `tailwind.config.ts`. Configuration is
  CSS-first in `app/globals.css` (`@import "tailwindcss"` + `@theme inline`).
  See §6.
- **The visual direction is executive editorial, not neo-brutalist.** Warm
  ivory is the default canvas; deep forest ink, fine rules, restrained green,
  serif display type, and generous negative space establish authority without
  implying a title Dakota does not hold. See §6.
- **The public identity is personal and precise.** The wordmark is `Dakota
Smith`; `daksmith.dev` is the domain signature; `AI Systems Architect &
Full-Stack Engineer` is the current professional position. “Head of AI
  Innovation” is an aspiration, not a claim made by the product.
- **Toolkit is capability-first and cross-vendor.** Durable engineering
  capabilities are the taxonomy; Claude Code, OpenAI Codex, and GitHub Copilot
  are evidence-backed product projections. See §4.
- **The default Open Graph image is a checked-in static artifact.** Metadata
  points to `public/og-default.png`; there is no dynamic OG route. See §11.

Every claim here is anchored to a file path. When you change the
behavior, change the anchor's neighbor — and update this section's date. A
design doc that drifts from the code is worse than no design doc.

---

## 1. The problem and the constraints

This is Dakota Smith's professional publication — a blog plus a four-pillar
learning corpus on accountable AI systems and agentic engineering (114 MDX
documents across six content areas as of 2026-08-01). It must read as the work
of an AI systems architect and full-stack engineer operating toward AI
innovation leadership, not as a hobby portfolio or a generic developer blog.
Four forcing functions shape every decision:

1. **A hard performance/accessibility bar.** Lighthouse Accessibility, Best
   Practices, and SEO must score **100** (enforced as `1.0` in
   `lighthouserc.json:21-29`) on every collected run. Performance must clear
   **0.90** on the representative median run (`lighthouserc.json:20`). These
   are not aspirations; they are merge gates (§12).
2. **Professional credibility without title inflation.** Authority comes from
   the quality of the work, the specificity of the writing, and the product's
   editorial discipline. The site says `AI Systems Architect & Full-Stack
Engineer`; it does not claim `Head of AI Innovation`.
3. **A real security posture.** This site teaches AI security; shipping a weak
   header set would be self-refuting. The trust surface is a first-class
   deliverable, not an afterthought (§10).
4. **A static deployment target.** Vercel, SSG, `daksmith.dev`, no
   application backend. Anything that forces dynamic rendering (per-request
   middleware, server data fetching) is in tension with the performance budget
   and is rejected unless it pays for itself.

The constraint hierarchy, when these conflict: **correctness > accessibility >
security > performance > developer convenience.** Most decisions below are
resolutions of a tension between two of these, and the ordering is what breaks
the tie.

---

## 2. Design principles

These are the durable rules. They exist so a new contributor can make a _new_
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
   `lib/security-types.ts:6-9`: it says what the invariant is, _and_ what
   breaks if you violate it (sidebar slug parsing). This is the house style for
   load-bearing constraints. (Drives §4.)
5. **Accessibility is a mechanism, not a checklist.** Every a11y claim in this
   doc names the code that enforces it. If it isn't enforced, it isn't true.
   (Drives §9, §12.)
6. **Security decisions are documented at the point of the weakness.** Where we
   accept a weaker control, the `next.config.ts` comment explains why, the
   alternative, and the revisit condition (e.g. `next.config.ts:8-17`,
   `next.config.ts:148-150`). (Drives §10.)
7. **Voice and structure are part of the product.** The content system enforces
   brand voice; the engineering should match it — direct, specific, no filler.
8. **Professional authority is shown, not titled into existence.** Identity,
   typography, information hierarchy, source discipline, and production proof
   must do the positioning work. Never imply that Dakota currently holds the
   Head of AI Innovation title.
9. **Capabilities outlive products; evidence expires.** Toolkit information
   architecture is capability-first. Product classifications always carry a
   review date and sources, and documented behavior is never represented as
   runtime-conformance evidence. (Drives §4, §12.)

---

## 3. System architecture

### 3.1 Rendering model

Next.js 16 App Router (`next@^16.2.12`, `react@^19.2.8`), **SSG end to end**.
There is no `middleware.ts` and no per-request server work. The lifecycle is:

```
build time:  content/*.mdx ──► lib/*.ts (fs + gray-matter) ──► generateStaticParams
                                                                      │
                                                                      ▼
             Server Components render ──► MDXRemote compiles MDX ──► static HTML
                                                                      │
request time: Vercel's CDN serves prerendered HTML + cache-policy static assets
                                                                      │
                                                                      ▼
             Client Components hydrate (interaction, theme, motion only)
```

The single most consequential property of this system is that **there is no
request-time server**. It is the root of the CSP decision (§10.1), the caching
strategy (§3.3), and the cost model for every feature.

### 3.2 Route surface

Seven content areas, one app. Routes under `app/`:

- **Writing** — `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
  `app/blog/page/[page]/page.tsx`, `app/blog/tags/[tag]/page.tsx`.
- **Learn** — field-level navigation in `app/learn/layout.tsx`, a full-width hub,
  and route-local pillar shells below (§4).
- **Work** — `app/work/page.tsx`, an evidence-bounded projection of
  `content/products.json`; filtering is a small client leaf.
- **Static** — `app/page.tsx` (home), `app/about/page.tsx` (practice profile).
- **Generated endpoints** — `app/sitemap.ts`, `app/robots.ts`,
  `app/feed.xml/route.ts`, `app/llms.txt/route.ts`,
  `app/api/search/route.ts`, and `app/twofold-logo/route.tsx` (publisher logo).
  All are build-time/static.
- **Static identity assets** — `public/favicon.svg`,
  `public/favicon-32x32.png`, `public/apple-touch-icon.png`, and
  `public/og-default.png` are generated by `pnpm brand:generate` from
  `.content/brand/brand-kit.v1.json` through
  `scripts/generate-brand-assets.ts`, then checked in. There is no
  request-time icon or Open Graph image rendering.
- **Redirects** — consolidation rules in `next.config.ts:188-211`
  (`/patterns/*` → `/learn/patterns/*`, `/tools` → `/work`,
  `/blog/page/1` → `/blog`, `/contact` → `/about#contact`). Redirects are
  config, not pages, so they
  cost nothing at runtime and preserve link equity (`permanent: true`).

### 3.3 Caching

Set entirely via response headers in `next.config.ts:99-186`, because there is
no server to cache _in_:

- Fingerprinted `/_next/static/*` assets use Next.js-owned immutable caching;
  application config must not override it.
- Replaceable editorial files under `/images/*`: `public, max-age=0,
must-revalidate`. Stable filenames must not be cached as immutable across a
  later publication.
- HTML: `public, max-age=0, must-revalidate` — the CDN holds the prerendered
  document; the browser always revalidates. Correct for a site that redeploys
  on content change.

---

## 4. Information architecture: the four-pillar Learn model

This is the most distinctive engineering in the codebase and the easiest to
erode, so it gets its own section.

`Learn` has four **peer** pillars, each a content type with its own `lib/`
loader and types module:

| Pillar   | Concept                                | Loader            | Types / constants       | Routing                    |
| -------- | -------------------------------------- | ----------------- | ----------------------- | -------------------------- |
| Patterns | Portable techniques                    | `lib/patterns.ts` | (chaptered, 6 chapters) | nested                     |
| Toolkit  | Cross-vendor coding-agent capabilities | `lib/toolkit.ts`  | `lib/toolkit-types.ts`  | topic/lens + product views |
| Harness  | Runtime and delivery machinery         | `lib/harness.ts`  | `lib/harness-types.ts`  | flat                       |
| Security | The trust & privacy surface            | `lib/security.ts` | `lib/security-types.ts` | flat                       |

The root Learn layout exposes only field-level destinations: Overview, Start,
Patterns, Capability Index, Harness, and Security. It does not load the full
corpus. Each pillar owns a route-local layout that loads only its syllabus and
hands client-safe navigation records to `LearnSectionShell`. The rail begins at
`xl`; smaller viewports retain a compact disclosure so it never collides with a
detail-page table of contents. Desktop article indexes use
`StickyTableOfContents`, pinned below the persistent site header with a bounded
viewport height; mobile keeps the in-flow disclosure. The `/learn` hub remains
full width and leads with decisions rather than document taxonomy.

Two engineering patterns hold the content model together:

**Boundary statements.** Each pillar exports a prose constant defining what it
_is not_ (`HARNESS_BOUNDARY` in `lib/harness-types.ts:33-34`,
`SECURITY_BOUNDARY` in `lib/security-types.ts:40-41`). These render on the
Learn hero and section indexes. They exist because a four-pillar model decays
into overlapping mush without a maintained fence. The comment says it plainly:
_"that fence is what makes it this site, not an OWASP checklist."_ **A new
pillar must ship a boundary statement.** This is not optional polish; it is the
mechanism that keeps the IA legible.

Harness contains two explicit layers without changing its flat routing model.
Chapters 01–06 cover the runtime harness beneath a model: loop, context,
compaction, tools, prompt architecture, and custom runtime construction.
Chapter 07 covers the delivery harness above one or more runtimes: durable work
state, exact-candidate evidence, independent verification, and bounded
authorization. The boundary is authority, not model count or vendor topology.

**Colocated routing invariants.** `lib/security-types.ts:6-9` declares the
`FLAT-ONLY CONSTRAINT` directly above the data it governs: routes are
`/learn/security/<chapter>`, never `/<chapter>/<sub>`, _because_ the sidebar
and mobile-nav active-slug parsing assume a single segment. The constraint, its
reason, and its blast radius are one comment. Replicate this pattern for any
invariant a future contributor could plausibly violate without noticing.

The client-safe split (`*-types.ts`) is deliberate: chapter metadata, ordering,
icons, and boundary text contain no `fs` access, so Client Components
(sidebars, mobile nav, hero) import them without dragging Node APIs into the
bundle. Server loaders (`lib/harness.ts`, `lib/security.ts`) own the filesystem
and re-export the types module so callers have one import site.

**Toolkit's evidence contract is stronger than the other pillar loaders.** Its
nine stable capability topics each publish an overview plus four implementation
lenses: Mental Model, Playbook, Compositions, and Pitfalls. Product routes at
`/learn/toolkit/products/{claude-code,openai-codex,github-copilot}` are generated
projections of the same corpus; product names do not create three competing
taxonomies. `content/toolkit/_data/products.json` defines products and surfaces,
`sources.json` is the official-source register, and `coverage.json` records
dated capability classifications by product and surface. The server loader
fails closed on malformed IDs, dates, source references, status values, and the
complete 9 × 5 public content contract (`lib/toolkit.ts`).

Coverage status means what the reviewed official material documented, not what
a product can theoretically do and not what was independently measured in a
live runtime. The allowed vocabulary — `native`, `partial`, `external`,
`no-documented-equivalent`, and `unknown` — keeps absence of evidence distinct
from evidence of absence. `basis: documented | observed` makes provenance
explicit. The current 2026-08-01 registry contains documentation evidence only.

The former Claude-specific `claude-md` URL remains link-safe through explicit
static redirect pages at `app/learn/toolkit/claude-md/`; it canonicalizes to the
capability name `project-instructions`, including lens subroutes. Do not restore
`claude-md` as a second taxonomy.

### 4.1 The on-ramp layer (a non-pillar front door)

`/learn/start` is a fifth Learn area that is **deliberately not a pillar**. It is
a plain-English on-ramp for non-technical readers (founders, PMs, designers,
ops) who watched an agentic-engineering demo and want to understand it, not
build it. It decodes the vocabulary (the **Decoder**, a thematic glossary at
`/learn/start/decoder`) and the core mental models (**explainers** at
`/learn/start/explain/<slug>` and **Demo, Decoded** walkthroughs at
`/learn/start/demo/<slug>`), then links _into_ the four pillars.

**Define-on-first-use toggletips are site-wide.** `lib/rehype-glossary.ts` runs
in the shared MDX pipeline (`lib/mdx-options.ts`) and wraps the first occurrence
of each Decoder term in any document in a `<glossaryterm>` element, mapped in
`components/blog/MdxComponents.tsx` to an accessible click-toggletip
(`components/learn/GlossaryTerm.tsx`) that links back to the Decoder. It skips
code, links, and headings, and wraps each term at most once per document.

It follows the per-section convention without claiming peer status: a boundary
statement plus a client-safe types module (`lib/onramp-types.ts`, which also
carries the glossary data for the static Decoder field lexicon), a
server loader (`lib/onramp.ts`) for the demo MDX, and a colocated routing
invariant. Its identity colour is `amber` (chapter-5). Harness uses the core
forest `accent` rather than the former purple AI shorthand; purple remains only
where it carries categorical meaning inside Patterns chapter 4. The remaining
pillar accents are Patterns green, Toolkit cyan, and Security red.

**It is excluded from every pillar syllabus on purpose.** The field-level
`LearnPrimaryNav` identifies Start directly; route-local `LearnSidebar` and
`LearnMobileNav` receive only one pillar's shaped navigation records. Start
therefore remains visible without pretending to be a fifth peer syllabus.

---

## 5. Content pipeline

File-based content store. No CMS, no database. Content is `.mdx` under
`content/{posts,patterns,toolkit,harness,security,onramp}/` plus JSON sidecars
(`content/referrals.json`, Toolkit evidence registries, pattern tool examples).

### 5.1 File → HTML

1. **Read & parse.** `lib/posts.ts:87-133` and peers: `fs.readdirSync` →
   `gray-matter` splits frontmatter from body → `reading-time` computes the
   "N min read" string. Frontmatter is typed (`PostFrontmatter`,
   `lib/posts.ts:6-20`, and the per-pillar analogues).
2. **Filter & sort.** `getAllPosts()` drops `published: false` and sorts by
   `date` descending (`lib/posts.ts`). Dynamic content routes also set
   `dynamicParams = false`, so drafts and unknown slugs cannot bypass the
   published static-param set.
3. **Derive.** TOC extraction, signal extraction, related-content scoring
   (§5.3).
4. **Compile.** `MDXRemote` (`next-mdx-remote@^6.0.0`, App-Router compatible)
   renders the body with options from `lib/mdx-options.ts` and a
   per-content-type component map (blog vs. pattern MDX components).

### 5.2 The deliberate dev/prod MDX divergence

`lib/mdx-options.ts:5-39` returns **different pipelines per environment**:

- **Both:** `remark-gfm`, deterministic heading IDs, and define-on-first-use
  glossary terms.
- **Prod additionally:** `rehype-pretty-code` with the editorial code-theme
  object (`editorialCodeTheme`), loaded via dynamic `import()` and a singleton
  highlighter (`lib/shiki-highlighter.ts`). Shiki emits the code palette as CSS
  token references, keeping `app/globals.css` authoritative for color.

This is an explicit trade-off. The Shiki highlighter and its language grammars
are heavy; loading them on every HMR cycle would make authoring sluggish.
Skipping syntax highlighting in dev keeps the inner loop fast. **The cost: code
blocks are unstyled in `pnpm dev` and you do not see real highlighting until a
production build.** Accept this; do not "fix" it by enabling Shiki in dev
without re-evaluating HMR cost. The dynamic `import()` in the prod branch also
keeps Shiki out of any bundle that doesn't render MDX.

### 5.3 Related-content algorithm

`getRelatedPosts()` (`lib/posts.ts:181-220`) is the reference implementation for
relationship surfacing: score every other post by tag-set intersection size,
sort by score then recency, and if fewer than `limit` posts share a tag,
backfill with the most recent posts so the slot count is always met. Pattern
relationships are explicit instead (typed edges in pattern frontmatter), which
is the right call for a curated graph and the wrong call for a growing blog —
the asymmetry is intentional.

### 5.4 Deterministic editorial art

Every post has two checked-in raster outputs: a 1600×900 hero and a 960×640
thumbnail. `.content/images/post-art.v1.json` is the contract: it records the
palette, renderer versions, output geometry, eight semantic motifs, and the
motif/variant assigned to every post slug. `scripts/generate-post-images.ts`
renders raw RGB geometry with Sharp from those versioned inputs. It uses no
fonts, remote assets, SVG illustration, random source, or model call; visible
headlines remain HTML rather than being burned into the art.

`pnpm images:generate` rewrites the committed JPEGs and injects both blur
placeholders into MDX frontmatter. `pnpm images:generate -- --slug <slug>` is the
authoring path for one post. `pnpm images:check` renders in memory and requires
byte equality, complete manifest/content coverage, pinned renderer versions,
canonical filenames and dimensions, and exact blur data. This makes the image
system reproducible rather than merely stylistically consistent. The lead essay
uses its 16:9 hero; every writing-ledger record renders its 3:2 thumbnail in a
stable media rail, so image coverage is an invariant rather than a layout cadence.

---

## 6. Design system

### 6.1 Tokens and the theming mechanism

There is **no `tailwind.config.ts`**. Tailwind v4 is configured CSS-first in
`app/globals.css`:

- `:root` defines raw values for both themes plus the active aliases
  (`app/globals.css:7-48`).
- `html.light` / `html.dark` rebind the active aliases
  (`app/globals.css:50-75`).
- `@theme inline` (`app/globals.css:78-95`) maps the CSS variables to Tailwind
  utility names so `bg-background`, `text-text`, `border-accent` resolve to
  live variables.

Core palette (light default; dark remains a fully supported preference):

| Token        | Light     | Dark      | Role                              |
| ------------ | --------- | --------- | --------------------------------- |
| `background` | `#f7f4ee` | `#111713` | Warm paper / dark canvas          |
| `surface`    | `#ebe6dc` | `#1b231e` | Quiet panels and code             |
| `text`       | `#14211c` | `#f2efe7` | Primary ink                       |
| `muted`      | `#5d665f` | `#aab2ac` | Secondary copy                    |
| `accent`     | `#006b4d` | `#72d3ad` | Links, focus, deliberate emphasis |
| `rule`       | `#d4cec2` | `#38423c` | Hairlines and editorial structure |

Six `--color-chapter-N` tokens give each Patterns chapter its own accent. The
light theme rebinds each one to a darker same-hue variant so chapter text stays
at least WCAG AA against both the page and surface tokens. This is the only
place the palette expands, and it expands by token, never by component literal.

**Why CSS variables and not Tailwind's dark variant:** theme switching must not
cause a layout shift or a React re-render of the tree. A class swap on
`<html>` re-resolves every variable in one paint. This is principle #3, and it
is _why_ the bootstrap script in §6.3 exists.

### 6.2 Typography

Space Grotesk is loaded from checked-in TTF files with `next/font/local`
(`app/layout.tsx`) at weights 400, 500/600, and 700, exposed as
`--font-editorial-sans` and mapped to `font-sans` in `@theme inline`. Editorial
display copy uses the `font-serif` / `font-display` system stack declared in
`app/globals.css`: Bodoni/Didot where available, then Baskerville/Iowan Old
Style/Georgia. The result is typographic contrast without a third-party font
request. This is both a performance property and a privacy/security property
consistent with CSP `font-src 'self'` (`next.config.ts`).

### 6.3 The theme bootstrap (and why it costs us a CSP control)

`app/layout.tsx:91-109` injects a blocking inline `<script>` in `<head>` that
reads `localStorage['theme-preference']` (default `light`, `system` resolved via
`matchMedia`), removes any stale theme class, and sets exactly one resolved
class on `documentElement` _before_ CSS applies. `ThemeToggle` is mounted in
the desktop and mobile header controls.
`<html suppressHydrationWarning>` covers the resulting server/client class
mismatch.

This eliminates the flash of wrong theme. It is also a direct cause of the CSP
`'unsafe-inline'` decision (§10.1): a render-blocking inline script that must
run before paint cannot be deferred or externalized without reintroducing the
flash. The two decisions are coupled; change one and you must revisit the
other.

### 6.4 Executive-editorial composition and motion

The professional shell is a restrained editorial system, not a repeated card
grid. `components/editorial/EditorialHomepage.tsx` establishes the composition:
large serif thesis, small uppercase role and section labels, long horizontal
rules, asymmetric whitespace, and sparse accent use. `Header` and `Footer` use
`Dakota Smith` as the wordmark and `daksmith.dev` as a quiet domain signature.
Fine `rule` borders structure the page; heavy boxes and decorative shadows are
not a default hierarchy mechanism. Square controls and the high-contrast MDX
code treatment remain where they serve function, but the older raw/brutalist
aesthetic is not the product direction.

Code blocks retain line numbers, highlight ranges, and `+/-` diff markers
driven by `data-` attributes from `rehype-pretty-code` (`app/globals.css`). A
single deep-forest code plate serves both reading themes; bone, stone, muted
sage, and antique-brass tokens replace the retired neon syntax palette. The MDX
code renderer distinguishes fenced code from inline prose and forwards Shiki's
language, theme, line-number, and highlight attributes. CSS still reasserts the
fenced-code foreground as the development and unscoped-token fallback.

Motion is governed globally by `<MotionConfig reducedMotion="user">`
(`app/layout.tsx:133`). This is the _mechanism_ behind every "respects
`prefers-reduced-motion`" claim — Framer Motion reads the OS setting at the
provider, so individual components do not each re-implement the check. New
animation goes through Framer Motion so it inherits this for free; bespoke CSS
keyframe animation must add its own `@media (prefers-reduced-motion)` guard.
Primary content renders in its visible state (`initial={false}`); reveal and
page motion are progressive enhancement, never a prerequisite for reading SSG
HTML when hydration or an intersection observer fails.

---

## 7. Component architecture

Components are grouped by domain under `components/` (`editorial/`, `ui/`,
`layout/`, `blog/`, `home/`, `patterns/`, `learn/`, `toolkit/`, `work/`,
`seo/`) with a barrel `index.ts` where the domain exposes one.

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
_base_ `mdxComponents` map (`components/blog/MdxComponents.tsx`), so they are
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
- **`optimizePackageImports: ['framer-motion']`** (`next.config.ts:77`) —
  tree-shakes the one heavy UI dependency to its used surface.
- **Image policy** (`next.config.ts:81-91`) — deterministic 3:2 thumbnails and
  16:9 heroes are checked in; AVIF then WebP plus an explicit
  `deviceSizes`/`imageSizes` ladder so `next/image` emits a tight `srcset`;
  remote images restricted to `images.unsplash.com`.
- **`removeConsole` in production** (`next.config.ts:95`) — strips logging
  weight and noise from shipped JS.
- **Font self-hosting** (§6.2) — no third-party round trip, `swap` avoids
  invisible text.
- **Lazy Shiki** (§5.2) — the heaviest content dependency is dynamically
  imported and prod-only.
- **Conditional analytics** — `<Analytics />` / `<SpeedInsights />` render only
  when `NEXT_PUBLIC_VERCEL_ENV` is set (`app/layout.tsx:142-143`), so they cost
  nothing in local/preview-less contexts.
- **Split asset caching** (§3.3) — immutable only when filenames are
  fingerprinted; replaceable editorial images revalidate.

**Known characteristic, not a bug:** `getAllPosts()` and peers re-read and
re-parse the filesystem on every call with no memoization (`lib/posts.ts:119`).
At build time, with 114 documents, this is irrelevant. It is a documented
scaling cliff: at thousands of documents, add a build-scoped cache. Don't
pre-optimize it now.

---

## 9. Accessibility

100 is a merge gate (§12), so a11y is enforced, not reviewed. The mechanisms:

- **Skip link** — `app/layout.tsx:126-130`, `sr-only` until focused, jumps to
  `#main-content` (`app/layout.tsx:135`).
- **Reduced motion** — globally via `MotionConfig` (§6.4), not per-component.
- **Focus visibility** — high-contrast `accent` focus rings with a background
  offset remain visible in both themes without changing layout.
- **Contrast** — both the warm-ivory and dark palettes are built for it, and
  `color-contrast` is asserted at `1.0` in CI (`lighthouserc.json:30`).
- **Semantics & labels** — single `<main id="main-content">`, `<html lang>`;
  `button-name`, `image-alt`, `link-name`, `aria-prohibited-attr`,
  `label-content-name-mismatch` each asserted at `1.0`
  (`lighthouserc.json:31-38`).

The principle: a11y regressions fail the build. If you add an icon button
without a name, CI stops you — that is the design, and it is why the audit list
in `lighthouserc.json` is specific rather than just `categories:accessibility`.

---

## 10. Security architecture

The implemented architecture treats the trust surface as a deliverable. The
controls and, more importantly, the _reasoning_ are in `next.config.ts` and
`pnpm-workspace.yaml` so they are reviewed alongside the code they protect.

### 10.1 Content-Security-Policy

Defined in `next.config.ts:42-63`. The shape:

- Locked down: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `frame-ancestors 'self'`, `font-src 'self'`,
  `upgrade-insecure-requests`.
- Narrowly opened: `script-src` adds only `va.vercel-scripts.com` and
  `giscus.app`; `connect-src` only Vercel analytics/insights; `frame-src` only
  `giscus.app`; `img-src` only `self`, `data:`, Unsplash.
- Dev-only: `'unsafe-eval'` and `ws:` are appended _only_ when not production
  (`next.config.ts:48-58`) for HMR — they never ship.
- Vercel-only: `upgrade-insecure-requests` (and HSTS, §10.2) are emitted only
  when `VERCEL=1` — behind Vercel's TLS they're correct; from a local
  `pnpm start` on plain HTTP they upgrade every asset to `https://` and HSTS-pin
  `localhost` in the browser for two years, breaking local prod-server testing.

**The accepted weakness, documented at the weakness:** `script-src` includes
`'unsafe-inline'`. The rationale is in the file comment (`next.config.ts:8-17`):
a strict nonce-based policy requires per-request middleware, which forces
dynamic rendering and breaks the SSG performance budget — and the theme
bootstrap (§6.3) is exactly such a required inline script. The decision: accept
`'unsafe-inline'` for scripts, then make it as close to harmless as possible by
eliminating every _other_ injection vector (no external script origins beyond
two, no `eval`, no `object`, no `base` hijack, no form exfil). The revisit
condition: if this site ever gains a server/middleware tier, move to nonces.

`X-XSS-Protection` is **intentionally omitted** — see `next.config.ts:148-150`.
The legacy auditor is deprecated, disabled in modern browsers, and can itself
introduce cross-site leaks; CSP supersedes it. This is documented so a future
security scanner's "missing header" finding doesn't get it re-added.

### 10.2 Transport and isolation headers

All from `next.config.ts:125-173`: HSTS `max-age=63072000; includeSubDomains;
preload` (2y, Vercel-only — see §10.1), `X-Content-Type-Options: nosniff`, `X-Frame-Options:
SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Cross-Origin-Opener-Policy: same-origin`, `X-Permitted-Cross-Domain-Policies:
none`, `Permissions-Policy` denying camera/mic/geolocation/`browsing-topics`/
`interest-cohort` (the last two also opt out of ad-tech surveillance APIs).
`poweredByHeader: false` (`next.config.ts:72`) removes the framework fingerprint.

### 10.3 Supply chain

`pnpm-workspace.yaml` encodes a defense against the publish-then-yank worm
class, in a form understood by the project-pinned pnpm 10 runtime and newer
pnpm launchers:

- `minimumReleaseAge: 4320` — refuse dependency versions younger than 3 days,
  reducing exposure to short-lived malicious releases.
- `verifyDepsBeforeRun: warn` — flag `node_modules`/lockfile drift before
  scripts run.
- Lifecycle scripts are blocked unless `allowBuilds` explicitly approves the
  package (`esbuild`, `sharp`, and `unrs-resolver`). Keep that map minimal.
- `overrides` keep vulnerable transitive `js-yaml`, `postcss`, and `sharp`
  ranges on patched versions in the same workspace file.

`.npmrc` contains only the non-security `fund=false` noise preference. Frozen
lockfile installs remain a CI and Vercel command-level control.

CI reinforces it (§12): every workflow runs `pnpm install --frozen-lockfile`,
Node is pinned by `.nvmrc` (single source), pnpm is pinned via `packageManager`
(`package.json:38`), and **every GitHub Action is pinned to a commit SHA**, not
a tag (`.github/workflows/ci.yml:23,26,27` etc.) — a moved tag cannot inject code. Workflows
declare `permissions: contents: read` at the top and widen to
`pull-requests: write` only on the one job that comments
(`.github/workflows/lighthouse.yml:21-23`). Least privilege, by default, per workflow.

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
  segment that defines it (the root `page.tsx`), so child pages return a _bare_
  title — a pre-suffixed string double-suffixes. Home and every `/blog` route
  set `alternates.canonical`, matching the Learn routes.
- **Static default OG** — root OpenGraph and Twitter metadata reference the
  checked-in `public/og-default.png` (1200×630). Regenerate it with
  `pnpm generate:og` after changing the identity, role, thesis, or palette.
  Keeping the artifact static preserves the SSG-only contract and makes social
  preview output reviewable in the same change as its generator.
- **Structured data** — `lib/schema.ts` generators rendered through
  `components/seo/JsonLd`; `lib/json-ld.ts` escapes `<`, `>`, `&`, and Unicode
  line separators before placing JSON in a script element. Every page type has
  a matching schema (BlogPosting,
  TechArticle for patterns, BreadcrumbList, Person, CollectionPage incl. the
  `/learn` hub, `WebSite` with a `SearchAction`). Author is a `Person` whose
  `url` is the on-site `/about` page with off-site profiles in `sameAs`;
  Article-class `publisher` is the `Organization` (Twofold) carrying a logo
  (`app/twofold-logo` ImageObject), not the author Person. Breadcrumb schema is
  what earns rich results, so it is not optional on nested pages.
- **Sitemap** — `app/sitemap.ts` enumerates blog, every Learn leaf (including
  Toolkit capability lenses, all three product views, and Start
  explainers/demos), and tag pages with tiered priorities. It reads the same
  published-only loaders as the pages.
- **Search** — `lib/search/index-generator.ts` normalizes those same published
  leaf loaders into records that own their canonical `href`; the client never
  reconstructs nested routes from a slug. Decoder terms are the one synthetic
  source because their anchors render from client-safe glossary data rather
  than MDX. Collection pages are excluded to prevent duplicate results.
- **robots / RSS / llms.txt** — `app/robots.ts` allows `/`, disallows `/api/`
  (no legacy `Host` directive); `/components-demo` is crawlable but emits a
  route-level `noindex, nofollow` directive so crawlers can observe the control.
  `app/feed.xml/route.ts`
  serves RSS (linked from `<head>`), `export const dynamic = 'force-static'` so
  it prerenders as a static asset like its sibling endpoints. `lib/rss.ts`
  emits RSS 2.0 with full-text `content:encoded` (MDX → HTML via a
  remark/rehype pipeline, relative URLs absolutised), per-item `media:content`/
  `media:thumbnail` images, `dc:creator` author names, and content-derived
  (deterministic) build timestamps; `app/llms.txt/route.ts` serves a curated
  AI-agent site map (llmstxt.org) built from the same `lib/` loaders.

SEO `1.0` is a merge gate (§12), which is why these are wired to the data
layer rather than hand-maintained.

---

## 12. Quality gates — what actually blocks a merge

CI runs on every PR to `main`. These are the real gates, not guidelines:

**`ci.yml`** — four jobs; `build` depends on `typecheck`, `lint`, and `test`
passing first:

- `pnpm typecheck` — strict application and script TypeScript, zero errors.
- `pnpm lint` — ESLint 9, zero errors.
- `pnpm validate:toolkit` + `pnpm test` — fail-closed Toolkit registry/content
  validation plus focused behavior tests.
- `pnpm build` — production build must succeed, with `.next/cache` keyed on
  lockfile + source hash.

**`lighthouse.yml`** — the blocking Lighthouse CI job builds, then audits home,
blog index, the latest blog detail, About, Work, Learn, Patterns, Toolkit, and
Harness 3× each (`lighthouserc.json`). It posts one representative run per URL
to the PR, preserves the complete reports as workflow artifacts, and **fails**
on:

- Accessibility, Best Practices, SEO < `1.0` on the pessimistic aggregation —
  one failing run blocks the merge.
- Performance < `0.90` on the representative median run.
- Specific a11y audits < `1.0` on any run (§9).

A separate non-blocking desktop job pins the current Lighthouse `13.4.1`
package and captures HTML and JSON diagnostics for home, blog, Patterns,
Toolkit, and Work. This is the forward-looking Performance Insights and
Agentic Browsing path. It remains advisory because the SHA-pinned Lighthouse CI
action currently bundles Lighthouse `12.6.1`; forcing a different major through
its dependency tree would create an unqualified merge gate. The two report sets
are named and stored separately.

**`content-check.yml`** — on content- and Toolkit-path PRs only: runs content,
Toolkit evidence, and image validation and **fails if average content score <
80**. The report is uploaded as a workflow artifact; a separate least-privilege
job downloads that evidence and publishes the PR comment. Untrusted validation
output is treated as data rather than interpolated into executable workflow
script.

**One asymmetry to understand before you trust the green check:** the merge
gate and the current-engine diagnostic intentionally run different Lighthouse
majors. A green blocking job proves the pinned `12.6.1` contract; it does not
prove that every new Lighthouse 13 Insight is clean. The advisory artifact is
the evidence for those newer diagnostics until Lighthouse CI officially
supports the same major or the project deliberately owns a replacement runner.

---

## 13. Decision ledger

The load-bearing decisions, with the alternative we rejected and the condition
that should make us revisit. Detail is in the cited section.

| #   | Decision                                                                                                 | Rejected alternative                             | Revisit when                                                                                             | §        |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------- |
| 1   | SSG only, no middleware                                                                                  | SSR/ISR for freshness                            | A real backend appears                                                                                   | 3        |
| 2   | CSP allows `script-src 'unsafe-inline'`                                                                  | Nonce-based strict CSP                           | A server/middleware tier exists                                                                          | 10.1     |
| 3   | Omit `X-XSS-Protection`                                                                                  | Keep legacy header                               | Never (CSP supersedes); documented to prevent re-adding                                                  | 10.1     |
| 4   | Tailwind v4 CSS-first, tokens as CSS vars                                                                | `tailwind.config.ts` + dark variant              | Tokens outgrow CSS-var theming                                                                           | 6        |
| 5   | Dev = no Shiki, prod = Shiki                                                                             | Highlight in dev too                             | HMR cost stops mattering                                                                                 | 5.2      |
| 6   | Blocking inline theme script in `<head>`                                                                 | Defer / accept theme flash                       | Coupled to #2 — revisit together                                                                         | 6.3      |
| 7   | 3-day dependency cooldown + SHA-pinned actions + frozen lockfile                                         | Trust latest, tag-pinned actions                 | Threat model changes                                                                                     | 10.3     |
| 8   | Four pillars + boundary statements + colocated routing invariants                                        | Free-form sections                               | Adding a pillar (must ship a boundary)                                                                   | 4        |
| 9   | Filesystem content, no CMS, no memoization                                                               | Database/CMS, or cached reads                    | Thousands of docs, or non-git authoring                                                                  | 5, 8     |
| 10  | Perf gate `0.90` on median run; correctness gates pessimistic `1.0`                                      | Best-run aggregation for all categories          | Runner variance makes the median gate materially flaky                                                   | 12       |
| 11  | Runnable code embeds (Codapi) opt-in, OFF by default behind `NEXT_PUBLIC_ENABLE_CODAPI`                  | Ship runnable by default                         | The CSP relaxation (wasm-unsafe-eval + unpkg origin) is accepted and Lighthouse re-verified              | 10.1, 14 |
| 12  | `robots.txt` explicitly _welcomes_ major AI crawlers (per-agent rules)                                   | Wildcard-only, or block AI bots                  | A crawler abuses access, or citation policy changes (flip its entry to `disallow`)                       | 11       |
| 13  | `/quality-gate`: enforced prose-rubric gate + human sign-off, "gates over trust"                         | Trust the mechanical score alone                 | LLM-as-judge proves unreliable enough to drop, or a deterministic prose check replaces it                | —        |
| 14  | Executive-editorial visual system; warm-ivory light theme is default                                     | Preserve dark neo-brutal grid                    | Repeated user feedback or measured readability/accessibility evidence shows the direction weakens trust  | 6        |
| 15  | `Dakota Smith` wordmark, `daksmith.dev` signature, `AI Systems Architect & Full-Stack Engineer` position | `DAK`, `dak.dev`, or aspirational-title branding | Dakota's legal/public identity or held role changes                                                      | 0, 1, 6  |
| 16  | Toolkit taxonomy is capability-first; product routes project one dated evidence model                    | Separate Claude/Codex/Copilot trees              | Product capabilities stop mapping to durable shared problems                                             | 4        |
| 17  | Checked-in static `public/og-default.png`; no dynamic OG route                                           | Request-time `ImageResponse` route               | Per-page generated social art creates value worth adding a rendering tier                                | 3, 11    |
| 18  | Versioned deterministic raster art for every post                                                        | Manual or stochastic per-post image creation     | The publication adopts photography or commissioned source masters that need a different provenance model | 5.4, 8   |

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
- **The Lighthouse merge gate trails the advisory engine by one major.** This
  preserves a qualified blocking dependency tree, but a green gate does not
  imply clean Lighthouse 13 Insights or Agentic Browsing diagnostics. Review
  the advisory artifact and converge the versions when Lighthouse CI supports
  the same major (§12).
- **Unmemoized filesystem reads** are an O(documents) build-time cost with no
  cache (§8). Fine now; a documented cliff later.
- **`reactStrictMode` double-invokes effects in dev** (`next.config.ts:69`) —
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
- **Most four-pillar boundaries remain prose contracts.** The Toolkit is now
  fail-closed on product, source, coverage, frontmatter, and 9 × 5 page
  completeness, but the other pillar boundary statements and flat-only routing
  invariants still depend on review discipline plus colocated comments (§4).
  Candidate future work: a unit test asserting every pillar exports a non-empty
  boundary constant and that flat pillars have no two-segment routes.
- **Toolkit currency is documentation currency, not product conformance.** The
  registry is source-backed and dated 2026-08-01, but vendors can change a
  surface after review and none of the current claims are runtime-observed.
  Re-run source review, update `reviewedAt`/`accessedAt`, and execute
  `pnpm validate:toolkit` whenever product coverage changes.
- **Procedural editorial art trades infinite variation for reproducibility.**
  Eight motifs and four variants provide a bounded visual language, not a
  unique commissioned illustration for every essay. Expand the versioned motif
  vocabulary—or adopt provenance-tracked source masters—before repetition
  becomes more visible than cohesion.

---

## 15. Conventions for contributors

- New interactive UI: extract a small Client leaf; keep the page a Server
  Component (§7).
- New color: add a CSS variable in `app/globals.css` and map it in
  `@theme inline`. Never a literal in a component (§6.1).
- New visual composition: preserve the executive-editorial hierarchy — serif
  display type, fine rules, generous negative space, and sparse accent. Do not
  reintroduce a repeated card grid or hobby-dashboard aesthetic (§6.4).
- New animation: Framer Motion (inherits reduced-motion); bespoke keyframes
  must add their own `prefers-reduced-motion` guard (§6.4).
- New Learn pillar: ship a `*-types.ts` (client-safe), a `*.ts` loader (owns
  `fs`), a boundary statement, and a colocated comment for any routing
  invariant (§4).
- Toolkit product claim: cite an official source, state exact surfaces, retain
  the documented/observed basis, update review dates, and run
  `pnpm validate:toolkit` (§4, §12).
- New external origin (script/style/img/connect/frame): it must be added to the
  CSP in `next.config.ts` _with a comment saying why_, or it will be blocked in
  production — by design (§10.1).
- Accept a weaker security control only with a comment at the weakness stating
  the alternative and the revisit condition (principle #6).
- Before merging MDX/content changes: `pnpm build` locally (§5.2, §14).

---

_This document describes the system as built. If you change the system, change
this document in the same PR. Anchors are `path:line` — keep them honest._
