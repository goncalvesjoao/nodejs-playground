import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiController } from '@app/controllers/api-controllers';
import CountryList from 'country-list';

const defaultRequest = {
  method: 'GET',
  path: '',
  params: {},
  headers: {},
  body: () => Promise.resolve(Buffer.from('')),
};

void describe('app - controllers - CountriesApiController#handle', () => {
  void test('returns a list of countries when "/countries" request is made', async () => {
    const req = { ...defaultRequest, path: '/api/countries' };
    const controller = new CountriesApiController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('returns a list of countries when "/countries/" request is made', async () => {
    const req = { ...defaultRequest, path: '/api/countries/' };
    const controller = new CountriesApiController();
    const response = await controller.handle(req);

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('returns false when an unknown path is requested', async () => {
    const req = { ...defaultRequest, path: '/unknown' };
    const controller = new CountriesApiController();
    const response = await controller.handle(req);

    assert.equal(response, false, 'Expected handle function to be returned');
  });
});
