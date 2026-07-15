# /dak

Your single entry point for working on this site. `/dak` orients, routes your
request to the right skill / subagent / workflow, enforces the hard constraints,
and fans work out to the team when the job is bigger than one context.

## Usage

```
/dak <anything>              # Triage the request, route it, execute (default)
/dak                         # No args → orient: git state + highest-value next move
/dak plan <goal>             # Design-first: produce a plan before touching code
/dak ship <change>           # Execute → build → quality-gate → verify → commit → PR → watch CI
/dak review [target]         # Route to the right review (code / post / security / product)
/dak fan <big task>          # Orchestrate a multi-agent workflow over a work-list
/dak rollback                # Prod broken → revert fast (Vercel promote-previous / git revert)
/dak team                    # Print the roster (skills + subagents)
```

## Description

`/dak` is the foreman. `/product-owner` decides **what** to build and **whether**
it's worth it; `/dak` decides **how to execute it and who does the work**, then
makes sure it ships without breaking a budget. It owns no domain of its own — it
routes to the specialist that does, enforces the guardrails on every path, and
escalates to subagents or a workflow when the task outgrows a single context.

## Prime directives

1. **Route, don't sprawl.** Every request maps to an owner — a specialist skill,
   a subagent, a workflow, or a direct edit. Pick the smallest tool that fits.
2. **When the request maps to no row, is ambiguous, or is a symptom not a task —
   don't force-fit a skill.** Ask one sharp clarifying question, or default to a
   read-only `Explore` / `improve` pass to gather context first, then route. If a
   capability might exist but you don't recognize it, run `find-skills` before
   deciding it's unsupported.
3. **Guard the budgets on every path** (see *Hard constraints*). A change that
   trades a budget for a nice-to-have gets sent back, not shipped.
4. **Ground every move in an artifact.** Cite the file, the diff, the budget
   number, the `DESIGN.md` §. No hedging — this repo's brand voice bans it.
5. **Stay in the loop on big jobs.** Fan out to gather and verify, then decide.
   Never merge a subagent's finding unread.

## Step 0 — Orient

- **Read the spine:** `CLAUDE.md` (constraints + the skill/knowledge map). Pull
  the relevant Tier-1 doc for the task area (see *Knowledge map*).
- **Check reality:** `git status`, current branch, open PRs (`gh pr list`).
- **Classify** the request into one row of the Routing table, then act.

## Routing table

| You want to… | Route to | Why |
|---|---|---|
| Draft a new blog post *(posts only)* | `/write-post` | Brand-voice + anti-slop scaffold into `content/posts/`; iterates to score ≥ 80 |
| Add / edit a **Learn** pillar page (Patterns · Toolkit · Harness · Security) or on-ramp | Direct MDX under `content/<pillar>/` + its `lib/<pillar>.ts` loader; `Plan` subagent for a *new* pillar; `/frontend-design` for the route UI | Structural Learn content, not a blog post — `DESIGN.md` §4. `/write-post` is posts-only |
| Score / fix one existing post | `/review-post` | Weighted pre-publish check (frontmatter, structure, voice, SEO, images) |
| Quick voice check on a snippet | `/brand-check` | Fast brand-voice pass on arbitrary text |
| SEO, keywords, gaps, clusters, brand scan, batch ideas → drafts | `/content-strategist` | `keywords`/`gaps`/`cluster`/`audit`/`compete`/`scan` |
| Manage the pipeline / backlog | `/content-calendar` | Idea backlog, stage transitions, priority |
| Certify a drafted post for publish | `/quality-gate` | Wraps `/review-post` as Gate 1; adds voice + prose + human sign-off → promotes `review` → `ready` |
| UI / component / visual change | `/frontend-design` | Neo-brutalist design system + token/motion/a11y discipline |
| "Should we build this / what's next?" | `/product-owner` | Opinionated verdict + roadmap (`review`/`vision`/`roadmap`/`tech`/`decide`) |
| A build / CI check or Lighthouse budget is **red** | Reproduce with the same gate locally (`pnpm build` · `pnpm exec tsc --noEmit` · `pnpm lint` · `pnpm validate:content`), then route the fix; `Explore` if it spans files | `DESIGN.md` §12 gates · §8 perf · §9 a11y · §11 SEO |
| Add / bump / remove a dependency | Direct `pnpm` edit (never npm/yarn); mind the `.npmrc` 3-day cooldown + `onlyBuiltDependencies`; then build + tsc + lint; `/security-review` if supply-chain surface changes | Cooldown + hardening are load-bearing (`DESIGN.md` §10) |
| Find bugs in the current diff | `/code-review` | Correctness review of working changes |
| Tidy the diff (reuse/simplify/perf) | `/simplify` | Quality cleanup, no bug-hunting |
| Security review of pending changes | `/security-review` | Threat check before shipping |
| Confirm a change works | `/verify` / `/run` | Drives the real app, observes behavior |
| Deep multi-source external research | `/deep-research` | Fan-out web research + cited synthesis |
| Audit the codebase / "where next" | `improve` skill | Read-only senior audit → handoff plans |
| Claude Code / Agent SDK / API question | `docs/research/*-expert-reference.md` + `claude-code-guide` subagent; `claude-api` skill for API/SDK | Repo-local harness truth first |
| Review a GitHub PR by number | `/review` | PR-level review |
| Deploy / logs / rollback | `vercel:deploy` · `vercel:logs`; rollback via *Watch & recover* | Ship + diagnose production |

If a request spans several rows, **decompose it** and route each part.

## Skill subcommands (the multi-mode ones)

```
/product-owner            health verdict · review <change> · vision · roadmap · tech · decide <q>
/content-strategist       <ideas…> (batch) · keywords <t> · gaps · cluster <t> · audit <slug> · compete <t> · scan [--posts|--components]
/content-calendar         (overview) · add <title> · status <id> <stage> · priority <id> <p>
/write-post               <topic> [--type general|tutorial|project] [--from-calendar <id>]
/review-post · /quality-gate · /brand-check    <slug> / <slug> / <text>
```

## The content pipeline

The content skills are stages of one pipeline — route to the stage, not a random skill:

```
idea            → /content-calendar add
SEO research    → /content-strategist keywords|gaps|cluster|compete
outline         → /content-calendar (status → outlined)
draft           → /write-post   (scaffolds MDX into content/posts/<slug>.mdx)
review          → /review-post   (+ /brand-check for ad-hoc voice checks)
certify (gate)  → /quality-gate <slug>  → mechanical + voice + prose + human sign-off → status: ready
pre-publish     → /content-strategist audit <slug>
publish         → set frontmatter published: true → push → Vercel auto-deploys
```

`published: false` is excluded from builds. CI runs `pnpm validate:content` on
content PRs and **fails if the average content score < 80**
(`content-check.yml`). `.content/` is the source of truth — never restate its rules.

**Learn content is a separate system.** A pillar (Patterns · Toolkit · Harness ·
Security) is structural, not a blog post:

- **New chapter in an existing pillar** → author the MDX under `content/<pillar>/`
  and register it in that pillar's `lib/<pillar>-types.ts` ordering.
- **New pillar** → ship a client-safe `*-types.ts`, a server `*.ts` loader that
  owns the `fs` reads, a boundary statement, and a colocated routing-invariant
  comment (`DESIGN.md` §4). Route the design through a `Plan` subagent first.

## When to fan out

Direct edit is the default. Escalate only when the shape of the work calls for it:

| Signal | Tool | Use |
|---|---|---|
| Answering means sweeping many files; you want the conclusion, not the dumps | `Explore` subagent | Broad read-only search |
| A structural change needs a strategy before code | `Plan` subagent | Step-by-step plan + critical files |
| Independent chunks that can run at once | `general-purpose` subagents (parallel) | One per chunk |
| A work-list to pipeline, findings to adversarially verify, or multi-phase understand→build→review | **Workflow** | Deterministic fan-out; verify each finding |
| A Claude Code / Agent SDK / API mechanics question | `claude-code-guide` subagent | Harness / SDK / API |

### How to fan out (the mechanism)

- **Launch** subagents with the **Task tool**, `subagent_type` = `Explore` /
  `Plan` / `general-purpose` / `claude-code-guide`.
- **Parallelize** by issuing all Task calls **in a single message** — they run
  concurrently; separate messages run serially.
- **Brief each agent self-contained** — it inherits none of your context. One
  paragraph: the goal, the constraints it must respect (link the `CLAUDE.md` /
  `DESIGN.md` § that binds it), and the exact shape of the answer to return.
- **For deterministic multi-stage fan-out** (pipeline over N items, or
  find → adversarially verify → synthesize) author a **Workflow** instead.
- **Reconcile and verify** results before deciding. A finding is a claim until
  checked against the code.

## The execution loop

```
Orient → Route → (Plan if structural) → Implement →
pnpm build → Quality gate → Verify → Commit (Conventional) → PR → Watch & recover
```

| Stage | Owner |
|---|---|
| Plan (structural only) | `Plan` subagent, or `/dak plan` |
| Implement | direct edits, or the routed specialist skill |
| Build | `pnpm build` — **mandatory** before claiming MDX/content done (Shiki is prod-only; `pnpm dev` hides render errors) |
| Quality gate — **code** | `/code-review` → `/simplify` → `/security-review` (if inputs/headers/origins changed); `pnpm lint`, `pnpm exec tsc --noEmit` |
| Quality gate — **content** | `/review-post` → `/quality-gate <slug>`; `pnpm validate:content` |
| Verify | `/verify` or `/run` |
| Commit | Conventional Commits (`feat:` / `fix:` / `docs:`), branch off `main` |
| Ship | open a PR; update `DESIGN.md` in the **same PR** if architecture moved |

### What blocks a merge

The CI gates (`DESIGN.md` §12):

- **`ci.yml`** — `tsc --noEmit`, `pnpm lint`, `pnpm build`.
- **`lighthouse.yml`** — A11y / Best-Practices / SEO = **100**, Performance ≥ **90** on `/`, `/blog`, `/about`.
- **`content-check.yml`** *(content PRs)* — average content score ≥ **80**.

### Watch & recover

- **Confirm green:** `gh pr checks <n>` (or `gh run watch`) after pushing.
- **On red:** read the failing run, map it back to the gate (build/lint/tsc →
  fix the code; Lighthouse a11y/SEO/perf → route to `/frontend-design` or the SEO
  owner; content-check < 80 → `/review-post`), fix, re-push.
- **Prod broken after deploy:** fast path is a Vercel instant rollback (promote
  the previous deployment); durable fix is `git revert <sha>` + push. Pull logs
  with `vercel:logs`.

## Hard constraints

Enforced on every path. Full list: `CLAUDE.md` → *Hard constraints*. The
highest-violation ones:

- **`pnpm` only** (pinned `pnpm@10.33.4`), Node `>=22.22.2`. Never `npm`/`yarn`.
- **`pnpm build` before "done"** on any MDX/content work.
- **SSG-only** — no server, no `middleware.ts`, no dynamic rendering (`DESIGN.md` §3).
- **Extend a CSS-variable token** in `app/globals.css`; never hardcode a color.
- **New external origin** ⇒ a **commented** CSP edit in `next.config.ts` (`DESIGN.md` §10).

**Sharp edges** (see `DESIGN.md`): §10.1 don't re-add `X-XSS-Protection` ·
§11 absolute URLs only from `SITE_URL` (`lib/site.ts`) · §7 explorable-island
props are single-quoted JSON string literals · §4 new-pillar checklist ·
`.npmrc` 3-day dependency cooldown.

## Knowledge map

| Tier | File(s) | Read when |
|---|---|---|
| 0 — Spine | `CLAUDE.md` | Every session; constraints + the map |
| 1 — Architecture | `DESIGN.md` | Any structural change (section pointers below) |
| 1 — Doc map | `docs/README.md` | Where new knowledge belongs |
| 1 — Content ops | `docs/content-ops.md` | Content / brand-voice / SEO work |
| 1 — UI workflow | `docs/ui-workflow.md` | UI work + the Pencil.dev MCP flow |
| 1 — History | `docs/project-history.md` | Original plan, epics, past decisions |
| 1 — Harness refs | `docs/research/*-expert-reference.md` | Configuring Claude Code mechanics |
| 1 — Prior plans | `docs/plans/*` | Per-feature design/plan history |
| Data (SoT) | `.content/{brand,seo,calendar,templates}/*` | Voice, SEO strategy, pipeline, templates |

**`DESIGN.md` section pointers:** §3 SSG rendering · §4 four-pillar Learn IA ·
§5 MDX pipeline (dev/prod Shiki split) · §6 design system & tokens · §7
server/client split & islands · §8 performance budget · §9 accessibility · §10
security/CSP/supply-chain · §11 SEO & metadata · §12 quality gates · §13 decision
ledger · §15 contributor conventions.

## The team

Output of `/dak team` — everything in the Routing table, grouped:

- **Content:** `/write-post` · `/review-post` · `/brand-check` · `/content-calendar` · `/content-strategist` · `/quality-gate`
- **Product & code quality:** `/product-owner` · `/code-review` · `/simplify` · `/security-review` · `/verify` · `/run`
- **Design:** `/frontend-design`
- **Research & audit:** `/deep-research` · `improve` · `claude-api`
- **Ship:** `vercel:deploy` · `vercel:logs` · `/review`
- **Subagents to fan out to:** `Explore` · `Plan` · `general-purpose` · `claude-code-guide`

## Examples

```
/dak write a post on Server Component data-loading patterns
  → /content-strategist keywords → /write-post → /review-post → /quality-gate → build

/dak add a Toolkit topic on subagents
  → direct MDX under content/toolkit/ + register in lib/toolkit-types.ts (DESIGN.md §4) → build

/dak the hero feels heavy on mobile
  → /frontend-design (token-safe fix) → pnpm build → /verify → Lighthouse check

/dak the build is red on main
  → reproduce (pnpm build / tsc --noEmit / lint) → route the fix → gh pr checks

/dak is it worth adding a newsletter?
  → /product-owner decide "add a newsletter?"   (verdict + reasoning, then route)

/dak find everywhere we read post frontmatter
  → Explore subagent (read-only sweep) → report call sites
```

## Related Commands

- `/product-owner` — the strategy authority `/dak` routes "should we / what next"
  questions to.
- `CLAUDE.md` / `DESIGN.md` — the constraints and architecture `/dak` enforces.
- `docs/README.md` — the full knowledge-tier system this command indexes.
