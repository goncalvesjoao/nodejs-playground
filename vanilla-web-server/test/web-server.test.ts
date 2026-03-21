import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { WebServer } from '@/web-server';
import type { ServerModRequestType } from '@/types';

const handlerRun = mock.fn(async (_req: ServerModRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

void describe('WebServer', () => {
  void test('invokes handler#run with a well formed request', async (t) => {
    const webServer = new WebServer();

    webServer.handler = { run: handlerRun };

    t.after(() => webServer.close());

    void webServer.listen();

    await fetch(`${webServer.url}/posts?timestamp=123`, {
      method: 'POST',
      headers: { Authorization: 'Bearer <token>' },
      body: `I'm not a teapot`,
    });

    assert.strictEqual(handlerRun.mock.calls.length, 1);
    const firstCallArgs = handlerRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];

    assert.strictEqual(receivedRequest.method, 'POST');
    assert.strictEqual(receivedRequest.pathname, '/posts');
    assert.strictEqual(receivedRequest.searchParams['timestamp'], '123');
    assert.strictEqual(receivedRequest.headers.authorization, 'Bearer <token>');

    const bodyText = (await receivedRequest.body()).toString();
    assert.strictEqual(bodyText, `I'm not a teapot`);
  });

  void test('returns an HTTP response based on handler#run output', async (t) => {
    handlerRun.mock.mockImplementationOnce(async (_req: ServerModRequestType) =>
      Promise.resolve({
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Bad Request' }),
      }),
    );

    const webServer = new WebServer();

    webServer.handler = { run: handlerRun };

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

  void test('returns an Internal Server Error when handler#run throws an error', async (t) => {
    handlerRun.mock.mockImplementationOnce(async (_req: ServerModRequestType) =>
      Promise.reject(new Error('Something went wrong')),
    );

    const webServer = new WebServer();

    webServer.handler = { run: handlerRun };

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
