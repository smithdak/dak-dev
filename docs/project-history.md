# Project History

> Archived planning and origin. **This is history, not session instructions.**
> It is preserved so decisions remain traceable; nothing here is a directive.

For the current architecture and live decisions, see `DESIGN.md`. For what to
do now, see `CLAUDE.md`.

---

## Origin

Bootstrapped by the Claude Code Meta-Orchestrator on **2026-01-25** as a
greenfield personal blog. The original `CLAUDE.md` carried the full planning
narrative inline (stack, design system, epics, clarifications, a `/meta loop`
execution flow backed by a `.meta/` directory).

By **2026-05-19** the project was built and in security hardening. The `.meta/`
scaffolding (`.meta/plan.json`, `.meta/PROJECT_OVERVIEW.md`, `.meta/epics/*`,
`.meta/progress.json`) and the `/meta` commands **no longer exist**. References
to them were removed from `CLAUDE.md` because a stale instruction pointing the
agent at a nonexistent command is worse than no instruction. This document is
now the canonical record of that planning phase.

## Original build plan — 6 epics, 47 stories, ~35–47 hours

| Epic | Scope | Stories |
|------|-------|---------|
| 1 — Foundation & Setup | Next.js, TypeScript, Tailwind, MDX pipeline, Space Grotesk, sample posts | 5 |
| 2 — Code Highlighting | Shiki custom dark theme, line numbers/highlight, diff, copy button | 4 |
| 3 — Core UI & Design System | Neo-brutalist components, responsive nav, Framer Motion w/ motion prefs | 8 |
| 4 — Blog Pages & Content | Home, listing + pagination, post pages, tag filtering, about | 7 |
| 5 — SEO, Analytics, Comments | JSON-LD, OG images, sitemap, Giscus (lazy), Vercel Analytics | 7 |
| 6 — Performance & Deployment | Bundle/image optimization, Lighthouse 98+, WCAG, Vercel deploy | 11 |

All six shipped (git history: *"feat: complete personal blog with all 6
epics"*). The site has since grown well past the original plan — the
four-pillar Learn platform (Patterns, Toolkit, Harness, Security) and the
security-hardening work are post-plan additions documented in `DESIGN.md`.

## Original product clarifications

These were decided at kickoff and remain true. The still-load-bearing ones are
distilled into `CLAUDE.md`'s constraints; the full original list is preserved
here.

**Content strategy**
- Fresh start — no content to migrate.
- Single author — Dakota Smith only; no guest posts.
- Publish-when-ready cadence (nominally weekly).
- Images in-repo: 2 per post (thumbnail + hero).

**Technical**
- No dynamic backend — static site only; `mailto:` for contact.
- Advanced code blocks — Shiki, full feature set.
- Free, self-hosted fonts — Space Grotesk via `next/font`.
- Accessibility first; visual wow-factor secondary.

**Privacy & analytics**
- Page-view-only analytics (Vercel); no cookies; no GDPR/cookie consent.
- Cookie-free comments — Giscus via GitHub auth.

**Deployment**
- Vercel free `*.vercel.app` domain.
- GitHub is the single source of truth; push to `main` auto-deploys.

## License

Personal project — all rights reserved by Dakota Smith.
