/**
 * Canonical site origin — single source of truth for absolute URL building.
 *
 * Sourced from NEXT_PUBLIC_SITE_URL with any trailing slash(es) stripped. A
 * base URL that ends in `/` concatenated with paths that start with `/`
 * (`${SITE_URL}/path`) emits `https://host//path`, which splits canonical /
 * OG / JSON-LD / sitemap signals across `/path` and `//path`. Normalising
 * here makes that class of bug structurally impossible regardless of how the
 * environment variable is set, so import this everywhere instead of
 * re-deriving the origin inline.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://daksmith.dev'
).replace(/\/+$/, '');
