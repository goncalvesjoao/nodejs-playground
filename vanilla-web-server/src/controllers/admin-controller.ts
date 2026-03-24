import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';
import { Controller } from '@/controller';

export class AdminController extends Controller {
  static basePath = '/admin';

  serverMod: ServerModInterface;

  constructor(protected next: ServerModInterface) {
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
