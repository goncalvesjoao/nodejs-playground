import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { WebServer } from '@/web-server';
import type { ServerAppRequestType } from '@/types';

const serverAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ statusCode: 418, headers: {}, body: `I'm a teapot` }),
);

void describe('WebServer', () => {
  void test('invokes serverApp#run with a well formed request', async (t) => {
    const webServer = new WebServer({ run: serverAppRun }, 3001);

    t.after(() => webServer.close());

    void webServer.listen();

    await fetch(`${webServer.url}/posts?timestamp=123`, {
      method: 'POST',
      headers: { Authorization: 'Bearer <token>' },
      body: JSON.stringify({ key: 'value' }),
    });

    assert.strictEqual(serverAppRun.mock.calls.length, 1);
    const firstCallArgs = serverAppRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];

    assert.strictEqual(receivedRequest.method, 'POST');
    assert.strictEqual(receivedRequest.pathname, '/posts');
    assert.strictEqual(receivedRequest.searchParams['timestamp'], '123');
    assert.strictEqual(receivedRequest.headers.authorization, 'Bearer <token>');

    const bodyText = await receivedRequest.body();
    assert.strictEqual(bodyText, JSON.stringify({ key: 'value' }));
  });

  void test('returns an HTTP response based on serverApp#run output', async (t) => {
    serverAppRun.mock.mockImplementationOnce(
      async (_req: ServerAppRequestType) =>
        Promise.resolve({
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Bad Request' }),
        }),
    );

    const webServer = new WebServer({ run: serverAppRun }, 3001);

    t.after(() => webServer.close());

    void webServer.listen();

    const response = await fetch(`${webServer.url}/posts`);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.headers.get('Content-Type'),
      'application/json',
    );

    const bodyText = await response.text();
    assert.strictEqual(bodyText, JSON.stringify({ error: 'Bad Request' }));
  });

  void test('returns an Internal Server Error when serverApp#run throws an error', async (t) => {
    serverAppRun.mock.mockImplementationOnce(
      async (_req: ServerAppRequestType) =>
        Promise.reject(new Error('Something went wrong')),
    );

    const webServer = new WebServer({ run: serverAppRun }, 3001);

    t.after(() => webServer.close());

    void webServer.listen();

    const response = await fetch(`${webServer.url}/posts`);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(
      response.headers.get('Content-Type'),
      'application/json',
    );

    const bodyText = await response.text();
    assert.strictEqual(
      bodyText,
      JSON.stringify({ message: 'Internal Server Error' }),
    );
  });
});
