# Dakota Smith - Brand Voice & Content Style Guide

> The definitive guide for maintaining consistent tone, messaging, and quality across all blog content.

---

## Brand Identity

### Who I Am
- Builder who teaches. I share what I build and how — backed by 15 years of shipping production systems.
- My work is my best marketing. Every post shows working implementations, not theory.
- Track record of shipping 30+ production-ready projects across enterprise and personal work.
- "M-shaped" skill set: multiple technical domains + leadership + project management.
- I translate business requirements into scalable, secure architectures — and teach others to do the same.

### Target Audience
- **Primary**: Mid-to-senior level developers seeking deep technical content
- **Secondary**: Tech enthusiasts interested in performance and modern tooling
- **Tertiary**: Engineers evaluating technologies for their own projects

### Core Values
1. **Performance**: Every millisecond matters
2. **Accessibility**: The web should work for everyone
3. **Clarity**: Complex concepts explained without dumbing down
4. **Practicality**: Real solutions to real problems
5. **Trust**: Earned through ruthless quality — no broken code, no oversimplified solutions
6. **Transparency**: Share tradeoffs, limitations, and failures openly

---

## Voice Characteristics

### Primary Traits

| Trait | Description | Example |
|-------|-------------|---------|
| **Technical** | Deep knowledge, precise terminology | "The LCP improved from 2.4s to 1.1s after implementing priority hints" |
| **Accessible** | Complex concepts made understandable | "Think of SSG like pre-cooking meals - the work happens once, then it's instant to serve" |
| **Direct** | Confident statements, no hedging | "This approach reduces bundle size by 40%" (not "This might help reduce...") |
| **Educational** | Teaches the why, not just the how | "We use dynamic imports here because..." |
| **Practical** | Actionable, results-oriented | "Here's the exact configuration that achieved our Lighthouse 100" |
| **Transparent** | Honest about tradeoffs and limits | "This cut build times 90%, but cache invalidation adds 200ms to writes" |

### Tone Spectrum

```
Casual ←――――――――|―――――――――→ Formal
                 ↑
            [We are here]
        Professional but approachable
```

- More conversational than academic papers
- More technical than marketing content
- Never corporate-speak or buzzword-heavy
- Occasional personality, but substance first

---

## Content Principles

| Principle | What It Means | How We Apply It |
|-----------|---------------|-----------------|
| **Product is marketing** | Every post shows what was built and how | Share working code, real decisions, and measurable results. No theory-only posts. |
| **Build trust through quality** | Ruthless quality earns trust | Verify all code. Don't oversimplify. Share failures. Be transparent about complexity. |
| **Concise and precise** | Bottom line first, scannable structure | Lead with the key insight or metric. Address concerns directly. Specifics over generalities. |
| **Build community through transparency** | Own mistakes, share openly | Convert feedback to content. Document struggles alongside solutions. Make knowledge portable. |

---

## Writing Guidelines

### Words and Phrases to USE

**Confident Starters:**
- "Here's how to..."
- "The key insight is..."
- "This approach works because..."
- "Let's explore..."
- "Notice how..."
- "I built this by..."
- "The tradeoff is..."
- "This works when..."

**Active Constructions:**
- "This reduces..." (not "This can be used to reduce...")
- "You'll achieve..." (not "It is possible to achieve...")
- "The function returns..." (not "The function can return...")

**Technical Precision:**
- Specific metrics: "42% reduction in LCP"
- Concrete examples: "For a 100KB bundle..."
- Named technologies: "Using React 19's compiler..."

### Words and Phrases to AVOID

**Hedging Language:**
- ~~"I think"~~ → State it directly
- ~~"maybe"~~ → Research and be certain
- ~~"sort of"~~ → Be specific
- ~~"kind of"~~ → Define what it actually is
- ~~"probably"~~ → Test and confirm

**Filler Words:**
- ~~"just"~~ → Remove entirely
- ~~"simply"~~ → If it were simple, no explanation needed
- ~~"basically"~~ → Get to the point
- ~~"obviously"~~ → Nothing is obvious; explain it
- ~~"actually"~~ → Usually unnecessary

**Hyperbole:**
- ~~"amazing"~~ → Describe the specific benefit
- ~~"revolutionary"~~ → Explain what changed
- ~~"game-changing"~~ → Show the impact with data
- ~~"best ever"~~ → Compare with specifics
- ~~"incredible"~~ → Quantify the improvement

**Oversimplification:**
- ~~"seamlessly"~~ → Describe the actual integration experience
- ~~"effortlessly"~~ → Explain what work is involved
- ~~"perfect solution"~~ → State the tradeoffs
- ~~"zero overhead"~~ → Quantify the actual cost
- ~~"no downsides"~~ → Name the tradeoffs

**Corporate Speak:**
- ~~"leverage"~~ → use
- ~~"synergy"~~ → integration, combination
- ~~"paradigm shift"~~ → significant change
- ~~"move the needle"~~ → improve metrics
- ~~"circle back"~~ → revisit, follow up

### Transparency and Tradeoffs

Every technical advice post should address:
- **What could go wrong** — failure modes, edge cases, gotchas
- **When NOT to use this** — boundaries and conditions where the approach breaks down
- **What I got wrong** — mistakes made along the way (when applicable)
- **The complexity tax** — what this adds to your codebase, maintenance burden, learning curve

**Before (generic advice):**
> "Edge caching speeds up your API responses. Add caching headers and your users will see faster load times."

**After (transparent with tradeoffs):**
> "I reduced API response times from 800ms to 50ms with edge caching. The tradeoff: cache invalidation adds 200ms to write operations, and stale data can persist for up to 60 seconds. This works for read-heavy APIs serving fewer than 10K unique URLs. Beyond that, cache storage costs outweigh the latency gains."

---

## Content Structure Standards

### Post Anatomy

```
1. TITLE (30-70 characters)
   - Action-oriented or benefit-focused
   - Contains primary keyword
   - No clickbait, but compelling

2. EXCERPT (150-160 characters exactly)
   - Summarizes the core value
   - Includes call-to-action verb
   - Optimized for search snippets

3. INTRODUCTION (2-3 paragraphs)
   - Bottom line first: lead with the key insight or metric
   - Context: What problem we're solving
   - Promise: What the reader will learn
   Example: "I reduced build times from 8 minutes to 47 seconds. Here's how."
   NOT: "Build times are important. Let's talk about why."

4. BODY (3+ sections with H2 headers)
   - Logical progression
   - Code examples where relevant
   - Subheadings (H3) for complex sections
   - Tradeoffs section where applicable:
     • What could go wrong
     • When NOT to use this approach
     • The complexity cost

5. CONCLUSION (1-2 paragraphs)
   - Key takeaways (bullet points work well)
   - Call to action (next steps, related content)
```

### Title Formulas That Work

| Formula | Example |
|---------|---------|
| Building [X] with [Y] | "Building High-Performance APIs with Edge Functions" |
| How to [Achieve X] | "How to Achieve Perfect Lighthouse Scores" |
| [X] Deep Dive: [Specific Topic] | "React 19 Deep Dive: The New Compiler" |
| [Number] [Things] for [Outcome] | "5 Caching Strategies for Sub-Second Load Times" |
| Why [X] and How to [Y] | "Why Layout Shift Happens and How to Fix It" |

### Excerpt Formula

```
[Action verb] + [what you'll learn] + [benefit/outcome]
```

Examples:
- "Learn how to leverage Next.js 16's App Router to build lightning-fast websites with perfect Lighthouse scores."
- "Discover the caching strategies that reduced our API response times from 800ms to under 50ms."

---

## Code Block Standards

### Language Identifiers
Always include the language: ```typescript, ```javascript, ```python, etc.

### Line Highlighting
Use line highlighting to draw attention to key sections:

```typescript {3,7-10}
// Lines 3 and 7-10 will be highlighted
```

### Diff Syntax
Show changes with visual indicators:

```typescript diff
- const oldWay = 'deprecated';
+ const newWay = 'modern';
```

### Code Commentary
- Comment sparingly, only for non-obvious logic
- Explain the "why" in surrounding prose
- Keep examples concise but complete

---

## SEO Requirements

### Keywords
- **Primary keyword**: In title, first paragraph, and at least one H2
- **Secondary keywords**: 3-5 related terms distributed naturally
- **Keyword density**: 1-2% (don't force it)

### Meta Requirements
- `title`: 30-70 characters
- `excerpt`: 150-160 characters (this becomes meta description)
- `keywords`: Array of 3-7 relevant terms
- `tags`: 2-5 category tags

### Schema.org
All posts automatically generate:
- BlogPosting schema
- BreadcrumbList schema
- Person schema (author)

---

## Visual & Design Alignment

### Neo-Brutalist Aesthetic
Content should complement the design system:

| Design Element | Content Equivalent |
|----------------|-------------------|
| Thick borders (2-4px) | Bold, definitive statements |
| High contrast (#F5F5F5 on #0A0A0A) | Clear, unambiguous positions |
| No rounded corners | Direct communication, no softening |
| Hard shadows | Substance over style |
| Raw, unpolished feel | Authentic voice, real experiences |

### Typography Considerations
- Font: Space Grotesk (matches heading confidence)
- Use **bold** for emphasis, not italics
- Use code formatting for technical terms: `useState`, `next.config.ts`
- Lists for scannable content

---

## Community and Trust

### Build in Public
- Document where you struggled and how you solved it
- Share real metrics from real projects, not synthetic benchmarks
- Admit when something is experimental vs production-tested
- Show the messy middle, not just the polished result

### Engage With Readers
- Convert reader questions into content topics
- Address common objections and edge cases proactively
- Credit community contributions and feedback

### Make Knowledge Portable
- Write content that helps readers regardless of which company they work at
- Focus on transferable skills and principles, not just tool-specific tricks
- Share decision frameworks, not just decisions

---

## Quality Checklist

Before publishing, every post must:

### Technical Accuracy
- [ ] All code examples tested and working
- [ ] Performance claims backed by data
- [ ] Technical terms used correctly
- [ ] Links to documentation included

### Voice Consistency
- [ ] No hedging language
- [ ] No filler words
- [ ] Active voice throughout
- [ ] Confident, direct tone

### Trust & Transparency
- [ ] Tradeoffs/limitations addressed explicitly
- [ ] Real project metrics (not synthetic)
- [ ] "When NOT to use" guidance included (for technical advice)
- [ ] First-person for personal experiences, showing the work

### Structure
- [ ] Title: 30-70 characters
- [ ] Excerpt: 150-160 characters exactly
- [ ] Bottom line first in introduction
- [ ] 3+ H2 sections
- [ ] Conclusion with takeaways

### SEO
- [ ] Primary keyword in title and H2
- [ ] 3-7 keywords in frontmatter
- [ ] 2-5 relevant tags
- [ ] Compelling excerpt for snippets

---

## Examples: Before & After

### Hedging → Confidence

**Before:**
> "I think this approach might help improve performance, and it could potentially reduce your bundle size."

**After:**
> "This approach improves performance by reducing bundle size 35%. Here's how it works."

### Passive → Active

**Before:**
> "The component was rendered by React when the state was updated."

**After:**
> "React re-renders the component whenever state updates."

### Vague → Specific

**Before:**
> "This makes the website load much faster."

**After:**
> "This reduces LCP from 2.8s to 1.2s, a 57% improvement."

### Corporate → Human

**Before:**
> "Leveraging cutting-edge paradigms to synergize development workflows."

**After:**
> "Using modern tools to speed up development."

### Generic Advice → Transparent With Tradeoffs

**Before:**
> "Server-side rendering improves SEO and performance. Use it for all your pages."

**After:**
> "SSR improved our Time to First Byte from 1.8s to 400ms for dynamic pages. The tradeoff: server costs increased 3x and cold starts add 200ms. This works for pages that change frequently. For static content, SSG is cheaper and faster."

### Missing Limitations → Explicit Boundaries

**Before:**
> "This caching strategy works great for any application."

**After:**
> "This caching strategy works for sites under 10K pages with content that changes less than hourly. Beyond that, cache invalidation complexity grows faster than the performance gains. For high-churn content, consider ISR with a 60-second revalidation window instead."

---

*This style guide is a living document. Update it as the brand evolves.*
