import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootController } from '@/controllers';

const rootController = new RootController();

const defaultRequest = {
  method: 'GET',
  pathname: '/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('RootController', () => {
  void test('returns Home Page HTML when root path is requested', async () => {
    const response = await rootController.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.ok(
      String(response.body).includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });

  void test('returns a 404 HTML page when a request other than the root is made', async () => {
    const response = await rootController.run({
      ...defaultRequest,
      pathname: '/unknown',
    });

    assert.equal(response.status, 404);
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });
});
