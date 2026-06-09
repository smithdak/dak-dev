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
  thumbnailText?: string;  // Short 1-5 word tagline for thumbnail overlay
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

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
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return allPosts;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as PostFrontmatter;
    const stats = readingTime(content);

    return {
      frontmatter: {
        ...frontmatter,
        slug,
      },
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[posts] Failed to load post: ${slug}`, error);
    }
    return null;
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((fileName) => fileName.endsWith('.mdx')).map((fileName) => fileName.replace(/\.mdx$/, ''));
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
      return new Date(b.post.frontmatter.date).getTime() - new Date(a.post.frontmatter.date).getTime();
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
