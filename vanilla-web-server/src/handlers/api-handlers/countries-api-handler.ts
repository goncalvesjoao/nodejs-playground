import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import CountryList from 'country-list';

const BASE_PATH = /\/countries\/?(.*)/;

export class CountriesApiHandler implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    const id = req.pathname.match(BASE_PATH)?.[1];

    if (id === '' && req.method === 'GET') {
      return this.findAll();
    }

    return this.nextServerApp.run(req);
  }

  findAll(): ServerAppResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
