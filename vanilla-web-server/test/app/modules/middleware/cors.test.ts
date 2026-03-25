import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CorsMiddleware } from '@/modules/middleware';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const corsMiddleware = new CorsMiddleware({ handle: nextServerModRun });

const defaultRequest = {
  path: '/unknown',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('CorsMiddleware', () => {
  void test('returns a positive CORS response when OPTIONS request is made', async () => {
    const response = await corsMiddleware.handle({
      ...defaultRequest,
      method: 'OPTIONS',
    });

    assert.equal(nextServerModRun.mock.calls.length, 0);

    assert.equal(response.status, 204);
    assert.equal((response.headers || {})['Access-Control-Allow-Origin'], '*');
    assert.equal(response.body, null);
  });

  void test('invokes nextServerMod when OPTIONS request is not made', async () => {
    await corsMiddleware.handle({ ...defaultRequest, method: 'POST' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
