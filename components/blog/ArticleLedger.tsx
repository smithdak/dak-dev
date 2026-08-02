import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { formatCalendarDate } from '@/lib/utils';

interface ArticleLedgerProps {
  posts: Post[];
  startIndex?: number;
  headingLevel?: 'h2' | 'h3';
}

function recordNumber(value: number): string {
  return String(value).padStart(2, '0');
}

export function ArticleLedger({ posts, startIndex = 1, headingLevel = 'h3' }: ArticleLedgerProps) {
  const Heading = headingLevel;

  return (
    <ol className="border-y border-rule">
      {posts.map((post, index) => {
        const { frontmatter } = post;

        return (
          <li key={frontmatter.slug} className="border-b border-rule last:border-b-0">
            <article className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-x-5 gap-y-4 py-6 sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-x-6 md:gap-x-7 lg:grid-cols-[4.5rem_9rem_minmax(0,1fr)_11rem] lg:items-start lg:py-7 xl:grid-cols-[4.5rem_10rem_minmax(0,1fr)_13rem]">
              <div className="col-span-2 flex min-w-0 items-center gap-4 lg:hidden">
                <span
                  className="font-display text-3xl leading-none tabular-nums text-muted sm:text-4xl"
                  aria-hidden="true"
                >
                  {recordNumber(startIndex + index)}
                </span>
                <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.09em] text-muted">
                  <time dateTime={frontmatter.date}>{formatCalendarDate(frontmatter.date)}</time>
                  <span>{post.readingTime}</span>
                </div>
              </div>

              <span
                className="hidden font-display text-4xl leading-none tabular-nums text-muted lg:block"
                aria-hidden="true"
              >
                {recordNumber(startIndex + index)}
              </span>

              <div className="hidden pt-1 text-xs font-semibold uppercase tracking-[0.09em] text-muted lg:block">
                <time dateTime={frontmatter.date}>{formatCalendarDate(frontmatter.date)}</time>
                <p className="mt-2">{post.readingTime}</p>
              </div>

              <div className="min-w-0">
                <Heading className="max-w-[28ch] font-display text-xl leading-[1.1] tracking-[-0.025em] text-text sm:text-2xl md:text-3xl md:leading-[1.08]">
                  <Link
                    href={`/blog/${frontmatter.slug}`}
                    className="decoration-1 underline-offset-[0.16em] transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
                  >
                    {frontmatter.title}
                  </Link>
                </Heading>
                <p className="mt-3 line-clamp-2 max-w-[68ch] text-sm leading-relaxed text-muted md:text-base">
                  {frontmatter.excerpt}
                </p>
              </div>

              <figure className="relative col-start-2 row-start-2 aspect-[3/2] self-start overflow-hidden bg-surface lg:col-start-4 lg:row-start-1">
                <Image
                  src={frontmatter.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 639px) 104px, (max-width: 1023px) 128px, (max-width: 1279px) 176px, 208px"
                  placeholder={frontmatter.thumbnailBlur ? 'blur' : 'empty'}
                  blurDataURL={frontmatter.thumbnailBlur}
                />
              </figure>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
