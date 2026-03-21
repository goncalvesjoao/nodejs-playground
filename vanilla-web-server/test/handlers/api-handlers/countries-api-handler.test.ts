import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiHandler } from '@/handlers/api-handlers';
import { ServerAppRequestType } from '@/types';
import CountryList from 'country-list';

const nextServerAppRun = mock.fn(async (_req: ServerAppRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const countriesApiHandler = new CountriesApiHandler({ run: nextServerAppRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/countries',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(''),
};

void describe('CountriesApiHandler', () => {
  void test('returns a list of countries when a /countries request is made', async () => {
    const response = await countriesApiHandler.run({
      ...defaultRequest,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('invokes nextServerApp when a request is not supported', async () => {
    await countriesApiHandler.run({ ...defaultRequest, method: 'OPTIONS' });

    assert.equal(nextServerAppRun.mock.calls.length, 1);
  });
});
