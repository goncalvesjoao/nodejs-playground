import { type RequestType, ResponseType } from '@/modules';
import { ApiController } from '@/controllers/api-controller';

export class RootApiController extends ApiController {
  static basePath = super.basePath;

  async handle(req: RequestType): Promise<ResponseType> {
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
