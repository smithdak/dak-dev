import remarkGfm from 'remark-gfm';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeGlossary from './rehype-glossary';
import rehypeHeadingIds from './rehype-heading-ids';

const isDev = process.env.NODE_ENV === 'development';
type SerializeOptions = NonNullable<MDXRemoteProps['options']>;

async function getMdxOptions(): Promise<SerializeOptions> {
  if (isDev) {
    return {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHeadingIds, rehypeGlossary],
      },
    } as SerializeOptions;
  }

  const [{ default: rehypePrettyCode }, { editorialCodeTheme }, { getHighlighterInstance }] =
    await Promise.all([
      import('rehype-pretty-code'),
      import('./shiki-theme'),
      import('./shiki-highlighter'),
    ]);

  const highlighter = await getHighlighterInstance();

  return {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypePrettyCode,
          {
            theme: editorialCodeTheme,
            keepBackground: true,
            defaultLang: 'plaintext',
            getHighlighter: () => highlighter,
          },
        ],
        rehypeGlossary,
      ],
    },
  } as SerializeOptions;
}

export { getMdxOptions };
