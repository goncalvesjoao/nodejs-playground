import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@app/controllers/admin-controllers';

const defaultRequest = {
  method: 'GET',
  path: '',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - RootAdminController#handle', () => {
  void test('returns a Admin Home Page when "/admin" request is made', async () => {
    const req = { ...defaultRequest, path: '/admin' };
    const controller = new RootAdminController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('returns a Admin Home Page when "/admin/" request is made', async () => {
    const req = { ...defaultRequest, path: '/admin/' };
    const controller = new RootAdminController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('returns false when an unknown path is requested', async () => {
    const req = { ...defaultRequest, path: '/unknown' };
    const controller = new RootAdminController();
    const response = await controller.handle(req);

    assert.equal(response, false, 'Expected handle function to be returned');
  });
});
