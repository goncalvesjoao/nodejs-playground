import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@app/controllers/admin-controllers';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const rootAdminController = new RootAdminController({
  handle: nextServerModRun,
});

const defaultRequest = {
  method: 'GET',
  path: '/admin/',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootAdminController', () => {
  void test('returns a Admin Home Page when a root request is made', async () => {
    const response = await rootAdminController.handle({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('invokes nextServerMod when a request other than root is made', async () => {
    nextServerModRun.mock.resetCalls();

    await rootAdminController.handle({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
