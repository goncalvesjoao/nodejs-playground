import { type RequestType, ResponseType } from '@/modules';
import { AdminController } from '@/controllers/admin-controller';

export class RootAdminController extends AdminController {
  static basePath = super.basePath;

  async handle(req: RequestType): Promise<ResponseType> {
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

    return this.next.handle(req);
  }
}
