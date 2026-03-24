import type {
  ServerModRequestType,
  ServerMod,
  ServerModResponseType,
} from '@/server-mod';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';
import { Controller } from '@/controller';

export class AdminController extends Controller {
  static basePath = '/admin';

  serverMod: ServerMod;

  constructor(protected next: ServerMod) {
    super(next);

    this.serverMod = new RootAdminController({
      async run() {
        return Promise.resolve({
          status: 404,
          body: await readPublicFile('not_found.html', 'utf-8'),
        });
      },
    });
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverMod.run(req);
  }
}
