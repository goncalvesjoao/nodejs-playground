import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { Root } from '@/server-apps';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ statusCode: 418, headers: {}, body: `I'm a teapot` }),
);

const root = new Root({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/',
  searchParams: new URLSearchParams(),
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('Root server app', () => {
  void test('returns Home Page HTML when root path is requested', async () => {
    const response = await root.run({ ...defaultRequest });

    assert.equal(response.statusCode, 200);
    assert.ok(
      String(response.body).includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });

  void test('invokes nextServerApp when a request other than the root is made', async () => {
    await root.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
