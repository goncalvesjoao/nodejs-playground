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
    const match = req.pathname.match(BASE_PATH);

    if (!match) {
      return this.nextServerApp.run(req);
    }

    if (match[1] === '') {
      const results: CountryList.Country[] = CountryList.getData();

      return {
        statusCode: 200,
        body: { results },
      };
    }

    return {
      statusCode: 501,
      body: { message: 'Not Implemented' },
    };
  }
}
