import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiController } from '@app/controllers/api-controllers';
import CountryList from 'country-list';

const defaultRequest = {
  method: 'GET',
  path: '/api/countries',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - CountriesApiController', () => {
  void test('returns a list of countries when "/countries" request is made', async () => {
    const req = { ...defaultRequest, path: '/api/countries' };
    const controller = new CountriesApiController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('returns a list of countries when "/countries/" request is made', async () => {
    const req = { ...defaultRequest, path: '/api/countries/' };
    const controller = new CountriesApiController();
    const handler = controller.handler(req);

    assert.ok(handler, 'Expected a handler to be returned');

    const response = await handler(req);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('does not return a handler when a request is not supported', () => {
    const req = { ...defaultRequest, method: 'OPTIONS' };
    const controller = new CountriesApiController();
    const handler = controller.handler(req);

    assert.equal(handler, undefined);
  });
});
