import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootApiController } from '@/controllers/api-controllers';

const rootApiController = new RootApiController('/api');

const defaultRequest = {
  method: 'GET',
  pathname: '/api/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootApiController', () => {
  void test('returns a welcome message when a root request is made', async () => {
    const response = await rootApiController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('returns a 501 response when an unrecognized endpoint is requested', async () => {
    const response = await rootApiController.run({
      ...defaultRequest,
      pathname: '/unknown',
    });

    assert.equal(response.status, 501);
    assert.deepEqual(response.body, {
      message: 'Not Implemented',
    });
  });
});
