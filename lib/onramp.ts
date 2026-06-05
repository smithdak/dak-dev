import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// Re-export client-safe types, constants, and the glossary data so callers have
// one import site (mirrors lib/security.ts re-exporting ./security-types).
export * from './onramp-types';

import type {
  DemoFrontmatter,
  DemoWalkthrough,
  ExplainerFrontmatter,
  Explainer,
} from './onramp-types';
import { DEMO_WALKTHROUGHS, EXPLAINERS } from './onramp-types';

const demosDirectory = path.join(process.cwd(), 'content/onramp/demos');
const explainersDirectory = path.join(process.cwd(), 'content/onramp/explainers');

export function getDemo(slug: string): DemoWalkthrough | null {
  try {
    const fullPath = path.join(demosDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as DemoFrontmatter;
    if (!frontmatter.published) return null;
    const stats = readingTime(content);
    return { frontmatter, content, readingTime: stats.text };
  } catch {
    return null;
  }
}

export function getAllDemos(): DemoWalkthrough[] {
  return DEMO_WALKTHROUGHS.map((d) => getDemo(d.slug)).filter(
    (d): d is DemoWalkthrough => d !== null
  );
}

export function getExplainer(slug: string): Explainer | null {
  try {
    const fullPath = path.join(explainersDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as ExplainerFrontmatter;
    if (!frontmatter.published) return null;
    const stats = readingTime(content);
    return { frontmatter, content, readingTime: stats.text };
  } catch {
    return null;
  }
}

export function getAllExplainers(): Explainer[] {
  return EXPLAINERS.map((e) => getExplainer(e.slug)).filter(
    (e): e is Explainer => e !== null
  );
}
