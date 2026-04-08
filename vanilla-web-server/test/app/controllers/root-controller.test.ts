import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootController } from '@app/controllers';

const defaultRequest = {
  method: 'GET',
  path: '',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - RootController', () => {
  void test('returns Home Page HTML when "" is requested', async () => {
    const req = { ...defaultRequest, path: '' };
    const controller = new RootController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('returns Home Page HTML when "/" is requested', async () => {
    const req = { ...defaultRequest, path: '/' };
    const controller = new RootController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('does not return a handler when a request other than root is made', () => {
    const req = { ...defaultRequest, path: '/unknown' };
    const controller = new RootController();
    const handler = controller.handler(req);

    assert.equal(handler, undefined, 'Expected no handler to be returned');
  });
});
