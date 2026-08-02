'use client';

import { AgentLoopStepper } from '@/components/interactive/AgentLoopStepper';
import { RunnableSnippet } from '@/components/interactive/RunnableSnippet';
import { ScrollStory } from '@/components/interactive/ScrollStory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import { TagList } from '@/components/ui/Tag';

const samplePosts = [
  {
    title: 'Compiling Agent Config to Claude Code, Codex, and Copilot',
    excerpt:
      'How base compiles one vendor-neutral canon into native agent configuration, with drift protection in CI.',
    slug: 'base-compile-agent-config',
    thumbnail: '/images/posts/base-compile-agent-config/thumbnail.jpg',
    date: '2026-07-15',
    readingTime: '9 min read',
    tags: ['ai', 'agents', 'developer-tools'],
  },
  {
    title: 'Compile Your Agentic System: base, skillsmith, and ObjectCore',
    excerpt:
      'Three projects that treat agent configuration as compiler output: validated sources in, drift-gated artifacts out.',
    slug: 'compile-your-agentic-system',
    thumbnail: '/images/posts/compile-your-agentic-system/thumbnail.jpg',
    date: '2026-07-15',
    readingTime: '8 min read',
    tags: ['ai', 'agents', 'developer-tools'],
  },
];

const palette = [
  { name: 'Paper', value: '#f7f4ee', className: 'bg-background' },
  { name: 'Ink', value: '#14211c', className: 'bg-text' },
  { name: 'Editorial green', value: '#006b4d', className: 'bg-accent' },
  { name: 'Hairline', value: '#d4cec2', className: 'bg-rule' },
];

export default function ComponentsDemo() {
  return (
    <PageTransition className="min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="border-b border-rule pb-14">
          <p className="editorial-kicker">Internal design reference</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.98] tracking-tight text-text md:text-7xl">
            Executive-editorial component system.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
            A light-first publication language for Dakota Smith: serif authority, restrained green,
            hairline rules, and enough whitespace to let the argument lead.
          </p>
        </header>

        <section className="grid gap-8 border-b border-rule py-14 md:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="editorial-kicker">01 / Actions</p>
            <h2 className="mt-3 font-display text-3xl text-text">Buttons</h2>
          </div>
          <div className="flex flex-wrap items-start gap-4">
            <Button variant="primary" size="sm">
              Read analysis
            </Button>
            <Button variant="secondary">View the work</Button>
            <Button variant="ghost" size="lg">
              Explore Learn
            </Button>
            <Button variant="primary" disabled>
              Unavailable
            </Button>
          </div>
        </section>

        <section className="grid gap-8 border-b border-rule py-14 md:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="editorial-kicker">02 / Taxonomy</p>
            <h2 className="mt-3 font-display text-3xl text-text">Tags</h2>
          </div>
          <div className="space-y-7">
            <TagList
              tags={['ai-systems', 'architecture', 'accountable-delivery']}
              interactive={false}
            />
            <TagList tags={['patterns', 'toolkit', 'harness', 'security']} interactive={false} />
          </div>
        </section>

        <section className="grid gap-8 border-b border-rule py-14 md:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="editorial-kicker">03 / Writing</p>
            <h2 className="mt-3 font-display text-3xl text-text">Article records</h2>
          </div>
          <div className="space-y-12">
            {samplePosts.map((post) => (
              <Card key={post.slug} {...post} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-b border-rule py-14 md:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="editorial-kicker">04 / Type</p>
            <h2 className="mt-3 font-display text-3xl text-text">Typography</h2>
          </div>
          <div className="max-w-3xl space-y-5">
            <p className="font-display text-5xl leading-none tracking-tight text-text">
              Judgment belongs in the headline.
            </p>
            <p className="text-2xl font-semibold leading-tight text-text">
              Space Grotesk carries navigation, metadata, and operational detail.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              Body copy stays calm and precise. The hierarchy comes from scale, rhythm, and
              whitespace instead of heavy borders or decorative effects.
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-b border-rule py-14 md:grid-cols-[15rem_minmax(0,1fr)]">
          <div>
            <p className="editorial-kicker">05 / Tokens</p>
            <h2 className="mt-3 font-display text-3xl text-text">Palette</h2>
          </div>
          <dl className="divide-y divide-rule border-y border-rule">
            {palette.map((color) => (
              <div key={color.name} className="flex items-center gap-5 py-4">
                <dt className="flex min-w-60 items-center gap-5 font-semibold text-text">
                  <span
                    className={`h-10 w-10 border border-rule ${color.className}`}
                    aria-hidden="true"
                  />
                  {color.name}
                </dt>
                <dd className="font-mono text-sm text-muted">{color.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-14">
          <p className="editorial-kicker">06 / Interaction</p>
          <h2 className="mt-3 font-display text-4xl text-text">Explorable components</h2>

          <div className="mt-10 space-y-14">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-text">Agent loop</h3>
              <AgentLoopStepper />
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-text">Scroll narrative</h3>
              <ScrollStory
                eyebrow="Demo walkthrough"
                steps={JSON.stringify([
                  {
                    title: 'Observe',
                    body: 'The sticky panel tracks the step centered in the viewport.',
                  },
                  {
                    title: 'Decide',
                    body: 'The sequence makes state and progress explicit without visual noise.',
                  },
                  {
                    title: 'Respect preference',
                    body: 'With reduced motion enabled, the steps read as a stable list.',
                  },
                ])}
              />
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-text">Runnable JavaScript</h3>
              <RunnableSnippet
                language="javascript"
                sandbox="javascript"
                engine="browser"
                code={`let turns = 0;\nlet state = "start";\nwhile (state !== "done" && turns < 5) {\n  turns += 1;\n  state = turns >= 3 ? "done" : "thinking";\n}\nconsole.log("Loop stopped after", turns, "turns:", state);`}
              />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
