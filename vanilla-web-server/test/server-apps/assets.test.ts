import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import { Assets } from '@/server-apps';
import { ServerAppRequestType } from '@/types';
import path from 'node:path';
import { PUBLIC_DIR_NAME } from '@/constants';
import { rootDirPath } from '@/utils';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ statusCode: 418, headers: {}, body: `I'm a teapot` }),
);

const assets = new Assets({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/assets',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('Assets server app', () => {
  void test('returns an asset from the disk, matching the requested path', async () => {
    const response = await assets.run({
      ...defaultRequest,
      pathname: '/assets/chippy.jpg',
    });

    const expectedBody = await fs.readFile(
      path.join(rootDirPath, PUBLIC_DIR_NAME, 'assets', 'chippy.jpg'),
    );

    assert.equal(response.statusCode, 200);

    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('returns a 404 response when an unknown asset is requested', async () => {
    const response = await assets.run({
      ...defaultRequest,
      pathname: '/assets/unknown',
    });

    assert.equal(response.statusCode, 404);
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });

  void test('invokes nextServerApp when a request other than /assets is made', async () => {
    await assets.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
