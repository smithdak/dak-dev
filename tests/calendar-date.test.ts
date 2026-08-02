import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCalendarDate } from '@/lib/utils';

test('formatCalendarDate does not shift date-only frontmatter across timezones', () => {
  assert.equal(formatCalendarDate('2026-02-01'), 'February 1, 2026');
});

test('formatCalendarDate rejects invalid input', () => {
  assert.throws(() => formatCalendarDate('not-a-date'), /Invalid date/);
});
