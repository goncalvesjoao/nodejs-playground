import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@/controllers/admin-controllers';

const nextRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootAdminController = new RootAdminController({ run: nextRun }, '/admin');

const defaultRequest = {
  method: 'GET',
  path: '/admin/',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootAdminController', () => {
  void test('returns a Admin Home Page when a root request is made', async () => {
    const response = await rootAdminController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('invokes next when a request other than root is made', async () => {
    nextRun.mock.resetCalls();

    await rootAdminController.run({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextRun.mock.calls.length, 1);
  });
});
