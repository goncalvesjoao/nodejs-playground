import {
  BaseController,
  type RequestType,
  type ResponseType,
} from '@/controllers/base-controller';

export class AuthController extends BaseController {
  static basePath = '/auth';

  async handle(req: RequestType): Promise<ResponseType> {
    if (req.method === 'GET' && req.path === `${this.basePath}/login`) {
      return this.showLogin();
    }

    return this.next.handle(req);
  }

  async showLogin(): Promise<ResponseType> {
    return {
      status: 200,
      body: await this.renderView('login.html'),
    };
  }
}
