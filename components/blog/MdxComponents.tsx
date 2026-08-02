import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { GlossaryTerm } from '@/components/learn/GlossaryTerm';

/**
 * Editorial MDX components shared by articles and Learn guides.
 * These override the default markdown elements
 */

// Headings with auto-generated IDs for anchor links
function H1({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <h1
      id={id}
      className="mb-6 mt-14 scroll-mt-24 border-b border-text/20 pb-5 font-display text-4xl leading-tight tracking-tight md:text-5xl"
    >
      {children}
    </h1>
  );
}

function H2({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mb-4 mt-12 scroll-mt-24 font-display text-3xl leading-tight tracking-tight md:text-4xl"
    >
      {children}
    </h2>
  );
}

function H3({ children, id }: { children?: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mb-3 mt-9 scroll-mt-24 font-display text-2xl leading-tight md:text-3xl">
      {children}
    </h3>
  );
}

function H4({ children }: { children?: ReactNode }) {
  return <h4 className="mb-3 mt-7 font-display text-xl md:text-2xl">{children}</h4>;
}

function H5({ children }: { children?: ReactNode }) {
  return <h5 className="text-lg md:text-xl font-bold mb-2 mt-4">{children}</h5>;
}

function H6({ children }: { children?: ReactNode }) {
  return <h6 className="text-base md:text-lg font-bold mb-2 mt-4">{children}</h6>;
}

// Paragraph
function P({ children }: { children?: ReactNode }) {
  return <p className="mb-6 leading-relaxed text-muted">{children}</p>;
}

// Links with external link indicator
function A({ href, children }: { href?: string; children?: ReactNode }) {
  const isExternal = href?.startsWith('http');
  const isAnchor = href?.startsWith('#');

  const className =
    'font-semibold text-text underline decoration-text/35 decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href || '#'} className={className}>
      {children}
    </Link>
  );
}

// Images using next/image
function Img({
  src,
  alt,
  width,
  height,
}: {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  if (!src) return null;

  // For external images or if dimensions are provided
  if (width && height) {
    return (
      <span className="my-9 block overflow-hidden bg-surface">
        <Image src={src} alt={alt || ''} width={width} height={height} className="w-full h-auto" />
      </span>
    );
  }

  // For images without dimensions, use fill with aspect ratio container
  return (
    <span className="relative my-9 block aspect-video overflow-hidden bg-surface">
      <Image src={src} alt={alt || ''} fill className="object-cover" />
    </span>
  );
}

function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-9 border-l-2 border-accent py-1 pl-6 font-display text-xl italic leading-relaxed">
      <div className="text-text">{children}</div>
    </blockquote>
  );
}

// Unordered lists
function Ul({ children }: { children?: ReactNode }) {
  return <ul className="my-6 ml-6 list-disc space-y-2 marker:text-accent">{children}</ul>;
}

// Ordered lists
function Ol({ children }: { children?: ReactNode }) {
  return (
    <ol className="my-6 ml-6 list-decimal space-y-2 marker:font-semibold marker:text-accent">
      {children}
    </ol>
  );
}

function Li({ children }: { children?: ReactNode }) {
  return <li className="pl-2 leading-relaxed text-muted">{children}</li>;
}

// Horizontal rule
function Hr() {
  return <hr className="my-12 border-0 border-t border-text/20" />;
}

// Strong (bold)
function Strong({ children }: { children?: ReactNode }) {
  return <strong className="font-bold text-text">{children}</strong>;
}

// Em (italic)
function Em({ children }: { children?: ReactNode }) {
  return <em className="italic text-text">{children}</em>;
}

type CodeProps = React.ComponentPropsWithoutRef<'code'>;

// Inline code and fenced-code passthrough. rehype-pretty-code attaches its
// language, theme, line-number, and highlighting contract to the code element;
// keep those props intact instead of styling every code node as inline prose.
function Code({ children, className, ...props }: CodeProps) {
  const isFencedCode =
    className?.includes('language-') ||
    'data-language' in props ||
    'data-theme' in props ||
    'data-line-numbers' in props;

  if (isFencedCode) {
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  }

  return (
    <code
      {...props}
      className={`bg-surface/50 px-1.5 py-0.5 font-mono text-sm text-text ${className || ''}`}
    >
      {children}
    </code>
  );
}

// Table components with scroll hint on mobile
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="relative my-9 border-y border-text/20">
      <div className="overflow-x-auto table-scroll-container">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

function Thead({ children }: { children?: ReactNode }) {
  return <thead>{children}</thead>;
}

function Tbody({ children }: { children?: ReactNode }) {
  return <tbody>{children}</tbody>;
}

function Tr({ children }: { children?: ReactNode }) {
  return <tr className="hover:bg-surface/30 transition-colors">{children}</tr>;
}

function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="border-b border-text/30 bg-surface px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-text">
      {children}
    </th>
  );
}

function Td({ children }: { children?: ReactNode }) {
  const text = children?.toString().trim();

  let content: ReactNode = children;
  if (text === 'Yes') {
    content = <span className="font-medium text-accent">Yes</span>;
  } else if (text === 'No') {
    content = <span className="text-muted">No</span>;
  } else if (text === 'Experimental') {
    content = <span className="font-medium text-chapter-5">Experimental</span>;
  }

  return <td className="px-4 py-3 text-muted border-b border-muted/30">{content}</td>;
}

/**
 * Export MDX components object
 */
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  a: A,
  img: Img,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  strong: Strong,
  em: Em,
  code: Code,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  // Auto-glossary "define on first use" toggletip. lib/rehype-glossary wraps the
  // first occurrence of each Decoder term in a <glossaryterm> element; this maps
  // that element to the accessible toggletip component. Site-wide via this map.
  glossaryterm: GlossaryTerm,
};
