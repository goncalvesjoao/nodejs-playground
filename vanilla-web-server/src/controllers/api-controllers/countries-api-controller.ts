import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import CountryList from 'country-list';

const BASE_PATH = '/countries';

export class CountriesApiController implements ServerModInterface {
  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    if (req.method === 'GET' && req.path === this.basePath) {
      return this.findAll();
    }

    return this.nextServerMod.run(req);
  }

  findAll(): ServerModResponseType {
    const results: CountryList.Country[] = CountryList.getData();

    return { status: 200, body: { results } };
  }
}
