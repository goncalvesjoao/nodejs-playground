import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';

export class RootApiController extends Controller {
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

    return this.next(req);
  }
}
