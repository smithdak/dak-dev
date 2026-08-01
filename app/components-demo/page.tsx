'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TagList } from '@/components/ui/Tag';
import { PageTransition } from '@/components/ui/PageTransition';
import { AgentLoopStepper } from '@/components/interactive/AgentLoopStepper';
import { ScrollStory } from '@/components/interactive/ScrollStory';
import { RunnableSnippet } from '@/components/interactive/RunnableSnippet';

const samplePosts = [
  {
    title: 'Compiling Agent Config to Claude Code, Codex, and Copilot',
    excerpt:
      'How base compiles one vendor-neutral canon into native agent config for Claude Code, Codex, and GitHub Copilot—with drift protection in CI.',
    slug: 'base-compile-agent-config',
    thumbnail: '/images/posts/base-compile-agent-config/thumbnail.jpg',
    date: '2026-07-15',
    readingTime: '9 min read',
    tags: ['ai', 'claude-code', 'rust', 'developer-tools'],
  },
  {
    title: 'Compile Your Agentic System: base, skillsmith, and ObjectCore',
    excerpt:
      'Three projects that treat agent config as compiler output: validated sources in, drift-gated artifacts out.',
    slug: 'compile-your-agentic-system',
    thumbnail: '/images/posts/compile-your-agentic-system/thumbnail.jpg',
    date: '2026-07-15',
    readingTime: '8 min read',
    tags: ['ai', 'claude-code', 'agents', 'developer-tools'],
  },
  {
    title: 'Durable Agent Orchestration with Claude Managed Agents',
    excerpt:
      'Why I moved agent orchestration into durable workflow steps instead of a coordinator agent, including the safety and cost tradeoffs.',
    slug: 'durable-agent-orchestration-claude-managed-agents',
    thumbnail: '/images/posts/durable-agent-orchestration-claude-managed-agents/thumbnail.jpg',
    date: '2026-06-09',
    readingTime: '11 min read',
    tags: ['ai', 'claude', 'agents', 'orchestration'],
  },
];

export default function ComponentsDemo() {
  return (
    <PageTransition className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="mb-16 border-b-4 border-text pb-16">
          <h1 className="text-5xl font-bold mb-4">Components Demo</h1>
          <p className="text-xl text-muted max-w-3xl">
            A showcase of all UI components in the Dakota Smith blog design system. Neo-brutalist
            aesthetics meet modern web standards.
          </p>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-text pl-4">Buttons</h2>
          <div className="space-y-6">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">Primary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  Small Button
                </Button>
                <Button variant="primary" size="md">
                  Medium Button
                </Button>
                <Button variant="primary" size="lg">
                  Large Button
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">Secondary Variant</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="sm">
                  Small Button
                </Button>
                <Button variant="secondary" size="md">
                  Medium Button
                </Button>
                <Button variant="secondary" size="lg">
                  Large Button
                </Button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">Ghost Variant</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="ghost" size="sm">
                  Small Button
                </Button>
                <Button variant="ghost" size="md">
                  Medium Button
                </Button>
                <Button variant="ghost" size="lg">
                  Large Button
                </Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">With Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                  iconPosition="left"
                >
                  Create Post
                </Button>
                <Button
                  variant="secondary"
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  }
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tags Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-text pl-4">Tags</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">Interactive (Clickable)</h3>
              <TagList tags={['ai', 'claude-code', 'agents', 'developer-tools', 'skills']} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted">Static (Display Only)</h3>
              <TagList tags={['design', 'engineering', 'optimization']} interactive={false} />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-text pl-4">Blog Post Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePosts.map((post) => (
              <Card key={post.slug} {...post} />
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-text pl-4">Typography</h2>
          <div className="space-y-4 max-w-3xl">
            <p className="text-5xl font-bold">Heading 1 style — Space Grotesk Bold</p>
            <p className="text-4xl font-bold">Heading 2 style — Space Grotesk Bold</p>
            <p className="text-3xl font-semibold">Heading 3 style — Space Grotesk Semibold</p>
            <p className="text-2xl font-semibold">Heading 4 style — Space Grotesk Semibold</p>
            <p className="text-base text-text">
              Body text - Space Grotesk Regular. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. High contrast (#F5F5F5 on #0A0A0A) ensures readability and accessibility.
            </p>
            <p className="text-base text-muted">
              Muted text - Space Grotesk Regular with muted color. Used for secondary information
              and metadata.
            </p>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-text pl-4">Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-4 border-text p-6">
              <div className="w-full h-24 bg-background border-2 border-text mb-4"></div>
              <h3 className="font-bold mb-2">Background</h3>
              <p className="text-sm text-muted">#0A0A0A</p>
            </div>
            <div className="border-4 border-text p-6">
              <div className="w-full h-24 bg-surface border-2 border-text mb-4"></div>
              <h3 className="font-bold mb-2">Surface</h3>
              <p className="text-sm text-muted">#333333</p>
            </div>
            <div className="border-4 border-text p-6">
              <div className="w-full h-24 bg-text border-2 border-background mb-4"></div>
              <h3 className="font-bold mb-2">Text</h3>
              <p className="text-sm text-muted">#F5F5F5</p>
            </div>
            <div className="border-4 border-text p-6">
              <div className="w-full h-24 bg-muted border-2 border-text mb-4"></div>
              <h3 className="font-bold mb-2">Muted</h3>
              <p className="text-sm text-muted">#A9A9A9</p>
            </div>
          </div>
        </section>

        {/* Interactive / explorable components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">
            Interactive Components
          </h2>

          <h3 className="text-xl font-bold mb-3">AgentLoopStepper</h3>
          <AgentLoopStepper />

          <h3 className="text-xl font-bold mb-3 mt-10">ScrollStory</h3>
          <ScrollStory
            eyebrow="Demo walkthrough"
            steps={JSON.stringify([
              {
                title: 'First beat',
                body: 'Scroll down slowly. The sticky panel on the left tracks whichever step is centered in the viewport.',
              },
              {
                title: 'Second beat',
                body: 'The number flips and the progress bar advances as each step crosses the middle of the screen.',
              },
              {
                title: 'Third beat',
                body: 'With reduced motion enabled, tracking is disabled and the steps simply read as a list.',
              },
            ])}
          />

          <h3 className="text-xl font-bold mb-3 mt-10">
            RunnableSnippet — JavaScript (engine: browser)
          </h3>
          <RunnableSnippet
            language="javascript"
            sandbox="javascript"
            engine="browser"
            code={`// The agent loop, in miniature. Press Run.\nlet turns = 0;\nfunction step(state) {\n  turns++;\n  return state === "done" ? "done" : "thinking";\n}\nlet state = "start";\nwhile (state !== "done" && turns < 5) {\n  state = turns >= 3 ? "done" : step(state);\n}\nconsole.log("Loop stopped after", turns, "turns:", state);`}
          />

          <h3 className="text-xl font-bold mb-3 mt-10">RunnableSnippet — Python (engine: wasi)</h3>
          <RunnableSnippet
            language="python"
            sandbox="python"
            engine="wasi"
            code={`# Token budget check — runs in-browser via WASI.\nbudget = 4000\nturns = [320, 180, 540, 260, 150]\nused = sum(turns)\nprint(f"{used}/{budget} tokens used ({used*100//budget}%)")`}
          />
        </section>
      </div>
    </PageTransition>
  );
}
