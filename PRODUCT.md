# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Readers evaluating how agentic systems, delivery harnesses, enterprise platforms, and AI-enabled change are designed, governed, and shipped. The Learn on-ramp also serves non-technical readers who need the vocabulary before entering the deeper engineering material.

## Product Purpose

`daksmith.dev` is Dakota Smith's professional publication and learning platform. It makes his writing, technical field guide, and selected systems legible as one body of work. Success means a visitor can understand the point of view, find the right depth of material, and inspect concrete work without the site overstating Dakota's role or the evidence behind a claim.

## Positioning

The publication treats accountable AI delivery as a systems problem: models sit inside architecture, evidence, policy, security, and change-control mechanisms. It is not a generic AI news blog, tool directory, or personal portfolio assembled around screenshots.

## Operating Context

- Visitors move among four public surfaces: Writing, Learn, Work, and About.
- Writing publishes dated field notes and long-form analysis from file-based MDX.
- Learn organizes a four-pillar field guide: Patterns, Toolkit, Harness, and Security, with a separate plain-language on-ramp.
- Work presents selected systems and products already recorded in `content/products.json`.
- About explains Dakota's practice, background, focus, and contact paths.

## Capabilities and Constraints

- Next.js App Router with end-to-end static generation; no request-time server, middleware, CMS, database, cookies, or multi-author workflow.
- Content and product evidence come from repository-controlled files and are rendered at build time.
- The Toolkit distinguishes official documentation evidence from runtime-observed conformance and is current only to its recorded review date.
- Accessibility, Best Practices, and SEO must score 100 in Lighthouse; Performance must score at least 90.
- New imagery must be reproducible from versioned inputs and code so the full publication can be regenerated consistently.

## Brand Commitments

- Public identity: Dakota Smith.
- Current professional position: AI Systems Architect & Full-Stack Engineer.
- Domain signature: `daksmith.dev`.
- “Head of AI Innovation” is an aspiration, never a current-title claim.
- The approved homepage is the visual anchor: authoritative, editorial, precise, and materially quieter than the retired hobby-grid treatment.
- Voice is direct, specific, evidence-aware, and free of inflated claims.

## Evidence on Hand

- Published essays and their metadata under `content/posts/`.
- The four-pillar Learn corpus and source registers under `content/`.
- Selected systems and outbound project URLs in `content/products.json`.
- Existing homepage, production screenshots, and design QA evidence under the current implementation and `.playwright-mcp/`.
- No customer testimonials, commercial outcome metrics, or independently verified runtime-conformance results are available and none should be fabricated.

## Product Principles

1. Show authority through specificity, structure, and proof rather than title inflation.
2. Make the path from point of view to practical material obvious.
3. Separate personal context, published thinking, learning material, and work evidence into distinct jobs.
4. Prefer durable capabilities and mechanisms over transient product hype.
5. Keep every public claim traceable to repository evidence or clearly labeled judgment.

## Accessibility & Inclusion

The site must retain semantic landmarks, keyboard-complete interaction, visible focus, reduced-motion behavior, accessible names, meaningful image alternatives, and the CI-enforced Lighthouse accessibility score of 100.
