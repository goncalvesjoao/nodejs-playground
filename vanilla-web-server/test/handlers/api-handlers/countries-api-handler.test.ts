import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiHandler } from '@/handlers/api-handlers';
import { ServerModRequestType } from '@/types';
import CountryList from 'country-list';

const nextServerModRun = mock.fn(async (_req: ServerModRequestType) =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const countriesApiHandler = new CountriesApiHandler({ run: nextServerModRun });

const defaultRequest = {
  method: 'GET',
  pathname: '/countries',
  searchParams: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
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

  void test('invokes nextServerMod when a request is not supported', async () => {
    await countriesApiHandler.run({ ...defaultRequest, method: 'OPTIONS' });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
