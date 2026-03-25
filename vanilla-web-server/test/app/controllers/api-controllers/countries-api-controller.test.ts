import { describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiController } from '@/controllers/api-controllers';
import CountryList from 'country-list';

const nextServerModRun = mock.fn(async () =>
  Promise.resolve({ status: 418, headers: {}, body: `I'm a teapot` }),
);

const countriesApiController = new CountriesApiController({
  handle: nextServerModRun,
});

const defaultRequest = {
  method: 'GET',
  path: '/api/countries',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('CountriesApiController', () => {
  void test('returns a list of countries when a /countries request is made', async () => {
    const response = await countriesApiController.handle({
      ...defaultRequest,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('invokes nextServerMod when a request is not supported', async () => {
    await countriesApiController.handle({
      ...defaultRequest,
      method: 'OPTIONS',
    });

    assert.equal(nextServerModRun.mock.calls.length, 1);
  });
});
