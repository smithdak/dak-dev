# Content Operations

> Orientation for content, brand-voice, and SEO work. The **data** lives in
> `.content/` — this file routes you to it; it does not restate it.

Read this when writing, reviewing, planning, or optimizing content. For the
engineering of the MDX pipeline, see `DESIGN.md` §5.

---

## Sources of truth (do not duplicate these)

| Concern | Canonical file |
|---|---|
| Brand voice & style | `.content/brand/voice.md` |
| Machine-readable validation rules | `.content/brand/guidelines.json` |
| Post templates (general / tutorial / project / pattern) | `.content/templates/*.template` |
| Content pipeline & idea backlog | `.content/calendar/content-plan.json` |
| SEO strategy, keywords, clusters, gaps | `.content/seo/strategy.json` |
| Internal-linking strategy & opportunities | `.content/linking-strategy.md`, `.content/internal-linking-opportunities.md` |
| Patterns content strategy | `.content/patterns/strategy.md` |
| Latest validation results | `.content/validation-report.json` |

If a rule (e.g. excerpt length, heading count) is needed, read
`.content/brand/guidelines.json` — it is the authority, and it can change
without this file changing.

## Skills (the procedural layer)

| Skill | Use when |
|---|---|
| `/write-post` | Creating a post — brand-consistent scaffold from a template |
| `/review-post` | Pre-publish review for brand consistency, quality, SEO |
| `/brand-check` | Quick brand-voice check on arbitrary text |
| `/content-calendar` | View/manage the pipeline and idea backlog |
| `/content-strategist` | Keyword research, gap analysis, topic clusters, SEO audit |

## Workflow

```
idea ──► outlined ──► drafting ──► review ──► ready ──► published
  │          │            │           │          │
  │          │            │           │          └─ set published: true, push (auto-deploys)
  │          │            │           └─ /review-post, fix issues
  │          │            └─ /write-post, create the MDX
  │          └─ add the outline to calendar notes
  └─ add the idea via /content-calendar
```

SEO sequence, before and around drafting:

```
/content-strategist keywords <topic>  → research
/content-strategist gaps              → find opportunities
/content-strategist cluster <topic>   → plan topic authority
/content-strategist audit <slug>      → audit before publish
/content-strategist compete <topic>   → competitive analysis
```

Integration: `/content-strategist` → `/content-calendar` → `/write-post` →
`/review-post`.

## Validation

```bash
pnpm validate:content       # published posts
pnpm validate:content:all   # includes drafts
pnpm images:validate        # post imagery
```

CI runs these on content PRs and **fails if the average content score is below
80** (`.github/workflows/content-check.yml`). Thresholds themselves live in
`.content/brand/guidelines.json`.

## Authoring constraints (engineering)

- Posts are `.mdx` in `content/posts/`; frontmatter is typed by
  `PostFrontmatter` in `lib/posts.ts`. `published: false` is excluded from
  builds.
- **Run `pnpm build` before considering content done.** Syntax highlighting
  (Shiki) is production-only; `pnpm dev` will not surface MDX rendering errors.
  Rationale: `DESIGN.md` §5.2.
- The four-pillar Learn corpus (Patterns / Toolkit / Harness / Security) has its
  own loaders and information-architecture rules — see `DESIGN.md` §4 before
  adding or restructuring a pillar.
