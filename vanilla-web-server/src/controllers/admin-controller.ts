import {
  type ServerModRequestType,
  type ServerModInterface,
  type ServerModResponseType,
  ChainEndServerMod,
} from '@/server-mod';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';
import { Controller } from '@/controller';

export class AdminController extends Controller {
  static path = '/admin';

  serverMod: ServerModInterface;

  constructor(
    protected nextServerMod: ServerModInterface,
    pathPrefix: string = '',
  ) {
    super(nextServerMod, pathPrefix);

    this.serverMod = new RootAdminController(
      new ChainEndServerMod(async () =>
        Promise.resolve({
          status: 404,
          body: await readPublicFile('not_found.html', 'utf-8'),
        }),
      ),
      this.path,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.path)) {
      return this.next(req);
    }

    return this.serverMod.run(req);
  }
}
