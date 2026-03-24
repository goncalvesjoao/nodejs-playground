import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiController } from '@/controllers';

const nextRun = mock.fn(async () =>
  Promise.resolve({
    status: 418,
    headers: {},
    body: { message: `I'm a teapot` },
  }),
);

const defaultRequest = {
  method: 'GET',
  path: '/api',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('ApiController', () => {
  void test('invokes #serverMod.run when a request starting with "/api" is made', async () => {
    const mockedRun = mock.fn(async () =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: { message: `I'm not a teapot` },
      }),
    );

    const apiController = new ApiController({ run: nextRun });

    apiController.serverMod = { run: mockedRun };

    const response = await apiController.run({
      ...defaultRequest,
      path: '/api/unknown',
    });

    assert.strictEqual(mockedRun.mock.calls.length, 1);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { message: `I'm not a teapot` });
  });

  void test('invokes next when a request other than /api is made', async () => {
    const apiController = new ApiController({ run: nextRun });

    await apiController.run({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextRun.mock.calls.length, 1);
  });
});
