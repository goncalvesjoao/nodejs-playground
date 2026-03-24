import {
  type ServerModRequestType,
  type ServerModInterface,
  type ServerModResponseType,
  ChainEndServerMod,
} from '@/server-mod';
import {
  RootApiController,
  CountriesApiController,
} from '@/controllers/api-controllers';
import { Controller } from '@/controller';

export class ApiController extends Controller {
  static basePath = '/api';

  serverMod: ServerModInterface;

  constructor(
    protected next: ServerModInterface,
    pathPrefix: string = '',
  ) {
    super(next, pathPrefix);

    this.serverMod = new CountriesApiController(
      new RootApiController(
        new ChainEndServerMod(async () =>
          Promise.resolve({
            status: 501,
            body: { message: 'Not Implemented' },
          }),
        ),
        this.basePath,
      ),
      this.basePath,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverMod.run(req);
  }
}
