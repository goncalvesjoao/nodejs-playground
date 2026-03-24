import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootController } from '@/controllers';

const nextRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootController = new RootController({ run: nextRun });

const defaultRequest = {
  method: 'GET',
  path: '/',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootController', () => {
  void test('returns Home Page HTML when root path is requested', async () => {
    const response = await rootController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('invokes next when a request other than root is made', async () => {
    nextRun.mock.resetCalls();

    await rootController.run({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextRun.mock.calls.length, 1);
  });
});
