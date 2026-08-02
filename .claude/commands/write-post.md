# /write-post

Create a new blog post with brand voice enforcement and quality gates.

## Usage

```
/write-post <topic>                           # Interactive mode
/write-post <topic> --type tutorial           # Specify type
/write-post <topic> --from-calendar idea_001  # From calendar backlog
```

## Description

Creates a complete blog post that passes brand voice validation. Coordinates research gathering, template filling, and iterative refinement until the post scores 80+.

## Workflow

```
Topic → Research → Draft → Validate → Fix → Repeat until score ≥ 80 → Done
```

### Step 1: Gather Research

Before writing, collect:

- **Metrics**: Specific numbers (%, ms, KB, x improvement)
- **Code Examples**: Real, tested snippets
- **Facts**: Verified technical details
- **Sources**: Documentation links, benchmarks
- **Recency**: External stats/studies must be ≤6 months old at time of publication. Older data is only acceptable for historical context clearly marked as such (e.g., "Back in 2023...").

**Anti-Slop Rule:** Writing cannot start without:

- Specific metrics (generic claims like "improves performance" are rejected)
- Identified tradeoffs or limitations for the approach
- "When NOT to use" boundaries defined

### Step 2: Determine Content Type

| Type       | Template              | Use When                       |
| ---------- | --------------------- | ------------------------------ |
| `general`  | post.mdx.template     | Standard blog posts            |
| `tutorial` | tutorial.mdx.template | Step-by-step guides with code  |
| `project`  | project.mdx.template  | Project showcases with metrics |

### Step 3: Generate Frontmatter

```yaml
title: '{{Topic refined to 30-70 chars, primary keyword included}}'
date: "{{Today's date YYYY-MM-DD}}"
excerpt: '{{140-160 chars EXACTLY - action verb + learning + benefit}}'
slug: '{{url-friendly-slug}}'
tags: [{ { 2-5 relevant tags } }]
thumbnail: '/images/posts/{{slug}}/thumbnail.jpg'
hero: '/images/posts/{{slug}}/hero.jpg'
published: false
author: 'Dakota Smith'
keywords: [{ { 3-7 SEO keywords from research } }]
```

### Step 4: Fill Template

Load template from `.content/templates/` and fill each section:

**Introduction:**

- Bottom line first: lead with the key insight or result
- Context: What problem we're solving
- Promise: What the reader will learn

**Body Sections (3+ H2 headings):**

- Each section has clear heading
- Concrete explanations with metrics
- Code examples where relevant
- Validation after each section
- Tradeoffs section where applicable:
  - What could go wrong
  - When NOT to use this approach
  - The complexity cost

**Conclusion:**

- Summary paragraph
- 3-5 bullet-point takeaways
- Optional call to action

### Step 5: Validate

Run full validation:

```bash
npx tsx scripts/run-validation.ts validate <slug>
```

**Quality Gates:**

- Overall score ≥ 80
- Zero forbidden phrases
- All metrics are specific
- Excerpt is 140-160 chars exactly
- Title is 30-70 chars
- Tradeoffs/limitations addressed
- Bottom line in opening paragraph

### Step 6: Iterate (if needed)

If score < 80:

1. Review specific issues
2. Rewrite affected sections
3. Re-validate
4. Max 3 iterations before asking user for input

### Step 7: Update Calendar

Update `.content/calendar/content-plan.json`:

- If from backlog: move idea to topics with status "review"
- If new: add to topics with status "review"

## Output

Creates file at: `/content/posts/{slug}.mdx`

```
Write Post Complete
============================================================

Created: /content/posts/edge-caching-api-response-times.mdx

--- Validation Results ---
Overall Score: 85/100 ✓
Status: PASSED

--- Metrics ---
Word Count: 1,247
Headings: 5
Code Blocks: 4

--- Next Steps ---
1. Review the post at /content/posts/edge-caching-api-response-times.mdx
2. Add images to /public/images/posts/edge-caching-api-response-times/
3. Run: pnpm images:generate
4. Set published: true when ready

--- Calendar Updated ---
Added to topics as "review" status
```

## Examples

### Basic Usage

```
/write-post "Next.js caching strategies"
```

### Tutorial Type

```
/write-post "Comparing MCP support across Claude Code, Codex, and Copilot" --type tutorial
```

### From Calendar

```
/write-post --from-calendar idea_001
```

## Agent Coordination

This skill delegates to:

1. **Researcher Agent** (if needed): Gathers metrics, examples, facts via WebSearch
2. **Writer Agent**: Generates content following templates and brand voice
3. **Editor Agent**: Fixes validation issues in iterations

## Anti-AI-Slop Enforcement

### Required Before Writing

- [ ] Specific metrics gathered (not "improves performance")
- [ ] Real code examples (not generic pseudo-code)
- [ ] Verified facts with sources
- [ ] External sources are ≤6 months old (or clearly framed as historical)

### Checked During Writing

- [ ] No forbidden phrases (31+ patterns)
- [ ] Active voice (≤20% passive)
- [ ] Short sentences (≤35 words each)

### Transparency Checks

- [ ] Tradeoffs/limitations stated for technical advice
- [ ] No oversimplification phrases ("seamlessly", "effortlessly", "perfect solution", "zero overhead", "no downsides")
- [ ] "When NOT to use" boundaries included
- [ ] Real metrics from real projects (not synthetic)

### Validated After Writing

- [ ] Score ≥ 80
- [ ] Title 30-70 chars
- [ ] Excerpt 140-160 chars exactly
- [ ] 3+ H2 headings
- [ ] Conclusion with takeaways
- [ ] Bottom line in opening paragraph
- [ ] Tradeoffs/limitations addressed

## Failure Handling

**If validation fails after 3 iterations:**

```
Write Post Incomplete
============================================================

Created draft: /content/posts/edge-caching-api-response-times.mdx

Score: 72/100 (requires 80)

--- Remaining Issues ---
  ⚠ Excerpt too short: 135 chars (need 140-160)
  ⚠ Primary keyword "edge caching" not in first paragraph

--- Manual Fixes Needed ---
The draft is saved. Please:
1. Review the issues above
2. Edit the file manually
3. Run: /review-post edge-caching-api-response-times
```

## Related Commands

- `/review-post` - Validate existing posts
- `/brand-check` - Quick text validation
- `/content-calendar` - View and manage pipeline
- `/content-strategist` - SEO strategy and keywords
