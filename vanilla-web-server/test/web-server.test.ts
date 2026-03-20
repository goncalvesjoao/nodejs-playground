import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { WebServer } from '@/web-server';

const webServer = new WebServer();

void describe('WebServer', () => {
  before(() => webServer.listen());
  after(() => webServer.close());

  void test('GET /', async () => {
    const response = await fetch(`${webServer.url}/`);
    const responseText = await response.text();

    assert.ok(
      responseText.includes('<h1>Home Page</h1>'),
      'Response should include "Home Page"',
    );
  });
});
