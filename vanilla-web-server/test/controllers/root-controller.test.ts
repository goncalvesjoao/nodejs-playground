import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootController } from '@/controllers';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootController = new RootController({ run: nextServerModRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/',
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

  void test('invokes nextServerMod when a request other than root is made', async () => {
    nextServerModRun.mock.resetCalls();

    await rootController.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
