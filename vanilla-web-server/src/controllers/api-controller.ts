import type {
  ServerModRequestType,
  ServerMod,
  ServerModResponseType,
} from '@/server-mod';
import {
  RootApiController,
  CountriesApiController,
} from '@/controllers/api-controllers';
import { Controller } from '@/controller';

export class ApiController extends Controller {
  static basePath = '/api';

  serverMod: ServerMod;

  constructor(protected next: ServerMod) {
    super(next);

    this.serverMod = new CountriesApiController(
      new RootApiController({
        async run() {
          return Promise.resolve({
            status: 501,
            body: { message: 'Not Implemented' },
          });
        },
      }),
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverMod.run(req);
  }
}
