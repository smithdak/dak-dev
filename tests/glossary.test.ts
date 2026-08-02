import assert from 'node:assert/strict';
import test from 'node:test';
import rehypeGlossary from '@/lib/rehype-glossary';

interface TestNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: TestNode[];
  value?: string;
}

test('glossary transform injects only matched entry data', () => {
  const paragraph: TestNode = {
    type: 'element',
    tagName: 'p',
    properties: {},
    children: [{ type: 'text', value: 'An agent uses tools. The agent then checks its work.' }],
  };
  const tree = { type: 'root', children: [paragraph] };

  rehypeGlossary()(tree);

  const glossaryNodes = (paragraph.children ?? []).filter(
    (node) => 'tagName' in node && node.tagName === 'glossaryterm'
  );

  assert.equal(glossaryNodes.length, 1);
  const properties = glossaryNodes[0]?.properties ?? {};
  assert.equal(properties.term, 'Agent');
  assert.equal(typeof properties.analogy, 'string');
  assert.equal(typeof properties.definition, 'string');
  assert.ok(String(properties.analogy).length > 0);
  assert.ok(String(properties.definition).length > 0);
  assert.equal('example' in properties, false);
});
