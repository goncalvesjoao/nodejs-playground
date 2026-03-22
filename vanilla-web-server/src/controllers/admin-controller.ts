import {
  type ServerModRequestType,
  type ServerModInterface,
  type ServerModResponseType,
  ServerMod,
} from '@/server-mod';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';
import { Controller } from '@/controller';

export class AdminController extends Controller {
  static basePath = '/admin';

  serverMod: ServerModInterface;

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {
    super(nextServerMod, basePathPrefix);

    this.serverMod = new RootAdminController(
      ServerMod.new(async () =>
        Promise.resolve({
          status: 404,
          body: await readPublicFile('not_found.html', 'utf-8'),
        }),
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
