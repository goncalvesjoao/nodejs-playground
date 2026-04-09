import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootAdminController } from '@app/controllers/admin-controllers';
import { RequestBuilder } from '@test/support/utils';

void describe('app - controllers - RootAdminController#handle', () => {
  void test('returns a Admin Home Page when "/admin" request is made', async () => {
    const controller = new RootAdminController();
    const response = await controller.handle(
      RequestBuilder({ path: '/admin' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('returns a Admin Home Page when "/admin/" request is made', async () => {
    const controller = new RootAdminController();
    const response = await controller.handle(
      RequestBuilder({ path: '/admin/' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('Admin Home Page'));
  });
});
