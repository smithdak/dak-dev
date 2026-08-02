import Image from 'next/image';
import Link from 'next/link';
import { TagList } from './Tag';
import { formatCalendarDate } from '@/lib/utils';

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

/** Editorial article preview: image, record metadata, and one clear reading path. */
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
  const formattedDate = formatCalendarDate(date);

  return (
    <article className={`group h-full border-t border-text/20 pt-5 ${className}`}>
      <Link
        href={`/blog/${slug}`}
        className="grid h-full gap-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background sm:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.2fr)]"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-surface">
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 40vw, 28vw"
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            <time dateTime={date}>{formattedDate}</time>
            {readingTime ? <span>{readingTime}</span> : null}
          </div>

          <h2 className="font-display text-2xl leading-[1.08] tracking-tight text-text group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{excerpt}</p>

          {tags.length > 0 ? (
            <div className="mt-auto pt-5">
              <TagList tags={tags} interactive={false} />
            </div>
          ) : null}
        </div>
      </Link>
    </article>
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

export function CardList({ posts, className = '' }: CardListProps) {
  return (
    <div className={`grid gap-12 ${className}`}>
      {posts.map((post) => (
        <Card key={post.slug} {...post} />
      ))}
    </div>
  );
}
