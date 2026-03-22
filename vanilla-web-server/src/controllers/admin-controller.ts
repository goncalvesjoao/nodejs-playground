import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootAdminController } from '@/controllers/admin-controllers';

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
    this.serverMod = new RootAdminController(this.basePath);
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    return this.serverMod.run(req);
  }
}
