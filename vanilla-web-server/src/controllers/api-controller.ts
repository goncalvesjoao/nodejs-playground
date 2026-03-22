import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModType,
} from '@/types';
import {
  RootApiController,
  CountriesApiController,
} from '@/controllers/api-controllers';

const BASE_PATH = '/api';

export class ApiController implements ServerModInterface {
  serverMod: ServerModInterface;

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModType,
    protected basePathPrefix: string = '',
  ) {
    this.serverMod = new CountriesApiController(
      new RootApiController(async () => {
        return Promise.resolve({
          status: 501,
          body: { message: 'Not Implemented' },
        });
      }, this.basePath).run,
      this.basePath,
    );
  }

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod(req);
    }

    return this.serverMod.run(req);
  };
}
