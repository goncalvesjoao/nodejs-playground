import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiController } from '@/controllers';
import { ServerModRequestType } from '@/types';

const nextServerModRun = mock.fn(async (_req: ServerModRequestType) =>
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
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('ApiController', () => {
  void test('invokes #serverMod.run with a request without the "/api" prefix', async () => {
    const mockedRun = mock.fn(async (_req: ServerModRequestType) =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: { message: `I'm not a teapot` },
      }),
    );

    const apiController = new ApiController({ run: nextServerModRun });

    apiController.serverMod = { run: mockedRun };

    const response = await apiController.run({
      ...defaultRequest,
      pathname: '/api/unknown',
    });

    assert.strictEqual(mockedRun.mock.calls.length, 1);
    const firstCallArgs = mockedRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];
    assert.strictEqual(receivedRequest.pathname, '/unknown');

    assert.equal(response.status, 200);
    assert.equal((response.headers || {})['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(String(response.body)), {
      message: `I'm not a teapot`,
    });
  });

  void test('invokes nextServerMod when a request other than /api is made', async () => {
    const apiController = new ApiController({ run: nextServerModRun });

    await apiController.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
