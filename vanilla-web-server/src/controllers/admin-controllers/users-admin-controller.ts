import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { renderView } from '@/utils';

const BASE_PATH = '/users';

export class UsersAdminController implements ServerModInterface {
  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerMod.run(req);
    }

    if (req.method === 'GET' && req.pathname === `${BASE_PATH}/login`) {
      return this.showLogin();
    }

    return this.nextServerMod.run(req);
  }

  async showLogin(): Promise<ServerModResponseType> {
    return {
      status: 200,
      body: await renderView('admin/users/login.html'),
    };
  }
}
