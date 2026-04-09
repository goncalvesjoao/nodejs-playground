import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PublicController } from '@app/controllers';
import { readPublicFile } from '@app/utils';
import { RequestBuilder } from '@test/support/utils';

void describe('app - controllers - PublicController#handle', () => {
  void test('returns an asset from the disk, matching the requested path', async () => {
    const controller = new PublicController();
    const response = await controller.handle(
      RequestBuilder({ path: '/assets/chippy.jpg' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    const expectedBody = (await readPublicFile('assets/chippy.jpg')) as Buffer;

    assert.equal(response.status, 200);

    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('returns a 404 when an unknown asset is requested', async () => {
    const controller = new PublicController();
    const response = await controller.handle(
      RequestBuilder({ path: '/assets/unknown' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 404);
  });
});
