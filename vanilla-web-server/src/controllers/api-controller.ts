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
  serverMod: ServerModInterface;

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {
    this.serverMod = new CountriesApiController(
      new RootApiController(
        {
          run() {
            return Promise.resolve({
              status: 501,
              body: { message: 'Not Implemented' },
            });
          },
        },
        this.basePath,
      ),
      this.basePath,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    return this.serverMod.run(req);
  }
}
