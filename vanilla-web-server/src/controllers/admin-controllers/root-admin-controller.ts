import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';

export class RootAdminController extends Controller {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.pathname === this.basePath || req.pathname === `${this.basePath}/`)
    ) {
      const data = { title: 'Admin Home Page' };

      return {
        status: 200,
        body: await this.renderView('index.html', data),
      };
    }

    return this.nextServerMod.run(req);
  }
}
