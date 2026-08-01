'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { TagList } from '@/components/ui/Tag';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  tags: string[];
  date: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  className?: string;
}

/**
 * RelatedPosts component displays "You might also like" section
 * Shows up to 3 related posts in responsive grid
 * Neo-brutalist styling with thick borders and hard shadows
 */
export function RelatedPosts({ posts, className = '' }: RelatedPostsProps) {
  // Don't render if no posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`} aria-labelledby="related-posts-heading">
      {/* Section Header */}
      <div className="mb-8 border-b-4 border-text pb-4">
        <h2 id="related-posts-heading" className="text-3xl md:text-4xl font-bold text-text">
          You Might Also Like
        </h2>
      </div>

      {/* Posts Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial={false}
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {posts.map((post) => {
          const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <motion.article key={post.slug} variants={staggerItemVariants} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="block bg-surface border-4 border-text shadow-[8px_8px_0_0_var(--color-text)] hover:shadow-[12px_12px_0_0_var(--color-accent)] hover:border-accent transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden border-b-4 border-text">
                  <Image
                    src={post.thumbnail}
                    alt={`Cover image for ${post.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <time
                    dateTime={post.date}
                    className="block text-sm text-muted font-semibold mb-3"
                  >
                    {formattedDate}
                  </time>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text mb-3 group-hover:underline underline-offset-4 decoration-4 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mt-4">
                      <TagList tags={post.tags} interactive={false} />
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
