import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootApiHandler } from '@/handlers/api-handlers';

const rootApiHandler = new RootApiHandler();

const defaultRequest = {
  method: 'GET',
  pathname: '/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('RootApiHandler', () => {
  void test('returns a welcome message when a root request is made', async () => {
    const response = await rootApiHandler.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      message: 'Welcome to the API!',
    });
  });

  void test('returns a 501 response when an unrecognized endpoint is requested', async () => {
    const response = await rootApiHandler.run({
      ...defaultRequest,
      pathname: '/unknown',
    });

    assert.equal(response.status, 501);
    assert.deepEqual(response.body, {
      message: 'Not Implemented',
    });
  });
});
