import { Metadata } from 'next';
import { SearchContent } from './SearchContent';

// SEO metadata with noindex
export const metadata: Metadata = {
  title: 'Search',
  description: 'Search articles, agent patterns, and technical guides across the site.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return <SearchContent />;
}
