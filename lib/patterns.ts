import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type PatternDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type RelationshipType = 'enables' | 'composes' | 'prevents' | 'contrasts';

export interface PatternRelationship {
  slug: string;
  type: RelationshipType;
  note: string;
}

export interface PatternFrontmatter {
  name: string;
  slug: string;
  chapter: number;
  number: string;
  intent: string;
  difficulty: PatternDifficulty;
  published: boolean;
  keywords?: string[];
  relatedPatterns?: PatternRelationship[];
}

export interface Pattern {
  frontmatter: PatternFrontmatter;
  content: string;
  readingTime: string;
}

export interface ChapterMeta {
  number: number;
  name: string;
  slug: string;
  description: string;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    number: 1,
    name: 'Foundation',
    slug: 'foundation',
    description: 'Setting up your environment, codebase, and tools for agent success.',
  },
  {
    number: 2,
    name: 'Context',
    slug: 'context',
    description: "Managing what the agent knows — and doesn't know.",
  },
  {
    number: 3,
    name: 'Task',
    slug: 'task',
    description: 'Breaking work into units that agents handle well.',
  },
  {
    number: 4,
    name: 'Steering',
    slug: 'steering',
    description: 'Guiding agent behavior toward the output you actually want.',
  },
  {
    number: 5,
    name: 'Verification',
    slug: 'verification',
    description: "Ensuring the agent's output is correct, complete, and safe.",
  },
  {
    number: 6,
    name: 'Recovery',
    slug: 'recovery',
    description: 'What to do when things go wrong.',
  },
];

const patternsDirectory = path.join(process.cwd(), 'content/patterns');

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function requireString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`frontmatter.${key} must be a non-empty string`);
  }
  return value;
}

/** Parse and validate pattern frontmatter before published content is routed. */
export function parsePatternFrontmatter(data: unknown, slug: string): PatternFrontmatter {
  assertRecord(data, `Pattern "${slug}" frontmatter`);

  const chapter = data.chapter;
  if (!Number.isInteger(chapter) || (chapter as number) < 1) {
    throw new TypeError('frontmatter.chapter must be a positive integer');
  }

  const difficulty = data.difficulty;
  if (!['beginner', 'intermediate', 'advanced'].includes(String(difficulty))) {
    throw new TypeError('frontmatter.difficulty must be beginner, intermediate, or advanced');
  }

  if (typeof data.published !== 'boolean') {
    throw new TypeError('frontmatter.published must be a boolean');
  }

  if (
    data.keywords !== undefined &&
    (!Array.isArray(data.keywords) || !data.keywords.every((item) => typeof item === 'string'))
  ) {
    throw new TypeError('frontmatter.keywords must be an array of strings when present');
  }

  return {
    name: requireString(data, 'name'),
    slug,
    chapter: chapter as number,
    number: requireString(data, 'number'),
    intent: requireString(data, 'intent'),
    difficulty: difficulty as PatternDifficulty,
    published: data.published,
    keywords: data.keywords as string[] | undefined,
    relatedPatterns: data.relatedPatterns as PatternRelationship[] | undefined,
  };
}

export function getAllPatterns(): Pattern[] {
  if (!fs.existsSync(patternsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(patternsDirectory);
  const allPatterns = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      return getPatternBySlug(slug);
    })
    .filter((pattern): pattern is Pattern => pattern !== null && pattern.frontmatter.published)
    .sort((a, b) => {
      const chapterDiff = a.frontmatter.chapter - b.frontmatter.chapter;
      if (chapterDiff !== 0) return chapterDiff;
      return parseFloat(a.frontmatter.number) - parseFloat(b.frontmatter.number);
    });

  return allPatterns;
}

export function getPatternBySlug(slug: string): Pattern | null {
  const fullPath = path.join(patternsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = parsePatternFrontmatter(data, slug);
    const stats = readingTime(content);

    return {
      frontmatter,
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[patterns] Invalid pattern "${slug}": ${message}`);
  }
}

export function getAllPatternSlugs(): string[] {
  if (!fs.existsSync(patternsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(patternsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}

/** Static route candidates must never include unpublished patterns. */
export function getPublishedPatternSlugs(): string[] {
  return getAllPatternSlugs().filter(
    (slug) => getPatternBySlug(slug)?.frontmatter.published === true
  );
}

export function getPatternsByChapter(chapterNumber: number): Pattern[] {
  return getAllPatterns().filter((p) => p.frontmatter.chapter === chapterNumber);
}

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

/**
 * Extract "Signals" bullet points from pattern MDX content.
 * Looks for a ## Signals section and pulls the first N bullet items.
 */
export function extractSignals(content: string, maxItems: number = 3): string[] {
  const lines = content.split('\n');
  const signalsIdx = lines.findIndex((l) => /^##\s+Signals/.test(l.trim()));
  if (signalsIdx === -1) return [];

  const signals: string[] = [];
  for (let i = signalsIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) break; // next section
    if (line.startsWith('- ') || line.startsWith('* ')) {
      signals.push(line.replace(/^[-*]\s+/, ''));
      if (signals.length >= maxItems) break;
    }
  }
  return signals;
}

export type ToolName = 'claude-code' | 'cursor' | 'copilot' | 'windsurf';

export interface ToolExample {
  description: string;
  code: string;
}

const toolExamplesDirectory = path.join(process.cwd(), 'content/patterns/tools');

export function getToolExamples(slug: string): Record<ToolName, ToolExample> | null {
  try {
    const filePath = path.join(toolExamplesDirectory, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as Record<ToolName, ToolExample>;
  } catch {
    return null;
  }
}

export function getRelatedPatterns(
  pattern: Pattern
): (Pattern & { relationship: PatternRelationship })[] {
  const related = pattern.frontmatter.relatedPatterns || [];
  return related
    .map((rel) => {
      const relatedPattern = getPatternBySlug(rel.slug);
      if (!relatedPattern || !relatedPattern.frontmatter.published) return null;
      return { ...relatedPattern, relationship: rel };
    })
    .filter((p): p is Pattern & { relationship: PatternRelationship } => p !== null);
}
