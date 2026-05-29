import { ReactNode } from 'react';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS, getToolkitTopicPages, type ToolkitSubPage } from '@/lib/toolkit';
import { HARNESS_CHAPTERS } from '@/lib/harness';
import { SECURITY_CHAPTERS } from '@/lib/security';
import { LearnSidebar } from '@/components/learn/LearnSidebar';
import { LearnMobileNav } from '@/components/learn/LearnMobileNav';

export default function LearnLayout({ children }: { children: ReactNode }) {
  const allPatterns = getAllPatterns();

  const sidebarPatterns = allPatterns.map((p) => ({
    slug: p.frontmatter.slug,
    name: p.frontmatter.name,
    number: p.frontmatter.number,
    chapter: p.frontmatter.chapter,
    difficulty: p.frontmatter.difficulty,
  }));

  // Compute which sub-pages exist for each toolkit topic
  const topicSubPages: Record<string, ToolkitSubPage[]> = {};
  for (const topic of TOOLKIT_TOPICS) {
    const pages = getToolkitTopicPages(topic.slug);
    topicSubPages[topic.slug] = pages.map((p) => p.frontmatter.subPage!).filter(Boolean);
  }

  // overflow-x-clip (not -hidden): clips horizontal overflow without creating a
  // scroll container, so position:sticky descendants — the sidebar, the TOC,
  // and ScrollStory — still pin to the viewport.
  return (
    <div className="mx-auto max-w-[1400px] overflow-x-clip">
      {/* Mobile nav */}
      <LearnMobileNav
        chapters={CHAPTERS}
        patterns={sidebarPatterns}
        toolkitTopics={TOOLKIT_TOPICS}
        topicSubPages={topicSubPages}
        harnessChapters={HARNESS_CHAPTERS}
        securityChapters={SECURITY_CHAPTERS}
        className="px-4 sm:px-6 lg:hidden pt-4"
      />

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:px-8 lg:pb-8 lg:pt-6">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <LearnSidebar
            chapters={CHAPTERS}
            patterns={sidebarPatterns}
            toolkitTopics={TOOLKIT_TOPICS}
            topicSubPages={topicSubPages}
            harnessChapters={HARNESS_CHAPTERS}
            securityChapters={SECURITY_CHAPTERS}
          />
        </div>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
