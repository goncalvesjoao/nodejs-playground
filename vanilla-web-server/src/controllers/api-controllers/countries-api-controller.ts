import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';
import CountryList from 'country-list';

export class CountriesApiController extends Controller {
  static path = '/countries';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.path)) {
      return this.next(req);
    }

    if (req.method === 'GET' && req.path === this.path) {
      return this.findAll();
    }

    return this.next(req);
  }

  findAll(): ServerModResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
