import {
  BaseController,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';

export class RootController extends BaseController {
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
