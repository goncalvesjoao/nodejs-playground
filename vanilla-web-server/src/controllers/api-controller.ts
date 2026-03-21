import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import {
  RootApiController,
  CountriesApiController,
} from '@/controllers/api-controllers';

const BASE_PATH = '/api';

export class ApiController implements ServerModInterface {
  serverMod: ServerModInterface = new CountriesApiController(
    new RootApiController(),
  );

  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerMod.run(req);
    }

    return this.serverMod.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
