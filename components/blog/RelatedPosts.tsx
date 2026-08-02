import Image from 'next/image';
import Link from 'next/link';
import { formatCalendarDate } from '@/lib/utils';

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

export function RelatedPosts({ posts, className = '' }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className={className} aria-labelledby="related-posts-heading">
      <div className="border-t border-text/20 pt-7">
        <h2 id="related-posts-heading" className="font-display text-4xl tracking-[-0.025em]">
          Continue reading
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Selected from nearby topics and the recent archive.
        </p>
      </div>

      <div className="mt-8 divide-y divide-text/20 border-y border-text/20">
        {posts.map((post) => (
          <article key={post.slug} className="group py-6">
            <Link
              href={`/blog/${post.slug}`}
              className="grid gap-5 focus:outline-none focus:ring-2 focus:ring-accent sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-surface">
                <Image
                  src={post.thumbnail}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="160px"
                />
              </div>
              <div>
                <time
                  dateTime={post.date}
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-muted"
                >
                  {formatCalendarDate(post.date)}
                </time>
                <h3 className="mt-2 font-display text-2xl leading-tight group-hover:underline group-hover:underline-offset-4">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:block">
                Read
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
