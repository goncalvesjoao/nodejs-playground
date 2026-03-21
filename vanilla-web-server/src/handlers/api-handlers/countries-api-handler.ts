import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import CountryList from 'country-list';

const BASE_PATH = /\/countries\/?(.*)/;

export class CountriesApiHandler implements ServerModInterface {
  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    const id = req.pathname.match(BASE_PATH)?.[1];

    if (id === '' && req.method === 'GET') {
      return this.findAll();
    }

    return this.nextServerMod.run(req);
  }

  findAll(): ServerModResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
