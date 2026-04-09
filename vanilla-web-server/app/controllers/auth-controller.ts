import {
  Get,
  BaseController,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';

export class AuthController extends BaseController {
  static basePath = 'auth';

  @Get('login')
  async showLogin(_req: RequestType): Promise<ResponseType> {
    return {
      status: 200,
      body: await this.renderView('login.html'),
    };
  }
}
