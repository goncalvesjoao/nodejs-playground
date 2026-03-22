import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModType,
} from '@/types';
import { RootAdminController } from '@/controllers/admin-controllers';
import { readPublicFile } from '@/utils/read-public-file';

const BASE_PATH = '/admin';

export class AdminController implements ServerModInterface {
  serverMod: ServerModType;

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModType,
    protected basePathPrefix: string = '',
  ) {
    this.serverMod = new RootAdminController(async () => {
      return Promise.resolve({
        status: 404,
        body: await readPublicFile('not_found.html', 'utf-8'),
      });
    }, this.basePath).run;
  }

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod(req);
    }

    return this.serverMod(req);
  };
}
