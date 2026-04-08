import {
  BaseController,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';
import { Get } from '@lib/framework/controller';

export class RootController extends BaseController {
  static basePath = '';

  @Get('{/}')
  async index(_req: RequestType): Promise<ResponseType> {
    const data = { title: 'Home Page' };

    return {
      status: 200,
      body: await this.renderView('index.html', data),
    };
  }
}
