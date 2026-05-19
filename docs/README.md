# Documentation System

> How knowledge is organized in this repo, and where new knowledge goes.

This project deliberately keeps `CLAUDE.md` small and pushes depth into
on-demand documents. This file is the map and the rule set for that system.

---

## The problem this solves

`CLAUDE.md` loads into the model's context on **every session** and again
after every compaction. Every token there is a token unavailable for the
actual task, and a long instruction file buries the rules that matter. The
project's own reference (`docs/research/claude-md-expert-reference.md`) records
Anthropic's guidance: **keep `CLAUDE.md` under 200 lines**, and *"the test for
every line: would removing this cause Claude to make mistakes? If not, delete
it."*

So knowledge is **tiered by how often it is needed**, and only Tier 0 is always
loaded.

## The tiers

| Tier | What | Loaded | Examples |
|------|------|--------|----------|
| **0 — Spine** | Rules/constraints needed every session; pointers to everything else | Always (survives compaction) | `CLAUDE.md` |
| **1 — Reference** | Deep knowledge read when a task touches the area | On demand, by path | `DESIGN.md`, `docs/*.md`, `.content/*` |
| **2 — Procedural** | Repeatable multi-step workflows | On demand, when invoked | `.claude/commands/*` (slash-command skills) |

**Progressive disclosure is the whole design.** `CLAUDE.md` names a document and
says *"read this when X."* The model pulls it only when X happens. Reference
docs are **never `@import`-ed** into `CLAUDE.md` — an `@import` embeds the entire
file into every session and re-creates the bloat we are removing.

## Knowledge base — the map

### Engineering
- **`DESIGN.md`** — canonical architecture reference: the "why," the decision
  ledger, the risk register. Read for any structural or architectural change.
  Anchored to `path:line`; update it in the same PR as the code it describes.

### Operating manuals (`docs/`)
- **`docs/content-ops.md`** — content, brand-voice, and SEO operating manual.
  Orients the work; defers to `.content/` for the actual data.
- **`docs/ui-workflow.md`** — the Pencil.dev MCP visual-UI workflow and the
  neo-brutalist verification checklist.
- **`docs/project-history.md`** — archived origin, the 6-epic build plan, and
  original product clarifications. History, **not** session instructions.

### Existing libraries (indexed here, not relocated)
- **`docs/research/*-expert-reference.md`** — deep references on Claude Code
  mechanics: `claude-md`, `skills`, `hooks`, `commands`, `agents`, `agent-teams`,
  `mcp-servers`, `memory-system`, `settings`. Read when configuring the harness.
- **`docs/plans/*`** — per-feature design and plan documents. Naming convention:
  `YYYY-MM-DD-<feature>-design.md` (the "what/why") and
  `YYYY-MM-DD-<feature>-plan.md` (the "how/steps"). Add new ones here; do not
  delete superseded ones — they are decision history.
- **`.content/`** — the content-operations data and **source of truth** for
  brand voice (`brand/voice.md`), machine-readable validation rules
  (`brand/guidelines.json`), templates, calendar, SEO strategy, linking
  strategy. Docs and `CLAUDE.md` point here; they never restate it.

### Procedural (skills)
- **`.claude/commands/*.md`** — slash-command skills: `/write-post`,
  `/review-post`, `/brand-check`, `/content-calendar`, `/content-strategist`,
  `/frontend-design`, `/product-owner`. Zero context cost until invoked.

## Where does new material go? (decision boundary)

From `docs/research/claude-md-expert-reference.md`: *"If an instruction applies
to every session, put it in `CLAUDE.md`. If it is a multi-step procedure or only
matters for one part of the codebase, make it a skill."* Extending that:

```
Is it a rule/constraint needed on essentially every session?
  └─ yes → CLAUDE.md (a line, concrete, mistake-preventing)
  └─ no  → Is it a repeatable multi-step procedure the agent executes?
            └─ yes → a skill in .claude/commands/
            └─ no  → Is it architecture/rationale?
                      └─ yes → DESIGN.md (+ a CLAUDE.md pointer)
                      └─ no  → an operating manual in docs/ (+ a pointer)
Is it content data (voice, rules, templates, calendar)?
  └─ always → .content/  (never duplicated into docs or CLAUDE.md)
```

**Skills vs. knowledge base, decided:** the repeatable content workflows are
*already* skills. The gap this restructure fills is **reference knowledge plus a
navigable index**, not more skills. New procedures become skills; new
explanation becomes a doc; new always-true rules become a `CLAUDE.md` line.

## Maintenance rules

1. **`CLAUDE.md` stays under 200 lines.** If it grows, something belongs in a
   Tier-1 doc.
2. **No `@import` of large docs in `CLAUDE.md`.** Reference by path with a
   "read when X" hook.
3. **`DESIGN.md` changes with the code it describes** — same PR, anchors kept
   honest.
4. **Treat docs like code.** When behavior changes, prune the stale line; a
   wrong instruction is worse than a missing one. The dead `.meta/` scaffolding
   removed in this restructure is the cautionary example (see
   `docs/project-history.md`).
5. **One source of truth.** Brand/content data lives only in `.content/`;
   architecture rationale only in `DESIGN.md`. Other files point, not copy.

---

*Entry point: start at `CLAUDE.md`; it routes here.*
