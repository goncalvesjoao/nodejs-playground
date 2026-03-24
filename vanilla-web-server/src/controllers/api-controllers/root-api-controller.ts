import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';
import { ApiController } from '@/controllers/api-controller';

export class RootApiController extends ApiController {
  static basePath = super.basePath;

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

    return {
      status: 501,
      body: { message: 'Not Implemented' },
    };
  }
}
