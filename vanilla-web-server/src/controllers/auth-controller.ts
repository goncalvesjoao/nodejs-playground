import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '/auth';

export class AuthController implements ServerModInterface {
  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath)) {
      return this.nextServerMod.run(req);
    }

    if (req.method === 'GET' && req.path === `${this.basePath}/login`) {
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
