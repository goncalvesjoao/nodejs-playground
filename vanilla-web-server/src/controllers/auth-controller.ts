import { Controller, type RequestType, ResponseType } from '@/modules';

export class AuthController extends Controller {
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
