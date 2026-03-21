import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { Cors } from '@/server-apps';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ statusCode: 204, headers: {}, body: '' }),
);

const defaultRequest = {
  pathname: '/',
  searchParams: new URLSearchParams(),
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('Cors', () => {
  void test('returns a positive CORS response when OPTIONS request is made', async () => {
    const cors = new Cors({ run: nextServerAppRun });
    const response = await cors.run({ ...defaultRequest, method: 'OPTIONS' });

    assert.equal(
      nextServerAppRun.mock.calls.length,
      0,
      'Next server app should not be called for OPTIONS request',
    );

    assert.equal(response.statusCode, 204, 'Response status should be 204');
    assert.equal(
      response.headers['Access-Control-Allow-Origin'],
      '*',
      'Access-Control-Allow-Origin header should be set to "*"',
    );
    assert.equal(
      response.body,
      null,
      'Response body should be null for 204 status',
    );
  });

  void test('invokes nextServerApp when OPTIONS request is not made', async () => {
    const cors = new Cors({ run: nextServerAppRun });
    await cors.run({ ...defaultRequest, method: 'POST' });

    assert.equal(
      nextServerAppRun.mock.calls.length,
      1,
      'Next server app should be called for non-OPTIONS request',
    );
  });
});
