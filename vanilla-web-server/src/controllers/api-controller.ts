import {
  type ServerModRequestType,
  type ServerModInterface,
  type ServerModResponseType,
  ServerMod,
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
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {
    super(nextServerMod, basePathPrefix);

    this.serverMod = new CountriesApiController(
      new RootApiController(
        ServerMod.new({
          status: 501,
          body: { message: 'Not Implemented' },
        }),
        this.basePath,
      ),
      this.basePath,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath)) {
      return this.next(req);
    }

    return this.serverMod.run(req);
  }
}
