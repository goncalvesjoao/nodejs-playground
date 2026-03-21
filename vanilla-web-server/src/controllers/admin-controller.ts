import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootAdminController } from '@/controllers/admin-controllers';

const BASE_PATH = '/admin';

export class AdminController implements ServerModInterface {
  serverMod: ServerModInterface = new RootAdminController();

  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerMod.run(req);
    }

    return this.serverMod.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
