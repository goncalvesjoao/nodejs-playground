import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootApiController } from '@app/controllers/api-controllers';
import { RequestBuilder } from '@test/support/utils';

void describe('app - controllers - RootApiController#handle', () => {
  void test('returns a welcome message when "/api" request is made', async () => {
    const controller = new RootApiController();
    const response = await controller.handle(RequestBuilder({ path: '/api' }));

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('returns a welcome message when "/api/" request is made', async () => {
    const controller = new RootApiController();
    const response = await controller.handle(RequestBuilder({ path: '/api/' }));

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('returns a 501 response when "/api/unknown" request is made', async () => {
    const controller = new RootApiController();
    const response = await controller.handle(
      RequestBuilder({ path: '/api/unknown' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 501);
    assert.deepEqual(response.body, {
      message: 'Not Implemented',
    });
  });
});
