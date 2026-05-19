import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Re-export client-safe types and constants.
export * from './security-types';

import type { SecurityFrontmatter, SecurityChapter } from './security-types';
import { SECURITY_CHAPTERS } from './security-types';

const securityDirectory = path.join(process.cwd(), 'content/security');

export function getSecurityChapter(slug: string): SecurityChapter | null {
  try {
    const fullPath = path.join(securityDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as SecurityFrontmatter;
    if (!frontmatter.published) return null;
    const stats = readingTime(content);
    return { frontmatter, content, readingTime: stats.text };
  } catch {
    return null;
  }
}

export function getAllSecurityChapters(): SecurityChapter[] {
  return SECURITY_CHAPTERS.map((c) => getSecurityChapter(c.slug)).filter(
    (c): c is SecurityChapter => c !== null
  );
}
