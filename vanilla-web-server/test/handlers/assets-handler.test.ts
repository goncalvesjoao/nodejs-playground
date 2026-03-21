import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { AssetsHandler } from '@/handlers';
import { ServerModRequestType } from '@/types';
import { readPublicFile } from '@/utils';

const nextServerModRun = mock.fn(async (_req: ServerModRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const assetsHandler = new AssetsHandler({ run: nextServerModRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/assets',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
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

  void test('invokes nextServerMod when an unknown asset is requested', async () => {
    nextServerModRun.mock.resetCalls();

    await assetsHandler.run({
      ...defaultRequest,
      pathname: '/assets/unknown',
    });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });

  void test('invokes nextServerMod when a request other than /assets is made', async () => {
    nextServerModRun.mock.resetCalls();

    await assetsHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
