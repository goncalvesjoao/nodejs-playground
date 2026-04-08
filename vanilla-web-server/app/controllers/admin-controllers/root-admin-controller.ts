import {
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';
import { AdminController } from '@app/controllers/admin-controller';
import { Get } from '@lib/framework';

export class RootAdminController extends AdminController {
  static basePath = super.basePath;

  @Get('{/}')
  async index(_req: RequestType): Promise<ResponseType> {
    const data = { title: 'Admin Home Page' };

    return {
      status: 200,
      body: await this.renderView('index.html', data),
    };
  }
}
