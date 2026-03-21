import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { RootApiHandler, CountriesApiHandler } from '@/handlers/api-handlers';
import { JsonMiddleware } from '@/middlewares';

const BASE_PATH = '/api';

const handler = new CountriesApiHandler(new RootApiHandler());

export class ApiHandler implements ServerAppInterface {
  handler: ServerAppInterface = handler;

  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    const app = new JsonMiddleware(this.handler);

    return app.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
