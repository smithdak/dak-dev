# UI Development Workflow

> Read this for visual UI/component work. `DESIGN.md` §6 is canonical for the
> implemented design system; this file defines the workflow and proof required
> to change it.

---

## Direction

The product is Dakota Smith's professional publication at `daksmith.dev`, not a
developer dashboard or a hobby portfolio. Its visual thesis is executive
editorial:

- warm-ivory paper and deep-forest ink in the default light theme;
- serif display typography paired with a locally hosted editorial sans;
- fine rules, asymmetric composition, and generous negative space;
- restrained green accent reserved for links, focus, and decisive emphasis;
- `Dakota Smith` as the wordmark, `daksmith.dev` as the quiet signature, and
  `AI Systems Architect & Full-Stack Engineer` as the current position.

The site may communicate readiness for AI innovation leadership through the
work. It must not imply that Dakota currently holds the title Head of AI
Innovation.

## Workflow

1. **Read the rendered context.** Inspect the page at desktop and mobile widths
   before changing it. A component that looks plausible in isolation can break
   editorial rhythm, reading measure, or navigation hierarchy in context.
2. **Name the hierarchy.** State what is primary, supporting, and interactive.
   Prefer typography, spacing, and `rule` borders over adding another card,
   container, badge, or decorative effect.
3. **Use the token contract.** Extend semantic variables in
   `app/globals.css` and map them through `@theme inline`; never hardcode a new
   component color. Light is the default, but every component must work in
   `html.light` and `html.dark` without conditional rendering.
4. **Keep the Server/Client boundary small.** Pages and filesystem data stay in
   Server Components. Extract only the stateful, animated, or event-driven leaf
   behind `'use client'`.
5. **Implement accessibility with the interaction.** Use semantic elements,
   visible accent focus, accessible names, meaningful image alternatives, and
   44×44px touch targets. Motion must inherit the global reduced-motion
   contract or carry its own CSS guard.
6. **Verify the rendered result.** Compare browser screenshots at representative
   desktop and mobile widths in both themes. Test keyboard navigation and
   reduced motion, then run the relevant lint, type, test, production-build,
   and Lighthouse gates before calling the change complete.

## Visual review checklist

- [ ] Reads as a serious executive publication, not a card grid or terminal UI.
- [ ] Uses `Dakota Smith`, `daksmith.dev`, and `AI Systems Architect & Full-Stack Engineer` precisely;
      no aspirational-title claim.
- [ ] Warm-ivory light mode is the intentional default; dark mode is equally
      legible and structurally identical.
- [ ] Uses semantic `background`, `surface`, `text`, `muted`, `accent`, `rule`,
      or chapter tokens; no new raw color literal in a component.
- [ ] Editorial hierarchy comes from type, whitespace, and fine rules. Heavy
      borders, hard shadows, repetitive boxes, and gratuitous badges are absent.
- [ ] Long-form text has a controlled measure and headings retain a clear scale.
- [ ] Keyboard focus, touch targets, labels, alt text, contrast, and reduced
      motion satisfy `DESIGN.md` §9.
- [ ] Desktop and mobile screenshots show no clipping, overlap, overflow, or
      accidental horizontal scroll.
- [ ] The production build succeeds for MDX or content-rendering work; Shiki is
      production-only and `pnpm dev` is insufficient proof.

## Design tools

An external design canvas such as Pencil can help explore composition, but it
is optional and non-authoritative. The committed tokens, components, rendered
browser output, accessibility behavior, and CI budgets are the product. When a
mockup disagrees with the implemented system, either revise the mockup or make
an explicit architecture change in `DESIGN.md`; do not silently fork the visual
language.
