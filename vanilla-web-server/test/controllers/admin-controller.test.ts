import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AdminController } from '@/controllers';

const nextServerMod = mock.fn(async () =>
  Promise.resolve({
    status: 418,
    headers: {},
    body: { message: `I'm a teapot` },
  }),
);

const defaultRequest = {
  method: 'GET',
  pathname: '/admin',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('AdminController', () => {
  void test('invokes #serverMod.run when a request starting with "/admin" is made', async () => {
    const serverMod = mock.fn(async () =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: '<h1>Admin Home Page</h1>',
      }),
    );

    const adminController = new AdminController(nextServerMod);

    adminController.serverMod = serverMod;

    const response = await adminController.run({
      ...defaultRequest,
      pathname: '/admin/unknown',
    });

    assert.strictEqual(serverMod.mock.calls.length, 1);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('invokes nextServerMod when a request other than /admin is made', async () => {
    const adminController = new AdminController(nextServerMod);

    await adminController.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerMod.mock.calls.length, 1);
  });
});
