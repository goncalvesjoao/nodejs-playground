import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/types';

export class AuthController extends Controller {
  static basePath = '/auth';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method === 'GET' && req.path === `${this.basePath}/login`) {
      return this.showLogin();
    }

    return this.next.run(req);
  }

  async showLogin(): Promise<ServerModResponseType> {
    return {
      status: 200,
      body: await this.renderView('login.html'),
    };
  }
}
