import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AsciiHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const asciiHandler = new AsciiHandler({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/ascii',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('AsciiHandler', () => {
  void test('returns an ASCII version of the requested asset', async () => {
    const response = await asciiHandler.run({
      ...defaultRequest,
      pathname: '/ascii/123',
    });

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.ok(
      String(response.body).includes('| |/ __/ ___) |'),
      'Response should include an ASCII representation of "123"',
    );
  });

  void test('invokes nextServerApp when a request other than /ascii is made', async () => {
    await asciiHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
