import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootController } from '@app/controllers';
import { RequestBuilder } from '@test/support/utils';

void describe('app - controllers - RootController#handle', () => {
  void test('returns Home Page HTML when "" is requested', async () => {
    const controller = new RootController();
    const response = await controller.handle(RequestBuilder({ path: '' }));

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('returns Home Page HTML when "/" is requested', async () => {
    const controller = new RootController();
    const response = await controller.handle(RequestBuilder({ path: '/' }));

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });
});
