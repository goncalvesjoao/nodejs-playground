import {
  Get,
  RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';
import { ApiController } from '@app/controllers/api-controller';
import CountryList from 'country-list';

export class CountriesApiController extends ApiController {
  static basePath = `${super.basePath}/countries`;

  @Get('{/}')
  findAll(_req: RequestType): Promise<ResponseType> {
    const results: CountryList.Country[] = CountryList.getData();

    return Promise.resolve({ status: 200, body: { results } });
  }
}
