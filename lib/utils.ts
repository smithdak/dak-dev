/**
 * Shared utility functions
 */

/**
 * Convert text to a URL-friendly slug
 * Used for generating heading IDs, URL slugs, etc.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Format a date string for display
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return formatCalendarDate(dateString, options);
}

/**
 * Format an editorial calendar date without letting the viewer's timezone
 * shift it to the previous day. `YYYY-MM-DD` frontmatter is a date, not a
 * midnight UTC instant.
 */
export function formatCalendarDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const calendarDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  const date = calendarDate
    ? new Date(
        Date.UTC(Number(calendarDate[1]), Number(calendarDate[2]) - 1, Number(calendarDate[3]))
      )
    : new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid date: ${dateString}`);
  }

  return new Intl.DateTimeFormat('en-US', {
    ...options,
    ...(calendarDate ? { timeZone: 'UTC' } : {}),
  }).format(date);
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if code is running on the server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if code is running on the client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}
