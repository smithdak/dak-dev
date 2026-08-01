'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { TagList } from './Tag';

interface CardProps {
  title: string;
  excerpt: string;
  slug: string;
  thumbnail: string;
  date: string;
  readingTime?: string;
  tags?: string[];
  className?: string;
}

/**
 * Card component for blog post previews
 * Neo-brutalist styling with thick borders and hard shadows
 */
export function Card({
  title,
  excerpt,
  slug,
  thumbnail,
  date,
  readingTime,
  tags = [],
  className = '',
}: CardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article variants={staggerItemVariants} className={`group ${className}`}>
      <Link
        href={`/blog/${slug}`}
        className="block bg-surface border-4 border-text shadow-[8px_8px_0_0_var(--color-text)] hover:shadow-[12px_12px_0_0_var(--color-accent)] hover:border-accent transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden border-b-4 border-text">
          <Image
            src={thumbnail}
            alt={`Cover image for ${title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-sm text-muted mb-4">
            <time dateTime={date} className="font-semibold">
              {formattedDate}
            </time>
            {readingTime && (
              <>
                <span className="text-text" aria-hidden="true">
                  •
                </span>
                <span className="text-accent">{readingTime}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-text mb-3 group-hover:underline underline-offset-4 decoration-4">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-muted leading-relaxed mb-4 line-clamp-3">{excerpt}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4">
              <TagList tags={tags} interactive={false} />
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

interface CardListProps {
  posts: Array<{
    title: string;
    excerpt: string;
    slug: string;
    thumbnail: string;
    date: string;
    readingTime?: string;
    tags?: string[];
  }>;
  className?: string;
}

/**
 * CardList component for displaying multiple post cards in a grid
 */
export function CardList({ posts, className = '' }: CardListProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {posts.map((post) => (
        <Card key={post.slug} {...post} />
      ))}
    </motion.div>
  );
}
