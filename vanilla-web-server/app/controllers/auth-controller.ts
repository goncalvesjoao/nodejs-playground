import {
  BaseController,
  type ResponseType,
} from '@app/controllers/base-controller';
import { Get, RequestType } from '@lib/framework';

export class AuthController extends BaseController {
  static basePath = '/auth';

  @Get('login')
  async showLogin(_req: RequestType): Promise<ResponseType> {
    return {
      status: 200,
      body: await this.renderView('login.html'),
    };
  }
}
