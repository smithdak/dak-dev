import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeJsonLd } from '@/lib/json-ld';

test('serializeJsonLd preserves data without exposing an inline script terminator', () => {
  const payload = {
    headline: '</script><script>alert("xss")</script>',
    description: 'A & B\u2028next line',
  };

  const serialized = serializeJsonLd(payload);

  assert.equal(serialized.includes('</script>'), false);
  assert.equal(serialized.includes('<'), false);
  assert.equal(serialized.includes('&'), false);
  assert.deepEqual(JSON.parse(serialized), payload);
});
