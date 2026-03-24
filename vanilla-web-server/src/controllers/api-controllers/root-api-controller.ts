import type { ServerModRequestType, ServerModResponseType } from '@/types';
// import { ApiController } from '@/controllers/api-controller';
import { Controller } from '@/controller';

export class RootApiController extends Controller {
  static basePath = '/api';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.basePath || req.path === `${this.basePath}/`)
    ) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return this.next.run(req);
  }
}
