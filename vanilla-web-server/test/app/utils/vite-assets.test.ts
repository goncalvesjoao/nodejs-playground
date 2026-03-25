import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDevelopmentViteAssetTags,
  buildProductionViteAssetTags,
} from '@/utils';

void describe('vite-assets', () => {
  void test('buildDevelopmentViteAssetTags returns Vite client and entry tags', () => {
    const tags = buildDevelopmentViteAssetTags(
      'assets/main.ts',
      'http://localhost:5173',
    );

    assert.ok(tags.includes('http://localhost:5173/@vite/client'));
    assert.ok(tags.includes('http://localhost:5173/assets/main.ts'));
  });

  void test('buildProductionViteAssetTags resolves entry css and imported chunks', () => {
    const tags = buildProductionViteAssetTags(
      {
        'assets/main.ts': {
          file: 'assets/main-abc123.js',
          src: 'assets/main.ts',
          isEntry: true,
          css: ['assets/main-def456.css'],
          imports: ['assets/chunk.ts'],
        },
        'assets/chunk.ts': {
          file: 'assets/chunk-ghi789.js',
          css: ['assets/chunk-jkl012.css'],
        },
      },
      'assets/main.ts',
    );

    assert.ok(
      tags.includes('<link rel="stylesheet" href="/assets/main-def456.css">'),
    );
    assert.ok(
      tags.includes('<link rel="stylesheet" href="/assets/chunk-jkl012.css">'),
    );
    assert.ok(
      tags.includes(
        '<link rel="modulepreload" href="/assets/chunk-ghi789.js">',
      ),
    );
    assert.ok(
      tags.includes(
        '<script type="module" src="/assets/main-abc123.js"></script>',
      ),
    );
  });
});
