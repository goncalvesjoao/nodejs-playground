import { describe, mock, test } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { viteAssetTags } from '@lib/utils';

void describe('lib - utils - viteAssetTags', () => {
  void test('returns Vite client and entry tags for development when productionMode is false', () => {
    const tags = viteAssetTags({
      productionMode: false,
      entryPath: 'assets/main.ts',
      devServerOrigin: 'http://localhost:5173',
      manifestPath: '',
    });

    assert.ok(tags.includes('http://localhost:5173/@vite/client'));
    assert.ok(tags.includes('http://localhost:5173/assets/main.ts'));
  });

  void test('returns resolved entry css and imported chunks for production when productionMode is true', () => {
    const mockContent = JSON.stringify({
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
    });

    mock.method(fs, 'readFileSync', () => mockContent);

    const tags = viteAssetTags({
      productionMode: true,
      entryPath: 'assets/main.ts',
      devServerOrigin: '',
      manifestPath: 'fake-manifest.json',
    });

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
