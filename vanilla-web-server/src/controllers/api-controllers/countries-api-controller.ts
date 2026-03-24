import type { ServerModRequestType, ServerModResponseType } from '@/types';
import CountryList from 'country-list';
// import { ApiController } from '@/controllers/api-controller';
import { Controller } from '@/controller';

export class CountriesApiController extends Controller {
  static basePath = '/api/countries';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method === 'GET' && req.path === this.basePath) {
      return this.findAll();
    }

    return this.next.run(req);
  }

  findAll(): ServerModResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
