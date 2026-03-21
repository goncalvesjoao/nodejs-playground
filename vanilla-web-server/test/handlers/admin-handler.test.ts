import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AdminHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
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
  body: () => Promise.resolve(''),
};

void describe('AdminHandler', () => {
  void test('invokes the handler using HtmlMiddleware', async () => {
    const handlerRun = mock.fn(async (_req: ServerAppRequestType) =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: '<h1>Admin Dashboard</h1>',
      }),
    );

    const adminHandler = new AdminHandler({ run: nextServerAppRun });

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
    assert.ok(String(response.body).includes('<h1>Admin Dashboard</h1>'));
  });

  void test('invokes nextServerApp when a request other than /admin is made', async () => {
    const adminHandler = new AdminHandler({ run: nextServerAppRun });

    await adminHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
