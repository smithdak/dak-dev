import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Re-export client-safe types and constants.
export * from './harness-types';

import type { HarnessFrontmatter, HarnessChapter } from './harness-types';
import { HARNESS_CHAPTERS } from './harness-types';

const harnessDirectory = path.join(process.cwd(), 'content/harness');

export function getHarnessChapter(slug: string): HarnessChapter | null {
  try {
    const fullPath = path.join(harnessDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as HarnessFrontmatter;
    if (!frontmatter.published) return null;
    const stats = readingTime(content);
    return { frontmatter, content, readingTime: stats.text };
  } catch {
    return null;
  }
}

export function getAllHarnessChapters(): HarnessChapter[] {
  return HARNESS_CHAPTERS.map((c) => getHarnessChapter(c.slug)).filter(
    (c): c is HarnessChapter => c !== null
  );
}
