/**
 * Search module types
 * Shared between server and client code
 */

export type SearchContentType =
  'post' | 'pattern' | 'toolkit' | 'harness' | 'security' | 'start' | 'work';

export interface SearchIndexItem {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  contentPreview: string;
  tags: string[];
  keywords: string[];
  date?: string;
  type: SearchContentType;
  label: string;
  section?: string;
}
