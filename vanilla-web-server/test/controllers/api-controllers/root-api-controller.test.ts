import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootApiController } from '@/controllers/api-controllers';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootApiController = new RootApiController(
  { run: nextServerModRun },
  '/api',
);

const defaultRequest = {
  method: 'GET',
  path: '/api/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootApiController', () => {
  void test('returns a welcome message when a root request is made', async () => {
    const response = await rootApiController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('invokes nextServerMod when a request other than root is made', async () => {
    nextServerModRun.mock.resetCalls();

    await rootApiController.run({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
