import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { myFunction } from '@/example';

void describe('myFunction', () => {
  void test('should return a structured output', () => {
    const input = {};

    const expectedOutput = {};

    const output = myFunction(input);

    assert.deepEqual(
      output,
      expectedOutput,
      'The output did not match the expected result',
    );
  });
});
