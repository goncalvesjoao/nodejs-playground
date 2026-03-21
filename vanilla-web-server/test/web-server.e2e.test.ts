// import { after, before, describe, test } from 'node:test';
// import assert from 'node:assert/strict';
// import { WebServer } from '@/web-server';
// import { serverApp } from '@/server-app';

// const webServer = new WebServer(serverApp);

// void describe('WebServer e2e', () => {
//   before(() => webServer.listen());
//   after(() => webServer.close());

//   void test('OPTIONS / - should return a positive CORS response', async () => {
//     const response = await fetch(`${webServer.url}/`, { method: 'OPTIONS' });

//     assert.equal(response.status, 204, 'Response status should be 204');
//     assert.equal(
//       response.headers.get('Access-Control-Allow-Origin'),
//       '*',
//       'Access-Control-Allow-Origin header should be set to "*"',
//     );
//   });

//   void test('GET / - should return the home page', async () => {
//     const response = await fetch(`${webServer.url}/`);
//     const responseText = await response.text();

//     assert.equal(response.status, 200, 'Response status should be 200');
//     assert.ok(
//       responseText.includes('<h1>Home Page</h1>'),
//       'Response should include "Home Page"',
//     );
//   });

//   void test('GET /unknown - should return a 404 page', async () => {
//     const response = await fetch(`${webServer.url}/unknown`);
//     const responseText = await response.text();

//     assert.equal(response.status, 404, 'Response status should be 404');
//     assert.ok(
//       responseText.includes('<h1>404 Page Not Found</h1>'),
//       'Response should include "404 Page Not Found"',
//     );
//   });

//   void test('GET /api - should return a JSON response', async () => {
//     const response = await fetch(`${webServer.url}/api`);
//     const responseText = await response.text();

//     assert.equal(response.status, 200, 'Response status should be 200');
//     assert.deepEqual(
//       JSON.parse(responseText),
//       { message: 'Hello from the API!' },
//       'API response should match',
//     );
//   });

//   void test('GET /api/unknown - should return a 501 JSON response', async () => {
//     const response = await fetch(`${webServer.url}/api/unknown`);
//     const responseText = await response.text();

//     assert.equal(response.status, 501, 'Response status should be 501');
//     assert.deepEqual(
//       JSON.parse(responseText),
//       { message: 'Not Implemented' },
//       'API response should match',
//     );
//   });

//   void test('GET /assets/chippy.jpg - should return the asset', async () => {
//     const response = await fetch(`${webServer.url}/assets/chippy.jpg`);
//     const responseBytes = await response.arrayBuffer();

//     assert.equal(response.status, 200, 'Response status should be 200');
//     assert.ok(responseBytes.byteLength > 0, 'Asset should not be empty');
//   });

//   void test('GET /assets/unknown - should return a 404 response', async () => {
//     const response = await fetch(`${webServer.url}/assets/unknown`);
//     const responseText = await response.text();

//     assert.equal(response.status, 404, 'Response status should be 404');
//     assert.ok(
//       responseText.includes('<h1>404 Page Not Found</h1>'),
//       'Response should include "404 Page Not Found"',
//     );
//   });

//   void test('GET /ascii/123 - should return an ASCII response', async () => {
//     const response = await fetch(`${webServer.url}/ascii/123`);
//     const responseText = await response.text();

//     assert.equal(response.status, 200, 'Response status should be 200');
//     assert.ok(
//       responseText.includes('| |/ __/ ___) |'),
//       'Response should include an ASCII representation of "123"',
//     );
//   });
// });
