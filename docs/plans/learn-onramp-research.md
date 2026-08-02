# Learn on-ramp for non-technical readers — research & plan

> Status: MVP shipped (Decoder + one Demo, Decoded + Start Here index).
> Audience decision: **non-technical pros** (founders, PMs, designers, ops).
> Core gaps: **decode vocabulary** + **build accurate mental models**.
> Origin: people repeatedly ask, after a live agentic-engineering demo, "how do
> I learn / understand what you're doing?" This is the place to point them.

---

## 1. The question, scoped

"A Learn area to point non-devs/technical people/engineers to after a demo."
Clarified to:

- **Primary reader:** non-technical professionals who want to _understand_, not
  build. No code assumed.
- **Two core gaps:** (1) the **jargon** (agent, agentic, context window, MCP,
  harness, RAG…), (2) the **mental models** (what the agent is actually doing,
  why it works, why it fails).
- **IA:** left open ("surprise me") → see the decision in §5.
- **Deliverable:** multiple _distinct_ concept options + a recommendation.

The brand constraint is the design key: _"complex concepts explained without
dumbing down."_ That matches the plain-language standard exactly — calibrate
complexity, don't remove it. So every analogy is **paired with** the precise
term, never a replacement.

## 2. Method

Five parallel research angles (pedagogy; real-world explainer exemplars; how AI
agents are explained to non-tech audiences; learn-hub formats/IA; analogies &
mental models), then a verification pass on the load-bearing facts. Full source
list in §8.

## 3. The six options

| #   | Concept                                                   | Gap              | Build       | Differentiation |
| --- | --------------------------------------------------------- | ---------------- | ----------- | --------------- |
| 1   | **The Decoder** — plain-English glossary of _your_ words  | Vocabulary       | Low         | Medium          |
| 2   | **How This Actually Works** — 6–8 mental-model explainers | Models           | Med         | Medium          |
| 3   | **Demo, Decoded** — annotated replays of real demos       | Both, in context | Med         | **Very high**   |
| 4   | **Explain Me This** — one concept at escalating depth     | Both (tiering)   | Low (layer) | Medium          |
| 5   | **Start Here** — guided on-ramp + curated canon           | Orientation      | Low         | Low             |
| 6   | **The Playground** — interactive agent-loop explorable    | Models           | High        | High (caveated) |

Condensed rationale (evidence in §8):

1. **The Decoder.** Thematic (not alphabetical) glossary; each term =
   analogy → precise definition → example → go deeper. Define-on-first-use is
   the usability-tested jargon standard. A literal `TextDecode` scramble was
   considered, then rejected in the polish pass: decorative motion delays
   scanning on a reference surface without improving comprehension.
2. **How This Actually Works.** A finite set of Explanation-quadrant pieces, one
   durable mental model each (agent loop; context window = working memory; the
   jagged frontier; model-vs-system; autonomy dial; why it makes things up).
   Present an analogy, name where it breaks, offer a second — comparing analogies
   ≈ 3× transfer (Gentner).
3. **Demo, Decoded.** Take the real demo and annotate every move in context.
   Worked examples are the highest-leverage tool for novices (Sweller); it is
   _unreplicable_ (your actual work) → strongest differentiator. **Made the
   signature piece.**
4. **Explain Me This.** Depth tiers (Curious → Decision-maker → Builder), capped
   at 2–3 (NN/g). Serves the whole spread without separate tracks, and avoids
   the debunked "learning styles" trap (tier by depth, not modality).
5. **Start Here.** Orientation ramp with specific link labels (not a generic
   "Get Started"), a suggested path, and "permission to not know."
6. **The Playground.** Highest wow, weakest evidence-per-dollar: interactivity
   boosts engagement but **does not beat good text on comprehension** (n=454),
   at high build + a11y cost. Defer to a flagship.

## 4. Cross-cutting principles (apply to all)

- Pair every analogy with the precise term.
- Question-first headers ("How does an agent remember?" not "Memory").
- Name the misconception, then correct it (7 ready-made misconceptions).
- Lead with "why this matters to _you_."
- Don't build modality tracks; do offer depth tiers.
- A11y is the existing gate: toggletips not hover; reduced-motion; captions +
  transcripts for video; `<title>/<desc>` on SVG diagrams.
- Avoid junk stats (the "80% video recall" and "90% Feynman retention" claims
  are unsourced — discarded).
- Be honest about limits (the 2025 hype correction is real).

## 5. IA decision

**Not a fifth pillar.** The four pillars are expert guides for builders; a
non-technical layer as a peer erodes the boundary-statement legibility that
DESIGN.md §4 protects. Instead: a distinct **on-ramp layer in front of** the
pillars at `/learn/start`, which funnels the curious _into_ them (harness is the
natural bridge term). It still ships the §4 conventions (boundary, client-safe
types, loader, routing invariant) to stay architecturally honest. See
`DESIGN.md` §4.1.

Recommended build order: **Start Here + Decoder → mental-model explainers →
Demo, Decoded → Explain Me This (layer) → Playground (later)**.

## 6. What shipped (this MVP)

- `lib/onramp-types.ts` — client-safe: `ONRAMP_BOUNDARY`, routing invariant, the
  12-term glossary data + clusters, demo metadata, helpers.
- `lib/onramp.ts` — server loader for demo MDX (re-exports the types module).
- `components/learn/Decoder.tsx` — static thematic field lexicon with a compact
  term index and numbered, anchored records; no client-only behavior.
- `components/learn/Annotation.tsx` — presentational "decode this step" margin
  note for demos.
- `components/learn/sectionTheme.ts` — added the `amber` (chapter-5) section
  colour for the on-ramp identity.
- `app/learn/start/page.tsx` — Start Here index (boundary, who-it's-for, the
  path, two ways in, connects into pillars).
- `app/learn/start/decoder/page.tsx` — the Decoder page.
- `app/learn/start/demo/[slug]/page.tsx` — Demo, Decoded template (MDX +
  `Callout` + `Annotation` + `AgentLoopStepper`).
- `content/onramp/demos/fix-a-failing-test.mdx` — first annotated demo.
- `app/learn/page.tsx` — "New here?" CTA band linking to `/learn/start`.
- `DESIGN.md` §4.1 — documents the non-pillar on-ramp layer.

## 7. Follow-ups (not in this MVP)

- The mental-model explainers (Option 2) as real Explanation pages.
- Define-on-first-use **toggletips** site-wide that link into the Decoder (WCAG
  1.4.13 toggletip pattern — dismissible/hoverable/persistent, tap-safe).
- "Explain Me This" depth-tier toggle on the hardest concepts.
- More Demo, Decoded walkthroughs from real sessions; optional narrated video
  (needs a CSP edit in `next.config.ts` + captions/transcript).
- Optional: wire the on-ramp into `LearnSidebar`/`LearnMobileNav` (see §4.1
  caveat) and an OG image for `/learn/start`.

## 8. Verified facts, discarded myths, and sources

**Verified this session:**

- Jagged-frontier RCT (Dell'Acqua, McFowland, Mollick et al., HBS WP 24-013 /
  _Organization Science_ 2025): 758 BCG consultants; **+12.2% tasks, 25.1%
  faster, ~40% higher quality** inside the frontier; **19% less likely correct**
  outside it. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321
- Elements of AI: 2M+ enrolled, 170+ countries, ~40% women.
  https://www.elementsofai.com/
- MCP: Anthropic Nov 2024 → OpenAI Mar 2025 → Google DeepMind Apr 2025.
  https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data/

**Discarded as unsourced:** "80% of viewers recall video after a month"; "Feynman
technique = 90% retention."

**Pedagogy:** worked-example effect (en.wikipedia.org/wiki/Worked-example_effect);
expertise reversal (en.wikipedia.org/wiki/Expertise_reversal_effect); curse of
knowledge (mitsloan.mit.edu/ideas-made-to-matter/curse-knowledge-why-experts-struggle-to-explain-their-work);
Nathan & Petrosino (journals.sagepub.com/doi/10.3102/00028312040004905);
learning-styles meta-analysis (pmc.ncbi.nlm.nih.gov/articles/PMC11270031/);
Gentner analogical encoding
(groups.psych.northwestern.edu/gentner/papers/GentnerLoewensteinThompson03.pdf);
plain language (digital.gov/guides/plain-language/principles;
iplfederation.org/plain-language/).

**Formats / IA:** Diátaxis Explanation (diataxis.fr/explanation/); NN/g
progressive disclosure, "Get Started", mental models, technical jargon
(nngroup.com); WCAG tooltips (sarahmhigley.com/writing/tooltips-in-wcag-21/);
Mayer's principles (digitallearninginstitute.com/blog/mayers-principles-multimedia-learning).

**Exemplars:** Illustrated Transformer (jalammar.github.io/illustrated-transformer/);
Ciechanowski (ciechanow.ski); Explorable Explanations (explorabl.es); How HTTPS
Works (howhttps.works); Wait But Why (waitbutwhy.com); a16z AI Canon
(a16z.com/ai-canon/); Lenny's AI glossary (lennysnewsletter.com/p/an-ai-glossary);
Lilian Weng on agents (lilianweng.github.io/posts/2023-06-23-agent/).

**AI explainers / mental models:** Mollick "Thinking Like an AI"
(oneusefulthing.org/p/thinking-like-an-ai); Willison agent definition
(simonw.substack.com/p/i-think-agent-may-finally-have-a) and "calculator for
words" (simonwillison.net/2023/Apr/2/calculator-for-words/); Anthropic Building
Effective Agents, MCP, Measuring Agent Autonomy (anthropic.com); MIT Sloan
Agentic AI Explained (mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained);
NN/g anthropomorphism (nngroup.com/articles/anthropomorphism/); MIT Tech Review
"the great AI hype correction of 2025".
