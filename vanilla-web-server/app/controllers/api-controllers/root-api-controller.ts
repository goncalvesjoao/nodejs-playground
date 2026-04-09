import { ApiController } from '@app/controllers/api-controller';
import {
  Get,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';

export class RootApiController extends ApiController {
  static basePath = '';

  @Get('{/*path}')
  async index(req: RequestType): Promise<ResponseType> {
    if (req.path === this.path || req.path === `${this.path}/`) {
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
