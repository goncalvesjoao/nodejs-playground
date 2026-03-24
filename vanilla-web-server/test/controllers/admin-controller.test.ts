import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AdminController } from '@/controllers';

const nextRun = mock.fn(async () =>
  Promise.resolve({
    status: 418,
    headers: {},
    body: { message: `I'm a teapot` },
  }),
);

const defaultRequest = {
  method: 'GET',
  path: '/admin',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('AdminController', () => {
  void test('invokes #serverMod.run when a request starting with "/admin" is made', async () => {
    const mockedRun = mock.fn(async () =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: '<h1>Admin Home Page</h1>',
      }),
    );

    const adminController = new AdminController({ run: nextRun });

    adminController.serverMod = { run: mockedRun };

    const response = await adminController.run({
      ...defaultRequest,
      path: '/admin/unknown',
    });

    assert.strictEqual(mockedRun.mock.calls.length, 1);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('invokes next when a request other than /admin is made', async () => {
    const adminController = new AdminController({ run: nextRun });

    await adminController.run({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextRun.mock.calls.length, 1);
  });
});
