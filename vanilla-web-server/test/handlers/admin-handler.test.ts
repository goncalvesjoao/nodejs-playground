import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AdminHandler } from '@/handlers';
import { ServerModRequestType } from '@/types';

const nextServerModRun = mock.fn(async (_req: ServerModRequestType) =>
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

void describe('AdminHandler', () => {
  void test('invokes the handler using HtmlMiddleware', async () => {
    const handlerRun = mock.fn(async (_req: ServerModRequestType) =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: '<h1>Admin Home Page</h1>',
      }),
    );

    const adminHandler = new AdminHandler({ run: nextServerModRun });

    adminHandler.handler = { run: handlerRun };

    const response = await adminHandler.run({
      ...defaultRequest,
      pathname: '/admin/unknown',
    });

    assert.strictEqual(handlerRun.mock.calls.length, 1);
    const firstCallArgs = handlerRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];
    assert.strictEqual(receivedRequest.pathname, '/unknown');

    assert.equal(response.status, 200);
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(String(response.body).includes('<h1>Admin Home Page</h1>'));
  });

  void test('invokes nextServerMod when a request other than /admin is made', async () => {
    const adminHandler = new AdminHandler({ run: nextServerModRun });

    await adminHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
