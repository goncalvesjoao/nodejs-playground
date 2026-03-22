import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';

export class RootController extends Controller {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.path || req.path === `${this.path}/`)
    ) {
      const data = { title: 'Home Page' };

      return {
        status: 200,
        body: await this.renderView('index.html', data),
      };
    }

    return this.next(req);
  }
}
