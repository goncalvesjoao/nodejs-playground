import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AssetsHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';
import { readPublicFile } from '@/utils';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const assetsHandler = new AssetsHandler({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/assets',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('AssetsHandler', () => {
  void test('returns an asset from the disk, matching the requested path', async () => {
    const response = await assetsHandler.run({
      ...defaultRequest,
      pathname: '/assets/chippy.jpg',
    });

    const expectedBody = await readPublicFile('assets/chippy.jpg');

    assert.equal(response.status, 200);

    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('invokes nextServerApp when an unknown asset is requested', async () => {
    nextServerAppRun.mock.resetCalls();

    await assetsHandler.run({
      ...defaultRequest,
      pathname: '/assets/unknown',
    });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });

  void test('invokes nextServerApp when a request other than /assets is made', async () => {
    nextServerAppRun.mock.resetCalls();

    await assetsHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
