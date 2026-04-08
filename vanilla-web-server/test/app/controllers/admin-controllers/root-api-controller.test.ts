import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@app/controllers/admin-controllers';

const defaultRequest = {
  method: 'GET',
  path: '/admin',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - RootAdminController', () => {
  void test('returns a Admin Home Page when "/admin" request is made', async () => {
    const req = { ...defaultRequest, path: '/admin' };
    const controller = new RootAdminController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('returns a Admin Home Page when "/admin/" request is made', async () => {
    const req = { ...defaultRequest, path: '/admin/' };
    const controller = new RootAdminController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('does not return a handler when a request other than root is made', () => {
    const req = { ...defaultRequest, path: '/admin/unknown' };
    const controller = new RootAdminController();
    const handler = controller.handler(req);

    assert.equal(handler, undefined);
  });
});
