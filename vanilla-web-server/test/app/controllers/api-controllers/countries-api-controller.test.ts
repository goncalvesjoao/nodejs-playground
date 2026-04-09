import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CountriesApiController } from '@app/controllers/api-controllers';
import CountryList from 'country-list';
import { RequestBuilder } from '@test/support/utils';

void describe('app - controllers - CountriesApiController#handle', () => {
  void test('returns a list of countries when "/countries" request is made', async () => {
    const controller = new CountriesApiController();
    const response = await controller.handle(
      RequestBuilder({ path: '/api/countries' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });

  void test('returns a list of countries when "/countries/" request is made', async () => {
    const controller = new CountriesApiController();
    const response = await controller.handle(
      RequestBuilder({ path: '/api/countries/' }),
    );

    assert.ok(response, 'Expected handle function to be returned');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      results: CountryList.getData(),
    });
  });
});
