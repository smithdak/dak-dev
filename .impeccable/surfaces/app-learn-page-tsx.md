---
version: 1
slug: 'app-learn-page-tsx'
primary_target: 'app/learn/page.tsx'
related_targets: ['app/learn/layout.tsx', 'components/learn']
---

## Scope and mode

`/learn` and the shared Learn route shell. Visitor mode: Read.

## Audience, job, and action

New and experienced readers need to choose the right entry point by problem and depth, then move into Patterns, Toolkit, Harness, Security, or the plain-language on-ramp without first decoding the site's internal taxonomy.

## Content and constraints

Preserve the four peer pillars, their boundary statements, counts, product-evidence contract, on-ramp non-pillar status, static rendering, and existing deep routes. The root index must not be constrained by the dense desktop syllabus sidebar used on leaf material.

## Chosen direction

Field-manual navigator. The first viewport works as a system compass: a concise field-guide thesis, an entry-point prompt, and four numbered domains presented as one operating system rather than four cards. The second fold exposes question-led routes and each domain's useful first destinations. The memorable moment is seeing the four pillars as connected responsibilities with distinct boundaries.

## Implementation inventory

- Root `/learn`: full-width editorial index with no leaf sidebar.
- Leaf routes: retain the existing syllabus sidebar/mobile navigation through a route-aware shell.
- Pillars: numbered records, boundary text, counts, and direct starting links.
- On-ramp: explicit beginning path, visually subordinate to the four pillars but easier to find.
- Responsive: linear reading order; no horizontal diagrams required for comprehension.

## Unresolved decisions

None. The user explicitly delegated frontend direction.
