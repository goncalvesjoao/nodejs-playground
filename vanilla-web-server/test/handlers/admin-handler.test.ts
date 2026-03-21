import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AdminHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const adminHandler = new AdminHandler({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/admin',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('AdminHandler', () => {
  void test('returns Admin Home Page HTML when root path is requested', async () => {
    const response = await adminHandler.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(String(response.body).includes('<h1>Admin Dashboard</h1>'));
  });

  void test('invokes nextServerApp when a request other than /admin is made', async () => {
    await adminHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
