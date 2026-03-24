import { Controller } from '@/controller';
import type { ServerModRequestType, ServerModResponseType } from '@/types';

export class RootController extends Controller {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
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

    return this.next.run(req);
  }
}
