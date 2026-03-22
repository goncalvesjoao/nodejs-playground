import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '/users';

export class UsersAdminController implements ServerModInterface {
  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    if (req.method === 'GET' && req.pathname === `${this.basePath}/login`) {
      return this.showLogin();
    }

    return this.nextServerMod.run(req);
  }

  async showLogin(): Promise<ServerModResponseType> {
    return {
      status: 200,
      body: await renderView(path.join(this.basePath, 'login.html')),
    };
  }
}
