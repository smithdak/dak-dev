'use client';

/**
 * Giscus Comments Component
 * Lazy-loads GitHub Discussions-based comments using IntersectionObserver
 * Triggers loading only when comment section is 200px from viewport
 */

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';

// Dynamically import Giscus to avoid loading it in the initial bundle
const Giscus = dynamic(() => import('@giscus/react'), {
  ssr: false,
  loading: () => <p className="text-muted">Loading comments...</p>,
});

interface CommentsProps {
  className?: string;
}

export function Comments({ className = '' }: CommentsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Create IntersectionObserver to lazy-load comments
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before section is visible
      }
    );

    if (commentRef.current) {
      observer.observe(commentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div ref={commentRef} className={`border-t border-text/20 pt-12 ${className}`} id="comments">
      <h2 className="mb-8 font-display text-4xl tracking-[-0.025em]">Discussion</h2>

      {isVisible ? (
        <div className="border-y border-text/20 py-6">
          <Giscus
            id="comments"
            repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={resolvedTheme}
            lang="en"
            loading="lazy"
          />
        </div>
      ) : (
        // Placeholder while comments are loading
        <div className="border-y border-text/20 py-12 text-center">
          <p className="text-muted">Loading comments...</p>
        </div>
      )}
    </div>
  );
}
