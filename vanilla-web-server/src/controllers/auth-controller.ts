import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';

export class AuthController extends Controller {
  static basePath = '/auth';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath)) {
      return this.next(req);
    }

    if (req.method === 'GET' && req.path === `${this.basePath}/login`) {
      return this.showLogin();
    }

    return this.next(req);
  }

  async showLogin(): Promise<ServerModResponseType> {
    return {
      status: 200,
      body: await this.renderView('login.html'),
    };
  }
}
