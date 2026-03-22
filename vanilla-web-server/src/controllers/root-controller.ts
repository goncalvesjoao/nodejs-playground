import type {
  ServerModInterface,
  ServerModRequestType,
  ServerModResponseType,
} from '@/types';
import { readPublicFile } from '@/utils';

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
      return {
        status: 200,
        body: await readPublicFile('index.html', 'utf-8'),
      };
    }

    return {
      status: 404,
      body: await readPublicFile('not_found.html', 'utf-8'),
    };
  }
}
