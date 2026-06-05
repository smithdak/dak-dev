import remarkGfm from 'remark-gfm';
import rehypeGlossary from './rehype-glossary';

const isDev = process.env.NODE_ENV === 'development';

async function getMdxOptions() {
  if (isDev) {
    return {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeGlossary],
      },
    };
  }

  const [{ default: rehypePrettyCode }, { neoBrutalistTheme }, { getHighlighterInstance }] =
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
        [
          rehypePrettyCode,
          {
            theme: neoBrutalistTheme,
            keepBackground: true,
            defaultLang: 'plaintext',
            getHighlighter: () => highlighter,
          },
        ],
        rehypeGlossary,
      ],
    },
  };
}

export { getMdxOptions };
