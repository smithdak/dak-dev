---
version: 1
slug: 'app-blog-page-tsx'
primary_target: 'app/blog/page.tsx'
related_targets:
  [
    'app/blog/page/[page]/page.tsx',
    'app/blog/tags/[tag]/page.tsx',
    'app/blog/[slug]/page.tsx',
    'components/blog',
  ]
---

## Scope and mode

`/blog`, paginated Writing archives, tag archives, and shared article-preview surfaces. Visitor mode: Read.

## Audience, job, and action

Readers need to identify the strongest current analysis quickly, understand the publication's recurring research lanes, and scan the archive without parsing implementation-level tag noise. The primary action is opening a lead analysis; the secondary action is moving through the chronological archive or a focused topic route.

## Content and constraints

Use only published post metadata and committed article art. Preserve static generation, granular tag routes, pagination, visible dates, reading time, and truthful excerpts. A single featured post leads and is not repeated in the first archive list. Editorial images never repeat the visible headline.

## Chosen direction

Executive editorial briefing desk. Approved comp: `.impeccable/mocks/blog-briefing-desk.png`. The first viewport pairs a dominant image-led analysis with a concise research-lanes rail; the second fold becomes a numbered analysis ledger with selective image interruptions. The memorable moment is the transition from one decisive lead story into a calm, high-density publication record.

## Implementation inventory

- Existing global header and visual tokens: retain.
- Lead spread: semantic article, authored deterministic raster, title/deck/metadata links.
- Research lanes: curated mapping over existing post tags; plain links, not filters masquerading as tabs.
- Archive: ruled article records with clear individual links and decorative card imagery.
- Responsive: lead stacks image before copy; lanes become a horizontal/vertical index; archive metadata stays scannable.

## Unresolved decisions

None. The user explicitly delegated frontend direction.
