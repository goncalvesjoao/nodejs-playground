import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiHandler } from '@/handlers';
import { ServerAppRequestType } from '@/types';
import CountryList from 'country-list';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const apiHandler = new ApiHandler({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/api',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('ApiHandler', () => {
  void test('returns a welcome message when a /api request is made', async () => {
    const response = await apiHandler.run({ ...defaultRequest });

    assert.equal(response.status, 200);
    assert.deepEqual(JSON.parse(String(response.body)), {
      message: 'Welcome to the API!',
    });
  });

  void test('returns a list of countries when a /api/countries request is made', async () => {
    const response = await apiHandler.run({
      ...defaultRequest,
      pathname: '/api/countries',
    });

    assert.equal(response.status, 200);
    assert.deepEqual(JSON.parse(String(response.body)), {
      results: CountryList.getData(),
    });
  });

  void test('returns a 501 response when an unrecognized /api endpoint is requested', async () => {
    const response = await apiHandler.run({
      ...defaultRequest,
      pathname: '/api/unknown',
    });

    assert.equal(response.status, 501);
    assert.deepEqual(JSON.parse(String(response.body)), {
      message: 'Not Implemented',
    });
  });

  void test('invokes nextServerApp when a request other than /api is made', async () => {
    await apiHandler.run({ ...defaultRequest, pathname: '/unknown' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
