import type { Metadata } from 'next';
import { getAllPatterns, CHAPTERS } from '@/lib/patterns';
import { TOOLKIT_TOPICS } from '@/lib/toolkit';
import { HARNESS_CHAPTERS } from '@/lib/harness';
import { SECURITY_CHAPTERS } from '@/lib/security';
import { PageTransition } from '@/components/ui/PageTransition';
import { LearnHero } from '@/components/learn/LearnHero';
import { ConnectionsMap } from '@/components/learn/ConnectionsMap';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dak-dev.vercel.app';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Expert guides for agentic engineering — patterns for AI-assisted development and deep-dives into Claude Code\'s toolkit.',
  openGraph: {
    title: 'Learn — Patterns & Claude Code Toolkit',
    description: 'Expert guides for agentic engineering with Claude Code.',
    url: `${siteUrl}/learn`,
  },
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  const allPatterns = getAllPatterns();

  return (
    <PageTransition className="min-h-screen pb-16">
      <LearnHero
        patternCount={allPatterns.length}
        chapterCount={CHAPTERS.length}
        toolkitTopicCount={TOOLKIT_TOPICS.length}
        harnessChapterCount={HARNESS_CHAPTERS.length}
        securityChapterCount={SECURITY_CHAPTERS.length}
      />

      <ConnectionsMap />
    </PageTransition>
  );
}
