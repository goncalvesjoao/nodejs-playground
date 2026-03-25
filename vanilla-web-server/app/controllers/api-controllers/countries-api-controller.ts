import {
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';
import { ApiController } from '@app/controllers/api-controller';
import CountryList from 'country-list';

export class CountriesApiController extends ApiController {
  static basePath = `${super.basePath}/countries`;

  async handle(req: RequestType): Promise<ResponseType> {
    if (req.method === 'GET' && req.path === this.basePath) {
      return this.findAll();
    }

    return this.next.handle(req);
  }

  findAll(): ResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
