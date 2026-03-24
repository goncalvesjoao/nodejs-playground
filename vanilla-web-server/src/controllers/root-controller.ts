import type {
  ServerModInterface,
  ServerModRequestType,
  ServerModResponseType,
} from '@/types';
import { renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '';

export class RootController implements ServerModInterface {
  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.basePath || req.path === `${this.basePath}/`)
    ) {
      const data = { title: 'Home Page' };

      return {
        status: 200,
        body: await renderView(path.join(this.basePath, 'index.html'), data),
      };
    }

    return this.nextServerMod.run(req);
  }
}
