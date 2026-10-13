import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { groupTranslations } from '@/example1';

void describe('groupTranslations', () => {
  void test('when given empty input, should return {}', () => {
    const output = groupTranslations([]);

    assert.deepEqual(output, {});
  });
});
