import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { formatCalendarDate } from '@/lib/utils';
import { slugifyTag } from '@/lib/tags';
import { formatWritingTag } from '@/lib/writing';

interface ArticleLeadProps {
  post: Post;
}

export function ArticleLead({ post }: ArticleLeadProps) {
  const { frontmatter } = post;

  return (
    <article className="border-y border-rule py-6 md:py-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(21rem,3fr)] lg:items-center lg:gap-10 xl:gap-12">
        <figure className="relative aspect-video overflow-hidden bg-surface">
          <Image
            src={frontmatter.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, (max-width: 1920px) 58vw, 1120px"
            placeholder={frontmatter.heroBlur ? 'blur' : 'empty'}
            blurDataURL={frontmatter.heroBlur}
          />
        </figure>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            <time dateTime={frontmatter.date}>{formatCalendarDate(frontmatter.date)}</time>
            <span>{post.readingTime}</span>
          </div>

          <h2 className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.02] tracking-[-0.035em] text-text sm:text-5xl">
            <Link
              href={`/blog/${frontmatter.slug}`}
              className="decoration-1 underline-offset-[0.16em] transition-colors hover:text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-background"
            >
              {frontmatter.title}
            </Link>
          </h2>

          <p className="mt-5 max-w-[42rem] text-lg leading-relaxed text-muted">
            {frontmatter.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${slugifyTag(tag)}`}
                className="inline-flex min-h-11 items-center border-b border-rule text-xs font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                {formatWritingTag(tag)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
