import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { RootHandler } from '@/handlers';

const rootHandler = new RootHandler();

const defaultRequest = {
  method: 'GET',
  pathname: '/',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('RootHandler', () => {
  void test('returns Home Page HTML when root path is requested', async () => {
    const response = await rootHandler.run({ ...defaultRequest });

    assert.equal(response.statusCode, 200);
    assert.ok(
      String(response.body).includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });

  void test('returns a 404 HTML page when a request other than the root is made', async () => {
    const response = await rootHandler.run({
      ...defaultRequest,
      pathname: '/unknown',
    });

    assert.equal(response.statusCode, 404);
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });
});
