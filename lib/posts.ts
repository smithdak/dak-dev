import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
  thumbnail: string;
  thumbnailBlur?: string;
  hero: string;
  heroBlur?: string;
  published: boolean;
  /** Pin this post to the homepage "Featured Post" slot; newest featured wins. */
  featured?: boolean;
  author?: string;
  keywords?: string[];
  thumbnailText?: string; // Short 1-5 word tagline for thumbnail overlay
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

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

function optionalString(data: Record<string, unknown>, key: string): string | undefined {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`frontmatter.${key} must be a non-empty string when present`);
  }
  return value;
}

function requireStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new TypeError(`frontmatter.${key} must be an array of strings`);
  }
  return value;
}

function optionalStringArray(data: Record<string, unknown>, key: string): string[] | undefined {
  if (data[key] === undefined) return undefined;
  return requireStringArray(data, key);
}

function requireBoolean(data: Record<string, unknown>, key: string): boolean {
  const value = data[key];
  if (typeof value !== 'boolean') {
    throw new TypeError(`frontmatter.${key} must be a boolean`);
  }
  return value;
}

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return (
    date.getUTCFullYear() === Number(match[1]) &&
    date.getUTCMonth() === Number(match[2]) - 1 &&
    date.getUTCDate() === Number(match[3])
  );
}

/** Parse and validate frontmatter before it reaches a page or generated index. */
export function parsePostFrontmatter(data: unknown, slug: string): PostFrontmatter {
  assertRecord(data, `Post "${slug}" frontmatter`);

  const date = requireString(data, 'date');
  if (!isValidCalendarDate(date)) {
    throw new TypeError('frontmatter.date must be a valid YYYY-MM-DD calendar date');
  }

  const featured = data.featured;
  if (featured !== undefined && typeof featured !== 'boolean') {
    throw new TypeError('frontmatter.featured must be a boolean when present');
  }

  return {
    title: requireString(data, 'title'),
    date,
    excerpt: requireString(data, 'excerpt'),
    slug,
    tags: requireStringArray(data, 'tags'),
    thumbnail: requireString(data, 'thumbnail'),
    thumbnailBlur: optionalString(data, 'thumbnailBlur'),
    hero: requireString(data, 'hero'),
    heroBlur: optionalString(data, 'heroBlur'),
    published: requireBoolean(data, 'published'),
    featured,
    author: optionalString(data, 'author'),
    keywords: optionalStringArray(data, 'keywords'),
    thumbnailText: optionalString(data, 'thumbnailText'),
  };
}

export function getAllPosts(): Post[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      return getPostBySlug(slug);
    })
    .filter((post): post is Post => post !== null && post.frontmatter.published)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));

  return allPosts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = parsePostFrontmatter(data, slug);
    const stats = readingTime(content);

    return {
      frontmatter,
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[posts] Invalid post "${slug}": ${message}`);
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}

/** Static route candidates must never include drafts. */
export function getPublishedPostSlugs(): string[] {
  return getAllSlugs().filter((slug) => getPostBySlug(slug)?.frontmatter.published === true);
}

/**
 * Get related posts based on tag similarity
 * @param currentSlug - The slug of the current post to exclude from results
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by relevance
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): Post[] {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((post) => post.frontmatter.slug === currentSlug);

  if (!currentPost) {
    return [];
  }

  const currentTags = new Set(currentPost.frontmatter.tags || []);

  // Score each post based on tag similarity
  const scoredPosts = allPosts
    .filter((post) => post.frontmatter.slug !== currentSlug) // Exclude current post
    .map((post) => {
      const postTags = new Set(post.frontmatter.tags || []);

      // Calculate number of matching tags
      const matchingTags = Array.from(currentTags).filter((tag) => postTags.has(tag));
      const matchScore = matchingTags.length;

      return {
        post,
        score: matchScore,
      };
    })
    .filter((item) => item.score > 0) // Only include posts with at least one matching tag
    .sort((a, b) => {
      // First sort by score (more matching tags = higher priority)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by date (most recent first)
      return b.post.frontmatter.date.localeCompare(a.post.frontmatter.date);
    });

  // If we have enough posts with matching tags, return them
  if (scoredPosts.length >= limit) {
    return scoredPosts.slice(0, limit).map((item) => item.post);
  }

  // Otherwise, fill remaining slots with most recent posts
  const relatedPosts = scoredPosts.map((item) => item.post);
  const remainingSlots = limit - relatedPosts.length;

  if (remainingSlots > 0) {
    const additionalPosts = allPosts
      .filter(
        (post) =>
          post.frontmatter.slug !== currentSlug &&
          !relatedPosts.some((rp) => rp.frontmatter.slug === post.frontmatter.slug)
      )
      .slice(0, remainingSlots);

    relatedPosts.push(...additionalPosts);
  }

  return relatedPosts;
}
