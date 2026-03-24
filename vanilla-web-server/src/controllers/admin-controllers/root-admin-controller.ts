import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';
import { Controller } from '@/controller';
// import { AdminController } from '@/controllers/admin-controller';

export class RootAdminController extends Controller {
  static basePath = '/admin';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.basePath || req.path === `${this.basePath}/`)
    ) {
      const data = { title: 'Admin Home Page' };

      return {
        status: 200,
        body: await this.renderView('index.html', data),
      };
    }

    return this.next.run(req);
  }
}
