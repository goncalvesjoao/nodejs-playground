import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { RootApiHandler, CountriesApiHandler } from '@/handlers/api-handlers';
import { JsonMiddleware } from '@/middlewares';

const BASE_PATH = '/api';

export class ApiHandler implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    const handler = new JsonMiddleware(
      new CountriesApiHandler(new RootApiHandler()),
    );

    return handler.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
