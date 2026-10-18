import test from 'node:test';
import assert from 'node:assert/strict';
import {
  badgeMetadata,
  badgeName,
  badgeFilename,
  createBadge,
} from '../lib/badge.ts';

test('each quest keeps a distinct share destination and badge download', () => {
  const expected = [
    ['first-clue', 'First Clue', 'first-clue-follow-the-bitcoin.png'],
    [
      'locked-fortune',
      'Evidence Detective',
      'evidence-detective-follow-the-bitcoin.png',
    ],
    ['fake-giveaway', 'Signal Sleuth', 'signal-sleuth-follow-the-bitcoin.png'],
  ];
  for (const [quest, name, filename] of expected) {
    const badge = badgeMetadata[quest];
    assert.equal(badge.name, name);
    assert.equal(badge.filename, filename);
    assert.equal(badge.route, `/#quest/${quest}`);
    assert.ok(badge.shareText.includes(badge.questTitle));
  }
  assert.equal(badgeName, 'First Clue');
  assert.equal(badgeFilename, 'first-clue-follow-the-bitcoin.png');
});

test('the local PNG exporter draws the selected badge without mixing quest rewards', async () => {
  const originalImage = Object.getOwnPropertyDescriptor(globalThis, 'Image');
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document',
  );
  const sources = [];
  const exports = [];
  class LocalBrandImage {
    naturalWidth = 120;
    naturalHeight = 160;
    set src(value) {
      sources.push(value);
      queueMicrotask(() => this.onload());
    }
  }
  Object.defineProperty(globalThis, 'Image', {
    configurable: true,
    value: LocalBrandImage,
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement(tag) {
        assert.equal(tag, 'canvas');
        const labels = [];
        const context = {
          fillRect() {},
          strokeRect() {},
          drawImage() {},
          save() {},
          restore() {},
          beginPath() {},
          arc() {},
          moveTo() {},
          lineTo() {},
          stroke() {},
          fill() {},
          fillText(value) {
            labels.push(value);
          },
        };
        const canvas = {
          width: 0,
          height: 0,
          getContext(kind) {
            assert.equal(kind, '2d');
            return context;
          },
          toBlob(callback, type) {
            assert.equal(type, 'image/png');
            exports.push({ width: this.width, height: this.height, labels });
            callback(new Blob(['local-canvas-export'], { type }));
          },
        };
        return canvas;
      },
    },
  });
  try {
    for (const quest of ['fake-giveaway', 'locked-fortune', 'first-clue']) {
      const blob = await createBadge(
        'https://followthebitcoin.pages.dev',
        quest,
      );
      assert.equal(blob.type, 'image/png');
      const output = exports.at(-1);
      assert.equal(output.width, 1200);
      assert.equal(output.height, 1200);
      assert.ok(output.labels.includes(badgeMetadata[quest].name));
      assert.ok(output.labels.includes('followthebitcoin.pages.dev'));
      for (const other of Object.keys(badgeMetadata).filter(
        (id) => id !== quest,
      )) {
        assert.ok(!output.labels.includes(badgeMetadata[other].name));
      }
    }
    assert.deepEqual(sources, Array(3).fill('/brand/white-rabbit.png'));
  } finally {
    if (originalImage)
      Object.defineProperty(globalThis, 'Image', originalImage);
    else delete globalThis.Image;
    if (originalDocument)
      Object.defineProperty(globalThis, 'document', originalDocument);
    else delete globalThis.document;
  }
});
