# /review-post

Comprehensive post validation with score breakdown and actionable fixes.

## Usage

```
/review-post <slug>
```

## Description

Runs the full validation suite on a blog post, checking:

- **Frontmatter** - Title, excerpt, date, tags, keywords, images
- **Structure** - Word count, headings, code blocks, conclusion
- **Brand Voice** - Forbidden phrases, passive voice, sentence length
- **SEO** - Keyword placement, density, meta optimization
- **Images** - File existence, dimensions, blur placeholders

Returns a detailed score breakdown with specific issues and suggestions.

## Scoring System

| Category                      | Weight | Checks                                            |
| ----------------------------- | ------ | ------------------------------------------------- |
| Technical Depth (Frontmatter) | 25%    | Title length, excerpt length, keywords, tags      |
| Voice Alignment               | 25%    | Forbidden phrases, passive voice, sentence length |
| Structure                     | 25%    | Word count, H2 headings, conclusion               |
| SEO Readiness                 | 25%    | Keyword in title, first paragraph, H2             |

### Score Thresholds

| Score | Status             | Action                       |
| ----- | ------------------ | ---------------------------- |
| 80+   | **Publish Ready**  | Can be published             |
| 60-79 | **Minor Edits**    | Fix warnings, review         |
| 0-59  | **Major Revision** | Significant rewriting needed |

## Output Format

```
Validating post: how-apl-built-this-blog
============================================================

Overall Score: 85/100
Status: ✓ PASSED

--- Metrics ---
Word Count: 1,247
Headings (H2): 5
Code Blocks: 3
Passive Voice: 12.5%
Avg Sentence Length: 18.3 words

--- Score Breakdown ---
frontmatter: 90/100 ✓
structure: 85/100 ✓
voice: 80/100 ✓
seo: 85/100 ✓
images: 85/100 ✓

--- Errors ---
  (none)

--- Warnings ---
  ⚠ [seo] Primary keyword "autonomous AI" not in first paragraph
    → Mention primary keyword early in the content
  ⚠ [images/thumbnailBlur] Missing blur placeholder for thumbnail
    → Run pnpm images:generate to regenerate deterministic art and blur data

============================================================
```

## Validation Rules

### Frontmatter

- Title: 30-70 characters
- Excerpt: 140-160 characters
- Date: ISO 8601 format (YYYY-MM-DD)
- Tags: 2-5 required
- Keywords: 3-7 required
- Thumbnail/Hero paths defined

### Structure

- Word count: 500-3000 words
- Minimum 3 H2 headings
- Conclusion section required
- Code blocks have language identifiers

### Brand Voice

- No forbidden phrases (31+ checked, including oversimplification phrases)
- Passive voice ≤ 20%
- Sentences ≤ 35 words
- Tradeoffs/limitations mentioned (for technical advice posts)
- No oversimplification phrases ("seamlessly", "effortlessly", "perfect solution", "zero overhead", "no downsides")

### SEO

- Primary keyword in title
- Primary keyword in first paragraph
- Primary keyword in at least one H2

### Images

- Thumbnail exists at specified path (800x450)
- Hero exists at specified path (1600x900)
- Blur placeholders generated

## Implementation

1. **Load Post**: Use `getPostBySlug(slug)` from `lib/posts.ts`

2. **Run Validations**: Call each validation function from `lib/content-validation.ts`:
   - `validateFrontmatter(frontmatter)`
   - `validateStructure(content)`
   - `validateBrandVoice(content)`
   - `validateSEO(frontmatter, content)`
   - `validateImages(frontmatter)`

3. **Calculate Score**: Weighted average using guidelines.json weights

4. **Format Output**: Display metrics, breakdown, errors, and warnings

5. **Return Status**: Pass if score ≥ 80 and no errors

## CLI Alternative

```bash
npx tsx scripts/run-validation.ts validate <slug>
```

For JSON output:

```bash
JSON_OUTPUT=true npx tsx scripts/run-validation.ts validate <slug>
```

## Common Issues and Fixes

### "Excerpt too short"

The excerpt must be 140-160 characters exactly. This is used as the meta description.

**Fix:** Expand to include more context about what the reader will learn.

### "Forbidden phrase found"

AI-generated content often includes hedging language.

**Fix:** Replace with direct, confident statements:

- "I think" → (remove, state directly)
- "might be" → "is"
- "just" → (remove entirely)

### "Primary keyword not in title"

SEO requires the target keyword in the title.

**Fix:** Naturally incorporate the primary keyword from your `keywords` array.

### "No conclusion section detected"

Posts must end with a conclusion containing takeaways.

**Fix:** Add `## Conclusion` section with bullet-point takeaways.

### "No tradeoffs or limitations mentioned"

Technical advice posts should address when NOT to use an approach.

**Fix:** Add a section covering what could go wrong, when it doesn't apply, and the complexity cost. Example: "This works for read-heavy APIs under 10K URLs. Beyond that, cache storage costs outweigh the latency gains."

## Related Commands

- `/brand-check` - Quick text validation
- `/write-post` - Create posts with built-in validation
- `/content-calendar` - Track post status
