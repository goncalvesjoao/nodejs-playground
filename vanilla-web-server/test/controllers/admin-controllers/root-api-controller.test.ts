import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@/controllers/admin-controllers';

const rootAdminController = new RootAdminController('/admin');

const defaultRequest = {
  method: 'GET',
  pathname: '/admin/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootAdminController', () => {
  void test('returns a Admin Home Page when a root request is made', async () => {
    const response = await rootAdminController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('returns a 404 response when an unrecognized endpoint is requested', async () => {
    const response = await rootAdminController.run({
      ...defaultRequest,
      pathname: '/unknown',
    });

    assert.equal(response.status, 404);
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });
});
