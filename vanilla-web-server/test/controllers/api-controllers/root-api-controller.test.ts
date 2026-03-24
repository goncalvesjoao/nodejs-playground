import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootApiController } from '@/controllers/api-controllers';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootApiController = new RootApiController({ handle: nextServerModRun });

const defaultRequest = {
  method: 'GET',
  path: '/api/',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootApiController', () => {
  void test('returns a welcome message when a root request is made', async () => {
    const response = await rootApiController.handle({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('invokes nextServerMod when a request other than root is made', async () => {
    nextServerModRun.mock.resetCalls();

    await rootApiController.handle({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
