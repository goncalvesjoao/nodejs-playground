import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '@app/index';
import { readPublicFile } from '@app/utils';

const app = new App();

const defaultRequest = {
  method: 'GET',
  path: '/',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app integration tests', () => {
  void test('OPTIONS / - should return a positive CORS response', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'OPTIONS',
    });

    assert.equal(response.status, 204, 'Response status should be 204');
    assert.equal(
      (response.headers || {})['Access-Control-Allow-Origin'],
      '*',
      'Access-Control-Allow-Origin header should be set to "*"',
    );
  });

  void test('GET / - should return the home page', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/',
    });

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(
      String(response.body).includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });

  void test('GET /unknown - should return a 404 page', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/unknown',
    });

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(
      String(response.body).includes('<h1>404 Page Not Found</h1>'),
      'Response should include "404 Page Not Found"',
    );
  });

  void test('GET /api - should return a JSON response', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/api',
    });

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal((response.headers || {})['Content-Type'], 'application/json');
    assert.deepEqual(
      JSON.parse(String(response.body)),
      { message: 'Welcome to the API!' },
      'API response should match',
    );
  });

  void test('GET /api/unknown - should return a 501 JSON response', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/api/unknown',
    });

    assert.equal(response.status, 501, 'Response status should be 501');
    assert.equal((response.headers || {})['Content-Type'], 'application/json');
    assert.deepEqual(
      JSON.parse(String(response.body)),
      { message: 'Not Implemented' },
      'API response should match',
    );
  });

  void test('GET /assets/chippy.jpg - should return a jpg image', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/assets/chippy.jpg',
    });

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal((response.headers || {})['Content-Type'], 'image/jpg');

    const expectedBody = (await readPublicFile('assets/chippy.jpg')) as Buffer;
    assert.ok(
      expectedBody.equals(response.body as Buffer),
      'returned asset is not identical to the expected asset',
    );
  });

  void test('GET /assets/unknown - should return a 404 response', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/assets/unknown',
    });

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });

  void test('GET /admin - returns Admin Home Page HTML', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/admin',
    });

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(String(response.body).includes('Admin Home Page'));
  });

  void test('GET /admin/unknown - should return a 404 response', async () => {
    const response = await app.handle({
      ...defaultRequest,
      method: 'GET',
      path: '/admin/unknown',
    });

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal((response.headers || {})['Content-Type'], 'text/html');
    assert.ok(String(response.body).includes('<h1>404 Page Not Found</h1>'));
  });
});
