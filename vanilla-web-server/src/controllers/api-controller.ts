import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootApiController, CountriesApiController } from '@/controllers/api-controllers';
import { JsonMiddleware } from '@/middlewares';

const BASE_PATH = '/api';

const handler = new CountriesApiController(new RootApiController());

export class ApiController implements ServerModInterface {
  handler: ServerModInterface = handler;

  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerMod.run(req);
    }

    const app = new JsonMiddleware(this.handler);

    return app.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
