import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModType,
} from '@/types';
import { renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '/auth';

export class AuthController implements ServerModInterface {
  constructor(
    protected nextServerMod: ServerModType,
    protected basePathPrefix: string = '',
  ) {}

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (!req.pathname.startsWith(this.basePath)) {
      return this.nextServerMod(req);
    }

    if (req.method === 'GET' && req.pathname === `${this.basePath}/login`) {
      return this.showLogin();
    }

    return this.nextServerMod(req);
  };

  async showLogin(): Promise<ServerModResponseType> {
    return {
      status: 200,
      body: await renderView(path.join(this.basePath, 'login.html')),
    };
  }
}
