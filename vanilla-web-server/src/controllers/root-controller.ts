import type {
  ServerModInterface,
  ServerModRequestType,
  ServerModResponseType,
} from '@/types';
import { readPublicFile, renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '/';

export class RootController implements ServerModInterface {
  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(protected basePathPrefix: string = '') {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.pathname === this.basePath || req.pathname === `${this.basePath}/`)
    ) {
      const data = { title: 'Home Page' };

      return {
        status: 200,
        body: await renderView(path.join(this.basePath, 'index.html'), data),
      };
    }

    return {
      status: 404,
      body: await readPublicFile('not_found.html', 'utf-8'),
    };
  }
}
