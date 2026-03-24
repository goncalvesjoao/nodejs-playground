import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';

const BASE_PATH = '/admin';

export class AdminController implements ServerModInterface {
  serverMod: ServerModInterface;

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {
    this.serverMod = new RootAdminController(
      {
        async run() {
          return Promise.resolve({
            status: 404,
            body: await readPublicFile('not_found.html', 'utf-8'),
          });
        },
      },
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
