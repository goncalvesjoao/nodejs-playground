import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { RootApiHandler, CountriesApiHandler } from '@/handlers/api-handlers';
import { JsonParser } from '@/middleware/json-parser';

const BASE_PATH = '/api';

export class ApiHandler implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    const serverApp = new JsonParser(
      new CountriesApiHandler(new RootApiHandler()),
    );

    return serverApp.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
