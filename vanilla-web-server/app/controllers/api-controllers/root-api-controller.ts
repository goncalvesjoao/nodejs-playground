import { ApiController } from '@app/controllers/api-controller';
import {
  Get,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';

export class RootApiController extends ApiController {
  static basePath = super.basePath;

  @Get('{*path}')
  async index(req: RequestType): Promise<ResponseType> {
    if (req.path === this.basePath || req.path === `${this.basePath}/`) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return Promise.resolve({
      status: 501,
      body: { message: 'Not Implemented' },
    });
  }
}
