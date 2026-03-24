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
  static basePath = '/admin';

  serverMod: ServerModInterface;

  constructor(
    protected next: ServerModInterface,
    pathPrefix: string = '',
  ) {
    super(next, pathPrefix);

    this.serverMod = new RootAdminController(
      new ChainEndServerMod(async () =>
        Promise.resolve({
          status: 404,
          body: await readPublicFile('not_found.html', 'utf-8'),
        }),
      ),
      this.basePath,
    );
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverMod.run(req);
  }
}
