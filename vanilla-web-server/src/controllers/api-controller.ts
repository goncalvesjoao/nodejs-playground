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
  static path = '/api';

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
        this.path,
      ),
      this.path,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.path)) {
      return this.next.run(req);
    }

    return this.serverMod.run(req);
  }
}
