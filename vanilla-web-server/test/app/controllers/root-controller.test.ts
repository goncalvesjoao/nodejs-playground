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

void describe('app - controllers - RootController#handle', () => {
  void test('returns Home Page HTML when "" is requested', async () => {
    const req = { ...defaultRequest, path: '' };
    const controller = new RootController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('returns Home Page HTML when "/" is requested', async () => {
    const req = { ...defaultRequest, path: '/' };
    const controller = new RootController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Home Page</h1>'));
  });

  void test('returns false when an unknown path is requested', async () => {
    const req = { ...defaultRequest, path: '/unknown' };
    const controller = new RootController();
    const response = await controller.handle(req);

    assert.equal(response, false, 'Expected handle function to be returned');
  });
});
