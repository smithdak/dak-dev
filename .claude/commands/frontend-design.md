# /frontend-design

Create or revise production UI for Dakota Smith's professional publication at
`daksmith.dev`. Use this skill for pages, components, layout, visual hierarchy,
responsive behavior, or design-system work.

## Product position

The interface should look like the publication of an AI systems architect and full-stack engineer who
builds accountable AI systems and is progressing toward AI innovation
leadership. It must demonstrate that trajectory through judgment and work; it
must not claim that Dakota currently holds the title Head of AI Innovation.

Identity is exact:

- wordmark: **Dakota Smith**;
- domain signature: **daksmith.dev**;
- current professional position: **AI Systems Architect & Full-Stack Engineer**.

`DAK`, `dak.dev`, and aspirational-title branding are not substitutes.

## Visual direction

The system is executive editorial: warm paper, deep ink, fine rules, restrained
green, typographic authority, and generous negative space. It is not the former
dark neo-brutalist grid.

1. **Typography establishes hierarchy.** Use serif display type for major
   editorial statements and the locally hosted sans for navigation, body copy,
   labels, and controls.
2. **Composition beats containment.** Prefer spacing, reading measure,
   alignment, and horizontal rules over repeated cards, badges, and boxes.
3. **Accent is scarce.** Green marks links, focus, current state, or one
   decisive idea. If everything is accented, nothing is.
4. **Hairlines create structure.** Use the `rule` token for editorial dividers.
   Heavy borders and hard shadows are exceptions for functional legacy content,
   not the site-wide language.
5. **Light is intentional.** Warm-ivory light mode is the default. Dark mode
   preserves the same hierarchy without becoming a different product.
6. **Motion is quiet.** Use it to clarify state and sequence, never to make the
   page feel “techy.” Primary content must be visible without hydration.

## Token contract

All colors come from CSS variables in `app/globals.css`, mapped through Tailwind
v4 `@theme inline`. Never add a raw color literal to a component.

| Semantic token | Light         | Dark              | Use                        |
| -------------- | ------------- | ----------------- | -------------------------- |
| `background`   | warm ivory    | deep forest-black | page canvas                |
| `surface`      | warm stone    | raised forest     | quiet panels and code      |
| `text`         | forest ink    | warm white        | primary foreground         |
| `muted`        | gray-green    | pale gray-green   | secondary copy             |
| `accent`       | deep green    | soft mint         | links, focus, active state |
| `rule`         | warm hairline | forest hairline   | editorial dividers         |

Use `bg-background`, `bg-surface`, `text-text`, `text-muted`, `text-accent`,
`border-rule`, and related semantic utilities. Chapter colors remain scoped to
Learn navigation and chapter identity.

### Typography contract

- `font-sans` maps to local Space Grotesk files through
  `--font-editorial-sans` in `app/layout.tsx`.
- `font-serif` and `font-display` map to the editorial serif system stack in
  `app/globals.css`.
- Major theses and publication headlines may use serif display type. UI labels,
  metadata, navigation, body copy, and controls use the sans.
- Maintain readable measure and line height. Do not solve weak hierarchy by
  making every heading larger or bolder.

## Technical requirements

- Next.js App Router, SSG end to end. Do not introduce middleware, request-time
  data fetching, cookies, or another backend tier.
- Server Components own filesystem data and content shaping. Add `'use client'`
  only to the smallest stateful, animated, or event-driven leaf.
- TypeScript strict mode; explicit prop types; no `any`.
- Tailwind v4 CSS-first tokens; no `tailwind.config.ts`.
- Use `next/image` for content images and supply meaningful `alt` and `sizes`.
- Reuse shared Framer Motion variants from `lib/animations.ts` when applicable;
  global `MotionConfig reducedMotion="user"` owns the motion preference.
- New CSS keyframes require their own `prefers-reduced-motion` guard.

## Composition patterns

### Editorial shell

Use `editorial-shell`, `editorial-kicker`, `editorial-link`, and the established
homepage/header/footer composition as references. Strong sections commonly use:

- a small uppercase kicker;
- a serif headline or thesis;
- one concise supporting paragraph;
- a full-width `rule` divider;
- asymmetric columns or measured single-column prose;
- one clear action, not a row of competing buttons.

### Lists and indexes

Prefer rows separated by `border-rule` or `border-text/15` over card grids.
Reveal title, description, metadata, and destination in that order. A grid is
allowed only when the content is genuinely spatial or comparative; “there are
several items” is not enough.

### Controls

Controls remain square or nearly square, compact, and legible. Use subtle
surface changes, underlines, or rule changes for hover. Focus must be unmistakable:
`focus:ring-2 focus:ring-accent` with an appropriate background offset or inset
ring. Avoid decorative hard shadows, hover jumps, glow, and scale effects on
ordinary navigation.

### Long-form and technical content

Protect reading measure and heading rhythm. MDX code blocks retain their strong
functional treatment, including line numbers, highlights, and diffs; do not
generalize that dense visual language to the editorial shell.

## Accessibility and budgets

Hard merge gates:

- Lighthouse Accessibility, Best Practices, and SEO: **100**;
- Lighthouse Performance: **at least 90**;
- keyboard-operable interactions with visible focus;
- accessible names for icon-only controls;
- meaningful image alternatives;
- at least 44×44px touch targets where applicable;
- no information or essential content gated by animation.

Preserve the project budgets in `CLAUDE.md` and `DESIGN.md`; verify rather than
asserting them.

## Anti-patterns

- `dak.dev`, `DAK` as the primary brand, or “Head of AI Innovation” as a held title.
- Repeated card grids used as the default page structure.
- Terminal windows, circuit-board decoration, neon glow, cyberpunk gradients,
  or generic AI iconography as shorthand for technical credibility.
- Thick borders and hard offset shadows on ordinary editorial sections.
- Raw hex colors, default Tailwind palette colors, or component-local theme logic.
- Dense badge collections, pill-heavy layouts, decorative metrics, or fake dashboards.
- Excessive rounded containers, glassmorphism, gradient mesh backgrounds, or
  generic SaaS landing-page composition.
- Promoting a whole page to a Client Component for one interaction.
- Inline reusable animation variants, unguarded CSS motion, or content hidden
  until an observer fires.
- Raw `<img>` elements for content imagery or unlabeled icon buttons.

## File placement

| Directory               | Responsibility                             |
| ----------------------- | ------------------------------------------ |
| `components/editorial/` | professional publication compositions      |
| `components/layout/`    | header, footer, navigation, page structure |
| `components/ui/`        | reusable primitives and interaction leaves |
| `components/blog/`      | post rendering and blog-specific UI        |
| `components/learn/`     | shared Learn chrome                        |
| `components/toolkit/`   | capability and evidence views              |
| `components/patterns/`  | pattern-specific UI                        |
| `app/`                  | route composition and metadata             |
| `app/globals.css`       | tokens and shared visual mechanisms        |

## Implementation workflow

1. Read `DESIGN.md` §6 and `docs/ui-workflow.md`.
2. Inspect the existing rendered page at desktop and mobile widths.
3. State the hierarchy and the smallest component boundary that solves it.
4. Implement with semantic tokens and a Server-first boundary.
5. Inspect desktop/mobile in light and dark themes; test keyboard and reduced motion.
6. Run the relevant lint, typecheck, tests, and production build. MDX work is
   incomplete until `pnpm build` succeeds because Shiki is production-only.

## Completion checklist

- [ ] Identity reads `Dakota Smith` / `daksmith.dev` / `AI Systems Architect & Full-Stack Engineer`.
- [ ] No aspirational role is represented as a current title.
- [ ] The result reads as executive editorial, not a hobby dashboard.
- [ ] Semantic tokens only; light and dark both verified.
- [ ] Typography, whitespace, and rules establish hierarchy before containers.
- [ ] Server/Client boundary remains narrow.
- [ ] Focus, labels, alt text, touch targets, contrast, and reduced motion verified.
- [ ] Desktop and mobile screenshots inspected for overflow and hierarchy.
- [ ] Required project gates pass.
