import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';

export class AuthController extends Controller {
  static basePath = '/auth';

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
      body: await this.renderView('login.html'),
    };
  }
}
