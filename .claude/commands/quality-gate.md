# /quality-gate

Enforced pre-publish pipeline. Runs every check as an independent gate and blocks promotion to `ready` until all pass — mechanical validation, brand voice, and a qualitative prose rubric — then requires a human sign-off.

## Usage

```
/quality-gate <slug>
```

## Philosophy: quality gates over trust

No single check is trusted to certify a post. Each gate scores the artifact
independently, and **any** hard failure blocks the whole pipeline. This is the
discipline that keeps AI-assisted output consistent: the post must survive
mechanical validation, voice enforcement, AND a prose-quality judge — not just
the one that happens to be lenient today.

The prose rubric is graded by an LLM-as-judge, which is fallible. So the final
gate is a **human checkpoint**: the rubric informs the verdict, the human makes
it. The gate's job is to make the decision cheap and well-evidenced, not to
remove the human.

## The gates (run in order; stop on the first hard block)

### Gate 1 — Mechanical validation (`/review-post`)
Run the full validator suite (`scripts/run-validation.ts validate <slug>`).
- **Hard block** if overall score < 80 or any errors.
- Carry warnings forward into the report (they inform, don't block).

### Gate 2 — Brand voice (`/brand-check`)
Run brand-voice validation over the full post body, not just the excerpt.
- **Hard block** on any forbidden phrase, passive voice > 20%, or any sentence > 35 words.

### Gate 3 — Prose rubric (LLM-as-judge)
Grade the post against `prose_rubric` in `.content/brand/guidelines.json`. Score
each dimension 0–5 against the anchors, with a one-line justification quoting the
post:
- `argument_structure` (20%) · `evidence_specificity` (25%) · `transparency` (25%) · `authority_originality` (15%) · `clarity_flow` (15%)

Compute the weighted total (normalize to 0–100).
- **Hard block** if the prose total < 80 (`prose_pass`).
- **Hard block** if any dimension scores below its `fail_below`.
- **Hard block** if a technical-advice post scores 0 on `transparency` (the `hard_fail_when` rule).

Be adversarial here. The judge's default posture is skeptical: if a claim could
be challenged, dock `evidence_specificity`; if a tradeoff is hand-waved, dock
`transparency`. Grade the post you have, not the post you assume was intended.

### Gate 4 — Human checkpoint
Only reached if Gates 1–3 all pass. Present a one-screen verdict (below) and the
proposed edits as a diff. **Do not promote the post to `ready` until the human
explicitly approves.** If the human requests changes, apply them and re-run from
Gate 1 — the gates are not skippable on a second pass.

## Output Format

```
Quality Gate: building-a-harness
============================================================

Gate 1 · Mechanical .......... 88/100  ✓ PASS
Gate 2 · Brand voice ......... clean   ✓ PASS
Gate 3 · Prose rubric ........ 84/100  ✓ PASS
    argument_structure   4/5  Leads with the bottom line; SDK example up front.
    evidence_specificity 4/5  Concrete maxTurns/cost ceilings; one claim unsourced.
    transparency         5/5  "The Tradeoff" + "When NOT to build" both present.
    authority_originality 4/5 First-person "parts you own" framing is original.
    clarity_flow         4/5  Tight; one 34-word sentence borders the cap.

------------------------------------------------------------
VERDICT: ✓ READY FOR HUMAN SIGN-OFF

Proposed edits (diff):
  ~ line 44: source the "out-improve on every release" claim or soften it

Awaiting approval. Reply "approve" to set status → ready, or request changes.
============================================================
```

On a block:

```
Quality Gate: edge-caching-explained
============================================================

Gate 1 · Mechanical .......... 72/100  ✗ BLOCK (needs 80)
Gate 2 · Brand voice ......... (not run — blocked at Gate 1)
Gate 3 · Prose rubric ........ (not run)

------------------------------------------------------------
VERDICT: ⛔ BLOCKED at Gate 1

Fix before re-running /quality-gate:
  ✗ [seo] Primary keyword "edge caching" not in first paragraph
  ✗ Excerpt 135 chars (need 140-160)
============================================================
```

## Implementation

1. Resolve the post with `getPostBySlug(slug)` (`lib/posts.ts`).
2. **Gate 1**: `npx tsx scripts/run-validation.ts validate <slug>` — parse score + errors.
3. **Gate 2**: run brand-voice validation (`validateBrandVoice`) on `content`.
4. **Gate 3**: read `prose_rubric` from `guidelines.json`; grade each dimension
   with a quoted justification; compute the weighted, normalized total; apply
   `fail_below` and `hard_fail_when`.
5. **Gate 4**: print the verdict; on pass, wait for explicit human approval, then
   set the calendar status to `ready`. On block, list the failing gate's fixes.
6. Never auto-publish. Promotion to `published` remains a manual `published: true` commit.

## Related Commands

- `/write-post` — create posts (built-in mechanical validation)
- `/review-post` — Gate 1 in isolation
- `/brand-check` — Gate 2 in isolation
- `/content-calendar` — pipeline status (`review` → `ready`)
