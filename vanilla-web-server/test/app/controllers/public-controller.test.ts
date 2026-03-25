import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { PublicController } from '@app/controllers';
import { readPublicFile } from '@app/utils';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const assetsController = new PublicController({ handle: nextServerModRun });

const defaultRequest = {
  method: 'GET',
  path: '/assets',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - PublicController', () => {
  void test('returns an asset from the disk, matching the requested path', async () => {
    const response = await assetsController.handle({
      ...defaultRequest,
      path: '/assets/chippy.jpg',
    });

    const expectedBody = (await readPublicFile('assets/chippy.jpg')) as Buffer;

    assert.equal(response.status, 200);

    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('invokes nextServerMod when an unknown asset is requested', async () => {
    nextServerModRun.mock.resetCalls();

    await assetsController.handle({
      ...defaultRequest,
      path: '/assets/unknown',
    });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });

  void test('invokes nextServerMod when a request other than /assets is made', async () => {
    nextServerModRun.mock.resetCalls();

    await assetsController.handle({ ...defaultRequest, path: '/unknown' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
