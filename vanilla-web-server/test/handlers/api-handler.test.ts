import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({
    status: 418,
    headers: {},
    body: { message: `I'm a teapot` },
  }),
);

const defaultRequest = {
  method: 'GET',
  pathname: '/api',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('ApiHandler', () => {
  void test('invokes the handler using JsonMiddleware', async () => {
    const handlerRun = mock.fn(async (_req: ServerAppRequestType) =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: { message: `I'm not a teapot` },
      }),
    );

    const apiHandler = new ApiHandler({ run: nextServerAppRun });

    apiHandler.handler = { run: handlerRun };

    const response = await apiHandler.run({
      ...defaultRequest,
      pathname: '/api/unknown',
    });

    assert.strictEqual(handlerRun.mock.calls.length, 1);
    const firstCallArgs = handlerRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];
    assert.strictEqual(receivedRequest.pathname, '/unknown');

    assert.equal(response.status, 200);
    assert.equal((response.headers || {})['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(String(response.body)), {
      message: `I'm not a teapot`,
    });
  });

  void test('invokes nextServerApp when a request other than /api is made', async () => {
    const apiHandler = new ApiHandler({ run: nextServerAppRun });

    await apiHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
