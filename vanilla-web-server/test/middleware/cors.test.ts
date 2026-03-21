import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CorsMiddleware } from '@/middlewares';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const corsMiddleware = new CorsMiddleware({ run: nextServerAppRun });

const defaultRequest = {
  pathname: '/unknown',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('CorsMiddleware', () => {
  void test('returns a positive CORS response when OPTIONS request is made', async () => {
    const response = await corsMiddleware.run({
      ...defaultRequest,
      method: 'OPTIONS',
    });

    assert.equal(nextServerAppRun.mock.calls.length, 0);

    assert.equal(response.status, 204);
    assert.equal((response.headers || {})['Access-Control-Allow-Origin'], '*');
    assert.equal(response.body, null);
  });

  void test('invokes nextServerApp when OPTIONS request is not made', async () => {
    await corsMiddleware.run({ ...defaultRequest, method: 'POST' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
