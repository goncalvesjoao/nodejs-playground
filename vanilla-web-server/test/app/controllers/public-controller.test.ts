import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PublicController } from '@app/controllers';
import { readPublicFile } from '@app/utils';

const defaultRequest = {
  method: 'GET',
  path: '/assets',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - PublicController', () => {
  void test('returns an asset from the disk, matching the requested path', async () => {
    const req = { ...defaultRequest, path: '/assets/chippy.jpg' };
    const controller = new PublicController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    const expectedBody = (await readPublicFile('assets/chippy.jpg')) as Buffer;

    assert.equal(response.status, 200);

    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('returns a 404 when an unknown asset is requested', async () => {
    const req = { ...defaultRequest, path: '/assets/unknown' };
    const controller = new PublicController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 404);
  });

  void test('does not return a handler when "/" is made', () => {
    const req = { ...defaultRequest, path: '/' };
    const controller = new PublicController();
    const handler = controller.handler(req);

    assert.equal(handler, undefined);
  });
});
