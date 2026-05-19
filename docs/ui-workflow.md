# UI Development Workflow

> Read this when doing visual UI/component work. For the design system itself
> (tokens, neo-brutalist primitives, motion), `DESIGN.md` §6 is canonical — this
> file is process, not specification.

---

## Pencil.dev MCP integration

This project uses [Pencil.dev](https://www.pencil.dev) MCP for visual UI design
and verification — a bidirectional design canvas that integrates with Claude
Code.

### Setup (per session)

1. Launch the Pencil desktop app **before** starting Claude Code.
2. Pencil auto-installs its MCP tools when the app is running.
3. Verify: run `/mcp` — the Pencil tools should appear.

### Workflow for UI components

1. **Design first** — create or select the component design in the Pencil
   canvas.
2. **Generate** — prompt Claude Code, e.g. *"Generate a React/Tailwind/Next.js
   component from the selected frame"* or *"Update CSS from the design
   variables."*
3. **Verify** — before marking the task complete, confirm the implementation
   matches the Pencil canvas.

### Verification checklist (UI tasks)

- [ ] Pencil MCP tools available (`/mcp` shows Pencil)
- [ ] Component visually matches the Pencil canvas design
- [ ] Neo-brutalist styling correct — thick borders, hard (blur-free) shadows,
      no rounded corners, Space Grotesk. **Use the design tokens, never hardcode
      hex values** (`DESIGN.md` §6.1; `app/globals.css`).
- [ ] Accessibility met — contrast, visible focus, keyboard navigation
      (`DESIGN.md` §9; this is CI-enforced at score 100).

### Notes

- Keep Pencil running for the whole session. If its tools disappear, restart
  Pencil, then restart Claude Code.
- Pencil verification is **warning-only** — a task can complete without it, but
  the gap should be logged.

## Relationship to the design system

Pencil is how a design is *produced and checked*. What "correct" means — the
exact tokens, the theming mechanism (CSS-variable swap, no layout shift), the
motion contract (`prefers-reduced-motion` via `MotionConfig`) — is defined once
in `DESIGN.md` §6 and implemented in `app/globals.css`. When the two disagree,
the design system wins; fix the component, not the token.
