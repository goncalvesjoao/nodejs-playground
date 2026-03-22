import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';
import CountryList from 'country-list';

export class CountriesApiController extends Controller {
  static basePath = '/countries';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    if (req.method === 'GET' && req.pathname === this.basePath) {
      return this.findAll();
    }

    return this.nextServerMod.run(req);
  }

  findAll(): ServerModResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
