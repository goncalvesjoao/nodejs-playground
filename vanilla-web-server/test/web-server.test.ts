import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { WebServer } from '@/web-server';
import type { ServerAppRequestType } from '@/types';

void describe('WebServer', () => {
  void test('evoke serverApp#run will a well formed request', async (t) => {
    const mockedRun = mock.fn(async (_request: ServerAppRequestType) =>
      Promise.resolve({ statusCode: 200, headers: {}, body: '' }),
    );

    const webServer = new WebServer({ run: mockedRun }, 3001);

    t.after(() => webServer.close());

    webServer.listen();

    await fetch(`${webServer.url}/posts?timestamp=123`, {
      method: 'POST',
      headers: { Authorization: 'Bearer <token>' },
      body: JSON.stringify({ key: 'value' }),
    });

    assert.strictEqual(mockedRun.mock.calls.length, 1);
    const firstCallArgs = mockedRun.mock.calls[0].arguments;
    const receivedRequest = firstCallArgs[0];

    assert.strictEqual(receivedRequest.method, 'POST');
    assert.strictEqual(receivedRequest.pathname, '/posts');
    assert.strictEqual(receivedRequest.searchParams.get('timestamp'), '123');
    assert.strictEqual(receivedRequest.headers.authorization, 'Bearer <token>');

    // const bodyText = await receivedRequest.body();
    // assert.strictEqual(bodyText, JSON.stringify({ key: 'value' }));
  });
});
