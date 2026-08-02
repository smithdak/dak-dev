# /content-strategist

Main orchestrator for autonomous content creation and SEO strategy.

## Usage

```
/content-strategist <ideas...>              # Process multiple ideas
/content-strategist keywords <topic>        # Keyword research
/content-strategist gaps                    # Find content opportunities
/content-strategist cluster <topic>         # Plan topic cluster
/content-strategist audit <slug>            # SEO audit existing post
/content-strategist compete <topic>         # Competitor analysis
/content-strategist scan                    # Scan all content for brand consistency
/content-strategist scan --posts            # Scan posts only
/content-strategist scan --components       # Scan components only
```

## Description

The content strategist is the primary entry point for autonomous content creation. It accepts multiple ideas, validates them against SEO opportunities, and orchestrates the full workflow through specialized agents.

**Key Features:**

- Accepts multiple ideas for batch processing
- Dedupes against existing content
- Matches ideas to SEO gaps for maximum impact
- Coordinates research, writing, and editing agents
- Produces posts that score 80+ without manual intervention

## Primary Mode: Multi-Idea Processing

### Invocation

```
/content-strategist "AI agents for code review" "Next.js caching deep dive" "Building CLI tools with Node.js"
```

### Workflow

```
┌─────────────────┐
│  Parse Ideas    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Dedupe Check   │ ← Check content-plan.json
└────────┬────────┘
         ↓
┌─────────────────┐
│  SEO Matching   │ ← Check strategy.json gaps
└────────┬────────┘
         ↓
┌─────────────────┐
│ Priority Order  │
└────────┬────────┘
         ↓
    For Each Idea:
┌─────────────────┐
│ Researcher Agent│ → Gather metrics, examples
└────────┬────────┘
         ↓
┌─────────────────┐
│  Writer Agent   │ → Generate content
└────────┬────────┘
         ↓
┌─────────────────┐
│  Validation     │ → Score 80+?
└────────┬────────┘
         ↓
┌─────────────────┐
│  Editor Agent   │ → Fix issues (if needed)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Update Calendar │ → Status: "review"
└────────┬────────┘
         ↓
┌─────────────────┐
│ Summary Report  │
└─────────────────┘
```

### Output

Posts stop at "review" status for final human review before publishing. The skill does NOT auto-publish.

```
Content Strategist Complete
============================================================

Processed: 3 ideas
Completed: 2
Needs Review: 1

--- Completed Posts ---

✓ AI Agents for Code Review
  /content/posts/ai-agents-code-review.mdx
  Score: 85/100 | 1,247 words | 5 sections

✓ Next.js Caching Deep Dive
  /content/posts/nextjs-caching-deep-dive.mdx
  Score: 88/100 | 1,892 words | 7 sections

--- Needs Manual Review ---

⚠ Building CLI Tools with Node.js
  /content/posts/building-cli-tools-nodejs.mdx
  Score: 76/100
  Issues: Excerpt 135 chars (need 140-160)

--- Calendar Updated ---
All posts added with status: "review"

--- Next Steps ---
1. Review posts at /content/posts/
2. Fix CLI Tools post excerpt
3. Add images to /public/images/posts/
4. Set published: true when ready
```

## Subcommands

### `keywords <topic>`

Research keywords for a topic.

```
/content-strategist keywords "Next.js performance"
```

**Output:**

```
Keyword Research: Next.js Performance
============================================================

--- Primary Keywords ---
  "next.js performance optimization" (medium difficulty)
  "next.js lighthouse score" (low difficulty)
  "next.js core web vitals" (medium difficulty)

--- Secondary Keywords ---
  "next.js image optimization"
  "next.js bundle size"
  "next.js caching strategies"
  "next.js server components performance"

--- Long-Tail Opportunities ---
  "how to improve next.js lighthouse score"
  "next.js performance best practices 2026"
  "next.js vs react performance comparison"

--- Competitor Analysis ---
  Top ranking for "next.js performance":
  1. vercel.com/docs/optimizations
  2. web.dev/performance
  3. blog.logrocket.com/...

--- Suggested Content ---
  Type: Tutorial
  Title: "Achieving Perfect Lighthouse Scores in Next.js 16"
  Primary: "next.js lighthouse score"
  Angle: Step-by-step from score 60 to 100
```

### `gaps`

Find content opportunities based on SEO strategy.

```
/content-strategist gaps
```

**Output:**

```
Content Gap Analysis
============================================================

--- High Priority Gaps ---

1. Cross-vendor agent configuration
   Keywords: Claude Code vs Codex vs Copilot, agent instructions, agent skills
   Opportunity: High-intent comparison grounded in official capability evidence
   Suggested: Capability-by-capability guide with dated source citations
   Status: Partially covered by existing posts

2. Autonomous AI Agent Patterns
   Keywords: LLM agent architecture, multi-agent systems
   Opportunity: Technical depth rare, high search intent
   Suggested: Architecture deep dive
   Status: Not covered

--- Medium Priority Gaps ---

3. Next.js 16 Migration Guide
   Keywords: next.js 16 upgrade, app router migration
   Opportunity: Time-sensitive, high utility
   Suggested: Tutorial with before/after code

--- Recommendations ---

Create content for gaps #2 and #3 to:
- Establish authority in AI agent space
- Capture time-sensitive Next.js 16 interest
```

### `cluster <topic>`

Plan a topic cluster for authority building.

```
/content-strategist cluster "AI development tools"
```

**Output:**

```
Topic Cluster: AI Development Tools
============================================================

--- Pillar Post (2000+ words) ---

Title: "The Complete Guide to AI-Powered Development in 2026"
Slug: ai-powered-development-guide
Type: Comprehensive overview linking to all cluster posts

--- Cluster Posts (800+ words each) ---

1. "Building Accountable Coding Agents Across Runtimes"
   → Links to pillar, post #2
   → Status: Published ✓

2. "Compiling Agent Configuration for Claude Code, Codex, and Copilot"
   → Links to pillar, posts #1, #3
   → Status: Published ✓

3. "How APL Built This Blog Autonomously"
   → Links to pillar, post #1
   → Status: Published ✓

4. "MCP Server Development Tutorial" [PLANNED]
   → Links to pillar, posts #1, #2
   → Status: Gap - high priority

5. "AI Code Review Integration Guide" [PLANNED]
   → Links to pillar, post #1
   → Status: Gap - medium priority

--- Internal Linking Map ---

  Pillar ←→ Post 1 ←→ Post 2
    ↓           ↓
  Post 3 ←→ Post 4 ←→ Post 5

--- Recommendations ---

1. Create pillar post to anchor cluster
2. Fill gap #4 (MCP tutorial) - high opportunity
3. Add internal links to existing posts
```

### `audit <slug>`

SEO audit of an existing post.

```
/content-strategist audit how-apl-built-this-blog
```

**Output:**

```
SEO Audit: how-apl-built-this-blog
============================================================

--- Keyword Analysis ---

Primary: "autonomous AI agent" (density: 1.2% ✓)
Secondary: "Claude Code", "OpenAI Codex", "GitHub Copilot" ✓
Missing: None

--- On-Page SEO ---

Title: 54 chars ✓ (30-70)
Excerpt: 156 chars ✓ (140-160)
Primary keyword in title: ✓
Primary keyword in first paragraph: ✓
Primary keyword in H2: ✓

--- Content Quality ---

Word Count: 1,247 ✓
Headings: 5 ✓
Code Blocks: 3 ✓
Internal Links: 1 (recommend 2-3)
External Links: 2 ✓

--- Recommendations ---

1. Add 1-2 more internal links to related posts
2. Consider adding FAQ schema for featured snippets
3. Re-verify all vendor capability claims against dated official sources

Overall SEO Score: 88/100
```

### `compete <topic>`

Analyze competitor content for a topic.

```
/content-strategist compete "coding agent configuration"
```

**Output:**

```
Competitor Analysis: Coding Agent Configuration
============================================================

--- Top Ranking Content ---

1. [Live result verified during the run]
   Strengths: Record the evidence observed
   Weaknesses: Record only defensible gaps

2. [Current official vendor documentation]
   Strengths: Authoritative capability reference
   Weaknesses: Usually organized by product rather than operating problem

--- Content Gap Opportunities ---

1. MCP server development (detailed tutorial)
2. Enterprise integration patterns
3. Performance optimization tips
4. Real production case studies with metrics

--- Differentiation Strategy ---

Our Angle: Principal-level judgment + source-backed capability evidence + accountable delivery

Winning approach:
- Include specific performance metrics (X% improvement)
- Show real production code, not toy examples
- Add architectural diagrams
- Maintain direct, confident voice
```

### `scan`

Full content scan across posts and components. Validates all content against brand guidelines.

```
/content-strategist scan              # Scan all content
/content-strategist scan --posts      # Posts only
/content-strategist scan --components # Components only
```

**Output:**

```
Full Content Scan
============================================================

Scanned: 17 files | Posts: 3 | Components: 14

=== BLOG POSTS (3) ===

1. how-apl-built-this-blog (Score: 90/100)
   ✗ Excerpt too short: 111 chars (need 140-160)
   ⚠ No conclusion section
   ⚠ Primary keyword not in first paragraph

2. building-apl-autonomous-coding-agent (Score: 90/100)
   ⚠ Code block missing language identifier

3. building-claude-marketplace-cms-analyzers (Score: 90/100)
   ✓ All checks passed

=== PAGE COMPONENTS (5) ===

1. app/about/page.tsx
   ⚠ Forbidden phrase: "leverage" in line 127

2. app/page.tsx
   ✓ All checks passed

=== LAYOUT COMPONENTS (2) ===

1. components/layout/Header.tsx
   ✓ All checks passed

2. components/layout/Footer.tsx
   ✓ All checks passed

=== ISSUE SUMMARY ===

By Category:
  3x Excerpt/description issues
  2x Forbidden phrases
  1x No conclusion section

By Severity:
  1 Errors (must fix)
  8 Warnings (should fix)

=== RECOMMENDATIONS ===

Priority 1 - Quick Fixes:
  • Run `pnpm images:generate` for deterministic post art and blur placeholders

Priority 2 - Content Updates:
  • Add conclusion section to how-apl-built-this-blog
  • Replace "leverage" with "use" in app/about/page.tsx:127

============================================================
Posts: 90 avg | Components: 98 avg | Overall Health: Good
```

**What Gets Scanned:**

| Category   | Files                                            | Content Checked                  |
| ---------- | ------------------------------------------------ | -------------------------------- |
| Blog Posts | `content/posts/*.mdx`                            | Full articles, frontmatter, SEO  |
| Pages      | `app/**/page.tsx`                                | Metadata, headings, descriptions |
| Layout     | `components/layout/*.tsx`                        | Navigation, footer text          |
| Section    | `components/home/*.tsx`, `components/blog/*.tsx` | Headlines, CTAs                  |
| UI         | `components/ui/*.tsx`                            | Button labels, card text         |

**Validation Rules Applied:**

- Forbidden phrases (hedging, filler words, corporate jargon)
- Passive voice detection
- Sentence length analysis
- Frontmatter requirements (title, excerpt, tags, keywords)
- SEO keyword placement

## Integration Points

| File                                  | Purpose                  |
| ------------------------------------- | ------------------------ |
| `.content/calendar/content-plan.json` | Pipeline tracking        |
| `.content/seo/strategy.json`          | Keywords, gaps, clusters |
| `.content/brand/guidelines.json`      | Voice validation rules   |
| `.content/templates/*.template`       | Content structures       |
| `lib/content-validation.ts`           | Validation logic         |

## Agent Coordination

| Agent        | Invoked By      | Purpose                     |
| ------------ | --------------- | --------------------------- |
| Researcher   | Multi-idea mode | Gather metrics and examples |
| Writer       | After research  | Generate content            |
| Editor       | If score < 80   | Fix validation issues       |
| Orchestrator | Internally      | Coordinate flow             |

## Anti-AI-Slop Enforcement

This skill enforces quality at multiple points:

1. **Research Gate**: Writing cannot start without specific metrics
2. **Section Validation**: Brand voice checked during writing
3. **Final Validation**: Score must reach 80+ to complete
4. **Max Iterations**: 3 fix attempts before escalation

## Related Commands

- `/write-post` - Single post creation
- `/review-post` - Validate existing post
- `/content-calendar` - View pipeline
- `/brand-check` - Quick text validation
