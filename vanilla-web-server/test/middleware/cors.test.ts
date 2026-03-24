import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CorsMiddleware } from '@/middlewares';

const nextRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const corsMiddleware = new CorsMiddleware({ run: nextRun });

const defaultRequest = {
  path: '/unknown',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('CorsMiddleware', () => {
  void test('returns a positive CORS response when OPTIONS request is made', async () => {
    const response = await corsMiddleware.run({
      ...defaultRequest,
      method: 'OPTIONS',
    });

    assert.equal(nextRun.mock.calls.length, 0);

    assert.equal(response.status, 204);
    assert.equal((response.headers || {})['Access-Control-Allow-Origin'], '*');
    assert.equal(response.body, null);
  });

  void test('invokes next when OPTIONS request is not made', async () => {
    await corsMiddleware.run({ ...defaultRequest, method: 'POST' });

    assert.equal(nextRun.mock.calls.length, 1);
  });
});
