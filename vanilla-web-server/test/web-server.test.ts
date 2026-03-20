import { after, before, describe, test } from 'node:test';
import assert from "node:assert/strict";
import { WebServer } from '@/web-server';

const webServer = new WebServer();

describe('WebServer', async () => {
  before(() => webServer.listen());
  after(() => webServer.close());

  test('GET /', async (t) => {
    const response = await fetch(`${webServer.url}/`);
    const responseText = await response.text();

    assert.ok(responseText.includes('<h1>Hello World!</h1>'), 'Response should include "Hello World!"');
  });
});
