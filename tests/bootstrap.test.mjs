import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { compactBootstrap } from '../scripts/compact-bootstrap.mjs';
import { inlineScriptHashes, pagesHeaders } from '../scripts/pages-release.mjs';

const prefix =
  '((self[Symbol.for("vinext.navigationRuntime")]??={bootstrap:{routeManifest:null},functions:{}}).bootstrap.rsc??={rsc:[]}).rsc.push(';
const chunk = (value) => `<script>${prefix}${JSON.stringify(value)})</script>`;
function executeChunks(html) {
  const self = {};
  for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
    runInNewContext(code, { self, Symbol });
  return Array.from(
    self[Symbol.for('vinext.navigationRuntime')].bootstrap.rsc.rsc,
  );
}

test('static RSC chunk compaction preserves ordered payloads and fits the Pages CSP', () => {
  const payloads = Array.from(
    { length: 50 },
    (_, i) => `chunk ${i}: "árvíz"\\\n\u2028`,
  );
  const html = '<main>Reading edition</main>' + payloads.map(chunk).join('\n');
  assert.throws(() => pagesHeaders(html), /2,000/);
  const compact = compactBootstrap(html);
  assert.deepEqual(executeChunks(compact), executeChunks(html));
  assert.deepEqual(executeChunks(compact), payloads);
  assert.equal(inlineScriptHashes(compact).length, 1);
  assert(
    pagesHeaders(compact)
      .split('\n')
      .every((line) => line.length <= 2000),
  );
  assert.equal(compactBootstrap(compact), compact);
});

test('compaction never crosses markup, script attributes or unknown executable code', () => {
  const barriers = [
    '<div>Keep this DOM boundary</div>',
    '<script src="/app.js"></script>',
    `<script type="module">${prefix}"module")</script>`,
    `<script nonce="example">${prefix}"nonce")</script>`,
    '<script>self.other = true</script>',
    `<script>${prefix}"not a string-only call");self.other=true)</script>`,
  ];
  for (const barrier of barriers) {
    const html = chunk('before') + barrier + chunk('after');
    assert.equal(compactBootstrap(html), html);
  }
});
