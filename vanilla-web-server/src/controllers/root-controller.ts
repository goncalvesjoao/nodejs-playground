import { Controller, type RequestType, ResponseType } from '@/modules';

export class RootController extends Controller {
  static basePath = '';

  async handle(req: RequestType): Promise<ResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.basePath || req.path === `${this.basePath}/`)
    ) {
      const data = { title: 'Home Page' };

      return {
        status: 200,
        body: await this.renderView('index.html', data),
      };
    }

    return this.next.handle(req);
  }
}
