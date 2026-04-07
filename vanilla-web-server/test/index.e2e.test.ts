import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { bootLoader } from '@config/boot-loader';

const url = 'http://localhost:3000';

void describe('app end to end tests', () => {
  before(() => bootLoader.start());
  after(() => bootLoader.stop());

  void test('OPTIONS / - should return a positive CORS response', async () => {
    const response = await fetch(`${url}/`, { method: 'OPTIONS' });

    assert.equal(response.status, 204, 'Response status should be 204');
    assert.equal(
      response.headers.get('Access-Control-Allow-Origin'),
      '*',
      'Access-Control-Allow-Origin header should be set to "*"',
    );
  });

  void test('GET / - should return the home page', async () => {
    const response = await fetch(`${url}/`);
    const responseText = await response.text();

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal(response.headers.get('Content-Type'), 'text/html');
    assert.ok(
      responseText.includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });

  void test('GET /unknown - should return a 404 page', async () => {
    const response = await fetch(`${url}/unknown`);
    const responseText = await response.text();

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal(response.headers.get('Content-Type'), 'text/html');
    assert.ok(
      responseText.includes('<h1>404 Page Not Found</h1>'),
      'Response should include "404 Page Not Found"',
    );
  });

  void test('GET /api - should return a JSON response', async () => {
    const response = await fetch(`${url}/api`);
    const responseText = await response.text();

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal(response.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(
      JSON.parse(responseText),
      { message: 'Welcome to the API!' },
      'API response should match',
    );
  });

  void test('GET /api/unknown - should return a 501 JSON response', async () => {
    const response = await fetch(`${url}/api/unknown`);
    const responseText = await response.text();

    assert.equal(response.status, 501, 'Response status should be 501');
    assert.equal(response.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(
      JSON.parse(responseText),
      { message: 'Not Implemented' },
      'API response should match',
    );
  });

  void test('GET /assets/chippy.jpg - should return a jpg image', async () => {
    const response = await fetch(`${url}/assets/chippy.jpg`);
    const responseBytes = await response.arrayBuffer();

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal(response.headers.get('Content-Type'), 'image/jpg');
    assert.ok(responseBytes.byteLength > 0, 'Asset should not be empty');
  });

  void test('GET /assets/unknown - should return a 404 response', async () => {
    const response = await fetch(`${url}/assets/unknown`);
    const responseText = await response.text();

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal(response.headers.get('Content-Type'), 'text/html');
    assert.ok(responseText.includes('<h1>404 Page Not Found</h1>'));
  });

  void test('GET /admin - returns Admin Home Page HTML', async () => {
    const response = await fetch(`${url}/admin`);
    const responseText = await response.text();

    assert.equal(response.status, 200, 'Response status should be 200');
    assert.equal(response.headers.get('Content-Type'), 'text/html');
    assert.ok(responseText.includes('Admin Home Page'));
  });

  void test('GET /admin/unknown - should return a 404 response', async () => {
    const response = await fetch(`${url}/admin/unknown`);
    const responseText = await response.text();

    assert.equal(response.status, 404, 'Response status should be 404');
    assert.equal(response.headers.get('Content-Type'), 'text/html');
    assert.ok(responseText.includes('<h1>404 Page Not Found</h1>'));
  });
});
