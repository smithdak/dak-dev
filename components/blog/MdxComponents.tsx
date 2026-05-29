import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { slugify } from '@/lib/utils';
import { AgentLoopStepper } from '@/components/interactive/AgentLoopStepper';
import { ScrollStory } from '@/components/interactive/ScrollStory';
import { RunnableSnippet } from '@/components/interactive/RunnableSnippet';

/**
 * Custom MDX components with neo-brutalist styling
 * These override the default markdown elements
 */

// Headings with auto-generated IDs for anchor links
function H1({ children }: { children?: ReactNode }) {
  const text = typeof children === 'string' ? children : '';
  const id = slugify(text);

  return (
    <h1
      id={id}
      className="text-4xl md:text-5xl font-bold mb-6 mt-12 border-b-4 border-text pb-4 scroll-mt-20"
    >
      {children}
    </h1>
  );
}

function H2({ children }: { children?: ReactNode }) {
  const text = typeof children === 'string' ? children : '';
  const id = slugify(text);

  return (
    <h2
      id={id}
      className="text-3xl md:text-4xl font-bold mb-4 mt-10 border-l-4 border-accent pl-4 scroll-mt-20"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children?: ReactNode }) {
  const text = typeof children === 'string' ? children : '';
  const id = slugify(text);

  return (
    <h3 id={id} className="text-2xl md:text-3xl font-bold mb-3 mt-8 scroll-mt-20">
      {children}
    </h3>
  );
}

function H4({ children }: { children?: ReactNode }) {
  return <h4 className="text-xl md:text-2xl font-bold mb-3 mt-6">{children}</h4>;
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
function A({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  const isExternal = href?.startsWith('http');
  const isAnchor = href?.startsWith('#');

  const className =
    'text-text font-semibold underline decoration-2 underline-offset-4 hover:decoration-accent hover:decoration-4 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} inline-flex items-center gap-1`}
      >
        {children}
        <svg
          className="w-4 h-4 inline-block text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
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
      <span className="block my-8 border-4 border-text">
        <Image
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          className="w-full h-auto"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E"
        />
      </span>
    );
  }

  // For images without dimensions, use fill with aspect ratio container
  return (
    <span className="block my-8 border-4 border-text relative aspect-video">
      <Image
        src={src}
        alt={alt || ''}
        fill
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230a0a0a'/%3E%3C/svg%3E"
      />
    </span>
  );
}

// Blockquotes with brutalist styling
function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-4 border-accent bg-surface p-6 italic">
      <div className="text-text">{children}</div>
    </blockquote>
  );
}

// Unordered lists
function Ul({ children }: { children?: ReactNode }) {
  return (
    <ul className="my-6 ml-6 space-y-2 list-none">
      {children}
    </ul>
  );
}

// Ordered lists
function Ol({ children }: { children?: ReactNode }) {
  return (
    <ol className="my-6 ml-6 space-y-2 list-none counter-reset-[item]">
      {children}
    </ol>
  );
}

// List items with custom bullets/numbers
function Li({ children }: { children?: ReactNode }) {
  return (
    <li className="relative pl-6 text-muted before:content-['▪'] before:absolute before:left-0 before:text-text before:font-bold">
      {children}
    </li>
  );
}

// Horizontal rule
function Hr() {
  return <hr className="my-12 border-0 border-t-4 border-text" />;
}

// Strong (bold)
function Strong({ children }: { children?: ReactNode }) {
  return <strong className="font-bold text-text">{children}</strong>;
}

// Em (italic)
function Em({ children }: { children?: ReactNode }) {
  return <em className="italic text-text">{children}</em>;
}

// Inline code
function Code({ children }: { children?: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-surface/50 text-text text-sm font-mono">
      {children}
    </code>
  );
}

// Table components with scroll hint on mobile
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="my-8 border-2 border-text relative">
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
    <th className="bg-surface px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-text border-b-2 border-text">
      {children}
    </th>
  );
}

function Td({ children }: { children?: ReactNode }) {
  const text = children?.toString().trim();

  let content: ReactNode = children;
  if (text === 'Yes') {
    content = <span className="text-accent font-medium">✓ Yes</span>;
  } else if (text === 'No') {
    content = <span className="text-muted/50">✗ No</span>;
  } else if (text === 'Experimental') {
    content = <span className="text-yellow-400 font-medium">◆ Experimental</span>;
  }

  return (
    <td className="px-4 py-3 text-muted border-b border-muted/30">{content}</td>
  );
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
  // Interactive "explorable explanation" components (client islands).
  // Available to blog, harness, and pattern MDX via this shared map.
  AgentLoopStepper,
  ScrollStory,
  RunnableSnippet,
};
